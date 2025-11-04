import { db } from "@/lib/db"; // Ensure your db connection is correctly set up
import crypto from "crypto";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer"; // Use Nodemailer for sending emails

// Configure Nodemailer (adjust settings as necessary)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use environment variables for security
  },
});

export async function POST(request) {
  const { email } = await request.json();

  // Check if the email exists
  const user = await db.Patient.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ success: false, message: "Email not registered" }, { status: 400 });
  }

  // Generate a reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Store the reset token and expiration in the database
  await db.Patient.update({
    where: { email },
    data: {
      resetToken,
      resetTokenExpiration: new Date(Date.now() + 3600000) // 1 hour expiration
    }
  });

  // Send email to user with the reset link
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/patient/authforgot/forgotpassword?token=${resetToken}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    text: `Click the link to reset your password: ${resetLink}`,
  });

  return NextResponse.json({ success: true, message: "Reset link sent to your email Please log in to your Mail and click on the link to reset password " });
}
