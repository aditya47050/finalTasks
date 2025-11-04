import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // make sure this points to your prisma client instance

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const seekerId = searchParams.get("seekerId");
    const companyId = searchParams.get("companyId");

    if (!seekerId || !companyId) {
      return NextResponse.json(
        { error: "seekerId and companyId are required" },
        { status: 400 }
      );
    }

    // Check if follow exists in DB
    const follow = await db.follow.findFirst({
      where: {
        seekerId: seekerId,
        companyId: companyId,
      },
    });

    const isFollowing = !!follow;

    return NextResponse.json({ isFollowing });
  } catch (error) {
    console.error("[v0] Error checking follow status:", error);
    return NextResponse.json(
      { error: "Failed to check follow status" },
      { status: 500 }
    );
  }
}
