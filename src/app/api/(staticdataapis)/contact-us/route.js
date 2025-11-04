import nodemailer from "nodemailer";
import { db } from "@/lib/db"; // Ensure your DB connection is correctly set up
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Parse the incoming request data
    const { fullname, email, mobile, message } = await request.json();

    // Save the contact message to the database
    const ContactMessage = await db.ContactUs.create({
      data: { fullname, email, message, mobile },
    });

    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gmail", // Or another email service like SMTP
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    // Prepare the email content for the applicant
    const mailOptionsToApplicant = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for Reaching Out",
      html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #555;">
      <p style="font-size: 14px;">This is an Automatic Mail, Don’t Reply</p>
      <h3 style="color: #243460;">Dear ${fullname},</h3>
      <p>Thank you for contacting us through our website! We’ve received your inquiry and will get back to you as soon as possible. Our Aarogya Aadhar team is committed to providing timely support, and you can expect a response within <strong>48 Working Hours</strong> or <strong>Two Business Days</strong>.</p>
      <p>If your matter is urgent, please feel free to reach out to our support team at:</p>
      <ul style="list-style-type: none; padding: 0;">
        <li><strong>Phone:</strong> +91 79-72-72-7498, +91 91-45-07-8001</li>
        <li><strong>Email:</strong> <a href="mailto:patient@aarogyaaadhar.com">patient@aarogyaaadhar.com</a></li>
      </ul>
      <p>Thank you for choosing Aarogya Aadhar. We look forward to assisting you!</p>
      <hr/>
      <a href="https://aarogyaaadhar.com/" target="_blank">
        <p>Best Regards,<br/>Aarogya Rakshak Team</p>
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

    // Prepare the email content for the admin
    const mailOptionsToAdmin = {
      from: process.env.EMAIL_USER,
      to: "abhishekpuranikpd@gmail.com", // Admin's email address
      subject: "New Contact Us Message",
      html: `
        <h3>New Contact Us Message</h3>
        <p><strong>Full Name:</strong> ${fullname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    // Send the email to the applicant (thank you for the message)
    await transporter.sendMail(mailOptionsToApplicant);

    // Send the email to the admin (new contact us message)
    await transporter.sendMail(mailOptionsToAdmin);

    // Return success response
    return NextResponse.json(
      { success: true, message: "New Message Found", ContactMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing contact message:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error processing message",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
