// /api/jobaadhar/job-seeker/jobs/applied.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  const url = new URL(req.url);
  const seekerId = url.searchParams.get("seekerId");

  if (!seekerId) {
    return NextResponse.json({ error: "SeekerId is required" }, { status: 400 });
  }

  try {
    const applications = await db.application.findMany({
      where: { seekerId },
      include: {
        job: {
          include: { company: true, skills: {
            include : {
                skill : true,
            }
          } },
        },
      },
      orderBy: { appliedAt: "desc" },
      take: 8, // paginate later
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch applied jobs" }, { status: 500 });
  }
}
