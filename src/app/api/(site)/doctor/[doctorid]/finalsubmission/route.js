import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function PUT(request, { params }) {
  const id = params.doctorid;

  try {
    const doctor = await db.Doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
    }
    const cardNo = await generateUniqueCardNumber();
    // Create DoctorCertificate entry with approvalStatus PENDING
    const doctorCertificate = await db.DoctorCertificate.create({
      data: {
        approvalStatus: "PENDING",
        doctor: { connect: { id } },
        cardNo,
      },
    });

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: doctor.email,
      subject: "Your Profile Submission is Under Review - Aarogya Aadhar",
      text: `Dear ${doctor.firstName},\n\nYour profile submission is under review.\n\nApproval Status: Pending\n\nWe will notify you once it is approved.\n\nRegards,\nAarogya Aadhar Team`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Review email sent successfully to:", doctor.email);

    return NextResponse.json({ doctorCertificate });
  } catch (error) {
    console.error("Error creating doctor certificate:", error);
    return NextResponse.json(
      { error: "An error occurred: " + error.message },
      { status: 500 }
    );
  }
}
async function generateUniqueCardNumber() {
  const now = new Date();
  const datePart = `${now.getFullYear().toString().slice(-2)}${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;

  let uniqueNumber;
  let isUnique = false;

  while (!isUnique) {
    uniqueNumber =
      "DRS" + datePart + Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    const existingCard = await db.DoctorCertificate.findFirst({
      where: { cardNo: uniqueNumber },
    });

    if (!existingCard) {
      isUnique = true;
    }
  }

  return uniqueNumber;
}
