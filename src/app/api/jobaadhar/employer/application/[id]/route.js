import { NextResponse } from "next/server"
import { db } from '@/lib/db';

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    // In a real app, you would delete from the database like this:
    await db.application.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Application deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting application:", error)
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 })
  }
}
export async function GET(req, { params }) {
  try {
    const application = await db.application.findUnique({
      where: { id: params.id },
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
        job: true,
      },
    })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch application details" }, { status: 500 })
  }
}