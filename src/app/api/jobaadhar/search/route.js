import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword") || "";
    const locations = searchParams.get("locations")?.split(",").filter(Boolean) || [];
    const sortBy = searchParams.get("sortBy") || "postedAt";
    const order = searchParams.get("order") || "desc";

    const jobs = await db.Job.findMany({
      where: {
        status: "active",
        AND: [
          keyword
            ? {
                OR: [
                  { title: { contains: keyword, mode: "insensitive" } },
                  { company: { name: { contains: keyword, mode: "insensitive" } } },
                  { skills: { some: { skill: { name: { contains: keyword, mode: "insensitive" } } } } },
                ],
              }
            : {},
          locations.length > 0
            ? {
                OR: locations.map((loc) => ({
                    location: { contains: loc.trim(), mode: "insensitive" },
                })),
                }
            : {}
        ],
      },
      include: {
        company: true,
        skills: { include: { skill: true } },
      },
      orderBy: { [sortBy]: order },
    });

    const formatted = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company?.name || "Unknown Company",
      location: job.location,
      workMode: job.workMode || "On-site",
      salary: job.salary || null,
      skills: job.skills.map((s) => s.skill.name),
      postedAt: job.postedAt,
    }));

    return NextResponse.json({ jobs: formatted });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
