import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { doctorId, patientId, appointmentId } = body;

    const roomId = uuidv4();
    const consultation = await db.videoConsultation.create({
      data: {
        doctorId,
        patientId,
        appointmentId,
        roomId,
      },
    });

    return NextResponse.json({ consultation });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create video consultation" },
      { status: 500 }
    );
  }
}
