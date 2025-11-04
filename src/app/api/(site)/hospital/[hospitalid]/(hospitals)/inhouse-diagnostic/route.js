import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all linked diagnostic centers for a hospital
export async function GET(req, { params }) {
  const { hospitalid } = params;

  try {
    const hospital = await db.hospital.findUnique({
      where: { id: hospitalid },
      include: {
        linkedDiagnosticCenters: {
          include: {
            diagnosticCenter: {
              select: {
                id: true,
                email: true,
                mobile: true,
                hspInfo: {
                  select: { regname: true },
                },
              },
            },
          },
        },
      },
    });

    if (!hospital) {
      return NextResponse.json({ error: "Hospital not found" }, { status: 404 });
    }

    return NextResponse.json(hospital.linkedDiagnosticCenters, { status: 200 });
  } catch (error) {
    console.error("Error fetching linked diagnostic centers:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Link diagnostic centers to a hospital
export async function POST(req, { params }) {
    try {
      const { hospitalid } = params; // from URL
      const body = await req.json();
      const { diagnosticCenters, partnershipType, commissionRate, notes } = body;
  
      if (!hospitalid) {
        return NextResponse.json(
          { error: "hospitalId is required" },
          { status: 400 }
        );
      }
  
      if (!diagnosticCenters || !Array.isArray(diagnosticCenters)) {
        return NextResponse.json(
          { error: "diagnosticCenters must be an array" },
          { status: 400 }
        );
      }
  
      // Create HospitalDiagnosticCenter records
      const links = await Promise.all(
        diagnosticCenters.map((dcId) =>
          db.hospitalDiagnosticCenter.create({
            data: {
              hospitalId: hospitalid,      // ✅ FIXED: exact schema field
              diagnosticCenterId: dcId,    // ✅ matches schema
              status: "PENDING",
              partnershipType: partnershipType || "General",
              commissionRate: commissionRate ?? null,
              notes: notes ?? null,
            },
          })
        )
      );
  
      return NextResponse.json(
        { message: "Diagnostic centers linked successfully", links },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error linking diagnostic centers:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  
