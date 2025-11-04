import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const jobs = await db.job.findMany({
      where: { status: "active" },
      include: {
        company: true,
        skills: { include: { skill: true } },
      },
      orderBy: { postedAt: "desc" },
      take: 20, // take a few more to randomize later
    })

    // Get 4 random unique jobs
    const shuffled = jobs.sort(() => 0.5 - Math.random())
    const uniqueJobs = shuffled.slice(0, 4)

    const formatted = uniqueJobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company?.name || "Unknown Company",
      location: job.location,
      workMode: job.workMode || "On-site",
      skills: job.skills.map((s) => s.skill.name),
      badge: job.workMode || "Remote",
      postedAt: job.postedAt,
    }))

    return NextResponse.json({ jobs: formatted })
  } catch (error) {
    console.error("Unique job fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch unique jobs" }, { status: 500 })
  }
}
