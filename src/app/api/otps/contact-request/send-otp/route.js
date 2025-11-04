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
  const { email, name } = await request.json(); // Assuming you're sending the user's name too

  const patient = await db.patient.findFirst({
    where: { email },
  });
  await db.ContactRequestOTP.deleteMany({
    where: { email },
  });

  // Generate a 6-digit OTP
  const otp = randomInt(100000, 999999).toString();

  // Store OTP in the database
  await db.ContactRequestOTP.create({
    data: { email, otp },
  });

  // Email content with HTML formatting
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Contact Request – OTP Inside",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p style="font-size: 14px; color: #555;">This is an Automatic Mail, Don’t Reply</p>
        <h3>Dear User</h3>
        <p>Thank you for reaching out to Aarogya Aadhar Portal! To complete the verification process, please enter the One-Time Password (OTP) provided below. This helps us confirm your request and secure your information.</p>
        <p style="font-size: 24px; font-weight: bold; color: #4CAF50;">Your OTP: ${otp}</p>
        <p>Please note that this OTP is valid for the next <strong>5 minutes</strong>. For your security, do not share this OTP with anyone.</p>
        <p>If you did not make this request, please disregard this email.</p>
        <hr/>
        <p>Thank you for choosing Aarogya Aadhar .</p>
        <a href="https://aarogyaaadhar.com/" target="_blank">
            <p>Best Regards,<br/>Aarogya Rakshak Team</p>
          <img src="https://res.cloudinary.com/dnckhli5u/image/upload/v1728891425/Picture1_c31red.png" alt="Aarogya Aadhar Logo" style="width: full; height: 400px;" />
        </a>
        <h3 style="color: #243460;">Connect</h3>
        <p>Follow Aarogya Aadhar on:</p>
        <div style="display: flex; align-items: center; gap: 10px; padding-top: 10px;">
          <a href="https://www.instagram.com/bharat_aarogya_aadhar" style="padding: 10px; border-radius: 50%; text-decoration: none;">
            <p>Instagram |</p>
          </a>
          <a href="https://www.facebook.com/profile.php?id=61554162329099" style="padding: 10px; border-radius: 50%; text-decoration: none;">
            <p>Facebook |</p>
          </a>
          <a href="#" style="padding: 10px; border-radius: 50%; text-decoration: none;">
            <p>Twitter |</p>
          </a>
          <a href="https://www.linkedin.com/company/aarogya-aadhar" style="padding: 10px; border-radius: 50%; text-decoration: none;">
            <p>LinkedIn |</p>
          </a>
          <a href="https://youtu.be/T5BCaTuZUpY" style="padding: 10px; border-radius: 50%; text-decoration: none;">
            <p>YouTube</p>
          </a>
        </div>
        <p><a href="https://aarogyaaadhar.com/" target="_blank">Website</a></p>
        <hr/>   
        <p style="font-size: 12px; color: #999;">This E-Mail may contain Confidential and/or legally privileged Information and is meant for the intended recipient(s) only. If you have received this e-mail in error and are not the intended recipient/s, kindly delete this e-mail immediately from your system. You are also hereby notified that any use, any form of reproduction, dissemination, copying, disclosure, modification, distribution and/or publication of this e-mail, its contents or its attachment/s other than by its intended recipient/s is strictly prohibited and may be construed unlawful. Internet Communications cannot be guaranteed to be secure or error-free as information could be delayed, intercepted, corrupted, lost, or may contain viruses. Aarogya Aadhar does not accept any liability for any errors, omissions, viruses or computer shutdown (s) or any kind of disruption/denial of services if any experienced by any recipient as a result of this e-mail.</p>
      </div>
    `,
  };

  // Send OTP via email
  await transporter.sendMail(mailOptions);

  setTimeout(async () => {
    await db.ContactRequestOTP.deleteMany({
      where: {
        email,
        otp,
      },
    });
    console.log(`OTP for ${email} deleted after 5 minutes.`);
  }, 5 * 60 * 1000); // 5 minutes in milliseconds

  return new Response(JSON.stringify({ success: true, message: "OTP sent!" }), {
    status: 200,
  });
}
