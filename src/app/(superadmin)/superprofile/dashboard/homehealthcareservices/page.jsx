import { db } from "@/lib/db"
import HomeHealthcareBookingsClient from "../../components/HomeHealthcareBookingsClient"

export const dynamic = "force-dynamic"

const HomeHealthcareBookingsPage = async () => {
  try {
const bookings = await db.bookHomeHealthcare.findMany({
  include: {
    patient: true,
    HomeHealthcare: {
      include: {
        hospital: {
          include: {
            hspInfo: true, 
          },
        },
      },
    },
  },
  orderBy: { createdAt: "desc" },
})



    return <HomeHealthcareBookingsClient bookings={bookings} />
  } catch (error) {
    console.error("❌ Error fetching all bookings:", error)
    return <div>Something went wrong while fetching bookings.</div>
  }
}

export default HomeHealthcareBookingsPage
