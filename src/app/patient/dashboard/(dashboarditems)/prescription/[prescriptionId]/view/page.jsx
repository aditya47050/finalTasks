// src/app/patient/dashboard/(dashboarditems)/prescription/[prescriptionId]/view/page.jsx
import { notFound } from "next/navigation"
import { getSession } from "@/lib/getsession"
import { db } from "@/lib/db"
import PrescriptionView from "../../../../components/PrescriptionView"

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
  const session = await getSession()

  if (!session?.email) {
    return <div>Please log in to view prescriptions</div>
  }

  const patient = await db.patient.findUnique({
    where: { email: session.email },
  })

  if (!patient) {
    return <div>Patient not found</div>
  }

  const prescription = await getPrescriptionData(params.prescriptionId, patient.id)

  if (!prescription) {
    notFound()
  }

  return <PrescriptionView prescription={prescription} />
}