// /app/api/aarogyamart/categories/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: {
        products : true,
      },
    });



    return NextResponse.json(categories);
  } catch (err) {
    console.error("GET categories error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
