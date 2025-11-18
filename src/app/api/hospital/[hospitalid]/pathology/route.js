import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { hospitalid } = params; // <--- THIS IS CORRECT

    if (!hospitalid) {
      return NextResponse.json(
        { success: false, error: "Hospital ID is required." },
        { status: 400 }
      );
    }

    const [labTests, bloodBank, wellnessPackages] = await Promise.all([
      db.labTest.findMany({ where: { hospitalId: hospitalid } }),
      db.bloodbank.findMany({ where: { hospitalId: hospitalid } }),
      db.wellnesspackage.findMany({ where: { hospitalId: hospitalid } }),
    ]);

    return NextResponse.json(
      {
        success: true,
        labTests,
        bloodBank,
        wellnessPackages,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching pathology data:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Server error fetching pathology services.",
      },
      { status: 500 }
    );
  }
}
