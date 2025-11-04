import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  try {
    const { jobId, seekerId } = await request.json();

    if (!jobId || !seekerId) {
      return NextResponse.json(
        { error: "Job ID and Seeker ID are required" },
        { status: 400 }
      );
    }

    // Check if already applied
    const existingApplication = await db.Application.findFirst({
      where: { jobId, seekerId },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied for this job" },
        { status: 409 }
      );
    }

    // Create a new application
    const application = await db.Application.create({
      data: {
        seekerId,
        jobId,
        status: "APPLIED",
      },
      include: {
        seeker: {
          include: {
            user: true,
            skills: { include: { skill: true } },
            education: true,
            experience: true,
          },
        },
        job: {
          include: {
            company: true,
          },
        },
      },
    });

    // Prepare HTML email
    const seekerEmail = application.seeker.user.email;
    const job = application.job;
    const company = job.company;
    const jobDetailsHTML = `
      <h2>Hi ${application.seeker.user.fullName},</h2>
      <p>Thank you for applying to <strong>${job.title}</strong> at <strong>${company.name}</strong>.</p>

      <h3>Application Details:</h3>
      <ul>
        <li><strong>Job Title:</strong> ${job.title}</li>
        <li><strong>Company:</strong> ${company.name}</li>
        <li><strong>Status:</strong> ${application.status}</li>
        <li><strong>Applied On:</strong> ${application.appliedAt.toLocaleDateString()}</li>
      </ul>

      <h3>Suggested Jobs Based on Your Skills:</h3>
      <p>Check out other jobs that match your skills: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/jobaadhar/jobs">Click Here</a></p>

      <p>Best of luck!<br/>The Job Portal Team</p>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: seekerEmail,
      subject: `Application Confirmation: ${job.title} at ${company.name}`,
      html: jobDetailsHTML,
    });

    return NextResponse.json({
      success: true,
      application,
      message: "Application submitted and email sent successfully",
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
