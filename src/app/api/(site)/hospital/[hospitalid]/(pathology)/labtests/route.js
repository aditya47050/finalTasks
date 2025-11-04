import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";

export async function POST(req, { params }) {
  const session = await getSession();
  const hospitalId = params.hospitalid;

  if (!session?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find hospital by email in session
    const hospital = await db.hospital.findUnique({
      where: { email: session.email },
    });

    if (!hospital) {
      console.warn(
        `Unauthorized hospital: No hospital found for email ${session.email}`
      );
      return NextResponse.json(
        { error: "Unauthorized hospital: no hospital found" },
        { status: 403 }
      );
    }

    // Compare hospital.id and hospitalId param as strings
    if (hospital.id.toString() !== hospitalId.toString()) {
      return NextResponse.json(
        { error: "Unauthorized hospital: id mismatch" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Create the labtest record
    const labtest = await db.labTest.create({
      data: {
        testname: body.testname,
        price: body.price ?? null,
        finalprice: body.finalprice ?? null,
        discount: body.discount ?? null,
        available: body.available ?? false,
        hospitalId: hospital.id,
        nabl: body.nabl ?? false,
      },
    });

    return NextResponse.json({ success: true, labtest });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
