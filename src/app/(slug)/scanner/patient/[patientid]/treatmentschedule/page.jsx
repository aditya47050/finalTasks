// app/patient/dashboard/book-treatment/page.jsx

import React from "react";
import { db } from "@/lib/db";
import TreatmentSchedule from "../../components/treatmentschedule";

export const dynamic = "force-dynamic";

const PatientBookTreatmentPage = async ({ params }) => {
  try {
    const { patientid } = params; // ✅ Get patientId from URL

    if (!patientid) {
      return <div className="text-center p-6">Patient ID not provided</div>;
    }

    // 1️⃣ Find patient by ID
    const patient = await db.patient.findUnique({
      where: { id: patientid },
    });

    if (!patient) {
      return <div className="text-center p-6">Patient not found</div>;
    }

    // 2️⃣ Fetch treatment bookings for this patient
    const treatmentData = await db.bookSurgeryTreatment.findMany({
      where: {
        patientId: patient.id,
        service: { type: "Treatment" },
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

    return <TreatmentSchedule userdata={treatmentData} />;
  } catch (error) {
    console.error("Error loading BookTreatmentPage:", error);
    return <div className="text-center p-6">Something went wrong.</div>;
  }
};

export default PatientBookTreatmentPage;
