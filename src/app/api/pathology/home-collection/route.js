import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const hospitalId = searchParams.get("hospitalId");

    if (!hospitalId) {
      return NextResponse.json(
        { success: false, message: "Hospital ID is required." },
        { status: 400 }
      );
    }

    const hospital = await db.hospital.findUnique({
      where: { id: hospitalId },
      select: { homecollectionservices: true }, // ✅ correct field
    });

    if (!hospital || !hospital.homecollectionservices) {
      return NextResponse.json({
        success: true,
        message: "No Home Collection data found for this hospital.",
        homeCollection: null,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Home Collection data fetched successfully.",
      homeCollection: hospital.homecollectionservices,
    });
  } catch (error) {
    console.error("🔥 Error fetching home collection data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch Home Collection data.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
