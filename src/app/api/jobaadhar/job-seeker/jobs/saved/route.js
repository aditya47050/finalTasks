import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const seekerId = searchParams.get("seekerId")

    if (!seekerId) {
      return NextResponse.json(
        { error: "Seeker ID is required" },
        { status: 400 }
      )
    }

    const savedJobs = await db.savedJob.findMany({
      where: {
        seekerId,
      },
      include: {
        job: {
          include: {
            company: true,
            skills: {
              include: {
                skill: true,
              },
            },
            applications: true,
          },
        },
      },
      orderBy: {
        savedAt: "desc",
      },
    })

    return NextResponse.json({ savedJobs })
  } catch (error) {
    console.error("Error fetching saved jobs:", error)
    return NextResponse.json(
      { error: "Failed to fetch saved jobs" },
      { status: 500 }
    )
  }
}
