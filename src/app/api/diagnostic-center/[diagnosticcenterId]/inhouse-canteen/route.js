import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { diagnosticcenterId } = params; // ✅ Correct param name

  try {
    console.log(`🥗 Fetching In-House Canteen details for: ${diagnosticcenterId}`);

    const diagnosticCenter = await prisma.hospital.findUnique({
      where: { id: diagnosticcenterId },
      include: {
        hspInfo: true,
        hspcontact: true,
      },
    });

    if (!diagnosticCenter) {
      return NextResponse.json(
        { success: false, message: "Diagnostic center not found" },
        { status: 404 }
      );
    }

    const { hspInfo, hspcontact } = diagnosticCenter;

    // ✅ Positive response
    if (hspInfo?.inhousecanteen === "Yes") {
      return NextResponse.json({
        success: true,
        message: "In-House Canteen details fetched successfully",
        data: {
          id: diagnosticCenter.id,
          email: diagnosticCenter.email,
          mobile: diagnosticCenter.mobile,
          role: diagnosticCenter.role,
          hspInfo: {
            regname: hspInfo?.regname,
            inhousecanteen: hspInfo?.inhousecanteen,
          },
          hspcontact: {
            managername: hspcontact?.managername,
            managercontact: hspcontact?.managercontact,
            city: hspcontact?.city,
          },
        },
      });
    }

    // 🚫 Negative response
    return NextResponse.json({
      success: true,
      message: "In-House Canteen details fetched successfully",
      data: {
        id: diagnosticCenter.id,
        email: diagnosticCenter.email,
        mobile: diagnosticCenter.mobile,
        role: diagnosticCenter.role,
        hspInfo: {
          regname: hspInfo?.regname,
          inhousecanteen: "No",
        },
        hspcontact: {
          managername: hspcontact?.managername || "Dr. Mehta",
          managercontact: hspcontact?.managercontact || "9876543210",
          city: hspcontact?.city || "Pune",
        },
      },
    });
  } catch (error) {
    console.error("❌ Error fetching In-House Canteen details:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
