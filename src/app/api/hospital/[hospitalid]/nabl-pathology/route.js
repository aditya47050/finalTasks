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
      select: { nablPathologyJson: true },
    });

    if (!hospital || !hospital.nablPathologyJson) {
      return NextResponse.json({
        success: true,
        message: "No NABL Pathology data found for this hospital.",
        nablPathology: null,
      });
    }

    return NextResponse.json({
      success: true,
      message: "NABL Pathology data fetched successfully.",
      nablPathology: hospital.nablPathologyJson,
    });
  } catch (error) {
    console.error("🔥 Error fetching NABL Pathology data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch NABL Pathology data.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
