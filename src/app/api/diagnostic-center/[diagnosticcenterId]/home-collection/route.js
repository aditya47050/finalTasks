import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ GET API → Fetch Home Collection Details for a Diagnostic Center
export async function GET(request, context) {
  try {
    // Extract diagnostic center ID properly
    const params = await context.params;
    const { diagnosticcenterId } = params;

    console.log("🏥 Fetching Home Collection for Diagnostic Center:", diagnosticcenterId);

    if (!diagnosticcenterId) {
      return NextResponse.json(
        { success: false, message: "Diagnostic Center ID is required" },
        { status: 400 }
      );
    }

    // ✅ Fetch Diagnostic Center including related info
    const center = await prisma.hospital.findUnique({
      where: { id: diagnosticcenterId },
      include: {
        hspdetails: true,
        hspInfo: true,
        hspcontact: true,
      },
    });

    if (!center) {
      return NextResponse.json(
        { success: false, message: "Diagnostic Center not found" },
        { status: 404 }
      );
    }

    // ✅ Extract Home Collection Details
    const details = center.hspdetails;

    const homeCollectionData = {
      homecollection: details?.homecollection || "No",
      homecollectionavailable: details?.homecollectionavailable || "No",
      homecollectiontiming: details?.homecollectiontiming || "Not specified",
      homecollectioncontact: details?.homecollectioncontact || "N/A",
      homecollectioncoverage: details?.homecollectioncoverage || "Not specified",
    };

    // ✅ Prepare final response
    return NextResponse.json(
      {
        success: true,
        message: "Home Collection details fetched successfully",
        data: {
          id: center.id,
          email: center.email,
          mobile: center.mobile,
          role: center.role,
          hspInfo: {
            regname: center.hspInfo?.regname,
            experience: center.hspInfo?.experience,
          },
          hspdetails: homeCollectionData,
          hspcontact: {
            managername: center.hspcontact?.managername,
            managercontact: center.hspcontact?.managercontact,
            city: center.hspcontact?.city,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Error fetching Home Collection details:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch Home Collection details",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
