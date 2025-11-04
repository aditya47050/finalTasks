import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, { params }) {
  const { roomId } = params;
  try {
    const consultation = await db.videoConsultation.findUnique({
      where: { roomId },
      include: { Doctor: true, Patient: true },
    });

    if (!consultation)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ consultation });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch consultation" },
      { status: 500 }
    );
  }
}
