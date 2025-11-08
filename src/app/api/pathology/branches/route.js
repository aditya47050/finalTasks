import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Extract hospitalId from query string
    const { searchParams } = new URL(req.url);
    const hospitalId = searchParams.get("hospitalId");

    if (!hospitalId) {
      return NextResponse.json(
        { success: false, message: "Hospital ID is required" },
        { status: 400 }
      );
    }

    // Fetch hospital data
    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
      select: { facilitiesJson: true },
    });

    if (!hospital || !hospital.facilitiesJson) {
      return NextResponse.json(
        {
          success: true,
          message: "No branch data available for this hospital.",
          data: null,
        },
        { status: 200 }
      );
    }

    const data = hospital.facilitiesJson;

    return NextResponse.json(
      {
        success: true,
        message: "Pathology branches fetched successfully",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching pathology branches:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while fetching branch data",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
