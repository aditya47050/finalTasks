import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    // ✅ Direct string query works fine with Prisma (Mongo auto handles it)
    const insurance = await prisma.healthInsurance.findUnique({
      where: { id: insuranceId },
      select: {
        id: true,
        companyName: true,
        category: true,
        contactNumber: true,
        cashlessServices: true,
      },
    });

    if (!insurance) {
      return NextResponse.json(
        { success: false, message: "Insurance not found" },
        { status: 404 }
      );
    }

    const cashlessArray = Array.isArray(insurance.cashlessServices)
      ? insurance.cashlessServices
      : [];

    return NextResponse.json({
      success: true,
      message: "Cashless payment services fetched successfully",
      data: {
        id: insurance.id,
        companyName: insurance.companyName,
        category: insurance.category,
        contactNumber: insurance.contactNumber,
        cashlessServices: cashlessArray,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching cashless services:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
