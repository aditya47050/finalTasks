// app/patient/dashboard/updateprofile/page.jsx
import { getSession } from "@/lib/getsession";
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import PatientProfile from '../components/updateprofile';
import { parseRemarks } from '@/lib/parseRemarks'; // Import the parsing function

export const dynamic = "force-dynamic";

const PatientUpdateProfilePage = async () => {
  const session = await getSession();
  
  if (!session?.email) {
    redirect('/patient/login');
  }

  try {
    // Fetch all required data in parallel
    const [patient, states, districts, subDistricts] = await Promise.all([
      db.patient.findUnique({
        where: { email: session.email },
        include: {
          healthInsurances: true,
        },
      }),
      db.state.findMany({ orderBy: { stateName: 'asc' } }),
      db.district.findMany({ orderBy: { district: 'asc' } }),
      db.subDistrict.findMany({ orderBy: { subDistrict: 'asc' } })
    ]);

    if (!patient) {
      redirect('/patient/login');
    }
    
    const data = await db.HealthCard.findFirst({ 
      where: { patientId: patient.id } 
    });
    
    const rejectedFields = parseRemarks(data?.remarks);
    
    // Create a cleaned patient object with rejected fields cleared
    const formattedpatient = { ...patient };
    
    // Clear the values of rejected fields
    Object.keys(rejectedFields).forEach(field => {
      if (field in formattedpatient) {
        formattedpatient[field] = '';
      }
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
          <p>We couldn&apos;t load your profile data. Please try again later.</p>
        </div>
      </div>
    );
  }
};

export default PatientUpdateProfilePage;