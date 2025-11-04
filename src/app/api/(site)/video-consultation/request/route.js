// app/api/video-consultation/request/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function POST(req) {
  const { doctorId, patientId, appointmentId } = await req.json();

  const roomId = "room-" + Math.random().toString(36).substr(2, 9);

  const vc = await db.videoConsultation.create({
    data: {
      doctorId,
      patientId,
      appointmentId,
      roomId,
      status: "requested",
    },
  });

  return NextResponse.json(vc);
}
