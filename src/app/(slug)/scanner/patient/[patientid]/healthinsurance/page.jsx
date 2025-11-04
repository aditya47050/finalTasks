import React from "react";
import { db } from "@/lib/db";
import HealthInsurance from "../../components/healthinsurance";

export const dynamic = "force-dynamic";

const PatientHealthInsurancePage = async ({ params }) => {
  try {
    // Await params to handle Next.js async dynamic routes
    const { patientid: patientId } = await params;
    console.log("Patient ID:", patientId);

    if (!patientId) {
      console.warn("Patient ID not provided");
      return <div className="text-center p-6">Patient ID not provided</div>;
    }

    // Fetch patient basic insurance info
    const patient = await db.patient.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        healthInsuranceNumber: true,
        healthInsuranceDocument: true,
        provider: true,
        coverage: true,
        copay: true,
      },
    });

    console.log("Patient fetched:", patient);

    if (!patient) {
      console.error("Patient not found in DB");
      return <div className="text-center p-6">Patient not found</div>;
    }

    // Prepare insurance data array for component
    const insuranceData = patient.healthInsuranceNumber
      ? [
          {
            id: "basic-insurance",
            provider: patient.provider || "Basic Insurance",
            policyNumber: patient.healthInsuranceNumber,
            document: patient.healthInsuranceDocument,
            coverage: patient.coverage || "Basic coverage",
            copay: patient.copay || "N/A",
            createdAt: new Date(0), // Placeholder date
            updatedAt: new Date(0),
          },
        ]
      : [];

    console.log("Insurance data prepared:", insuranceData);

    return (
      <div>
        <HealthInsurance
          insuranceData={insuranceData}
          patientName={`${patient.firstName || ""} ${patient.lastName || ""}`.trim()}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading HealthInsurancePage:", error);
    return <div className="text-center p-6">Something went wrong. Please try again later.</div>;
  }
};

export default PatientHealthInsurancePage;
