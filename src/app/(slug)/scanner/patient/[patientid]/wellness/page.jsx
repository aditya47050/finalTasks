// app/patient/dashboard/wellness-center/page.jsx

import { db } from "@/lib/db";
import WellnessCenter from "../../components/wellnesscenter";

export const dynamic = "force-dynamic";

const PatientWellnessCenterServicePage = async ({ params }) => {
  try {
    const { patientid } = params; // ✅ patientId comes from URL

    if (!patientid) {
      return <div className="text-center p-6">Patient ID not provided</div>;
    }

    // 1️⃣ Find patient by ID
    const patient = await db.patient.findUnique({
      where: { id: patientid },
    });

    if (!patient) {
      return <div className="text-center p-6">Patient not found</div>;
    }

    // 2️⃣ Get BookWellnesspackage entries
    const bookings = await db.BookWellnesspackage.findMany({
      where: { patientId: patient.id },
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

    // 3️⃣ Get matching services (only those booked)
    const serviceIds = bookings.map((b) => b.serviceId);
    const matchingServices = await db.Wellnesspackage.findMany({
      where: { id: { in: serviceIds } }, // ✅ filter by booked services
      include: {
        Hospital: {
          include: {
            hspInfo: true,
          },
        },
      },
    });

    // 4️⃣ Merge bookings with their matching service info
    const mergedData = bookings.map((booking) => {
      const service = matchingServices.find(
        (srv) => srv.id === booking.serviceId
      );

      return {
        ...booking,
        service: service
          ? {
              id: service.id,
              aapackagename: service.aapackagename,
              labpackagename: service.labpackagename,
              includestest: service.includestest,
              aaprice: service.aaprice,
              price: service.price,
              finalpackageprice: service.finalpackageprice,
              discount: service.discount,
              available: service.available,
              homevisit: service.homevisit,
              hospitalId: service.Hospital?.id,
              hospitalName: service.Hospital?.hspInfo?.regname ?? null,
            }
          : null,
      };
    });

    // 5️⃣ Pass merged data to component
    return <WellnessCenter bookings={mergedData} />;
  } catch (error) {
    console.error("Error loading WellnessServicesPage:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    return (
      <div className="text-center p-6">
        Something went wrong. Check console for details.
      </div>
    );
  }
};

export default PatientWellnessCenterServicePage;
