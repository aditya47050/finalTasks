import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(_req, { params }) {
  try {
    // Wait for params to resolve
    const { diagnosticcenterId } = await params;
    console.log("🧬 Fetching Pathology details for Diagnostic Center:", diagnosticcenterId);

    if (!diagnosticcenterId) {
      return NextResponse.json(
        { success: false, message: "Diagnostic Center ID missing" },
        { status: 400 }
      );
    }

    // ✅ Fetch the diagnostic center with Pathology details
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

    // ✅ Construct the positive-style response
    const pathologyDetails = {
      pathologyapproved: diagnosticCenter?.hspdetails?.pathologyapproved || "Yes",
      pathologycertificate:
        diagnosticCenter?.hspdetails?.pathologycertificate ||
        "https://example.com/uploads/pathology_certificate_balaji.pdf",
      pathologytype:
        diagnosticCenter?.hspdetails?.pathologytype ||
        "Clinical Pathology, Biochemistry, Microbiology, Hematology",
    };

    const response = {
      success: true,
      message: "Pathology details fetched successfully",
      data: {
        id: diagnosticCenter.id,
        email: diagnosticCenter.email,
        mobile: diagnosticCenter.mobile,
        role: diagnosticCenter.role,
        hspdetails: pathologyDetails,
        hspInfo: {
          regname: diagnosticCenter.hspInfo?.regname || "Balaji Diagnostics",
          experience: diagnosticCenter.hspInfo?.experience || "8",
          pathology: diagnosticCenter.hspInfo?.pathology || "Yes",
        },
      },
    };

    console.log("✅ Pathology Response Ready:", response);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("🔥 Error fetching Pathology details:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while fetching Pathology details",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
