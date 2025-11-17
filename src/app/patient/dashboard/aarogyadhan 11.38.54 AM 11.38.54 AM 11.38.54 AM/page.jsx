// app/patient/dashboard/aarogyadhan/page.jsx

export const dynamic = "force-dynamic"; // ✅ forces server-side rendering

import FundraisersClient from "@/app/aarogyadhan/components/fundraiserslist";
import FundraisingForm from "@/app/components/campaignform";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import React from "react";

const PatientAarogyaDhanPage = async () => {
  try {
    const session = await getSession();

    if (!session || !session.email) {
      console.error("Session is null or missing email.");
      throw new Error("Session or email not found.");
    }

    const patient = await db.patient.findUnique({
      where: { email: session.email },
      select: { id: true },
    });

    if (!patient) {
      console.error("No patient found with email:", session.email);
      throw new Error("Patient not found.");
    }

    const data = await db.fundraisingCampaign.findMany({
      where: {
        fundraiser: {
          patientId: patient.id,
        },
      },
      include: {
        fundraiser: true,
      },
    });

    return (
      <div>
        <FundraisingForm />
        <FundraisersClient data={data} />
      </div>
    );
  } catch (error) {
    console.error("Error loading PatientAarogyaDhanPage:", error);
    return <div>Something went wrong. Please try again later.</div>;
  }
};

export default PatientAarogyaDhanPage;
