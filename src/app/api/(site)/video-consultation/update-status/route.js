// app/api/video-consultation/update-status/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { roomId, status } = await req.json();

  const vc = await db.videoConsultation.update({
    where: { roomId },
    data: { status },
  });

  return NextResponse.json(vc);
}
