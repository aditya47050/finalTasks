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

    const savedJob = await db.savedJob.findFirst({
      where: {
        jobId,
        seekerId,
      },
    })

    return NextResponse.json({ isSaved: !!savedJob })
  } catch (error) {
    console.error("Error checking saved job:", error)
    return NextResponse.json({ error: "Failed to check saved job" }, { status: 500 })
  }
}
