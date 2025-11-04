import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  const { mobile, email, password, pincode } = await request.json();

  // Check if the email is already registered for pharmacy
  const existingPharmacy = await db.Pharmacy.findUnique({ where: { email } });
  if (existingPharmacy) {
    return NextResponse.json(
      { success: false, message: "Email already registered" },
      { status: 400 }
    );
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new pharmacy user
  const pharmacy = await db.Pharmacy.create({
    data: { mobile, email, pincode, password: hashedPassword },
  });

  // Send welcome email
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Aarogya Aadhar – Pharmacy Account Successfully Created!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p style="font-size: 14px; color: #555;">This is an Automatic Mail, Don’t Reply</p>
          <h3>Dear ${email},</h3>
          <p>Welcome to the Aarogya Aadhar Family!</p>
          <p>Your pharmacy account has been successfully created. You can now log in and manage your pharmacy services.</p>
          
          <h4>Account Details:</h4>
          <ul>
            <li><strong>Phone No:</strong> ${mobile}</li>
            <li><strong>Email Address:</strong> ${email}</li>
            <li><strong>Account Type:</strong> Pharmacy</li>
          </ul>
          
          <h4>To Get Started:</h4>
          <ol>
            <li>Login Here: <a href="https://aarogyaaadhar.com/pharmacy/login" target="_blank">Pharmacy Login</a></li>
          </ol>

          <p>If you didn’t initiate this registration or have any questions, feel free to contact our support team at 
          <a href="mailto:pharmacy@aarogyaaadhar.com">pharmacy@aarogyaaadhar.com</a>.</p>
          
          <p>Thank you for joining Aarogya Aadhar!</p>
          
          <a href="https://aarogyaaadhar.com/" target="_blank">
            <p>Best Regards,<br/>Aarogya Rakshak Team</p>
            <img src="https://res.cloudinary.com/dnckhli5u/image/upload/v1728891425/Picture1_c31red.png" 
                 alt="Aarogya Aadhar Logo" 
                 style="width: 100%; max-height: 400px;" />
          </a>
          
          <hr/>
          <h3 style="color: #243460;">Connect</h3>
          <div style="display: flex; gap: 10px; padding-top: 10px;">
            <a href="https://www.instagram.com/bharat_aarogya_aadhar" target="_blank">Instagram |</a>
            <a href="https://www.facebook.com/profile.php?id=61554162329099" target="_blank">Facebook |</a>
            <a href="#" target="_blank">Twitter |</a>
            <a href="https://www.linkedin.com/company/aarogya-aadhar" target="_blank">LinkedIn |</a>
            <a href="https://youtu.be/T5BCaTuZUpY" target="_blank">YouTube</a>
          </div>
          <p><a href="https://aarogyaaadhar.com/" target="_blank">Website</a></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Pharmacy welcome email sent successfully to:", email);
  } catch (error) {
    console.error("Failed to send pharmacy welcome email:", error);
  }

  return NextResponse.json(
    { success: true, message: "New Pharmacy created", pharmacy },
    { status: 201 }
  );
}
