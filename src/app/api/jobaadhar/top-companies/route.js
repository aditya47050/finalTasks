import { NextResponse } from "next/server"
import { db } from "@/lib/db" // make sure this points to your Prisma client

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get("limit") || "8")

    // Fetch companies with their jobs
    const companies = await db.company.findMany({
      include: {
        jobs: true, // include related jobs
        category : true,
      },
    })

    // Map companies to include openings and jobCount
    const companiesStats = companies.map((c) => {
      const openings = c.jobs.reduce((sum, j) => sum + (j.openings ?? 0), 0)
      const jobCount = c.jobs.length
      return {
        id: c.id,
        name: c.name,
        logoUrl: c.logoUrl,
        category: c.category,
        openings,
        jobCount,
      }
    })

    // Sort by openings descending, then jobCount descending, and slice by limit
    const sorted = companiesStats
      .sort((a, b) => (b.openings !== a.openings ? b.openings - a.openings : b.jobCount - a.jobCount))
      .slice(0, limit)

    return NextResponse.json({ companies: sorted })
  } catch (err) {
    return NextResponse.json({ error: (err).message }, { status: 500 })
  }
}
