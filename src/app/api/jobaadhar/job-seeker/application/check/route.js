import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")
    const seekerId = searchParams.get("seekerId")

    if (!jobId || !seekerId) {
      return NextResponse.json({ error: "Job ID and Seeker ID are required" }, { status: 400 })
    }

    // Use Prisma correctly
    const existingApplication = await db.Application.findFirst({
      where: {
        jobId: jobId,
        seekerId: seekerId,
      },
    })

    return NextResponse.json({
      hasApplied: !!existingApplication,
      application: existingApplication || null,
    })
  } catch (error) {
    console.error("Error checking application status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
