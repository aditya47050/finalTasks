import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import PharmacyProfileClient from "../component/pharmacy-profile-client";

const PharmacyProfilePage = async () => {
  const session = await getSession();
  if (!session?.email) redirect("/pharmacy/login");

  const [states, districts, subDistricts] = await Promise.all([
    db.state.findMany({}),
    db.district.findMany({}),
    db.SubDistrict.findMany({}),
  ]);

  const existingProfile = await db.pharmacy.findUnique({
    where: { email: session.email },
    select: { email: true, mobile: true, pincode: true },
  });

  return (
    <PharmacyProfileClient
      states={states}
      districts={districts}
      subDistricts={subDistricts}
      existingProfile={existingProfile}
    />
  );
};

export default PharmacyProfilePage;


