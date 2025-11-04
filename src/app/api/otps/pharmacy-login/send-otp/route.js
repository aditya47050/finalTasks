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
  try {
    const { email, name } = await request.json(); // Assuming you're sending the user's name too

    // Check if the user exists
    const Pharmacy = await db.Pharmacy.findFirst({
      where: { email },
    });

    if (!Pharmacy) {
      return new Response(
        JSON.stringify({ success: false, message: "Pharmacy not found!" }),
        { status: 404 }
      );
    }

    // Delete the last OTP for the email, if it exists
    await db.LoginOtp.deleteMany({
      where: {
        email,
      },
    });

    // Generate a new 6-digit OTP
    const otp = randomInt(100000, 999999).toString();

    // Store the new OTP in the database with the current timestamp
    await db.LoginOtp.create({
      data: {
        email,
        otp,
        createdAt: new Date(), // Store the time the OTP was created
      },
    });

    // Email content with HTML formatting
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Aarogya Aadhar, OTP for Portal Services Login Credentials",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p style="font-size: 14px; color: #555;">This is an Automatic Mail, Don’t Reply</p>
          <h3>Dear User</h3>
          <p>To ensure the security of your account, a One-Time Password (OTP) has been generated for your login attempt. Please use the following OTP to complete your login:</p>
          <p style="font-size: 24px; font-weight: bold; color: #4CAF50;">Your OTP: ${otp}</p>
          <p>This OTP is valid for the next <strong>5 minutes</strong>. If you did not attempt to log in, please disregard this message or contact our support team immediately at <a href="mailto:patient@aarogyaaadhar.com">patient@aarogyaaadhar.com</a> or call us at +91 79-72-72-7498 & +91 91-45-07-8001.</p>
          <p><strong>For your security, please do not share this OTP with anyone.</strong></p>
          <p>Thank you for choosing Aarogya Aadhar Portal.</p>
          <hr/>
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
          <p style="font-size: 12px; color: #999;">This E-Mail may contain Confidential and/or legally privileged Information...</p>
        </div>
      `,
    };

    // Send OTP via email
    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent!" }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error during OTP process:", error);

    // Return a detailed error response
    return new Response(
      JSON.stringify({ success: false, message: "An error occurred while processing your request. Please try again." }),
      { status: 500 }
    );
  }
}
