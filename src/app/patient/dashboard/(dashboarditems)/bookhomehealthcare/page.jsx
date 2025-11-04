import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import BookHomeHealthcare from "@/app/patient/dashboard/components/bookhomehealthcare";

export const dynamic = "force-dynamic"; 

const PatientBookHomeHealthcarePage = async () => {
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

    const homeHealthcareData = await db.bookHomeHealthcare.findMany({
      where: { patientId: patient.id },
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
        createdAt: 'desc',
      },
    });

    console.log("Home Healthcare Data:", homeHealthcareData);
  
    return (
      <div>
        <BookHomeHealthcare userdata={homeHealthcareData} />
      </div>
    );
  } catch (error) {
    console.error("Error loading BookHomeHealthcarePage:", error);
    return <div className="text-center p-6">Something went wrong.</div>;
  }
};

export default PatientBookHomeHealthcarePage;