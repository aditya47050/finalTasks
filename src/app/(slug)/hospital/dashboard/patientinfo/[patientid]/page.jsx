import Patientinfopage from "../components/patientinfopage";
import { db } from "@/lib/db";

const PatientSingleViewPage = async ({ params }) => {
  const patientId = params.patientid;

  if (!patientId) return <div>Patient ID not provided</div>;

  // Fetch patient data only
  const patient = await db.patient.findUnique({
    where: { id: patientId },
    include: { healthcard: true }, // include healthcard if needed
  });

  if (!patient) return <div>Patient not found</div>;

  return (
    <Patientinfopage 
      userdata={patient} 
    />
  );
};

export default PatientSingleViewPage;
