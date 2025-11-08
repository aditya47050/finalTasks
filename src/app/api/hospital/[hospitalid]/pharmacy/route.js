import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// 🧠 GET Pharmacy details for a specific hospital
export async function GET(req, { params }) {
  try {
    const { hospitalid } = await params; // ✅ dynamic param

    // ⚠️ Validate hospital ID
    if (!hospitalid) {
      return NextResponse.json(
        { success: false, message: "Hospital ID is required." },
        { status: 400 }
      );
    }

    // 🔍 Fetch hospital data
    const hospital = await db.hospital.findUnique({
      where: { id: hospitalid },
      select: { pharmacyJson: true },
    });

    // 🧾 Handle not found
    if (!hospital) {
      return NextResponse.json(
        { success: false, message: "Hospital not found." },
        { status: 404 }
      );
    }

    // 💊 No pharmacy data
    if (!hospital.pharmacyJson) {
      return NextResponse.json({
        success: true,
        message: "No pharmacy data found for this hospital.",
        pharmacy: null,
      });
    }

    // ✅ Return data
    return NextResponse.json({
      success: true,
      message: "Pharmacy data fetched successfully.",
      pharmacy: hospital.pharmacyJson,
    });
  } catch (error) {
    console.error("🔥 Error fetching pharmacy details:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch pharmacy details.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
