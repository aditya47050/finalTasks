import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { campaignId, frontimage, image1, image2, image3, video1, video2 } =
      body;

    if (!campaignId) {
      return NextResponse.json(
        { message: "Campaign ID is required" },
        { status: 400 }
      );
    }

    const updated = await db.fundraisingCampaign.update({
      where: { id: campaignId },
      data: {
        frontimage,
        image1,
        image2,
        image3,
        video1,
        video2,
        assignmentStatus: "COMPLETED",
      },
    });

    return NextResponse.json({ message: "Updated", campaign: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
