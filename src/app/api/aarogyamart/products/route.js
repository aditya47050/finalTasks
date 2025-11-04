import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    const products = await db.productMart.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true, brand: true, reviews: true },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    console.error("GET Products Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ✅ Create Product
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      sellerId,
      categoryId,
      brandId,
      name,
      price,
      originalPrice,
      discount,
      stockCount,
      images,
      keywords,
      features,
      description,
      inStock,
      specifications, // ✅ new field
    } = body;

    // Basic validation
    if (!sellerId || !name || typeof price === "undefined" || !categoryId || !brandId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const created = await db.productMart.create({
      data: {
        name,
        price,
        originalPrice: originalPrice ?? null,
        discount: discount ?? null,
        stockCount: stockCount ?? null,
        images: images ?? [],
        keywords: keywords ?? [],
        features: features ?? [],
        description: description ?? "",
        inStock: inStock ?? true,
        specifications: specifications ?? {}, // ✅ save specifications as JSON

        // Relations
        seller: { connect: { id: sellerId } },
        category: { connect: { id: categoryId } },
        brand: { connect: { id: brandId } },
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err) {
    console.error("POST Product Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
