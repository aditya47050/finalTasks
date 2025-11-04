// src/app/(slug)/hospital/dashboard/associateddiagnosticcenters/page.jsx
import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import DiagnosticCenterApprovalClient from "../components/associateddiagnsoticcenters";

const Page = async () => {

  const session = await getSession();
  if (!session?.email) redirect("/hospital/login");


  const user = await db.Hospital.findFirst({
    where: { email: session.email, role: "DiagnosticCenter" },
    select: { id: true, email: true },
  });

  if (!user) redirect("/hospital/login");


  const partnerships = await db.HospitalDiagnosticCenter.findMany({
    where: { diagnosticCenterId: user.id }, 
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

  const [state, dist, subdist] = await Promise.all([
    db.state.findMany(),
    db.district.findMany(),
    db.SubDistrict.findMany(),
  ]);

  return (
    <DiagnosticCenterApprovalClient
      userdata={user}
      associations={associations}
      state={state}
      dist={dist}
      subdist={subdist}
    />
  );
};

export default Page;
