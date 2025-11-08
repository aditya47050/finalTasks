import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    // Fetch hospital data
    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
      select: { pathologyrating: true },
    });

    if (!hospital) {
      return NextResponse.json(
        { success: false, message: "Hospital not found." },
        { status: 404 }
      );
    }

    if (!hospital.pathologyrating) {
      return NextResponse.json({
        success: true,
        message: "No rating data available for this hospital.",
        data: null,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Pathology rating data fetched successfully.",
      data: hospital.pathologyrating,
    });
  } catch (error) {
    console.error("🔥 Error fetching pathology rating data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch pathology rating data.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
