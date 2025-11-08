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
      select: { onlinereportsservices: true },
    });

    if (!hospital || !hospital.onlinereportsservices) {
      return NextResponse.json({
        success: true,
        message: "No online report services found for this hospital.",
        onlineReports: null,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Online Reports data fetched successfully.",
      onlineReports: hospital.onlinereportsservices,
    });
  } catch (error) {
    console.error("🔥 Error fetching online reports data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch Online Reports data.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
