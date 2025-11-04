import React from "react";
import { db } from "@/lib/db";
import BedBookingClientGraph from "./client";

const BedBookingPageOverview = async () => {
  const bedbookingdata = await db.BedBooking.findMany({
    include: { patient: true },
  });

  return (
    <div>
      <BedBookingClientGraph userdata={bedbookingdata} />
    </div>
  );
};

export default BedBookingPageOverview;
