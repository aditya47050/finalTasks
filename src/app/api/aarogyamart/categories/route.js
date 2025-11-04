import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // your prisma client

export async function GET(req) {
  try {
    const categories = await db.category.findMany({
    });
    return NextResponse.json(categories);
  } catch (err) {
    console.error("GET categories error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, description, image } = body;

    if (!name) return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });

    const created = await db.category.create({
      data: { name, description: description || null, image: image || null },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
