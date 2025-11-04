import bcrypt from "bcryptjs";
import { db } from "@/lib/db"; // Ensure your db connection is correctly set up
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Replace with your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

export async function POST(request) {
  const {
    name,
    address,
    district,
    taluka,
    state,
    incharge,
    inchargeAadharNo,
    mobile,
    email,
    password,
    pincode,
    role,
  } = await request.json();

  // Check if the email is already registered
  const existingUser = await db.Eseva.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { success: false, message: "Email already registered" },
      { status: 400 }
    );
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user in the database
  const user = await db.Eseva.create({
    data: {
      name,
      address,
      district,
      taluka,
      state,
      incharge,
      inchargeaadharno: inchargeAadharNo,
      mobile,
      email,
      password: hashedPassword,
      pincode,
      role,
    },
  });

  // Send email notification
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to E-Seva - Aarogya Aadhar",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h3>Dear ${name},</h3>
          <p>Welcome to E-Seva! Your registration is successful.</p>
          <p>You can now log in using your email and password.</p>
          <p>Thank you for joining us!</p>
          <hr/>
          <p style="font-size: 12px; color: #999;">
            This email may contain confidential information. If you received it in error, please delete it immediately.
          </p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", email);
  } catch (error) {
    console.error("Failed to send email to:", email, "Error:", error);
  }

  return NextResponse.json(
    { success: true, message: "New e-Seva user created and email sent", user },
    { status: 201 }
  );
}
