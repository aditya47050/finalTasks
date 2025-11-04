import { db } from '@/lib/db';
import PatientProfile from '../../components/updateprofile';
import { parseRemarks } from '@/lib/parseRemarks';

export const dynamic = "force-dynamic";

const PatientUpdateByEmailPage = async ({ searchParams }) => {
  const email = searchParams?.email;

  if (!email) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <h2 className="font-bold">No Email Provided</h2>
          <p>Please provide a patient email to update the profile.</p>
        </div>
      </div>
    );
  }

  try {
    const [patient, states, districts, subDistricts] = await Promise.all([
      db.patient.findUnique({
        where: { email },
        include: { HealthInsurance: true },
      }),
      db.state.findMany({ orderBy: { stateName: 'asc' } }),
      db.district.findMany({ orderBy: { district: 'asc' } }),
      db.subDistrict.findMany({ orderBy: { subDistrict: 'asc' } })
    ]);

    if (!patient) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <h2 className="font-bold">Patient Not Found</h2>
            <p>No patient found with the provided email.</p>
          </div>
        </div>
      );
    }

    const data = await db.HealthCard.findFirst({ where: { patientId: patient.id } });
    const rejectedFields = parseRemarks(data?.remarks);

const formattedpatient = { ...patient };
Object.keys(rejectedFields).forEach(field => {
  formattedpatient[field] = '';
});

    return (
      <div className="container mx-auto px-4 py-8">
        <PatientProfile
          userdata={formattedpatient}
          state={states}
          dist={districts}
          subdist={subDistricts}
          isUpdateMode={true}
          patientId={patient.id}
          rejectedFields={rejectedFields}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading profile:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <h2 className="font-bold">Error Loading Profile</h2>
          <p>We couldn&apos;t load the profile data. Please try again later.</p>
        </div>
      </div>
    );
  }
};

export default PatientUpdateByEmailPage;