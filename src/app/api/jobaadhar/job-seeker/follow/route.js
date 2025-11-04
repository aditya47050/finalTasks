import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // make sure this points to your prisma client instance

export async function POST(request) {
  try {
    const body = await request.json();
    const { seekerId, companyId } = body;

    if (!seekerId || !companyId) {
      return NextResponse.json(
        { error: "seekerId and companyId are required" },
        { status: 400 }
      );
    }

    // Create follow record
    const follow = await db.follow.create({
      data: {
        seekerId,
        companyId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully followed company",
      data: follow,
    });
  } catch (error) {
    console.error("Error creating follow:", error);
    return NextResponse.json(
      { error: "Failed to follow company" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { seekerId, companyId } = body;

    if (!seekerId || !companyId) {
      return NextResponse.json(
        { error: "seekerId and companyId are required" },
        { status: 400 }
      );
    }

    // Delete follow record
    await db.follow.deleteMany({
      where: {
        seekerId,
        companyId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully unfollowed company",
    });
  } catch (error) {
    console.error("[v0] Error deleting follow:", error);
    return NextResponse.json(
      { error: "Failed to unfollow company" },
      { status: 500 }
    );
  }
}
