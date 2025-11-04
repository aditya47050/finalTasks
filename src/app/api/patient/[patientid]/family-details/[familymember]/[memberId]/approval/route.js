import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";

export async function POST(request, { params }) {
  try {
    const { patientid, memberId } = params;
    const { status, remark } = await request.json();

    // Optional: session check
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedMember = await db.familyMember.update({
      where: { id: memberId },   // ✅ must use memberId, not familymember
      data: {
        approvalStatus: status,
        Remark: remark || null,
      },
    });

    return NextResponse.json({ success: true, member: updatedMember });
  } catch (err) {
    console.error("Approval update error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
