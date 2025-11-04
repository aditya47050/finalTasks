import React from "react";
import Bookfreeappointment from "../../components/bookfreeappointment";
import { db } from "@/lib/db";
import BedBookingClient from "../../components/bedbooking";

const BedBookingPage = async () => {
  const bedbookingdata = await db.BedBooking.findMany({
    include: { patient: true },
  });

  return (
    <div>
      <BedBookingClient userdata={bedbookingdata} />
    </div>
  );
};

export default BedBookingPage;
