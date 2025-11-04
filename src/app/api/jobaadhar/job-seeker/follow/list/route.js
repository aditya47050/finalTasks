import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // your Prisma client

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const seekerId = searchParams.get("seekerId");

    if (!seekerId) {
      return NextResponse.json(
        { error: "seekerId is required" },
        { status: 400 }
      );
    }

    // Fetch all followed companies with details
    const follows = await db.follow.findMany({
      where: { seekerId: seekerId },
      include: {
        company: {
          include: {
            tags: {
              include: { tag: true },
            },
            jobs: true,
          },
        },
      },
      orderBy: { followedAt: "desc" },
    });

    // Map to match frontend-friendly response structure
    const followedCompanies = follows.map((f) => ({
      id: f.id,
      followedAt: f.followedAt,
      company: {
        id: f.company.id,
        name: f.company.name,
        logoUrl: f.company.logoUrl,
        founded: f.company.founded,
        about: f.company.about,
        tags: f.company.tags.map((t) => t.tag.name), // flatten tags
        jobs: f.company.jobs.map((j) => ({
          id: j.id,
          title: j.title,
        })),
      },
    }));

    return NextResponse.json({ followedCompanies });
  } catch (error) {
    console.error("Error fetching followed companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch followed companies" },
      { status: 500 }
    );
  }
}
