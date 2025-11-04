import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

import { db } from "@/lib/db"; // Make sure your db connection is correctly set up
import { NextResponse } from "next/server";

const transporter = nodemailer.createTransport({
  service: "gmail", // Replace with your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});
export async function POST(request) {
  const { mobile, email, password, pincode } = await request.json();

  // Check if the email is already registered
  const existingUser = await db.Patient.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { success: false, message: "Email already registered" },
      { status: 400 }
    );
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user in the database
  const user = await db.Patient.create({
    data: { mobile, email, pincode, password: hashedPassword },
  });

  // Try to send the welcome email and log the result
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Aarogya Aadhar – Your Account Successfully Created!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p style="font-size: 14px; color: #555;">This is an Automatic Mail, Don’t Reply</p>
      <h3>Dear ${email},</h3>
      <p>Welcome to the Aarogya Aadhar Family!</p>
      <p>We are excited to inform you that your account has been successfully created. You can now log in to our portal, complete your profile information, and start exploring all the features and benefits we offer.</p>
      
      <h4>Your Account Details:</h4>
      <ul>
        <li><strong>Phone No:</strong> ${mobile}</li>
        <li><strong>Email Address:</strong> ${email}</li>
        <li><strong>Account Type:</strong>  "Basic"</li>
      </ul>
      
      <h4>To Get Started:</h4>
      <ol>
        <li>Login Here: <a href="https://aarogyaaadhar.com/patient/login" target="_blank">Login Page</a></li>
        <li>Explore Features: <a href="https://www.youtube.com/watch?v=BN7mtt8dZVk&t=12s" target="_blank">Aarogya Aadhar Health Card Overview</a></li>
      </ol>

      <p>If you didn’t initiate this registration or have any questions, feel free to contact our support team at <a href="mailto:patient@aarogyaaadhar.com">patient@aarogyaaadhar.com</a> or call us at +91 79-72-72-7498 & +91 91-45-07-8001.</p>
      
      <p>Thank you for choosing Aarogya Aadhar. We look forward to serving you!</p>
      
      <a href="https://aarogyaaadhar.com/" target="_blank">
        <p>Best Regards,<br/>Aarogya Rakshak Team</p>
        <img src="https://res.cloudinary.com/dnckhli5u/image/upload/v1728891425/Picture1_c31red.png" alt="Aarogya Aadhar Logo" style="width: 100%; max-height: 400px;" />
      </a>
      
      <hr/>
      <h3 style="color: #243460;">Connect</h3>
      <p>Follow Aarogya Aadhar on:</p>
      <div style="display: flex; align-items: center; gap: 10px; padding-top: 10px;">
        <a href="https://www.instagram.com/bharat_aarogya_aadhar" target="_blank" style="text-decoration: none; color: inherit;">Instagram |</a>
        <a href="https://www.facebook.com/profile.php?id=61554162329099" target="_blank" style="text-decoration: none; color: inherit;">Facebook |</a>
        <a href="#" target="_blank" style="text-decoration: none; color: inherit;">Twitter |</a>
        <a href="https://www.linkedin.com/company/aarogya-aadhar" target="_blank" style="text-decoration: none; color: inherit;">LinkedIn |</a>
        <a href="https://youtu.be/T5BCaTuZUpY" target="_blank" style="text-decoration: none; color: inherit;">YouTube</a>
      </div>
      <p><a href="https://aarogyaaadhar.com/" target="_blank">Website</a></p>
      
      <hr/>
      <p style="font-size: 12px; color: #999;">
        This E-Mail may contain Confidential and/or legally privileged Information and is meant for the intended recipient(s) only. If you have received this e-mail in error and are not the intended recipient, kindly delete this e-mail immediately from your system. Any use, reproduction, dissemination, copying, disclosure, modification, distribution, or publication of this e-mail, its contents, or its attachments other than by the intended recipient is strictly prohibited and may be unlawful. Internet communications cannot be guaranteed to be secure or error-free, as information could be delayed, intercepted, corrupted, lost, or may contain viruses. Aarogya Aadhar does not accept liability for any errors, omissions, viruses, or any disruption if any experienced by the recipient due to this e-mail.
      </p>
    </div>
      `,
    };

    // Send OTP via email
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully to:", email);
  } catch (error) {
    console.error("Failed to send welcome email to:", email, "Error:", error);
  }

  return NextResponse.json(
    { success: true, message: "New Patient created", user },
    { status: 201 }
  );
}
