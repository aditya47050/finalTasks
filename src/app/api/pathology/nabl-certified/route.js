import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const hospitalId = searchParams.get("hospitalId");

  if (!hospitalId) {
    return NextResponse.json({ success: false, message: "Hospital ID is required" });
  }

  try {
    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
      select: { nablPathologyJson: true },
    });

    if (!hospital || !hospital.nablPathologyJson) {
      return NextResponse.json({
        success: true,
        message: "No NABL certification found",
        nablPathology: null,
      });
    }

    return NextResponse.json({
      success: true,
      message: "NABL Pathology Certification fetched successfully",
      nablPathology: hospital.nablPathologyJson,
    });
  } catch (error) {
    console.error("Error fetching NABL data:", error);
    return NextResponse.json({ success: false, message: "Internal server error" });
  }
}
