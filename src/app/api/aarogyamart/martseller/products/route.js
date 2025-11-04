
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId"); // string or null
    
    const products = await db.productMart.findMany(
      {
        where: { sellerId },
        orderBy: { createdAt: "desc" },
        include: { category: true, brand: true, reviews: true },
      }
    );

    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    console.error("GET Products Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}