import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(req, { params }) {
  const { id } = params;
  try {
    const body = await req.json();
    const updatedProduct = await db.productMart.update({
      where: { id },
      data: { badge: body.badge },
    });
    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("[PATCH /superadmin/products/:id] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
