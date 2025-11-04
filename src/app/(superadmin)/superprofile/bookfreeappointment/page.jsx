import React from "react";
import Bookfreeappointment from "../../components/bookfreeappointment";
import { db } from "@/lib/db";

const BookFreeAppointmentSuperPage = async () => {
  // Fetching appointment data along with category titles
  const Appointmentdata = await db.BookFreeAppointment.findMany({
    include: {
      patient: true,
      doctor: {
        select: { firstName: true, lastName: true, id: true },
      },
      category: {
        select: {
          title: true, // Include the title of the category
        },
      },
    },
    orderBy: {
      createdAt: "desc", // Order by creation date descending
    },
  });

  const doctortype = await db.ExpertDoctorsCategory.findMany({});
  // Extract category titles from the fetched data
  const categorytitle = Appointmentdata.map(
    (appointment) => appointment.category?.title
  );

  const doctordata = await db.doctor.findMany({
    include: {
      doctorinfo: true,
    },
  });

  return (
    <div>
      <Bookfreeappointment
        userdata={Appointmentdata}
        categorytitle={categorytitle}
        doctortype={doctortype}
        doctor={doctordata}
      />
    </div>
  );
};

export default BookFreeAppointmentSuperPage;
