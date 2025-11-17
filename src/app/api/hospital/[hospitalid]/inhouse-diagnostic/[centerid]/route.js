import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { hospitalid, centerid } = params;

    if (!hospitalid || !centerid) {
      return NextResponse.json(
        { success: false, message: "Hospital ID or Center ID missing" },
        { status: 400 }
      );
    }

    // 1️⃣ Check link exists in hospitalDiagnosticCenter table
    const link = await db.hospitalDiagnosticCenter.findFirst({
      where: {
        hospitalId: hospitalid,
        diagnosticCenterId: centerid,
      },
include: {
  diagnosticCenter: {
    include: {
      hspInfo: {
        include: {
          hspcategory: {
            include: {
              diagnosticcategory: true
            }
          }
        }
      },
      hspcontact: true,
    },
  },
},

    });

    if (!link || !link.diagnosticCenter) {
      return NextResponse.json(
        { success: false, message: "Diagnostic Center not linked" },
        { status: 404 }
      );
    }

    // 2️⃣ Fetch its services (services saved using centerId as hospitalId)
    const services = await db.diagnosticCenterServices.findMany({
      where: { hospitalId: centerid }, // centerId is used as service hospitalId
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      center: link.diagnosticCenter,
      services,
      count: services.length,
    });

  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
