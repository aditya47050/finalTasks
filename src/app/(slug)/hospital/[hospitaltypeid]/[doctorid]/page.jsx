import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import HospitalSingleView from "./components/hospitalsingle";
import AccessErrorDisplay from "@/app/components/accesserror";

export const dynamic = "force-dynamic";

const HospitalPage = async ({ params }) => {
  try {
    const { doctorid: hospitalid } = params;

    const session = await getSession();

    if (!session?.email) return <AccessErrorDisplay />;

    const patient = await db.patient.findUnique({
      where: { email: session.email },
    });

    if (!patient) return <AccessErrorDisplay />;

    const patientId = patient.id;

    // ⭐ Fetch ALL hospitals (for Top Bed Booking Section)
    const allHospitals = await db.Hospital.findMany({
      include: {
        hspInfo: true,
        hspcontact: true,
        hspdetails: true,
        _count: {
          select: {
            BedBooking: true,
            reviews: true,
          },
        },
      },
    });

    // ⭐ Fetch Single Hospital Data
    const hospitalData = await db.Hospital.findUnique({
      where: { id: hospitalid },
      include: {
        hspInfo: true,
        hspcontact: true,
        hspdetails: true,
        hspbranches: true,
        HospitalSpeciality: { include: { speciality: true } },
        linkedDiagnosticCenters: {
          select: {
            id: true,
            diagnosticCenterId: true,
            diagnosticCenter: {
              select: {
                id: true,
                email: true,
                mobile: true,
                hspInfo: { select: { regname: true } },
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
        allHospitals={allHospitals}   // ⬅️ ADD HERE
      />
    );
  } catch (error) {
    console.error("Error loading hospital page:", error);
    return <div>Something went wrong. Please try again later.</div>;
  }
};

export default HospitalPage;
