import { db } from "@/lib/db"; // Assuming you're using Prisma for DB management
import { NextResponse } from "next/server";

// PUT Handler
export async function PUT(request, { params }) {
  const id = params.patientid;

  try {
    const data = await request.formData();
    // console.log("Raw Form Data:", Array.from(data.entries()));
    const emaildata = await db.Patient.findUnique({ where: { id } });

    if (!emaildata) {
      return NextResponse.json(
        { error: "Patient not found." },
        { status: 404 }
      );
    }

    let formData = Object.fromEntries(data);

    const patientUpdateData = {
      ...formData,
    };

    for (const key in patientUpdateData) {
      if (patientUpdateData[key] === undefined || patientUpdateData[key] === "")
        delete patientUpdateData[key];
    }

    const updatedPost = await db.$transaction(async (prisma) => {
      const patientUpdate = await prisma.Patient.update({
        where: { id },
        data: patientUpdateData,
      });

      return patientUpdate;
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating patient:", error);
    return NextResponse.json(
      { error: `An error occurred: ${error.message}` },
      { status: 500 }
    );
  }
}
