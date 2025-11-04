import { NextResponse } from "next/server"
import { db } from '@/lib/db';


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const employerId = searchParams.get("employerId")

    if (!employerId) {
      return NextResponse.json({ error: "Employer ID is required" }, { status: 400 })
    }

    // In a real app, you would query your database like this:
    const applications = await db.application.findMany({
      where: {
        job: {
          employerId: employerId
        }
      },
      include: {
        seeker: {
          include: {
            user: true,
            experience: true,
            skills: {
              include: {
                skill: true
              }
            }
          }
        },
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            salary: true,
            employmentType: true
          }
        }
      },
      orderBy: {
        appliedAt: 'desc'
      }
    })

    // For now, return mock data
    return NextResponse.json({
      success: true,
      applications: applications,
    })
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
