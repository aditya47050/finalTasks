import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const hospitalParams = await params;
    const hospitalId = hospitalParams?.hospitalid;

    // 🧠 Basic validation
    if (!hospitalId) {
      return NextResponse.json(
        { success: false, message: "Hospital ID is required" },
        { status: 400 }
      );
    }

    // 🏥 Fetch all Treatment Packages for this hospital
    const treatments = await db.surgerytreatment.findMany({
      where: {
        hospitalId,
        type: "Treatment",
      },
      orderBy: {
        id: "desc",
      },
    });

    // 💡 If no treatments found
    if (!treatments || treatments.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No treatment packages found for this hospital.",
        treatments: [],
        count: 0,
      });
    }

    // ✨ Format output for frontend
    const formatted = treatments.map((treatment) => ({
      id: treatment.id,
      category: treatment.category,
      serviceName: treatment.serviceName,
      type: treatment.type || "Treatment",
      minPrice: treatment.minPrice || "N/A",
      maxPrice: treatment.maxPrice || "N/A",
      isAvailable: treatment.isAvailable,
    }));

    // ✅ Success response
    return NextResponse.json({
      success: true,
      message: "Treatment packages fetched successfully",
      treatments: formatted,
      count: formatted.length,
    });
  } catch (error) {
    console.error("🔥 Error fetching treatment packages:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch treatment packages.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
