import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/jobaadhar/employer/shortlist?employerId=123
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const employerId = searchParams.get("employerId")

    if (!employerId) {
      return NextResponse.json(
        { error: "employerId is required" },
        { status: 400 }
      )
    }

    const shortlisted = await db.application.findMany({
      where: {
        status: "SHORTLISTED", // matches enum ApplicationStatus
        job: {
          employerId: employerId, // ✅ nested filter through Job
        },
      },
      include: {
        seeker: {
          include: {
            user: true,
            education: true,
            experience: true,
            skills: {
              include: { skill: true },
            },
          },
        },
        job: {
          include: {
            company: true,
            skills: { include: { skill: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ shortlisted })
  } catch (error) {
    console.error("❌ Error fetching shortlisted:", error)
    return NextResponse.json(
      { error: "Failed to fetch shortlisted candidates" },
      { status: 500 }
    )
  }
}
