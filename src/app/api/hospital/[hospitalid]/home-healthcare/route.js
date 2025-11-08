// ✅ src/app/api/hospital/[hospitalid]/home-healthcare/route.js

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// 🧠 GET Home Healthcare services for a specific hospital
export async function GET(req, { params }) {
  try {
    const { hospitalid } = await params;

    // 🔹 Validate hospital ID
    if (!hospitalid) {
      return NextResponse.json(
        { success: false, message: "Hospital ID is required" },
        { status: 400 }
      );
    }

    // 🏠 Fetch all Home Healthcare services for this hospital
    const services = await db.homeHealthcare.findMany({
      where: { hospitalId: hospitalid },
      orderBy: { updatedAt: "desc" },
    });

    // 💡 If no services found
    if (!services || services.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No home healthcare services found for this hospital.",
        homeHealthcare: [],
        count: 0,
      });
    }

    // ✨ Format data for frontend
    const formatted = services.map((s) => ({
      id: s.id,
      serviceName: s.serviceName,
      description: s.description || "No description provided.",
      category: s.category || "General",
      visitType: s.visitType || "Home Visit",
      duration: s.duration || "Per Session",
      price: s.price || 0,
      discount: s.discount || "0%",
      available: s.available,
      hospitalId: s.hospitalId,
      createdAt: s.createdAt,
    }));

    // ✅ Return response
    return NextResponse.json({
      success: true,
      count: formatted.length,
      homeHealthcare: formatted,
    });
  } catch (error) {
    console.error("🔥 Error fetching Home Healthcare services:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch Home Healthcare services.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
