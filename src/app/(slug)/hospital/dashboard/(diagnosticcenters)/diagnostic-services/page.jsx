export const dynamic = "force-dynamic"; // ✅ forces server-side rendering
import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import DiagnosticServicesList from "../components/allDaignosticServices.jsx";

const DiagnosticServicesPage = async () => {
  const session = await getSession();
  const user = await db.Hospital.findFirst({
    where: { email: session.email, role: "DiagnosticCenter" },
    select: { id: true },
  });
  const data = await db.DiagnosticCenterServices.findMany({
    where: { hospitalId: user.id },
  });
  if (!session || !session.email) {
    // redirect or throw an error
    return <div>Unauthorized</div>;
  }

  if (!user) {
    // No matching diagnostic center found
    return <div>Access Denied</div>;
  }
  return (
    <div>
      <DiagnosticServicesList diagnosticServices={data} hospitalId={user.id} />
    </div>
  );
};

export default DiagnosticServicesPage;
