import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const { patientid } = params;
  const formData = await request.formData();

  const provider = formData.get("provider");
  const policyNumber = formData.get("policyNumber");
  const document = formData.get("document");
  const coverage = formData.get("coverage");
  const copay = formData.get("copay");

  if (!provider || !policyNumber) {
    return NextResponse.json(
      { error: "Provider and Policy Number are required." },
      { status: 400 }
    );
  }

  try {
    // Save the health insurance data to the database
    const healthInsurance = await db.healthInsurance.create({
      data: {
        provider,
        policyNumber,
        document,
        coverage,
        copay,
        patientId: patientid,
      },
    });

    return NextResponse.json({ success: true, data: healthInsurance });
  } catch (error) {
    console.error("Error saving health insurance:", error);
    return NextResponse.json(
      { error: "Failed to save health insurance." },
      { status: 500 }
    );
  }
}
