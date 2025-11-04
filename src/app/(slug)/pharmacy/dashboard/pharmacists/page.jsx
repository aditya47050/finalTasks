import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import PharmacistsList from "../component/pharmacists-list";

const PharmacistsPage = async () => {
  const session = await getSession();
  if (!session?.email) redirect("/pharmacy/login");

  const pharmacy = await db.pharmacy.findFirst({
    where: { email: session.email },
    select: { id: true },
  });
  if (!pharmacy) {
    return <div className="p-6">Pharmacy not found</div>;
  }

  const pharmacists = await db.pharmacist.findMany({
    where: { pharmacyId: pharmacy.id },
    orderBy: { regdate: "desc" },
    select: {
      id: true,
      regno: true,
      fullname: true,
      regdate: true,
      panno: true,
      pandoc: true,
      gender: true,
      aadharno: true,
      aadharfront: true,
      aadharback: true,
      profilepic: true,
    },
  });

  return (
    <PharmacistsList pharmacyId={pharmacy.id} pharmacists={pharmacists} />
  );
};

export default PharmacistsPage;


