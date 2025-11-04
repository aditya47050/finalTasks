import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import HeadingClientMain from "@/app/components/heading";
import DepartmentContactTable from "../components/department-contactclient";

const DepartmentContactPage= async () => {
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

  const data = await db.HospitalDepartment.findMany({
    where: { hospitalId: hospital.id },
  });

  return (
    <div className="md:container">
      <HeadingClientMain main="Department Contact info" />
      <DepartmentContactTable data={data} hospitalId={hospital.id} />
    </div>
  );
};

export default DepartmentContactPage;
