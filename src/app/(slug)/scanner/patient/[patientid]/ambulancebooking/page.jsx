import React from "react";
import { db } from "@/lib/db";
import BookAmbulance from "../../components/bookambulance";

export const dynamic = "force-dynamic";

const PatientBookAmbulancePage = async ({ params }) => {
  try {
    const { patientid: patientId } = params; // Get patientId from URL

    if (!patientId) {
      return <div className="text-center p-6">Patient ID not provided</div>;
    }

    // Fetch patient by ID
    const patient = await db.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return <div className="text-center p-6">Patient not found</div>;
    }

    // Fetch ambulance bookings for this patient
    const ambulanceData = await db.bookAmbulance.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        ambulancetype: true,
        ambulancecategory: true,
        hospitaltype: true,
        medicaldoc1: true,
        medicaldoc2: true,
        medicaldoc3: true,
        ambulanceVaichicleId: true,
        ambulanceVaichicle: {
          select: {
            ambulancetype: true,
            ambulancecategory: true,
            ambulance: {
              select: {
                AmbulanceHsp: {
                  select: {
                    hspregname: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return (
      <div>
        <BookAmbulance userdata={ambulanceData} />
      </div>
    );
  } catch (error) {
    console.error("Error loading BookAmbulancePage:", error);
    return <div className="text-center p-6">Something went wrong.</div>;
  }
};

export default PatientBookAmbulancePage;
