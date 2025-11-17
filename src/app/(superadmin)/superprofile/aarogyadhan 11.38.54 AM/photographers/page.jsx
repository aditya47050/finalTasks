import { db } from "@/lib/db";
import React from "react";
import AllPhotographersList from "../components/photographerlist";

const PhotographerPAge = async () => {
  const data = await db.photographer.findMany({
  select: {
    id: true,
    fullname: true,
    email: true,
    mobile: true,
    city: true,
    pincode: true,
    pancardno: true,
    aadharcardno: true,
  },
});

  return (
    <div>
      <AllPhotographersList photographerData={data} />
    </div>
  );
};

export default PhotographerPAge;
