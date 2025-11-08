import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * @route GET /api/diagnostic-center/[diagnosticcenterId]/nabl-certification
 * @desc  Fetch NABL certification details for a diagnostic center
 */
export async function GET(req, context) {
  try {
    // ✅ Await params for Next.js 14+
    const { diagnosticcenterId } = await context.params;

    if (!diagnosticcenterId) {
      return NextResponse.json(
        { success: false, message: "Diagnostic Center ID is required" },
        { status: 400 }
      );
    }

    console.log(`🏥 Fetching NABL details for Diagnostic Center: ${diagnosticcenterId}`);

    // ✅ Fetch diagnostic center and its NABL details
    const diagnosticCenter = await prisma.hospital.findUnique({
      where: { id: diagnosticcenterId },
      include: {
        hspdetails: true,
        hspInfo: true,
      },
    });

    if (!diagnosticCenter) {
      return NextResponse.json(
        { success: false, message: "Diagnostic Center not found" },
        { status: 404 }
      );
    }

    const details = diagnosticCenter.hspdetails || {};
    const info = diagnosticCenter.hspInfo || {};

    // ✅ Structure clean response
    const responseData = {
      id: diagnosticCenter.id,
      email: diagnosticCenter.email,
      mobile: diagnosticCenter.mobile,
      role: diagnosticCenter.role,
      hspdetails: {
        nabhnablapproved: details.nabhnablapproved || "No",
        nabhnablcertificate:
          details.nabhnablcertificate ||
          "https://example.com/uploads/nabl_certificate_placeholder.pdf",
        nabhnabllevel: details.nabhnabllevel || "Not Accredited",
      },
      hspInfo: {
        regname: info.regname || "Unnamed Diagnostic Center",
        experience: info.experience || "N/A",
        totalspeciality: info.totalspeciality || "N/A",
        totaldoctor: info.totaldoctor || "N/A",
      },
    };

    return NextResponse.json({
      success: true,
      message: "NABL Certification fetched successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("❌ Error fetching NABL Certification:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch NABL Certification",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
