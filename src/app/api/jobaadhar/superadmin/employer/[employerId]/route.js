import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, context) {
  try {
    const { params } = context;
    const employerId = params?.employerId;

    if (!employerId) {
      return NextResponse.json(
        { success: false, msg: "Employer ID required" },
        { status: 400 }
      );
    }

    const employer = await db.Employer.findUnique({
      where: { id: employerId },
      include: {
        user: true, // employer user info
        company: {
          include: {
            tags: { include: { tag: true } },
            benefits: { include: { benefit: true } },
            ratings: true,
            reviews: true,
            jobs: {
              include: {
                skills: { include: { skill: true } },
                applications: true,
              },
            },
            departments: true,

          },
        },
        documents: true,
      },
    });

    if (!employer) {
      return NextResponse.json(
        { success: false, msg: "Employer not found" },
        { status: 404 }
      );
    }

    // Optional: filter out null seekers to prevent frontend crashes
    if (employer.company?.followers) {
      employer.company.followers = employer.company.followers.filter(
        (f) => f.seeker !== null
      );
    }

    return NextResponse.json({ success: true, data: employer });
  } catch (error) {
    console.error("Fetch employer error:", error);
    return NextResponse.json(
      { success: false, msg: "Server error" },
      { status: 500 }
    );
  }
}
