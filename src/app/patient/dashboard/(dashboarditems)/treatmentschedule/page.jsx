// app/patient/dashboard/book-treatment/page.jsx

import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import TreatmentSchedule from "../../components/treatmentschedule"; // ✅ You'll need a TreatmentSchedule component

export const dynamic = "force-dynamic";

const PatientBookTreatmentPage = async () => {
  try {
    const session = await getSession();

    if (!session?.email) {
      throw new Error("Session or email not found");
    }

    // 1️⃣ Find patient by email
    const patient = await db.patient.findUnique({
      where: { email: session.email },
    });

    if (!patient) {
      throw new Error("Patient not found");
    }

    // 2️⃣ Fetch treatment bookings for this patient
    const treatmentData = await db.bookSurgeryTreatment.findMany({
              where: { 
    patientId: patient.id,
    service: { type: "Treatment" }
  },
      select: {
        id: true,
        bookingDate: true,
        preferredDate: true,
        preferredTimeSlot: true,
        status: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        service: {
          select: {
            serviceName: true,
            category: true,
            hospital: {
              select: {
                id: true,
                email: true,
                hspInfo: {
                  select: {
                    regname: true,
                    hspcategory: {
                      select: {
                        hspcategory: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        bookingDate: "desc",
      },
    });

    console.log("Treatment Data:", treatmentData);

    return (
      <div>
        <TreatmentSchedule userdata={treatmentData} />
      </div>
    );
  } catch (error) {
    console.error("Error loading BookTreatmentPage:", error);
    return <div className="text-center p-6">Something went wrong.</div>;
  }
};

export default PatientBookTreatmentPage;
