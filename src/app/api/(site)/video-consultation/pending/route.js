// app/api/video-consultation/pending/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function GET(req) {
  const doctorId = req.nextUrl.searchParams.get("doctorId");
        const calls = await db.videoConsultation.findMany({
            where: { doctorId, status: "requested" },
    include: { Patient: true },
  });
  return NextResponse.json(calls);
}
