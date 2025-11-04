// app/patient/dashboard/book-ambulance/page.jsx

import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import BookAmbulance from "@/app/patient/dashboard/components/bookambulance";

export const dynamic = "force-dynamic"; 

const PatientBookAmbulancePage = async () => {
  try {
    const session = await getSession();

    if (!session?.email) {
      throw new Error("Session or email not found");
    }

    const patient = await db.patient.findUnique({
      where: { email: session.email },
    });

    if (!patient) {
      throw new Error("Patient not found");
    }

const ambulanceData = await db.bookAmbulance.findMany({
  where: { patientId: patient.id },
  orderBy: { createdAt: 'desc' },
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
