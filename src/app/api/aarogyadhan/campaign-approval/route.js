import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { campaignId, newStatus } = await req.json();

    // Validate the new status
    const validStatuses = ["PENDING", "SUBMITTED", "APPROVED", "REJECTED"];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    // Update the campaign status
    const updatedCampaign = await db.fundraisingCampaign.update({
      where: { id: campaignId },
      data: { status: newStatus },
    });

    return NextResponse.json(
      { message: "Campaign status updated", updatedCampaign },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating campaign status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
