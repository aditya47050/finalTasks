import { getSession } from "@/lib/getsession"
import { db } from "@/lib/db"
import PrescriptionTemplateManager from "../components/PrescriptionTemplateManager"

export const dynamic = "force-dynamic"

export default async function PrescriptionTemplatesPage() {
  try {
    const session = await getSession()

    if (!session?.email) {
      throw new Error("Session or email not found")
    }

    // Get doctor data
    const doctor = await db.doctor.findUnique({
      where: { email: session.email },
      include: {
        doctorinfo: true,
      },
    })

        // Fetch templates on the server directly
        const templates = await db.prescriptionTemplate.findMany({
          where: { doctorId: doctor.id },
          orderBy: { createdAt: "desc" },
        })

    if (!doctor) {
      throw new Error("Doctor not found")
    }

    return (
      <div className="container mx-auto p-6">
        <PrescriptionTemplateManager doctor={doctor}  initialTemplates={templates}/>
      </div>
    )
  } catch (error) {
    console.error("Error loading prescription templates:", error)
    return <div className="text-center p-6">Error loading prescription templates</div>
  }
}
