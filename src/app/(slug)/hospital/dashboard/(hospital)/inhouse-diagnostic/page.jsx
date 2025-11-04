
import { db } from "@/lib/db";
import React from "react";
import InhouseDiagnosticComponent from "../components/inhousediagnosticcompo";
import { getSession } from "@/lib/getsession";

const InhouseDiagnosticsPage = async () => {
  const session = await getSession();
  if (!session || !session.email) {
    console.error("Session or email is undefined.");
    return <div>Error: Unauthorized</div>;
  }
  const hospital = await db.hospital.findFirst({
    where: { email: session.email },
    select: { id: true },
  });


  // Fetch the hospital data including linked diagnostic centers
  const hospitalData = await db.hospital.findUnique({
    where: { id: hospital.id },
    include: { 
      hspInfo: {
        select: {
          id: true,
          regname: true,
        },
      },
      linkedDiagnosticCenters: {
        select: {
          id: true,
          diagnosticCenter: {
            select: {
              id: true,
              email: true,
              mobile: true,
              hspInfo: {
                select: {
                  regname: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!hospitalData) {
    return <div>Hospital not found</div>;
  }

  // Fetch all diagnostic centers to allow linking
  const allDiagnosticCenters = await db.hospital.findMany({
    where: { role: "DiagnosticCenter" },
    select: {
      id: true,
      email: true,
      mobile: true,
      hspInfo: {
        select: {
          regname: true,
        },
      },
    },
  });

  return (
    <div>
      <InhouseDiagnosticComponent
        hospitalId={hospital.id}
        diagnosticCenters={hospitalData.linkedDiagnosticCenters}
        allDiagnosticCenters={allDiagnosticCenters}
      />
    </div>
  );
};

export default InhouseDiagnosticsPage;