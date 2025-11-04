import { db } from "@/lib/db";
import React from "react";
import Alldonorslist from "../components/donorslist";

const DonorsPage = async () => {
  const donors = await db.donor.findMany({
    select: {
      id: true,
      fullname: true,
      email: true,
      mobile: true,
      pincode: true,
      city: true,
      pancardno: true,
      createdAt: true,
    },
  });
  return (
    <div>
      <Alldonorslist donorData={donors} />
    </div>
  );
};

export default DonorsPage;
