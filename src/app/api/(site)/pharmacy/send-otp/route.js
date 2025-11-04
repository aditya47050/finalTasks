import nodemailer from "nodemailer";
import { randomInt } from "crypto";
import { db } from "@/lib/db";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  const { email, name } = await request.json();

  // ✅ 1. Check if pharmacy email already exists
  const pharmacy = await db.Pharmacy.findFirst({
    where: { email },
  });

  if (pharmacy) {
    return new Response(
      JSON.stringify({ success: false, message: "Email already registered." }),
      { status: 400 }
    );
  }

  // ✅ 2. Delete any previous OTP for the same email
  await db.Otp.deleteMany({
    where: { email },
  });

  // ✅ 3. Generate a new OTP
  const otp = randomInt(100000, 999999).toString();

  // ✅ 4. Store OTP in DB
  await db.Otp.create({
    data: { email, otp },
  });

  // ✅ 5. Send OTP email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject:
      "Your OTP for Pharmacy Registration at Aarogya Aadhar",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p style="font-size: 14px; color: #555;">This is Automatic Mail, Don’t Reply</p>
        <h3>Dear Pharmacy,</h3>
        <p>Thank you for registering with Aarogya Aadhar! Use the OTP below to verify your pharmacy account:</p>
        <p style="font-size: 24px; font-weight: bold; color: #4CAF50;">${otp}</p>
        <p>This OTP is valid for the next <strong>5 minutes</strong>.</p>
        <h4>How to use the OTP:</h4>
        <ol>
          <li>Go to the pharmacy registration page: <a href="https://aarogyaaadhar.com/pharmacy/register" target="_blank">Pharmacy Registration</a></li>
          <li>Enter the OTP when prompted.</li>
          <li>Once verified, your account will be successfully created!</li>
        </ol>
        <p>If you did not request this, please ignore this email or contact our support team.</p>
        <p>We are excited to have you on board!</p>
        <p>Best Regards,<br/>Aarogya Rakshak Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);

  return new Response(JSON.stringify({ success: true, message: "OTP sent!" }), {
    status: 200,
  });
}
