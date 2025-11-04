import { db } from "@/lib/db";
import BloodBankCenter from "../../components/bloodbankcenter";

const PatientBloodBankCenterServicePage = async ({ params }) => {
  try {
    const { patientid: patientId } = params; // Get patientId from URL

    if (!patientId) {
      return <div className="text-center p-6">Patient ID not provided</div>;
    }

    // Fetch patient by ID
    const patient = await db.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return <div className="text-center p-6">Patient not found</div>;
    }

    // 1. Get BookBloodbank entries
    const bookings = await db.BookBloodbank.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: 'desc' },
      include: {
        Hospital: {
          include: {
            hspdetails: true,
            hspcontact: true,
            hspInfo: true,
          },
        },
      },
    });

    // 2. Get serviceIds from bookings
    const serviceIds = bookings.map((b) => b.serviceId);

    // 3. Fetch matching Bloodbank services
    const matchingServices = await db.Bloodbank.findMany({
      where: { id: { in: serviceIds } },
      include: {
        Hospital: {
          include: {
            hspInfo: true,
          },
        },
      },
    });

    // 4. Merge bookings with their matching service info
    const mergedData = bookings.map((booking) => {
      const service = matchingServices.find(
        (srv) => srv.id === booking.serviceId
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

    return <BloodBankCenter bookings={mergedData} />;
  } catch (error) {
    console.error("Error loading BloodBankServicesPage:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    return <div className="text-center p-6">Something went wrong. Check console for details.</div>;
  }
};

export default PatientBloodBankCenterServicePage;
