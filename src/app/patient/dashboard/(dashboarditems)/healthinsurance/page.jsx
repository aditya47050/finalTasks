// src/app/patient/dashboard/(dashboarditems)/healthinsurance/page.jsx
import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import HealthInsurance from "@/app/patient/dashboard/components/healthinsurance";

export const dynamic = "force-dynamic";

const PatientHealthInsurancePage = async () => {
  try {
    const session = await getSession();
    if (!session?.email) throw new Error("Session or email not found");

    // Fetch patient with primary and secondary insurances
    const patient = await db.patient.findUnique({
      where: { email: session.email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        healthInsuranceNumber: true,
        healthInsuranceDocument: true,
        provider: true,
        coverage: true,
        copay: true,
        healthInsurances: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            provider: true,
            policyNumber: true,
            document: true,
            coverage: true,
            copay: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!patient) throw new Error("Patient not found");

    // Prepare props for the client component
    const primaryInsurance = patient.healthInsuranceNumber
      ? {
          id: "primary",
          provider: patient.provider || "Primary Insurance",
          policyNumber: patient.healthInsuranceNumber,
          document: patient.healthInsuranceDocument,
          coverage: patient.coverage || "N/A",
          copay: patient.copay || "N/A",
        }
      : null;

    return (
      <HealthInsurance
        primaryInsurance={primaryInsurance}
        secondaryInsurances={patient.healthInsurances}
        patientId={patient.id}
        patientName={`${patient.firstName || ""} ${patient.lastName || ""}`.trim()}
      />
    );
  } catch (error) {
    console.error("Error loading HealthInsurancePage:", error);
    return <div className="text-center p-6">Something went wrong. Please try again later.</div>;
  }
};

export default PatientHealthInsurancePage;