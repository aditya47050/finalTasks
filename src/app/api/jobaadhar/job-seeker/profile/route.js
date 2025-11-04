import { NextResponse } from "next/server"
import { db } from "@/lib/db"

async function withRetry(operation, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      if (attempt === maxRetries) throw error

      if (error.code === "P2034" || error.message?.includes("deadlock") || error.message?.includes("timeout")) {
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 100))
        continue
      }
      throw error
    }
  }
  throw new Error("Max retries exceeded")
}

// ---------------- GET PROFILE ----------------
export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 })

  try {
    const jobSeeker = await db.jobSeeker.findUnique({
      where: { userId },
      include: {
        user: true,
        skills: {
          include : {
            skill:true,
          }
        }, // array of strings
        education: true,
        experience: true,
      },
    })

    if (!jobSeeker) {
      const user = await db.jObUser.findUnique({ where: { id: userId } })
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

      const newProfile = await db.jobSeeker.create({
        data: { userId, bio: "", resumeUrl: "", profilePhoto: "", skills: [] },
        include: { user: true, education: true, experience: true },
      })
      return NextResponse.json(newProfile)
    }

    return NextResponse.json(jobSeeker)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

// ---------------- UPDATE/CREATE PROFILE ----------------
export async function POST(req) {
  try {
    const data = await req.json()
    const { userId, fullName, email, phone, bio, resumeUrl, profilePhoto, interests, skills } = data

    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 })

    const existingJobSeeker = await db.jobSeeker.findUnique({ where: { userId } })

    // Update JobUser info if provided
    if (fullName || email || phone) {
      await db.jObUser.update({
        where: { id: userId },
        data: { fullName, email, phone },
      })
    }

    let jobSeeker
    if (existingJobSeeker) {
      const updateData = {
        bio: bio ?? existingJobSeeker.bio,
        resumeUrl: resumeUrl ?? existingJobSeeker.resumeUrl,
        profilePhoto: profilePhoto ?? existingJobSeeker.profilePhoto,
        interests: interests ?? existingJobSeeker.interests,
        skills: skills ? Array.from(new Set([...existingJobSeeker.skills, ...skills])) : existingJobSeeker.skills,
      }

      jobSeeker = await db.jobSeeker.update({
        where: { userId },
        data: updateData,
        include: { user: true, skills: true, education: true, experience: true },
      })
    } else {
      jobSeeker = await db.jobSeeker.create({
        data: {
          userId,
          bio: bio ?? "",
          resumeUrl: resumeUrl ?? "",
          profilePhoto: profilePhoto ?? "",
          interests: interests ?? [],
          skills: skills ?? [],
        },
        include: { user: true, skills: true, education: true, experience: true },
      })
    }

    return NextResponse.json(jobSeeker)
  } catch (error) {
    console.error("Error saving profile:", error)
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 })
  }
}

// ---------------- PATCH FOR EDUCATION/EXPERIENCE ----------------
export async function PATCH(req) {
  try {
    const data = await req.json()
    const { userId, education, experience ,skills ,bio,resumeUrl,profilePhoto } = data

    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 })

    const existingJobSeeker = await db.jobSeeker.findUnique({ 
      where: { userId }, 
      include: { education: true, experience: true } 
    })
    if (!existingJobSeeker) return NextResponse.json({ error: "Profile not found" }, { status: 404 })

    // Delete old education/experience if sending full array
    if (education) {
      await db.education.deleteMany({ where: { seekerId: existingJobSeeker.id } })
      const newEducation = education.map((e) => ({ ...e, seekerId: existingJobSeeker.id }))
      await db.education.createMany({ data: newEducation })
    }

    if (experience) {
      await db.experience.deleteMany({ where: { seekerId: existingJobSeeker.id } })

      const newExperience = experience.map((e) => ({
        ...e,
        seekerId: existingJobSeeker.id,
        startDate: e.startDate ? new Date(e.startDate) : null,
        endDate: e.endDate ? new Date(e.endDate) : null,
      }))

      await db.experience.createMany({ data: newExperience })
    }
    // 1. Delete old skills if sending full array
    if (skills) {
      // Remove existing SkillOnSeeker entries
      await db.skillOnSeeker.deleteMany({ where: { seekerId: existingJobSeeker.id } });

      // Map skill names to IDs
      const skillRecords = await Promise.all(
        skills.map(async (name) => {
          let skill = await db.skill.findUnique({ where: { name } });
          if (!skill) {
            skill = await db.skill.create({ data: { name } });
          }
          return skill;
        })
      );

      // Create SkillOnSeeker entries
      const skillOnSeekerData = skillRecords.map((skill) => ({
        seekerId: existingJobSeeker.id,
        skillId: skill.id,
      }));

      await db.skillOnSeeker.createMany({ data: skillOnSeekerData });
    }

    const updatedProfile = await db.jobSeeker.findUnique({
      where: { userId },
      include: { education: true, experience: true, skills: true, user: true },
    })
    if (bio !== undefined || resumeUrl !== undefined || profilePhoto !== undefined) {
      await db.jobSeeker.update({
        where: { userId },
        data: {
          bio: bio ?? existingJobSeeker.bio,
          resumeUrl: resumeUrl ?? existingJobSeeker.resumeUrl,
          profilePhoto: profilePhoto ?? existingJobSeeker.profilePhoto,
        },
      })
    }

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error("Error updating profile section:", error)
    return NextResponse.json({ error: "Failed to update profile section" }, { status: 500 })
  }
}

