// src/app/(slug)/hospital/dashboard/associatedhomehealthcare/page.jsx
import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import HomeHealthcareApprovalClient from "../components/associatedhomehealthcare";

const Page = async () => {
  const session = await getSession();
  if (!session?.email) redirect("/hospital/login");

  // ✅ Fetch logged-in home healthcare user (same as diagnostic flow)
  const user = await db.Hospital.findFirst({
    where: { email: session.email, role: "homehealthcare" },
    select: { id: true, email: true },
  });

  if (!user) redirect("/hospital/login");

  // ✅ Fetch partnerships where this user is the home healthcare center
  const partnerships = await db.HospitalHomeHealthcare.findMany({
    where: { homeHealthcareId: user.id },
    include: {
      hospital: {
        include: {
          hspInfo: true,
          hspcontact: true,
          hspdetails: true,
        },
      },
    },
  });

  // ✅ Normalize associations for client
  const associations = partnerships.map((p) => ({
    id: p.id,
    hospital: p.hospital,
    status: p.status,
    partnershipType: p.partnershipType,
    agreementDate: p.agreementDate,
    expiryDate: p.expiryDate,
    notes: p.notes,
    approvedBy: p.approvedBy,
    approvedAt: p.approvedAt,
    createdAt: p.createdAt,
  }));

  // ✅ Match casing with schema (same as diagnostic page)
  const [state, dist, subdist] = await Promise.all([
    db.state.findMany(),
    db.district.findMany(),
    db.SubDistrict.findMany(),
  ]);

  return (
    <HomeHealthcareApprovalClient
      userdata={user}
      associations={associations}
      state={state}
      dist={dist}
      subdist={subdist}
    />
  );
};

export default Page;
