import { db } from "@/lib/db";
import nodemailer from "nodemailer";

// Configure your email transporter (example using Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
});

export async function POST(req, { params }) {
  try {
    const { diagnosticcenterId } = params;
    const { hospitalDiagnosticCenterId, approved, notes } = await req.json();

    if (!diagnosticcenterId || !hospitalDiagnosticCenterId) {
      return new Response(JSON.stringify({ message: "Invalid request" }), { status: 400 });
    }

    // 1️⃣ Update HospitalDiagnosticCenter status
    const record = await db.HospitalDiagnosticCenter.update({
      where: { id: hospitalDiagnosticCenterId },
      data: {
        status: approved ? "APPROVED" : "REJECTED",
        notes: notes || null,
        approvedBy: diagnosticcenterId,
        approvedAt: new Date(),
      },
      include: {
        hospital: { select: { email: true, hspInfo: true } },
      },
    });

    if (!record) {
      return new Response(JSON.stringify({ message: "Record not found" }), { status: 404 });
    }

    // 2️⃣ Send email to the hospital
    const hospitalEmail = record.hospital?.email;
    const hospitalName = record.hospital?.hspInfo?.regname || "Hospital";

    if (hospitalEmail) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: hospitalEmail,
        subject: `Association Request ${approved ? "Approved" : "Rejected"} by Diagnostic Center`,
        text: `Dear ${hospitalName},

Your request to associate with the diagnostic center has been ${approved ? "approved" : "rejected"}.

${notes ? "Notes: " + notes : ""}

Regards,
Diagnostic Center Team`,
      };

      await transporter.sendMail(mailOptions);
    }

    return new Response(JSON.stringify({ message: `Hospital ${approved ? "approved" : "rejected"} successfully.` }), { status: 200 });
  } catch (err) {
    console.error("Hospital approval error:", err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
