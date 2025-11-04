import { db } from '@/lib/db';
import { getSession } from "@/lib/getsession";
import PathlogyCenter from "@/app/patient/dashboard/components/pathologycenter";
const PatientPathologyServicePage = async () => {

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
        const bookings = await db.BookLabTest.findMany({
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
        const matchingServices = await db.LabTest.findMany({
            where: { id: { in: serviceIds } },
            select:{
                id:true,
                testname:true,
                aaprice:true,
                price:true,
                finalprice:true,
                discount:true,
                available:true,
                nabl:true,
                Hospital:true,
            }
            
        });
        
// Merge bookings with their matching service info
const mergedData = bookings.map((booking) => {
  const service = matchingServices.find(
    (srv) => srv.id === booking.serviceId
  );    

  return {
    ...booking,
    service: service
      ? {
          id: service.id,
          testname: service.testname,
          aaprice: service.aaprice,
          price: service.price,
          finalprice: service.finalprice,
          discount: service.discount,
          available: service.available,
          nabl: service.nabl,
          hospitalId: service.Hospital?.id,
          hospitalName: service.Hospital?.name ?? null,
        }
      : null,
  };
});

// Now pass only mergedData to component
return <PathlogyCenter bookings={mergedData} />;

    } catch (error) {
        console.error("Error loading PathlogyServicesPage:", {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        return <div className="text-center p-6">Something went wrong. Check console for details.</div>;
    }
}
export default PatientPathologyServicePage;