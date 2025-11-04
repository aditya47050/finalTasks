import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Ensure you have a `db.js` file in `lib/`

export async function POST(req, { params }) {
  try {
    const  hospitalId  = params.hospitalid;
    const { specialties } = await req.json();

    // Validate input
    if (
      !specialties ||
      !Array.isArray(specialties) ||
      specialties.length === 0
    ) {
      return NextResponse.json(
        { error: "Hospital ID and at least one specialty are required." },
        { status: 400 }
      );
    }

    // Ensure hospital exists
    const hospital = await db.hospital.findUnique({
      where: { id: hospitalId },
    });

    if (!hospital) {
      return NextResponse.json(
        { error: "Hospital not found" },
        { status: 404 }
      );
    }

    // Get existing specialties for the hospital
    const existingSpecialties = await db.hospitalSpeciality.findMany({
      where: { hospitalId },
      select: { specialityId: true },
    });

    const existingSpecialtyIds = new Set(
      existingSpecialties.map((s) => s.specialityId)
    );

    // Filter only new specialties that are not already linked
    const newSpecialties = specialties.filter(
      (specialityId) => !existingSpecialtyIds.has(specialityId)
    );

    if (newSpecialties.length > 0) {
      // Insert only new specialties
      await db.hospitalSpeciality.createMany({
        data: newSpecialties.map((specialityId) => ({
          hospitalId,
          specialityId,
        })),
      });
    }

    return NextResponse.json(
      { message: "Specialties updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating specialties:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
