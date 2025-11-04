// app/api/jobaadhar/jobs/route.js
import { NextResponse } from "next/server"
import { db } from "@/lib/db" // Prisma client

export async function GET() {
  try {
    const jobs = await db.job.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" }, // latest jobs first
      take: 20, // optional limit
      include: {
        company: true,
        employer: true,
      },
    })

    // Transform jobs to match frontend needs
    const transformedJobs = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company?.name || "Unknown",
      location: job.location || "Not specified",
      type: job.employmentType || "Not specified",
      salary: job.salary || "Negotiable",
      posted: job.postedAt ? timeAgo(job.postedAt) : "N/A",
      remote: job.workMode === "Remote",
      logo: job.company?.logo || job.company?.name?.slice(0, 2) || "JC", // initials
      description: job.description,
    }))

    return NextResponse.json(transformedJobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

// Helper to format posted date (example: '2 days ago')
function timeAgo(date) {
  const now = new Date()
  const postedDate = new Date(date)
  const diff = Math.floor((now - postedDate) / (1000 * 60 * 60 * 24)) // difference in days
  if (diff === 0) return "Today"
  if (diff === 1) return "1 day ago"
  return `${diff} days ago`
}
