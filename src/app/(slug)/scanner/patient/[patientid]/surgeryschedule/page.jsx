// app/patient/dashboard/book-surgery/page.jsx

import React from "react";
import { db } from "@/lib/db";
import SurgerySchedule from "../../components/surgeryschedule";

export const dynamic = "force-dynamic";

const PatientBookSurgeryPage = async ({ params }) => {
  try {
    const { patientid: patientId } = params; // Get patientId from URL

    if (!patientId) {
      return <div className="text-center p-6">Patient ID not provided</div>;
    }

    // 1️⃣ Find patient by ID
    const patient = await db.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return <div className="text-center p-6">Patient not found</div>;
    }

    // 2️⃣ Fetch surgery bookings for this patient
    const surgeryData = await db.bookSurgeryTreatment.findMany({
      where: { 
        patientId: patient.id,
        service: { type: "Surgery" },
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

    return <SurgerySchedule userdata={surgeryData} />;
  } catch (error) {
    console.error("Error loading BookSurgeryPage:", error);
    return <div className="text-center p-6">Something went wrong.</div>;
  }
};

export default PatientBookSurgeryPage;
