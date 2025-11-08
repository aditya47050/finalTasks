import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @route   GET /api/health-insurance/coverage?insuranceId=...
 * @desc    Get all coverage details for a specific Health Insurance entry
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

    // ✅ Fetch insurance with coverage and optional relations
    const insurance = await prisma.healthInsurance.findUnique({
      where: { id: insuranceId },
      include: {
        reviews: true,
      },
    });

    if (!insurance) {
      return NextResponse.json(
        { success: false, message: "Insurance not found" },
        { status: 404 }
      );
    }

    // ✅ Split multiline coverage string into an array for easy UI rendering
    const coverageArray = insurance.coverage
      ? insurance.coverage.split("\n").filter(Boolean)
      : [];

    return NextResponse.json({
      success: true,
      message: "Insurance coverage fetched successfully",
      data: {
        id: insurance.id,
        companyName: insurance.companyName,
        category: insurance.category,
        coverageDetails: coverageArray,
        description: insurance.description,
        contactNumber: insurance.contactNumber,
        email: insurance.email,
        reviews: insurance.reviews || [],
      },
    });
  } catch (error) {
    console.error("❌ Error fetching insurance coverage:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
