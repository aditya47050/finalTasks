import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // your Prisma client

export async function GET() {
  const banners = await db.banner.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(banners);
}

export async function POST(req) {
  const data = await req.json();
  const banner = await db.banner.create({ data });
  return NextResponse.json(banner);
}
