import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const hospitalId = searchParams.get("hospitalId");

    if (!hospitalId) {
      return NextResponse.json(
        { success: false, message: "Hospital ID is required" },
        { status: 400 }
      );
    }

    const labTests = await prisma.labTest.findMany({
      where: { hospitalId },
      select: {
        id: true,
        testname: true,
        aaprice: true,
        price: true,
        finalprice: true,
        discount: true,
        available: true,
        nabl: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Lab tests fetched successfully",
      data: labTests,
    });
  } catch (error) {
    console.error("Error fetching lab tests:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
