import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ GET Cashless Services for a specific hospital
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const hospitalId = searchParams.get("hospitalId");

    if (!hospitalId) {
      return NextResponse.json(
        { error: "Hospital ID is required" },
        { status: 400 }
      );
    }

    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
      select: { cashlessservices: true },
    });

    if (!hospital) {
      return NextResponse.json(
        { error: "Hospital not found" },
        { status: 404 }
      );
    }

    const data = hospital.cashlessservices || {};

    return NextResponse.json({
      success: true,
      message: "Cashless services fetched successfully",
      data,
    });
  } catch (error) {
    console.error("🔥 Error fetching cashless services:", error);
    return NextResponse.json(
      { error: "Failed to fetch cashless services" },
      { status: 500 }
    );
  }
}
