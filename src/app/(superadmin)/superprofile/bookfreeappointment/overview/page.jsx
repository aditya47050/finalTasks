import React from "react";
import { db } from "@/lib/db";
import BookfreeappointmentwithGraph from "./client";

const BookFreeAppointmentSuperPage = async () => {
  // Fetching appointment data along with category titles
  const Appointmentdata = await db.BookFreeAppointment.findMany({
    include: {
      patient: true,
      category: {
        select: {
          title: true, // Include the title of the category
        },
      },
    },
  });
  const doctortype = await db.ExpertDoctorsCategory.findMany({})
  // Extract category titles from the fetched data
  const categorytitle = Appointmentdata.map(
    (appointment) => appointment.category?.title
  );

  return (
    <div>
      <BookfreeappointmentwithGraph
        userdata={Appointmentdata}
        categorytitle={categorytitle}
        doctortype={doctortype}
      />
    </div>
  );
};

export default BookFreeAppointmentSuperPage;
