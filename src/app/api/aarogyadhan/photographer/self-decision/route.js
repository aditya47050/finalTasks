import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust based on your db setup

export async function POST(req) {
  try {
    const { id, decision } = await req.json();

    if (!id || !["ACCEPTED", "REJECTED"].includes(decision)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    await db.fundraisingCampaign.update({
      where: { id },
      data: {
        assignmentStatus: decision === "ACCEPTED" ? "ASSIGNED" : "UNASSIGNED",
        photographerId: decision === "REJECTED" ? null : undefined,
        photographerDecision: decision === "ACCEPTED" ? "ACCEPTED" : "PENDING",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
