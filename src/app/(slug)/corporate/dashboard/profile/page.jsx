import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import CorporateProfileClient from "../component/profile-client";

const CorporateProfilePage = async () => {
  const session = await getSession();
  if (!session?.email) redirect("/corporate/login");

  const [states, districts, subDistricts] = await Promise.all([
    db.state.findMany({}),
    db.district.findMany({}),
    db.SubDistrict.findMany({}),
  ]);

  const existingProfile = await db.corporate.findUnique({
    where: { email: session.email },
    select: { email: true, mobile: true, pincode: true },
  });

  return (
    <CorporateProfileClient
      states={states}
      districts={districts}
      subDistricts={subDistricts}
      existingProfile={existingProfile}
    />
  );
};

export default CorporateProfilePage;