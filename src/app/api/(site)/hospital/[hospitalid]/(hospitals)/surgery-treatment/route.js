import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request, { params }) {
  const { hospitalid } = params;

  try {
    const data = await request.json();

    const result = await db.Surgerytreatment.create({
      data: {
        hospitalId: hospitalid,
        category: data.selectedCategory,
        serviceName: data.selectedService, // Ensure this matches the field name in your schema
        isAvailable: data.isAvailable,
        minPrice: data.minPrice,
        maxPrice: data.maxPrice,
        type: data.serviceType,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Service added successfully!",
    });
  } catch (error) {
    console.error("Error adding service:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add service" },
      { status: 500 }
    );
  }
}
