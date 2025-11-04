import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import PrescriptionView from "../../../../components/PrescriptionView"
import { getSession } from "@/lib/getsession"


async function getPrescriptionData(prescriptionId, patientId) {
  const prescription = await db.prescription.findFirst({
    where: {
      id: prescriptionId,
      patientId: patientId,
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


  const prescription = await getPrescriptionData(params.prescriptionId, params.patientId)

  if (!prescription) {
    notFound()
  }

  const session = await getSession() // get the session
  const userRole = session?.role || null

  return <PrescriptionView prescription={prescription} userRole={userRole}/>
}