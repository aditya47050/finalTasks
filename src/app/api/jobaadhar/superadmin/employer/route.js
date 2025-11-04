// /app/api/employer/getAll.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const employers = await db.Employer.findMany({
      include: {
        user: true,
        company: true,
        documents: true,
      },
    });

    return NextResponse.json({ success: true, data: employers });
  } catch (error) {
    console.error("Fetch employers error:", error);
    return NextResponse.json({ success: false, msg: "Failed to fetch employers" }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    const { employerId, status } = await request.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ success: false, msg: "Invalid status" }, { status: 400 });
    }

    const updatedEmployer = await db.Employer.update({
      where: { id: employerId },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updatedEmployer });
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json({ success: false, msg: "Failed to update status" }, { status: 500 });
  }
}