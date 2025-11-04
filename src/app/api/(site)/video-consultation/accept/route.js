// app/api/video-consultation/accept/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { callId } = await req.json();

  const vc = await db.videoConsultation.update({
    where: { id: callId },
    data: { status: "accepted" },
  });

  return NextResponse.json(vc);
}
