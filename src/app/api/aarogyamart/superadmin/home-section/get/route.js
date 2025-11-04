// pages/api/aarogyamart/superadmin/home-section/get.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    const sections = await db.homeSection.findMany({
      orderBy: { position: "asc" },
    });
    return NextResponse.json(sections);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
