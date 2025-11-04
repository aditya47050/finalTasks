import { notFound } from "next/navigation"
import { getSession } from "@/lib/getsession"
import { db } from "@/lib/db"
import PrescriptionView from "../../../components/PrescriptionView"

async function getPrescriptionData(prescriptionId, doctorId) {
  const prescription = await db.prescription.findFirst({
    where: {
      id: prescriptionId,
      doctorId: doctorId,
    },
    include: {
      doctor: true,
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          mobile: true,
          healthcard: {
            select: {
              cardNo: true,
            },
          },
        },
      },
      template: true,
    },
  })

  return prescription
}

export default async function PrescriptionViewPage({ params }) {
  const session = await getSession()

  if (!session?.email) {
    return <div>Please log in to view prescriptions</div>
  }

  const doctor = await db.doctor.findUnique({
    where: { email: session.email },
  })

  if (!doctor) {
    return <div>Doctor not found</div>
  }

  const prescription = await getPrescriptionData(params.prescriptionId, doctor.id)

  if (!prescription) {
    notFound()
  }

  return <PrescriptionView prescription={prescription} />
}
