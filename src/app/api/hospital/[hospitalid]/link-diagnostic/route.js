import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req, { params }) {
  try {
    const { hospitalid } = params; // ← THIS is correct for your folder
    const { diagnosticCenterId } = await req.json();

    if (!hospitalid || !diagnosticCenterId) {
      return NextResponse.json(
        { success: false, message: "Missing IDs" },
        { status: 400 }
      );
    }

    const link = await db.hospitalDiagnosticCenter.create({
      data: {
        hospitalId: hospitalid, // ← insert into DB using right field
        diagnosticCenterId,
      },
    });

    return NextResponse.json({ success: true, link });

  } catch (error) {
    console.error("LINK ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
