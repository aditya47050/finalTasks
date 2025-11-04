import React from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import DiagnosticCenterSingleView from "./component/SingleDiagnosticDetails";
import { getSession } from "@/lib/getsession";
import AccessErrorDisplay from "@/app/components/accesserror";

const SingleDiagnosticDetailsPage = async ({ params }) => {
  const { diagnosticcenterid, diagnosticid } = params;
  const session = await getSession();

  if (!session || !session.email) {
    return <AccessErrorDisplay />;
  }

  const patient = await db.patient.findFirst({
    where: { email: session.email },
    select: { id: true },
  });

  // If not a patient, deny access
  if (!patient) {
    return (
      <AccessErrorDisplay />
    );
  }

  try {
    const diagnosticCenter = await db.DiagnosticCenterCategory.findFirst({
      where: { id: diagnosticcenterid },
    });

    const diagnosticCenterData = await db.Hospital.findFirst({
      where: { id: diagnosticid },
      include: {
        hspInfo: {
          include: {
            hspcategory: {
              include: {
                diagnosticcategory: true,
              },
            },
          },
        },
        hspdetails: true,
        hspcontact: true,
        hspbranches: true,
        diagnosticServices: true,
      },
    });

    if (!diagnosticCenter || !diagnosticCenterData) {
      notFound();
    }

    return (
      <div className="">
       {/* added className in the component directly */}
        <DiagnosticCenterSingleView
          diagnosticCenter={diagnosticCenter}
          diagnosticcenterdata={diagnosticCenterData}
          patientId={patient.id}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching diagnostic center data:", error);
    notFound();
  }
};

export default SingleDiagnosticDetailsPage;
