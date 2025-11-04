import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function DELETE(request) {
  try {
    const { jobId, seekerId } = await request.json()

    if (!jobId || !seekerId) {
      return NextResponse.json(
        { error: "Job ID and Seeker ID are required" },
        { status: 400 }
      )
    }

    // Remove the saved job
    await db.savedJob.deleteMany({
      where: {
        jobId,
        seekerId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unsaving job:", error)
    return NextResponse.json(
      { error: "Failed to unsave job" },
      { status: 500 }
    )
  }
}
