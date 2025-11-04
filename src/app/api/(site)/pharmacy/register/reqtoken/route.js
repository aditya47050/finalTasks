import { db } from "@/lib/db";
import crypto from "crypto";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  const { email } = await request.json();

  // Check if the email exists for pharmacy
  const pharmacy = await db.Pharmacy.findUnique({ where: { email } });
  if (!pharmacy) {
    return NextResponse.json({ success: false, message: "Email not registered" }, { status: 400 });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  // Store token and expiration
  await db.Pharmacy.update({
    where: { email },
    data: {
      resetToken,
      resetTokenExpiration: new Date(Date.now() + 3600000), // 1 hour
    },
  });

  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/pharmacy/authforgot/forgotpassword?token=${resetToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Pharmacy Password Reset',
    text: `Click the link to reset your password: ${resetLink}`,
  });

  return NextResponse.json({ success: true, message: "Reset link sent to your email. Please check your inbox." });
}
