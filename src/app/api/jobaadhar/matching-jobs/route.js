import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// Basic scorer: skills overlap + slight recency factor
function scoreJob(seekerSkills, jobSkills, postedAt) {
  const overlap = jobSkills.filter((s) => seekerSkills.includes(s)).length
  const recencyBoost =
    Math.max(0, 30 - Math.floor((Date.now() - postedAt.getTime()) / (1000 * 60 * 60 * 24))) / 100
  return overlap + recencyBoost
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get("limit") || "12")
    const userId = searchParams.get("userId")
    if (!userId) return NextResponse.json({ jobs: [] })

    // Fetch JobSeeker profile with skills
    const user = await db.JobSeeker.findUnique({
      where: { id: userId },
      include: { skills: { include: { skill: true } } },
    })

    if (!user) return NextResponse.json({ jobs: [] })

    const seekerSkills = user.skills.map((s) => s.skill.name.toLowerCase())

    // Fetch jobs with company and job skills
    const jobs = await db.Job.findMany({
      where: {
        status: "active",
      },
      include: { 
        company: true,
        skills: { include: { skill: true } },
      },
    })

    const scoredJobs = jobs
      .map((j) => {
        const jobSkills = j.skills.map((s) => s.skill.name.toLowerCase())
        const score = scoreJob(seekerSkills, jobSkills, j.postedAt)
        return {
          id: j.id,
          title: j.title,
          companyName: j.company?.name ?? "Company",
          location: j.location,
          workMode: j.workMode,
          postedAt: j.postedAt.toISOString(),
          skills: jobSkills,
          matchScore: score / Math.max(1, jobSkills.length),
        }
      })
      .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
      .slice(0, limit)

    return NextResponse.json({ jobs: scoredJobs })
  } catch (err) {
    return NextResponse.json({ error: (err).message }, { status: 500 })
  }
}
