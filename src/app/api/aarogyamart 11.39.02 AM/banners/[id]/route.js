import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, { params }) {
  const banner = await db.banner.findUnique({ where: { id: params.id } });
  return NextResponse.json(banner);
}

export async function PATCH(req, { params }) {
  const data = await req.json();
  const updated = await db.banner.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  await db.banner.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
