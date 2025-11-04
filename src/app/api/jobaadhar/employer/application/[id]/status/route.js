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

export async function PATCH(request, { params }) {
  try {
    const id = params.id;
    const { status } = await request.json();

    // Validate status
    const validStatuses = [
  "APPLIED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "REJECTED",
  "HIRED",
  "INTERVIEW_SCHEDULED",
  "INTERVIEWED",
  "OFFER_EXTENDED",
];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Update application status
    const updatedApplication = await db.application.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        seeker: {
          include: { user: true },
        },
        job: {
          include: { company: true },
        },
      },
    });

    // Send email to seeker
    const seekerEmail = updatedApplication.seeker.user.email;
    const job = updatedApplication.job;
    const company = job.company;

    const emailHTML = `
      <h2>Hi ${updatedApplication.seeker.user.fullName},</h2>
      <p>Your application status for <strong>${job.title}</strong> at <strong>${company.name}</strong> has been updated.</p>

      <h3>Application Details:</h3>
      <ul>
        <li><strong>Job Title:</strong> ${job.title}</li>
        <li><strong>Company:</strong> ${company.name}</li>
        <li><strong>New Status:</strong> ${updatedApplication.status}</li>
        <li><strong>Updated On:</strong> ${updatedApplication.updatedAt.toLocaleDateString()}</li>
      </ul>

      <h3>Explore More Jobs:</h3>
      <p>Check out other jobs that match your skills: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/jobaadhar/jobs">Click Here</a></p>

      <p>Best regards,<br/>The Job Portal Team</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: seekerEmail,
      subject: `Application Status Updated: ${job.title} at ${company.name}`,
      html: emailHTML,
    });

    return NextResponse.json({
      success: true,
      message: `Application status updated to ${status} and email sent to seeker`,
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json({ error: "Failed to update application status" }, { status: 500 });
  }
}
