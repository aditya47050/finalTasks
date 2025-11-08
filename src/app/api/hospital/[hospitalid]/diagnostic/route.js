import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ✅ GET Diagnostic Services for a specific hospital
export async function GET(req, context) {
  try {
    const params = await context.params;
    const { hospitalid } = params;

    // 🧠 Validate hospital ID
    if (!hospitalid) {
      return NextResponse.json(
        { success: false, message: "Hospital ID is required" },
        { status: 400 }
      );
    }

    // 🏥 Fetch all diagnostic services linked to this hospital
    const diagnostics = await db.diagnosticCenterServices.findMany({
      where: { hospitalId: hospitalid },
      orderBy: { updatedAt: "desc" }, // we use updatedAt because createdAt might not exist in older seeds
    });

    // 🧾 No records found
    if (!diagnostics || diagnostics.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No diagnostic services found for this hospital.",
        diagnostics: [],
        count: 0,
      });
    }

    // ✨ Format the output for frontend
    const formatted = diagnostics.map((d) => ({
      id: d.id,
      facility: d.facility,
      category: d.category,
      subCategory: d.subCategory || "General",
      available: d.available ?? true,
      minPrice: d.minPrice || "N/A",
      maxPrice: d.maxPrice || "N/A",
      finalPrice: d.finalPrice || "N/A",
      discount: d.discount || "0%",
      machinemodel: d.machinemodel || "Not Specified",
      hospitalId: d.hospitalId,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    }));

    // ✅ Return success response
    return NextResponse.json({
      success: true,
      diagnostics: formatted,
      count: formatted.length,
    });
  } catch (error) {
    console.error("🔥 Error fetching diagnostic services:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch diagnostic services.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
