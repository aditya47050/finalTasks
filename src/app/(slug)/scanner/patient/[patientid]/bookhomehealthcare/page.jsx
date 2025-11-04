import React from "react";
import { db } from "@/lib/db";
import BookHomeHealthcare from "../../components/bookhomeheathcare";

export const dynamic = "force-dynamic";

const PatientBookHomeHealthcarePage = async ({ params }) => {
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

    // Fetch home healthcare bookings for patient
    const homeHealthcareData = await db.bookHomeHealthcare.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: 'desc' },
      include: {
        HomeHealthcare: {
          include: {
            hospital: {
              include: {
                hspInfo: true,
                hspdetails: true,
                hspcontact: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return (
      <div>
        <BookHomeHealthcare userdata={homeHealthcareData} />
      </div>
    );
  } catch (error) {
    console.error("Error loading BookHomeHealthcarePage:", error);
    return (
      <div className="text-center p-6">
        Something went wrong. Check console for details.
      </div>
    );
  }
};

export default PatientBookHomeHealthcarePage;
