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
  const { name, email, password } = await request.json(); // Assuming role is passed in the request

  // Check if the email is already registered
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { success: false, message: "Email already registered" },
      { status: 400 }
    );
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user in the database
  const user = await db.user.create({
    data: { name, email, password: hashedPassword }, // Include role in the user creation
  });

  // Send email notification
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Profile has been Created by Admin - Aarogya Aadhar",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p style="font-size: 14px; color: #555;">This is an Automatic Mail, Don’t Reply</p>
          <h3>Dear ${name},</h3>
          <p>We are pleased to inform you that your profile has been successfully created by our Admin Team on the Super Admin Panel.</p>
          
          <h4>Profile Details:</h4>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email Address:</strong> ${email}</li>
            <li><strong>Username:</strong> ${email}</li>
          </ul>
          
          <h4>Next Steps:</h4>
          <ul>
            <li><a href="https://aarogyaaadhar.com/login" style="text-decoration: none; color: #007BFF;">Login to your account</a></li>
            <li><a href="https://aarogyaaadhar.com/reset-password" style="text-decoration: none; color: #007BFF;">Set/Update your password</a></li>
            <li><a href="https://aarogyaaadhar.com/features" style="text-decoration: none; color: #007BFF;">Explore your account features</a></li>
          </ul>

          <p><strong>Note:</strong> Please do not share your login credentials with anyone.</p>

          <p>If you have any questions or need assistance regarding your profile, please feel free to reach out to our support team at <a href="mailto:patient@aarogyaaadhar.com">patient@aarogyaaadhar.com</a> or call us at +91 79-72-72-7498 & +91 91-45-07-8001.</p>

          <p>Thank you for being a part of Aarogya Rakshak Team!</p>

          <hr/>
          <p style="font-size: 12px; color: #999;">
            This E-Mail may contain Confidential and/or legally privileged Information and is meant for the intended recipient(s) only. If you have received this e-mail in error, kindly delete this e-mail immediately.
          </p>
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
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", email);
  } catch (error) {
    console.error("Failed to send email to:", email, "Error:", error);
  }

  return NextResponse.json(
    { success: true, message: "New user created and email sent", user },
    { status: 201 }
  );
}
