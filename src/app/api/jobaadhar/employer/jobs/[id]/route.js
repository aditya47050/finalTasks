import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req, { params }) {
  try {
    const { id } = params; // ✅ get job ID from URL
    const body = await req.json();
    const {
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
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}
export async function DELETE(req, { params }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
    }

    // Delete related SkillOnJob entries first (to avoid foreign key constraints)
    await db.skillOnJob.deleteMany({
      where: { jobId: id },
    })

    // Delete related applications (optional, if you want cascade manually)
    await db.application.deleteMany({
      where: { jobId: id },
    })

    // Now delete the job itself
    await db.job.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Job deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
  }
}