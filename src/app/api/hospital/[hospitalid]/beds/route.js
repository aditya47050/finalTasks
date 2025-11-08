import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // same pattern as your ambulance route

export async function GET(req, { params }) {
  try {
    const { hospitalid } = params;

    if (!hospitalid) {
      return NextResponse.json(
        { error: "Hospital ID is required" },
        { status: 400 }
      );
    }

    // Fetch all beds for this hospital
    const hospitalBeds = await db.Bed.findMany({
      where: { hospitalId: hospitalid },
      include: {
        category: true, // Include category info like name, price, image
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format bed data to send cleanly to frontend
    const beds = hospitalBeds.map((b) => ({
      id: b.id,
      bedNumber: b.bedNumber,
      status: b.status,
      createdAt: b.createdAt,
      hospitalId: b.hospitalId,
      category: {
        id: b.category.id,
        name: b.category.name,
        chargeType: b.category.chargeType,
        finalPrice: b.category.finalPrice,
        discount: b.category.discount,
        image: b.category.image,
      },
    }));

    return NextResponse.json({
      success: true,
      beds,
      count: beds.length,
    });
  } catch (error) {
    console.error("❌ Error fetching hospital beds:", error);
    return NextResponse.json(
      { error: "Failed to fetch beds", details: error.message },
      { status: 500 }
    );
  }
}
