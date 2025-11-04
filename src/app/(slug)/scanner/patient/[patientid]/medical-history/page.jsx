import MedicalHistoryPage from "../../components/medicalhistoryclient1"
import { db } from "@/lib/db"

const MedicalHistory = async ({ params }) => {
  try {
    const { patientid: patientId } = params  // ✅ extract patientId from URL

    if (!patientId) {
      return <div>Patient ID not provided</div>
    }

    // ✅ fetch by patientId instead of session
    const userdata = await db.Patient.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        medicalhistory: true,
      },
    })

    if (!userdata) {
      return <div>Patient not found</div>
    }

    // ✅ medicalhistory is an array
    const medicalHistory =
      userdata.medicalhistory && userdata.medicalhistory.length > 0
        ? userdata.medicalhistory[0]
        : null

    const existingHistory = []
    if (medicalHistory) {
      const diseaseDetails = medicalHistory.diseaseDetails || {}

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

    return (
      <MedicalHistoryPage
        userdata={{ ...userdata, medicalhistory: medicalHistory }}
        existingHistory={existingHistory}
      />
    )
  } catch (error) {
    console.error("Error loading medical history:", error)
    return <div>Something went wrong. Please try again later.</div>
  }
}

export default MedicalHistory
