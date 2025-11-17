import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import HospitalSingleView from "./components/hospitalsingle";
import AccessErrorDisplay from "@/app/components/accesserror";

export const dynamic = "force-dynamic";

const HospitalPage = async ({ params }) => {
  try {
    const { doctorid: hospitalid } = params;

    // ✅ 1. Get session
    const session = await getSession();

    if (!session || !session.email) {
      return <AccessErrorDisplay />;
    }

    // ✅ 2. Find patient by email
    const patient = await db.patient.findUnique({
      where: { email: session.email },
    });

    if (!patient) {
      return <AccessErrorDisplay />;
    }

    const patientId = patient.id;

    // ✅ 3. Fetch hospital data
    const hospitalData = await db.Hospital.findUnique({
      where: { id: hospitalid },
      include: {
        hspInfo: true,
        hspcontact: true,
        hspdetails: true,
        hspbranches: true,

        HospitalSpeciality: {
          include: {
            speciality: true,
          },
        },

        // ⭐⭐⭐ FINAL IMPORTANT BLOCK ⭐⭐⭐
        linkedDiagnosticCenters: {
          select: {
            id: true,
            diagnosticCenterId: true,
            diagnosticCenter: {
              select: {
                id: true,
                email: true,
                mobile: true,
                hspInfo: {
                  select: { regname: true },
                },
              },
            },
          },
        },
      },
    });

    return (
      <HospitalSingleView 
        hospitalData={hospitalData}
        patientId={patientId}
      />
    );
  } catch (error) {
    console.error("Error loading hospital page:", error);
    return <div>Something went wrong. Please try again later.</div>;
  }
};

export default HospitalPage;
