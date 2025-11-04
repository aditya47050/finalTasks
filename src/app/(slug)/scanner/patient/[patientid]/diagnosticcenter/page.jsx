import React from "react";
import { db } from "@/lib/db";
import DiagnosticCenter from "../../components/diagnosticcenter";
import { getSession } from "@/lib/getsession";

export const dynamic = "force-dynamic";

const PatientDiagnosticServicesPage = async ({ params }) => {
  const { patientid: patientId } = params;

  if (!patientId) {
    return <div className="text-center p-6">Patient ID not provided</div>;
  }

  // ✅ Fetch logged-in diagnostic center session
  const session = await getSession();
  let diagnosticCenter = null;

  if (session?.email) {
    diagnosticCenter = await db.Hospital.findFirst({
      where: { email: session.email, role: "DiagnosticCenter" },
      select: { id: true },
    });
  }

  // Fetch patient info
  const patient = await db.patient.findUnique({ where: { id: patientId } });
  if (!patient) {
    return <div className="text-center p-6">Patient not found</div>;
  }

  // Fetch all bookings for this patient
  const diagnosticBookings = await db.bookDiagnosticService.findMany({
    where: { patientId: patient.id },
    orderBy: { bookingDate: "desc" },
    include: {
      service: {
        include: {
          Hospital: {
            include: {
              hspInfo: {
                include: {
                  hspcategory: {
                    include: { diagnosticcategory: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // Format data and mark if the logged-in diagnostic center owns this booking
  const formattedData = diagnosticBookings.map((booking) => {
    const diagnosticCategories = booking.service?.Hospital?.hspInfo?.hspcategory
      ?.filter((cat) => cat.diagnosticcategory !== null)
      ?.map((cat) => cat.diagnosticcategory);

    const primaryDiagnosticCategory = diagnosticCategories?.[0];

    // ✅ Check ownership
    const canUpload = diagnosticCenter
      ? booking.service.hospitalId === diagnosticCenter.id
      : false;

    return {
      id: booking.id,
      serviceId: booking.serviceId,
      facility: booking.service?.facility || "Not specified",
      hospitalId: booking.service?.hospitalId || null,
      hospitalName: booking.service?.Hospital?.name || "Not specified",
      hospitalRegName: booking.service?.Hospital?.hspInfo?.regname || "Not specified",
      diagnosticCategory: primaryDiagnosticCategory?.title || "Not specified",
      diagnosticCategoryId: primaryDiagnosticCategory?.id || null,
      minPrice: booking.service?.minPrice || "Not specified",
      maxPrice: booking.service?.maxPrice || "Not specified",
      available: booking.service?.available || false,
      bookingDate: booking.bookingDate,
      preferredDate: booking.preferredDate,
      preferredTimeSlot: booking.preferredTimeSlot,
      status: booking.status,
      report: booking.report || null,
      receipt: booking.receipt || null,
      canUpload, // ✅ flag for client component
    };
  });

  return <DiagnosticCenter bookings={formattedData} />;
};

export default PatientDiagnosticServicesPage;
