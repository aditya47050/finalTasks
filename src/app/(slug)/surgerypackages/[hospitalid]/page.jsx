import React from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

import { getSession } from "@/lib/getsession";
import AccessErrorDisplay from "@/app/components/accesserror";
import HospitalSingleView from "./component/SingleSurgeryCategory";

const SingleHospitalPage = async ({ params }) => {
  const { hospitalid } = params;
  const session = await getSession();

  // If no session, user is not logged in
  if (!session || !session.email) {
    return <AccessErrorDisplay />;
  }

  const patient = await db.patient.findFirst({
    where: { email: session.email },
    select: { id: true },
  });

  if (!patient) {
    return <AccessErrorDisplay />;
  }

  try {
    const hospitaldata = await db.Hospital.findFirst({
      where: { id: hospitalid },
      include: {
        hspInfo: {
          include: {
            hspcategory: {
              include: {
                hspcategory: true,
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

    if (!hospitaldata) {
      notFound();
    }

    return (
      <div className="min-h-screen ">
        <HospitalSingleView
          hospitaldata={hospitaldata}
          patientId={patient.id}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching diagnostic center data:", error);
    notFound();
  }
};

export default SingleHospitalPage;
