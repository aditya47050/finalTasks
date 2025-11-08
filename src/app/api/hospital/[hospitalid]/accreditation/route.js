import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { hospitalid } = await params;

    // 🧩 Validate hospital ID
    if (!hospitalid) {
      return NextResponse.json(
        { success: false, message: "Hospital ID is required." },
        { status: 400 }
      );
    }

    // 🔍 Fetch the hospital accreditation data
    const hospital = await db.hospital.findUnique({
      where: { id: hospitalid },
      select: { accreditationJson: true },
    });

    // ⚠️ If no data found
    if (!hospital || !hospital.accreditationJson) {
      return NextResponse.json({
        success: true,
        message: "No NABH Accreditation data found for this hospital.",
        accreditation: null,
      });
    }

    // ✅ Return accreditation data
    return NextResponse.json({
      success: true,
      message: "NABH Accreditation data fetched successfully.",
      accreditation: hospital.accreditationJson,
    });
  } catch (error) {
    console.error("🔥 Error fetching NABH Accreditation data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch NABH Accreditation data.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
