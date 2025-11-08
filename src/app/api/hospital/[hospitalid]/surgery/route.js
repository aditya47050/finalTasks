// ✅ src/app/api/hospital/[hospitalid]/surgery/route.js

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { hospitalid } = params;

    // 🧠 Basic validation
    if (!hospitalid) {
      return NextResponse.json(
        { success: false, message: "Hospital ID is required" },
        { status: 400 }
      );
    }

    // 🏥 Fetch all surgery packages for this hospital
    const surgeries = await db.surgerytreatment.findMany({
      where: { hospitalId: hospitalid },
      orderBy: { createdAt: "desc" },
    });

    // 💡 If no surgeries found
    if (!surgeries || surgeries.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No surgery packages found for this hospital.",
        surgeries: [],
        count: 0,
      });
    }

    // ✨ Format data (if needed for frontend)
    const formatted = surgeries.map((surgery) => ({
      id: surgery.id,
      category: surgery.category,
      serviceName: surgery.serviceName,
      type: surgery.type || "N/A",
      minPrice: surgery.minPrice || "N/A",
      maxPrice: surgery.maxPrice || "N/A",
      isAvailable: surgery.isAvailable,
      createdAt: surgery.createdAt,
      updatedAt: surgery.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      surgeries: formatted,
      count: formatted.length,
    });
  } catch (error) {
    console.error("🔥 Error fetching surgeries:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch surgery packages",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
