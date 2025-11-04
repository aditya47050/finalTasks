import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send an email
async function sendEmail(mailOptions) {
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", mailOptions.to);
  } catch (error) {
    console.error("Failed to send email to:", mailOptions.to, "Error:", error);
  }
}

// Function to generate a unique esevacode
async function generateUniqueesevacode() {
  const now = new Date();
  const datePart = `${now.getFullYear().toString().slice(-2)}${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;

  let uniqueCode;
  let isUnique = false;

  while (!isUnique) {
    uniqueCode =
      "ESEVA" + datePart + Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    const existingCode = await db.Eseva.findFirst({
      where: { esevacode: uniqueCode },
    });

    if (!existingCode) {
      isUnique = true;
    }
  }

  return uniqueCode;
}

export async function PUT(req) {
  try {
    const { esevaId } = await req.json();

    if (!esevaId) {
      return NextResponse.json({ error: "Missing esevaId" }, { status: 400 });
    }

    // Generate a unique esevacode
    const esevacode = await generateUniqueesevacode();

    // Update the Eseva profile with the generated esevacode
    const updatedProfile = await db.Eseva.update({
      where: { id: esevaId },
      data: { esevacode },
    });

    // Send email notification
    const esevaUser = await db.Eseva.findUnique({ where: { id: esevaId } });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: esevaUser.email,
      subject: "Eseva Profile Update - Aarogya Aadhar",
      html: `<p>Dear ${esevaUser.name},</p>
             <p>Your Eseva profile has been updated successfully. Your new Eseva Code is: <strong>${esevacode}</strong>.</p>
             <p>Thank you for using our services.</p>
             <p>Best Regards,<br/>Aarogya Aadhar Team</p>`,
    };

    sendEmail(mailOptions);

    return NextResponse.json(
      { success: true, profile: updatedProfile },
      { status: 200 }
    );
  } catch (error) {
    console.error("Eseva Update Error:", error);
    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 500 }
    );
  }
}
