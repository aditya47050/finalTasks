import { db } from "@/lib/db"; // Assuming you're using Prisma for DB management
import { NextResponse } from "next/server";

// Helper function to parse and validate DD/MM/YYYY to ISO-8601 (with time)
function parseDateOfBirth(dateString) {
  if (!dateString) return null;

  const [day, month, year] = dateString
    .split("/")
    .map((part) => parseInt(part, 10));
  if (
    !isNaN(day) &&
    !isNaN(month) &&
    !isNaN(year) &&
    day > 0 &&
    month > 0 &&
    month <= 12 &&
    year > 0
  ) {
    const date = new Date(year, month - 1, day);
    return date.toISOString(); // Returns ISO-8601 DateTime format 'YYYY-MM-DDTHH:mm:ss.sssZ'
  }
  throw new Error(`Invalid date format: ${dateString}`);
}

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

    // Handle dateOfBirth conversion
    if (formData.dateOfBirth) {
      try {
        formData.dateOfBirth = parseDateOfBirth(formData.dateOfBirth);
      } catch (error) {
        return NextResponse.json(
          { error: `Invalid date format: ${formData.dateOfBirth}` },
          { status: 400 }
        );
      }
    } else {
      // If dateOfBirth is not provided, exclude it from the update payload
      delete formData.dateOfBirth;
    }

    // Clean up empty fields
    for (const key in formData) {
      if (formData[key] === undefined || formData[key] === "")
        delete formData[key];
    }

    const updatedPost = await db.$transaction(async (prisma) => {
      const patientUpdate = await prisma.Patient.update({
        where: { id },
        data: formData,
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
