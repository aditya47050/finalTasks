// app/patient/dashboard/book-surgery/page.jsx

import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import SurgerySchedule from "../../components/surgeryschedule";

export const dynamic = "force-dynamic";

const PatientBookSurgeryPage = async () => {
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

    // 2️⃣ Fetch surgery bookings for this patient
    const surgeryData = await db.bookSurgeryTreatment.findMany({
        where: { 
    patientId: patient.id,
    service: { type: "Surgery" }
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


    return (
      <div>
        <SurgerySchedule userdata={surgeryData} />
      </div>
    );
  } catch (error) {
    console.error("Error loading BookSurgeryPage:", error);
    return <div className="text-center p-6">Something went wrong.</div>;
  }
};

export default PatientBookSurgeryPage;
