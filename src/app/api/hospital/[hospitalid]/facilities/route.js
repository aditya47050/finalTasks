import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// 🏥 GET Hospital Facilities
export async function GET(req, context) {
  try {
    // ✅ Fix #1 — Await params properly
    const { hospitalid } = await context.params;

    // ⚠️ Validate hospital ID
    if (!hospitalid) {
      return NextResponse.json(
        { success: false, message: "Hospital ID is required." },
        { status: 400 }
      );
    }

    // ✅ Fix #2 — Only works if Prisma client was regenerated
    const hospital = await db.hospital.findUnique({
      where: { id: hospitalid },
      select: {
        id: true,
        facilitiesJson: true, // works after prisma generate
      },
    });

    if (!hospital) {
      return NextResponse.json(
        { success: false, message: "Hospital not found." },
        { status: 404 }
      );
    }

    if (!hospital.facilitiesJson || hospital.facilitiesJson.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No facilities data available for this hospital.",
        facilities: [],
        count: 0,
      });
    }

    return NextResponse.json({
      success: true,
      count: hospital.facilitiesJson.length,
      facilities: hospital.facilitiesJson,
    });
  } catch (error) {
    console.error("🔥 Error fetching hospital facilities:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch hospital facilities.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
