import { db } from '@/lib/db';
import { getSession } from "@/lib/getsession";
import BloodBankCenter from "@/app/patient/dashboard/components/bloodbankcenter";
const PatientBloodBankCenterServicePage = async () => {

    try {
        const session = await getSession();
        if (!session?.email) {
            throw new Error("Session or email not found");
        }

        const patient = await db.patient.findUnique({
            where: { email: session.email },
        });
        if (!patient) {
            throw new Error("Patient not found");
        }
        // 1. Get BookLabTest entries
        const bookings = await db.BookBloodbank.findMany({
        where: { patientId: patient.id },
        orderBy: { createdAt: 'desc' },
        include:{
            Hospital:{
                include: {
                    hspdetails: true,
                    hspcontact: true,
                    hspInfo: true,
                },
            }
        }
        });
        
        // 2. Check if those serviceIds exist in LabTest
        const serviceIds = bookings.map(b => b.serviceId);
        const matchingServices = await db.Bloodbank.findMany({
            
            
        });
        
// Merge bookings with their matching service info
const mergedData = bookings.map((booking) => {
  const service = matchingServices.find(
    (srv) => srv.hospitalId === booking.hospitalId
  );    

  return {
    ...booking,
    service: service
      ? {
          id: service.id,
          bloodname: service.bloodname,
          aaprice: service.aaprice,
          price: service.price,
          finalprice: service.finalprice,
          discount: service.discount,
          available: service.available,
          hospitalId: service.Hospital?.id,
          hospitalName: service.Hospital?.hspInfo?.regname ?? null,
        }
      : null,
  };
});


// Now pass only mergedData to component
return <BloodBankCenter bookings={mergedData} />;

    } catch (error) {
        console.error("Error loading BloodBankServicesPage:", {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        return <div className="text-center p-6">Something went wrong. Check console for details.</div>;
    }
}
export default PatientBloodBankCenterServicePage;