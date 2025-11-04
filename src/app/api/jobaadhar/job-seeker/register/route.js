import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// setup mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  try {
    const { fullName, email, phone, password } = await request.json();

    // Check if email exists
    const existingUser = await db.jObUser.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );
    }

    // Check if phone exists
    const existingPhone = await db.jObUser.findUnique({ where: { phone } });
    if (existingPhone) {
      return NextResponse.json(
        { success: false, message: "Phone number already registered" },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user with role JOB_SEEKER
    const user = await db.jObUser.create({
      data: {
        role: "JOB_SEEKER",
        fullName,
        email,
        phone,
        password: hashedPassword,
        jobSeeker: {
          create: {}, // empty profile initially
        },
      },
      include: { jobSeeker: true },
    });

    // send welcome email
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to Job Aadhar – Account Created Successfully!",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p style="font-size: 14px; color: #555;">This is an automatic email, please do not reply.</p>
            <h3>Dear ${fullName || email},</h3>
            <p>Welcome to the Job Aadhar Family!</p>
            <p>Your account has been successfully created. You can now log in to explore job opportunities, create your profile, and apply for jobs.</p>
            
            <h4>Your Account Details:</h4>
            <ul>
              <li><strong>Name:</strong> ${fullName}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Phone:</strong> ${phone}</li>
              <li><strong>Account Type:</strong> Job Seeker</li>
            </ul>

            <p>👉 <a href="https://jobaadhar.com/jobaadhar/job-seeker/login" target="_blank">Login Here</a></p>

            <p>If you did not initiate this registration, please ignore this email.</p>

            <p>Thank you for joining Job Aadhar!</p>
            <br/>
            <p>Best Regards,<br/>Job Aadhar Team</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error("Failed to send welcome email:", err);
    }

    return NextResponse.json(
      { success: true, message: "Job Seeker account created", user },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register Job Seeker Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
