import nodemailer from "nodemailer";
import { randomInt } from "crypto";
import { db } from "@/lib/db";

const transporter = nodemailer.createTransport({
  service: "gmail", // Replace with your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

export async function POST(request) {
  const { email } = await request.json();

  // Check if the email exists in the database
  const user = await db.user.findFirst({
    where: { email },
  });

  // Generate a 6-digit OTP
  const otp = randomInt(100000, 999999).toString();

  // Delete any existing OTP for the given email to avoid unique constraint issues
  await db.SuperAdminLoginOtp.deleteMany({
    where: { email },
  });

  // Store the new OTP in the database
  await db.SuperAdminLoginOtp.create({
    data: { email, otp },
  });

  // Set the name to either the user's name or a fallback value
  const name = user ? user.name : "User";

  // Email content with HTML formatting
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to Aarogya Aadhar – Your Login OTP is:",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p style="font-size: 14px; color: #555;">This is Automatic Mail, Don’t Reply</p>
        <h3>Dear ${name},</h3>
        <p>Thank you for coming back to Aarogya Aadhar! To complete the login process, please use the One-Time Password (OTP) below to verify your account:</p>
        <p style="font-size: 24px; font-weight: bold; color: #4CAF50;">Your OTP: ${otp}</p>
        <p>This OTP is valid for the next <strong>5 minutes</strong>. Please ensure you enter it promptly to complete your registration.</p>
        <h4>How to use the OTP:</h4>
        <ol>
          <li>Go to the Login page: <a href="https://aarogyaaadhar.com/auth/login" target="_blank">Registration Page</a></li>
          <li>Enter your OTP when prompted.</li>
          <li>Once verified, your account will be successfully created!</li>
        </ol>
        <p>If you did not request this, please ignore this email or contact our support team immediately at <a href="mailto:patient@aarogyaaadhar.com">patient@aarogyaaadhar.com</a> or call us at +91 79-72-72-7498 & +91 91-45-07-8001.</p>
        <p>We are excited to have you on board!</p>
        <a href="https://aarogyaaadhar.com/" target="_blank">
          <p>Best Regards,<br/>Aarogya Rakshak Team</p> 
          <img src="https://res.cloudinary.com/dnckhli5u/image/upload/v1728891425/Picture1_c31red.png" alt="Aarogya Aadhar Logo" style="width: full; height: 400px;" />
        </a>
        <hr/>
        <h3 style="color: #243460;">Connect</h3>
        <p>Follow Aarogya Aadhar on:</p>
        <div style="display: flex; align-items: center; gap: 10px; padding-top: 10px;">
          <a href="https://www.instagram.com/bharat_aarogya_aadhar"><p>Instagram |</p></a>
          <a href="https://www.facebook.com/profile.php?id=61554162329099"><p>Facebook |</p></a>
          <a href="#"><p>Twitter |</p></a>
          <a href="https://www.linkedin.com/company/aarogya-aadhar"><p>LinkedIn |</p></a>
          <a href="https://youtu.be/T5BCaTuZUpY"><p>YouTube</p></a>
        </div>
        <p><a href="https://aarogyaaadhar.com/" target="_blank">Website</a></p>
        <hr/>   
        <p style="font-size: 12px; color: #999;">This E-Mail may contain Confidential and/or legally privileged Information...</p>
      </div>
    `,
  };

  // Send OTP via email
  await transporter.sendMail(mailOptions);

  return new Response(JSON.stringify({ success: true, message: "OTP sent!" }), {
    status: 200,
  });
}
