import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @route   GET /api/health-insurance/network?insuranceId=...
 * @desc    Get the network service info for a specific Health Insurance entry
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

    // ✅ Prisma handles Mongo string IDs directly
    const insurance = await prisma.healthInsurance.findUnique({
      where: { id: insuranceId },
      select: {
        id: true,
        companyName: true,
        category: true,
        contactNumber: true,
        networkService: true,
      },
    });

    if (!insurance) {
      return NextResponse.json(
        { success: false, message: "Insurance not found" },
        { status: 404 }
      );
    }

    if (!insurance.networkService) {
      return NextResponse.json(
        { success: false, message: "No network service data found for this insurance." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Network service details fetched successfully",
      data: {
        id: insurance.id,
        companyName: insurance.companyName,
        category: insurance.category,
        contactNumber: insurance.contactNumber,
        networkService: insurance.networkService,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching network service:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
