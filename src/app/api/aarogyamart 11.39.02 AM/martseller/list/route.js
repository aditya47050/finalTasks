import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const sellers = await db.MartSeller.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: sellers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
