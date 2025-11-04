import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST: Create Job
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      salary,
      workMode,
      location,
      companyId,
      employerId,
      exp,
      openings,
      employmentType,
      responsibilities,
      requirements,
      skills = [],
    } = body;

    const job = await db.job.create({
      data: {
        title,
        description,
        salary,
        workMode,
        location,
        exp,
        openings,
        employmentType,
        responsibilities,
        requirements,
        company: { connect: { id: companyId } },
        employer: { connect: { id: employerId } },
        skills: {
          create: await Promise.all(
            skills.map(async (skillName) => {
              const skill = await db.skill.upsert({
                where: { name: skillName },
                update: {},
                create: { name: skillName },
              });
              return { skillId: skill.id };
            })
          ),
        },
      },
      include: { company: true, employer: {include: { user: true }}, skills: { include: { skill: true } } },
      
    });
    // Fetch all JobSeekers (you can filter by followers of the company instead)
    const seekers = await db.jobSeeker.findMany({ select: { id: true } });

    // Create notifications for each seeker
    await Promise.all(
  seekers.map(async (seeker) => {
    try {
      await db.notification.create({
        data: {
          receiverId: seeker.id,
          jobId: job.id,
          employerId: employerId,
          companyId: companyId,
          type: "JOB_POSTED",
          message: `${job.employer.user.fullName} at ${job.company.name} posted a new job: ${job.title}`,
        },
      });
    } catch (err) {
      console.error("Notification create failed:", err);
    }
  })
);

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}

// PUT: Update Job
export async function PUT(req) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      description,
      salary,
      workMode,
      location,
      exp,
      openings,
      employmentType,
      responsibilities,
      requirements,
      skills = [],
      status,
    } = body;

    const job = await db.job.update({
      where: { id },
      data: {
        title,
        description,
        salary,
        workMode,
        location,
        exp,
        openings,
        employmentType,
        responsibilities,
        requirements,
        status,
        skills: {
          deleteMany: {},
          create: await Promise.all(
            skills.map(async (skillName) => {
              const skill = await db.skill.upsert({
                where: { name: skillName },
                update: {},
                create: { name: skillName },
              });
              return { skillId: skill.id };
            })
          ),
        },
      },
      include: { company: true, employer: true, skills: { include: { skill: true } } },
    });

    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

// GET: Fetch Jobs
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const employerId = searchParams.get("employerId");

    const jobs = await db.job.findMany({
      where: employerId ? { employerId } : {},
      include: { company: true, employer: true, skills: { include: { skill: true } } },
      orderBy: { postedAt: "desc" },
    });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
