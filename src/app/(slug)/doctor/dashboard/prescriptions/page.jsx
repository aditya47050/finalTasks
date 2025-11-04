import { getSession } from "@/lib/getsession"
import { db } from "@/lib/db"
import PrescriptionList from "../components/PrescriptionList"

export const dynamic = "force-dynamic"

export default async function PrescriptionsPage() {
  try {
    const session = await getSession()

    if (!session?.email) {
      throw new Error("Session or email not found")
    }

    // Get doctor
    const doctor = await db.doctor.findUnique({
      where: { email: session.email },
    })

    if (!doctor) {
      throw new Error("Doctor not found")
    }

    // Get prescriptions directly here
    const prescriptions = await db.prescription.findMany({
      where: { doctorId: doctor.id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            mobile: true,
          },
        },
        appointment: {
          select: {
            id: true,
            preferredDate: true,
            preferredTime: true,
          },
        },
        template: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return (
      <div className="container mx-auto p-6">
        <PrescriptionList doctor={doctor} prescriptions={prescriptions} />
      </div>
    )
  } catch (error) {
    console.error("Error loading prescriptions:", error)
    return <div className="text-center p-6">Error loading prescriptions</div>
  }
}
