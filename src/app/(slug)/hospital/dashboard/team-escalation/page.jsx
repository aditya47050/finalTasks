import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import StaffTable from "../components/escaltion-teamclient";
import HeadingClientMain from "@/app/components/heading";

const TeamEscaltionPage = async () => {
  const session = await getSession();

  // If there's no session, return an error or redirect
  if (!session || !session.email) {
    return <div>Error: No session found. Please log in.</div>;
  }

  const hospital = await db.hospital.findUnique({
    where: { email: session.email },
    select: { id: true },
  });

  // If no hospital is found, return an error message
  if (!hospital) {
    return <div>Error: No hospital found for this account.</div>;
  }

  const data = await db.Staff.findMany({
    where: { hospitalId: hospital.id },
  });

  return (
    <div>
      <HeadingClientMain main="Team Escalation" sub="Add New" />
      <StaffTable data={data} hospitalId={hospital.id} />
    </div>
  );
};

export default TeamEscaltionPage;
