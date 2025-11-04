import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const keyword = searchParams.get("keyword") || ""
  const locationsParam = searchParams.get("locations")
  const locations = locationsParam ? locationsParam.split(",").filter(Boolean) : []

  try {
    const jobs = await db.job.findMany({
  where: {
    status: "active",
    AND: [
      keyword
        ? {
            OR: [
              { title: { contains: keyword, mode: "insensitive" } },
              { company: { name: { contains: keyword, mode: "insensitive" } } },
              // Only check skills if keyword exists
              { skills: { some: { skill: { name: { contains: keyword, mode: "insensitive" } } } } },
            ],
          }
        : undefined,  // <-- don't pass empty object
      locations.length > 0 ? { location: { in: locations } } : undefined,
    ].filter(Boolean),  // remove undefined
  },
  include: {
    company: true,
    skills: { include: { skill: true } },
  },
  orderBy: { postedAt: "desc" },
})

    const formatted = jobs.map((job) => ({
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
    console.error("Job fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}
