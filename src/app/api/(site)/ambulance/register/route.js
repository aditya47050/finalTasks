import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { db } from "@/lib/db"; // Ensure your db connection is set up properly
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { mobile, email, password, pincode, category } = await request.json();

    // Check if the email is already registered
    const existingUser = await db.Ambulance.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Ambulance already registered" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const user = await db.Ambulance.create({
      data: { category, mobile, email, pincode, password: hashedPassword },
    });

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // or any email service you are using
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email app password
      },
    });

    // Create the email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Ambulance Registration Successful",
      text: `Dear ${category},\n\nThank you for registering your ambulance service. Below are your details:\n\nCategory: ${category}\nMobile: ${mobile}\nPincode: ${pincode}\n\nIf you did not register, please contact us immediately.\n\nBest regards,\n Aarogya Rakshak Team`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return success response
    return NextResponse.json(
      { success: true, message: "New Ambulance created and email sent", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
