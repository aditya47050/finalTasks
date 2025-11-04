import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getSession } from "@/lib/getsession"

export async function GET() {
  try {
    const session = await getSession()
    const userId = session?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const employer = await db.employer.findUnique({
      where: { userId },
      include: {
        user : true,
        company: {
          include: {
            category: true,
          },
        },
        documents: true, // ✅ include documents
      },
    })

    if (!employer) {
      return NextResponse.json({
        totalJobs: 0,
        totalApplications: 0,
        shortlisted: 0,
        profileCompleteness: 0,
        trend: [],
        company: null,
      })
    }

    // Jobs by this employer
    const jobs = await db.job.findMany({
      where: { employerId: employer.id },
      select: { id: true, postedAt: true },
    })
    const jobIds = jobs.map((j) => j.id)
    const totalJobs = jobIds.length

    // Applications on these jobs
    const applications = jobIds.length
      ? await db.application.findMany({
          where: { jobId: { in: jobIds } },
          select: { status: true, appliedAt: true },
        })
      : []

    const totalApplications = applications.length

    // ✅ Ensure status matches enum values exactly
    const shortlisted = applications.filter((a) => a.status === "SHORTLISTED").length

    // naive deltas
    const jobsDeltaLabel = totalJobs > 0 ? "+ growing" : "No jobs yet"
    const applicationsDeltaLabel = totalApplications > 0 ? "+ this month" : "No applications"

    // profile completeness
    const c = employer.company
    const fields = [
      "name",
      "logoUrl",
      "founded",
      "about",
      "addressLine1",
      "district",
      "city",
      "state",
      "pincode",
      "country",
      "mission",
      "values",
      "culture",
    ]
    const filled = fields.filter((k) => {
      const v = c?.[k]
      return v !== null && v !== undefined && String(v).trim().length > 0
    }).length
    const profileCompleteness = Math.round((filled / fields.length) * 100)

    // last 6 months trend
    const trend = buildLast6Months().map((m) => ({
      month: m.label,
      applications: applications.filter((a) => sameMonth(a.appliedAt, m.date)).length,
    }))

    return NextResponse.json({
      employer,
      totalJobs,
      totalApplications,
      shortlisted,
      profileCompleteness,
      jobsDeltaLabel,
      applicationsDeltaLabel,
      trend,
      company: employer.company ?? null,
      documents: employer.company?.documents ?? [], // ✅ include documents separately
    })
  } catch (err) {
    console.error("[GET] /api/employer/stats error:", err)
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 })
  }
}

function buildLast6Months() {
  const out = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    out.push({ date: d, label: d.toLocaleString("en-US", { month: "short" }) })
  }
  return out
}

function sameMonth(a, b) {
  const da = new Date(a)
  return da.getFullYear() === b.getFullYear() && da.getMonth() === b.getMonth()
}
