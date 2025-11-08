import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // ✅ make sure your prisma client is here

export async function GET(req, context) {
  try {
    // ✅ You must await params in Next.js 15+
    const { diagnosticcenterId } = await context.params;

    if (!diagnosticcenterId) {
      return NextResponse.json(
        { success: false, message: "Diagnostic Center ID missing" },
        { status: 400 }
      );
    }

    console.log(`🏥 Fetching NABL details for Diagnostic Center: ${diagnosticcenterId}`);

    // ✅ Fetch NABL details from Prisma
    const center = await db.hospital.findUnique({
      where: { id: diagnosticcenterId },
      select: {
        id: true,
        email: true,
        mobile: true,
        role: true,
        hspdetails: {
          select: {
            nabhnablapproved: true,
            nabhnablcertificate: true,
            nabhnabllevel: true,
          },
        },
        hspInfo: {
          select: {
            regname: true,
            experience: true,
            totalspeciality: true,
            totaldoctor: true,
          },
        },
      },
    });

    if (!center) {
      return NextResponse.json(
        { success: false, message: "Diagnostic Center not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "NABL Certification fetched successfully",
      data: center,
    });
  } catch (error) {
    console.error("🔥 Error fetching NABL:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
