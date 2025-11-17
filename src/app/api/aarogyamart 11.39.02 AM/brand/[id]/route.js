import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    // Fetch brand and related products
    const brand = await db.brand.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            brand: true,   // include brand info for each product
            reviews: true, // include reviews if exist
          },
        },
      },
    });

    if (!brand) {
      return NextResponse.json(
        { success: false, error: "Brand not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: brand });
  } catch (err) {
    console.error("❌ Brand fetch error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
