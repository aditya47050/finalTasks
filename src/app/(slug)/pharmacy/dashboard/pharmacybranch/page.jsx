// app/pharmacy/dashboard/branches/page.jsx
import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import BranchList from "../component/branch-list";

const BranchPage = async () => {
  const session = await getSession();
  if (!session?.email) redirect("/pharmacy/login");

  // ✅ Get pharmacy by session email
  const pharmacy = await db.pharmacy.findFirst({
    where: { email: session.email },
    select: { id: true },
  });

  if (!pharmacy) {
    return <div className="p-6">Pharmacy not found</div>;
  }

  // ✅ Get existing branches
  const branches = await db.pharmacybranch.findMany({
    where: { pharmacyId: pharmacy.id },
    orderBy: { regno: "asc" },
    select: {
      id: true,
      regname: true,
      regno: true,
      address: true,
      city: true,
      pincode: true,
      state: true,
      dist: true,
      taluka: true,
      receptionno1: true,
      receptionno2: true,
      receptionemail: true,
      branchmanagername: true,
      branchmanagerno: true,
      branchmanageremail: true,
    },
  });

  // ✅ Fetch States / Districts / SubDistricts (same as PharmacyProfilePage)
  const [states, districts, subDistricts] = await Promise.all([
    db.state.findMany({}),
    db.district.findMany({}),
    db.subDistrict.findMany({}),
  ]);

  return (
    <BranchList
      pharmacyId={pharmacy.id}
      branches={branches}
      states={states}
      districts={districts}
      subDistricts={subDistricts}
    />
  );
};

export default BranchPage;
