import MedicalHistoryPage from "../components/medicalhistoryclient1"
import { db } from "@/lib/db"
import { getSession } from "@/lib/getsession"
import { redirect } from "next/navigation"

const MedicalHistory = async () => {
  const session = await getSession()
  if (!session) {
    redirect("/patient/login")
  }
  const userdata = await db.patient.findUnique({
    where: { email: session.email },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      medicalhistory: true, // This will get the array of medical history records
    },
  })
  if (!userdata) {
    redirect("/patient/login")
  }
  // Since medicalhistory is an array but patientId is unique, get the first (and should be only) record
  const medicalHistory =
    userdata.medicalhistory && userdata.medicalhistory.length > 0 ? userdata.medicalhistory[0] : null
  // Transform existing medical history data for display
  const existingHistory = []
  if (medicalHistory) {
    const diseaseDetails = medicalHistory.diseaseDetails || {}
    // Get all the conditions that are true
    Object.keys(medicalHistory).forEach((key) => {
      if (
        medicalHistory[key] === true &&
        ![
          "id",
          "patientId",
          "createdAt",
          "updatedAt",
          "diseaseDetails",
          "bpvalue",
          "tuberculosisvalue",
          "cancervalue",
          "weight",
          "pulseRate",
          "thyroidvalue",
          "cholesterolvalue",
          "diabetesvalue",
        ].includes(key)
      ) {
        const details = diseaseDetails[key] || {}
        existingHistory.push({
          name: key,
          startDate: details.startDate || null,
          onTreatment: details.onTreatment || false,
          notes: details.notes || null,
        })
      }
    })
  }
  console.log(medicalHistory)
  return (
    <>
      <MedicalHistoryPage
        userdata={{ ...userdata, medicalhistory: medicalHistory }}
        existingHistory={existingHistory}
      />
    </>
  )
}

export default MedicalHistory
