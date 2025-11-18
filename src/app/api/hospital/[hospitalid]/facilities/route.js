import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// -----------------------------------------------------
// 🟦 GET — Fetch Hospital Facilities JSON (All Data)
// -----------------------------------------------------
export async function GET(req, { params }) {
  try {
    const { hospitalid } = params;

    if (!hospitalid) {
      return NextResponse.json(
        { success: false, message: "Hospital ID is required." },
        { status: 400 }
      );
    }

    const hospital = await db.hospital.findUnique({
      where: { id: hospitalid },
      select: {
        id: true,
        facilitiesJson: true, 
      },
    });

    if (!hospital) {
      return NextResponse.json(
        { success: false, message: "Hospital not found." },
        { status: 404 }
      );
    }

    // Return entire JSON (roomFacilities + transportation + landmarks)
    return NextResponse.json({
      success: true,
      facilities: {
        roomFacilities: hospital.facilitiesJson?.roomFacilities || [],
        transportation: hospital.facilitiesJson?.transportation || [],
        landmarks: hospital.facilitiesJson?.landmarks || [],
      },
    });
  } catch (error) {
    console.error("🔥 Error fetching hospital facilities:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch facilities.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// -----------------------------------------------------
// 🟩 PUT — Save/Update All Hospital Facilities
// -----------------------------------------------------
export async function PUT(req, { params }) {
  try {
    const { hospitalid } = params;
    const body = await req.json();

    const { roomFacilities, transportation, landmarks } = body;

    if (!hospitalid) {
      return NextResponse.json(
        { success: false, message: "Hospital ID is required." },
        { status: 400 }
      );
    }

    await db.hospital.update({
      where: { id: hospitalid },
      data: {
        facilitiesJson: {
          roomFacilities: roomFacilities || [],
          transportation: transportation || [],
          landmarks: landmarks || [],
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Facilities updated successfully.",
    });
  } catch (error) {
    console.error("🔥 Error saving hospital facilities:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save facilities.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
