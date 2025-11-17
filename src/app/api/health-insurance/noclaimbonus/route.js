import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @route   GET /api/health-insurance/noclaimbonus?insuranceId=...
 * @desc    Get No Claim Bonus service details for a specific Health Insurance
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
        noClaimBonusService: true,
      },
    });

    if (!insurance) {
      return NextResponse.json(
        { success: false, message: "Insurance not found" },
        { status: 404 }
      );
    }

    if (!insurance.noClaimBonusService) {
      return NextResponse.json(
        { success: false, message: "No claim bonus data not found for this insurance." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "No Claim Bonus details fetched successfully",
      data: {
        id: insurance.id,
        companyName: insurance.companyName,
        category: insurance.category,
        contactNumber: insurance.contactNumber,
        noClaimBonusService: insurance.noClaimBonusService,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching No Claim Bonus service:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
