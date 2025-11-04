import { db } from "@/lib/db"; // Prisma client import
import { NextResponse } from "next/server";

// PUT Handler
export async function PUT(request, { params }) {
  const id = params.patientid;

  try {
    const data = await request.formData();
    const emaildata = await db.Patient.findUnique({ where: { id } });

    if (!emaildata) {
      return NextResponse.json(
        { error: "Patient not found." },
        { status: 404 }
      );
    }

    // Parse formData and handle booleans properly
    const formData = Object.fromEntries(data);
    const patientUpdateData = {
      ...formData,
      hasPanCard: formData.hasPanCard === "true",
      ayushmancard : formData.ayushmancard === "true",
      isCompanyRegistered: formData.isCompanyRegistered === "true",
      income: formData.income === "true",
    };

    // Remove empty or undefined fields
    Object.keys(patientUpdateData).forEach((key) => {
      if (!patientUpdateData[key]) delete patientUpdateData[key];
    });

    const updatedPatient = await db.$transaction(async (prisma) => {
      const patientUpdate = await prisma.Patient.update({
        where: { id },
        data: patientUpdateData,
      });

      return patientUpdate;
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error("Error updating patient:", error);
    return NextResponse.json(
      { error: `An error occurred: ${error.message}` },
      { status: 500 }
    );
  }
}
