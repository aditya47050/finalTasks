import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const brands = await db.brand.findMany({

    });
    return NextResponse.json({ success: true, data: brands });
  } catch (err) {
    console.error("GET /brands Error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, image } = body;
    if (!name) return NextResponse.json({ success: false, error: "Name required" }, { status: 400 });

    const created = await db.brand.create({ data: { name, image: image || null } });
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
