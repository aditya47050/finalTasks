import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId");
    if (!sellerId) {
      return NextResponse.json({ success: false, error: "sellerId required" });
    }

    const brand = await db.brand.findFirst({
      where: { sellerId },
    });

    if (!brand) {
      return NextResponse.json({ success: false, error: "Brand not found" });
    }

    return NextResponse.json({ success: true, data: brand });
  } catch (error) {
    console.error("Error fetching brand:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
