// src/app/api/(site)/home-healthcare/[homehealthcareId]/hospitalapproval/route.js
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

// Configure transporter (example using Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req, { params }) {
  try {
    // Use exact folder name as key
    const { homehealthcareId } = params;

    const { hospitalHomeHealthcareId, approved, notes } = await req.json();



    if (!homehealthcareId || !hospitalHomeHealthcareId) {
      return new Response(
        JSON.stringify({ message: "Invalid request" }),
        { status: 400 }
      );
    }

    // Update HospitalHomeHealthcare association status
    const record = await db.HospitalHomeHealthcare.update({
      where: { id: hospitalHomeHealthcareId },
      data: {
        status: approved ? "APPROVED" : "REJECTED",
        notes: notes || null,
        approvedBy: homehealthcareId,
        approvedAt: new Date(),
      },
      include: {
        hospital: { select: { email: true, hspInfo: true } },
      },
    });

    if (!record) {
      return new Response(
        JSON.stringify({ message: "Record not found" }),
        { status: 404 }
      );
    }

    // Send notification email to hospital
    const hospitalEmail = record.hospital?.email;
    const hospitalName = record.hospital?.hspInfo?.regname || "Hospital";

    if (hospitalEmail) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: hospitalEmail,
        subject: `Association Request ${approved ? "Approved" : "Rejected"} by Home Healthcare`,
        text: `Dear ${hospitalName},

Your request to associate with the Home Healthcare center has been ${approved ? "approved" : "rejected"}.

${notes ? "Notes: " + notes : ""}

Regards,  
Home Healthcare Team`,
      };

      await transporter.sendMail(mailOptions);
    }

    return new Response(
      JSON.stringify({
        message: `Hospital ${approved ? "approved" : "rejected"} successfully.`,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("HomeHealthcare approval error:", err);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
