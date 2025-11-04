import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(request) {
  try {
    const { id, status } = await request.json();

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ success: false, msg: "Invalid status" }, { status: 400 });
    }

    const seller = await db.MartSeller.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: seller });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, msg: "Server error" }, { status: 500 });
  }
}
