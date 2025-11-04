import { db } from "@/lib/db"
import { getSession } from "@/lib/getsession"
import BookHomeHealthcareClient from "../components/HomeHealthcareBookingsClient"

export const dynamic = "force-dynamic"

const HospitalBookingsPage = async () => {
  try {
    const session = await getSession()

    if (!session?.email) {
      throw new Error("Unauthorized")
    }

    console.log("✅ Hospital session email:", session.email)

    // Find logged-in hospital
    const hospital = await db.hospital.findUnique({
      where: { email: session.email },
      include: {
        hspInfo: true,
        HomeHealthcare: true, // fetch hospital's homehealthcare services
      },
    })

    if (!hospital) {
      throw new Error("Hospital not found")
    }

    console.log("🏥 Hospital record:", JSON.stringify(hospital, null, 2))

    let bookings = []

    // Normalize role & homehealthcare flag for comparison
    const role = hospital.role?.toLowerCase()
    const hasHomeHealthcare =
      hospital.hspInfo?.homehealthcare?.toLowerCase() === "yes"

    if (role === "homehealthcare" || (role === "hospital" && hasHomeHealthcare)) {
      console.log("📌 Fetching home healthcare bookings for hospital...")

      bookings = await db.bookHomeHealthcare.findMany({
        where: {
          homeHealthcareId: {
            in: hospital.HomeHealthcare.map((h) => h.id),
          },
        },
        include: {
          patient: true,
          HomeHealthcare: true,
        },
        orderBy: { createdAt: "desc" },
      })
    }

    console.log("📋 Bookings fetched:", bookings.length)
    if (bookings.length > 0) {
      console.log("➡️ Sample booking:", JSON.stringify(bookings[0], null, 2))
    }

    return <BookHomeHealthcareClient bookings={bookings} />
  } catch (error) {
    console.error("❌ Error fetching bookings:", error)
    return <div>Something went wrong.</div>
  }
}

export default HospitalBookingsPage
