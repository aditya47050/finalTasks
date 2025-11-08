import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { hospitalid } = await params;

    if (!hospitalid) {
      return NextResponse.json(
        { success: false, message: "Hospital ID is required." },
        { status: 400 }
      );
    }

    const hospital = await db.hospital.findUnique({
      where: { id: hospitalid },
      select: { inhouseCanteenJson: true },
    });

    if (!hospital || !hospital.inhouseCanteenJson) {
      return NextResponse.json({
        success: true,
        message: "No Inhouse Canteen data found for this hospital.",
        canteen: null,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Inhouse Canteen data fetched successfully.",
      canteen: hospital.inhouseCanteenJson,
    });
  } catch (error) {
    console.error("🔥 Error fetching Inhouse Canteen data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch Inhouse Canteen data.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
