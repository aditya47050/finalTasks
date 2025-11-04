import { db } from "@/lib/db";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.formData();

    const fullname = await data.get("fullname");
    const mobile = await data.get("mobile");
    const email = await data.get("email");
    const category = await data.get("category");
    const cv = await data.get("cv");

    // Save the career application to the database
    const Careerssite = await db.CareersSite.create({
      data: { fullname, email, category, mobile, cv },
    });

    // Construct the applicant data
    const applicantData = {
      fullname,
      email,
      mobile,
      category,
      cv,
    };

    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gmail", // Or another email service
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your email password or app password
      },
    });

    // Generate a random OTP

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: " Thank You for Your Application!",
      html: `
       <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #555;">
      <p style="font-size: 14px;">This is an Automatic Mail, Don’t Reply</p>
      <h3 style="color: #243460;">Dear ${fullname},</h3>
      <p>Thank you for your interest in joining Aarogya Aadhar! We’ve received your application request and appreciate the time you took to complete our career form.</p>
      <p>Our team is currently reviewing applications, and we will be in touch if your background and experience match the qualifications for this role. You can expect to hear back from us within <strong>07 Working Days</strong>.</p>
      <p>In the meantime, if you have any questions, please don’t hesitate to reach out by replying to this email.</p>
      <p>Thank you again for considering a career with us. We look forward to the possibility of working together!</p>
      <hr/>
      <a href="https://aarogyaaadhar.com/" target="_blank">
        <p>Best Regards,<br/>Aarogya Aadhar Team</p>
        <img src="https://res.cloudinary.com/dnckhli5u/image/upload/v1728891425/Picture1_c31red.png" alt="Aarogya Aadhar Logo" style="width: 100%; max-width: 400px;" />
      </a>
      <h3 style="color: #243460;">Connect</h3>
      <p>Follow Aarogya Aadhar on:</p>
      <div style="display: flex; gap: 10px; padding-top: 10px;">
        <a href="https://www.instagram.com/bharat_aarogya_aadhar" style="text-decoration: none; color: #555;">Instagram</a> |
        <a href="https://www.facebook.com/profile.php?id=61554162329099" style="text-decoration: none; color: #555;">Facebook</a> |
        <a href="#" style="text-decoration: none; color: #555;">Twitter</a> |
        <a href="https://www.linkedin.com/company/aarogya-aadhar" style="text-decoration: none; color: #555;">LinkedIn</a> |
        <a href="https://youtu.be/T5BCaTuZUpY" style="text-decoration: none; color: #555;">YouTube</a>
      </div>
      <p><a href="https://aarogyaaadhar.com/" target="_blank" style="text-decoration: none; color: #243460;">Visit Our Website</a></p>
      <hr/>
      <p style="font-size: 12px; color: #999;">
        This email may contain confidential and/or legally privileged information and is meant for the intended recipient(s) only. If you have received this email in error, please delete it immediately. Internet communications cannot be guaranteed to be secure or error-free as information could be delayed, intercepted, corrupted, or lost. Aarogya Aadhar does not accept any liability for errors, omissions, or disruptions caused by this email.
      </p>
    </div>
    `,
    };

    // Send the email to the applicant
    await transporter.sendMail(mailOptions);

    // Send email notification to the admin
    const adminEmail = "abhishekpuranikpd@gmail.com"; // Replace with your admin email
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: "New Career Application Received",
      html: `
        <h3>New Career Application</h3>
        <p><strong>Full Name:</strong> ${fullname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>CV:</strong> <a href="${cv}" target="_blank">View CV</a></p>
      `,
    };

    // Send the email to the admin
    await transporter.sendMail(adminMailOptions);

    return NextResponse.json(
      { success: true, message: "Application received", Careerssite },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing application:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error processing application",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
