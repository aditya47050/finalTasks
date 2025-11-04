import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const { subadminId } = params;
  const { status } = await req.json();

  if (!subadminId || !status) {
    return NextResponse.json({ error: "Subadmin ID and status are required." }, { status: 400 });
  }

  try {
    // Update the subadmin status in the database
    const updatedSubAdmin = await db.EsevaSubAdmin.update({
      where: { id: subadminId },
      data: { status },
    });

    return NextResponse.json({ success: true, subAdmin: updatedSubAdmin }, { status: 200 });
  } catch (error) {
    console.error("Error updating subadmin status:", error);
    return NextResponse.json({ success: false, message: "Failed to update status" }, { status: 500 });
  }
}