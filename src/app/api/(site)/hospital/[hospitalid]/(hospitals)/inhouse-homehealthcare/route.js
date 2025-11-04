import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all linked home healthcare centers for a hospital
export async function GET(req, { params }) {
  const { hospitalid } = params;

  try {
    const hospital = await db.hospital.findUnique({
      where: { id: hospitalid },
      include: {
        linkedHomeHealthcare: {
          include: {
            homeHealthcare: {
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

    return NextResponse.json(hospital.linkedHomeHealthcare, { status: 200 });
  } catch (error) {
    console.error("Error fetching linked home healthcare centers:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Link home healthcare centers to a hospital
export async function POST(req, { params }) {
  try {
    const { hospitalid } = params;
    const body = await req.json();
    const { homeHealthcareCenters, partnershipType, commissionRate, notes } = body;

    if (!hospitalid) {
      return NextResponse.json(
        { error: "hospitalId is required" },
        { status: 400 }
      );
    }

    if (!homeHealthcareCenters || !Array.isArray(homeHealthcareCenters)) {
      return NextResponse.json(
        { error: "homeHealthcareCenters must be an array" },
        { status: 400 }
      );
    }

    // Create HospitalHomeHealthcare records
    const links = await Promise.all(
      homeHealthcareCenters.map((hhId) =>
        db.hospitalHomeHealthcare.create({
          data: {
            hospitalId: hospitalid,        // FK hospital
            homeHealthcareId: hhId,        // FK home healthcare
            status: "PENDING",
            partnershipType: partnershipType || "General",
            commissionRate: commissionRate ?? null,
            notes: notes ?? null,
          },
        })
      )
    );

    return NextResponse.json(
      { message: "Home healthcare centers linked successfully", links },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error linking home healthcare centers:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
