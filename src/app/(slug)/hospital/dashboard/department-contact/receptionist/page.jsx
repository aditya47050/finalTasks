/* eslint-disable */
import React from "react";
// @ts-nocheck
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import HeadingClientMain from "@/app/components/heading";
import CreateReceptionist from "./components/create-receptionist";
import ReceptionistList from "./components/receptionist-list";

export default async function ReceptionistPage() {
  const session = await getSession();

  if (!session?.email) {
    return <div>Error: No session found. Please log in.</div>;
  }

  let hospitalId;

  // Check if user is a receptionist
  if (session.role === 'receptionist' || session.hospitalId) {
    // For receptionist, use their linked hospitalId
    hospitalId = session.hospitalId;
  } else {
    // For hospital users, find hospital by email
    const hospital = await db.hospital.findUnique({
      where: { email: session.email },
      select: { id: true },
    });

    if (!hospital) {
      return <div>Error: No hospital found for this account.</div>;
    }
    hospitalId = hospital.id;
  }

  return (
    <div className="md:container">
      <HeadingClientMain main="Receptionists" />
      <div className="flex justify-end mb-3">
        <CreateReceptionist hospitalId={hospitalId} />
      </div>
      <ReceptionistList hospitalId={hospitalId} />
    </div>
  );
}


