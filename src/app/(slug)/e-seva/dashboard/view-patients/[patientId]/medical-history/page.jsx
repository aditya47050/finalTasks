// app/e-seva/patient/[patientId]/medical-history/page.js
import MedicalHistoryPage from "../../../../components/medicalhistoryclient";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";

const PatientMedicalHistory = async ({ params }) => {
  // In server components, params is directly available
  const { patientId } = params;

  // Get session
  const session = await getSession();
  if (!session) {
    redirect("/e-seva/login");
  }

  // Verify the logged-in user is either Eseva or SubAdmin
  const eseva = await db.Eseva.findUnique({
    where: { email: session.email },
    select: { id: true },
  });

  const subAdmin = !eseva
    ? await db.EsevaSubAdmin.findUnique({
        where: { email: session.email },
        select: { id: true, esevaId: true },
      })
    : null;

  if (!eseva && !subAdmin) {
    redirect("/e-seva/login");
  }

  // Fetch patient data
  const patient = await db.patient.findUnique({
    where: { id: patientId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      esevaId: true,
      subAdminId: true,
      medicalhistory: true,
    },
  });

  if (!patient) {
    return <div>Patient not found</div>;
  }

  // Ensure patient belongs to logged-in user
  if ((eseva && patient.esevaId !== eseva.id) || (subAdmin && patient.subAdminId !== subAdmin.id)) {
    redirect("/e-seva/patients");
  }

  // Transform medical history
  const medicalHistory = patient.medicalhistory?.[0] || null;
  const existingHistory = [];

  if (medicalHistory) {
    const diseaseDetails = medicalHistory.diseaseDetails || {};
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
        const details = diseaseDetails[key] || {};
        existingHistory.push({
          name: key,
          startDate: details.startDate || null,
          onTreatment: details.onTreatment || false,
          notes: details.notes || null,
        });
      }
    });
  }

  return (
    <MedicalHistoryPage
      userdata={{ ...patient, medicalhistory: medicalHistory }}
      existingHistory={existingHistory}
    />
  );
};

export default PatientMedicalHistory;
