import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    // ✅ Await params (Next.js requirement)
    const { diagnosticcenterId } = await params;

    console.log(`💳 Fetching Cashless Services for: ${diagnosticcenterId}`);

    if (!diagnosticcenterId) {
      return NextResponse.json(
        { success: false, message: "Diagnostic Center ID missing" },
        { status: 400 }
      );
    }

    // ✅ Fetch hospital with related details
    const diagnosticCenter = await prisma.hospital.findUnique({
      where: { id: diagnosticcenterId },
      include: {
        hspInfo: true,
        hspcontact: true,
        hspdetails: {
          select: {
            bankname: true,
            accounttype: true,
            ifsccode: true,
            isoapproved: true,
            paymentmodes: true, // ✅ include JSON field
          },
        },
      },
    });

    if (!diagnosticCenter) {
      return NextResponse.json(
        { success: false, message: "Diagnostic Center not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cashless Services details fetched successfully",
      data: diagnosticCenter,
    });
  } catch (error) {
    console.error("🔥 Error fetching Cashless Services:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
