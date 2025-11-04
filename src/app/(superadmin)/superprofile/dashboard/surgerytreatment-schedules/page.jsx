import React from "react";
import { db } from "@/lib/db";
import AllSurgeryTreatmentBookings from "../../components/surgerytreatmentsclient";

const SurgeryBookingPage = async () => {
  const data = await db.BookSurgeryTreatment.findMany({
    include: {
      patient: true,
      service: {
        include: {
          hospital: {
            include: {
              hspInfo: true, // to get hospital name
            },
          },
        },
      },
    },
  });

  const transformedData = data.map((booking) => ({
    id: booking.id,
    patient: {
      id: booking.patient.id,
      firstName: booking.patient.firstName,
      lastName: booking.patient.lastName,
      email: booking.patient.email,
      mobile: booking.patient.mobile,
    },
    service: {
      id: booking.service.id,
      serviceName: booking.service.serviceName,
      category: booking.service.category,
      type: booking.service.type || "N/A",   // <-- HERE we add type
      hospital: {
        id: booking.service.hospital.id,
        regname: booking.service.hospital.hspInfo?.regname || "N/A",
        email: booking.service.hospital.email || "N/A",
      },
    },
    preferredDate: booking.preferredDate,
    preferredTimeSlot: booking.preferredTimeSlot,
    status: booking.status,
    bookedByType: booking.bookedByType,
    createdAt: booking.createdAt,
  }));

  return (
    <div>
      <AllSurgeryTreatmentBookings userdata={transformedData} />
    </div>
  );
};

export default SurgeryBookingPage;
