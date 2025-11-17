import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @route   GET /api/health-insurance/healthcheck?insuranceId=...
 * @desc    Get health check service details for a specific Health Insurance
 * @access  Public
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const insuranceId = searchParams.get("insuranceId");

    if (!insuranceId) {
      return NextResponse.json(
        { success: false, message: "Missing insuranceId in query" },
        { status: 400 }
      );
    }

    const insurance = await prisma.healthInsurance.findUnique({
      where: { id: insuranceId },
      select: {
        id: true,
        companyName: true,
        category: true,
        contactNumber: true,
        healthCheckService: true,
      },
    });

    if (!insurance) {
      return NextResponse.json(
        { success: false, message: "Insurance not found" },
        { status: 404 }
      );
    }

    if (!insurance.healthCheckService) {
      return NextResponse.json(
        { success: false, message: "No health check data found for this insurance." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Health check details fetched successfully",
      data: {
        id: insurance.id,
        companyName: insurance.companyName,
        category: insurance.category,
        contactNumber: insurance.contactNumber,
        healthCheckService: insurance.healthCheckService,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching health check details:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
