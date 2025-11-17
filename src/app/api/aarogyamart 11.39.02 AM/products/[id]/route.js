import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const product = await db.productMart.findUnique({
      where: { id: await params.id },
      include: { category: true, brand: true, reviews: true },
    });
    if (!product) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const { sellerId } = body;

    // Ensure product belongs to seller
    const product = await db.productMart.findUnique({ where: { id: params.id } });
    if (!product || product.sellerId !== sellerId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const updated = await db.productMart.update({
      where: { id: params.id },
      data: { ...body },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    await db.productMart.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
