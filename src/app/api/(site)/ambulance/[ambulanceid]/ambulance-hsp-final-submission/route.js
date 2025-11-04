import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
const id = params.ambulanceid;

  const body = await req.json();

  try {
    // Check if an AmbulanceHsp record exists for this ambulance
    const hspRecord = await db.ambulanceHsp.findUnique({
      where: { ambulanceId: id },
    });

    let result;

    if (hspRecord) {
      // ✅ If exists, update it
      result = await db.ambulanceHsp.update({
        where: { ambulanceId: id },
        data: {
          ...body,
        },
      });
    } else {
      // ✅ If not exists, create it
      result = await db.ambulanceHsp.create({
        data: {
          ambulanceId: id,
          ...body,
        },
      });
    }

    return NextResponse.json({
      message: hspRecord ? "Updated successfully" : "Created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Final submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
