import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req, { params }) {
  const { homehealthcareId } = params;
  const body = await req.json();

  try {
    const updated = await db.homeHealthcare.update({
      where: { id: new ObjectId(homehealthcareId) },
      data: {
        facilitiesJson: body.services,   // services saved here
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
