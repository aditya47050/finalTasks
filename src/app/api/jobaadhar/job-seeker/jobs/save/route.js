import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request) {
  try {
    const { jobId, seekerId } = await request.json()

    if (!jobId || !seekerId) {
      return NextResponse.json(
        { error: "Job ID and Seeker ID are required" },
        { status: 400 }
      )
    }

    // Check if job is already saved
    const existingSave = await db.savedJob.findFirst({
      where: {
        jobId,
        seekerId,
      },
    })

    if (existingSave) {
      return NextResponse.json({ error: "Job already saved" }, { status: 409 })
    }

    // Save the job
    const savedJob = await db.savedJob.create({
      data: {
        jobId,
        seekerId,
      },
    })

    return NextResponse.json({ success: true, savedJob })
  } catch (error) {
    console.error("Error saving job:", error)
    return NextResponse.json(
      { error: "Failed to save job" },
      { status: 500 }
    )
  }
}
