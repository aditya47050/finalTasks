import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs"; // For hashing the temporary password
import nodemailer from "nodemailer"; // For sending emails

// Initialize Cloudinary once per environment
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request) {
  try {
    const data = await request.formData();
    const image = data.get("file");
    const email = data.get("email");
    const locateme = data.get("locateme");
    const ambulancecategory = data.get("ambulancecategory");
    const pinCode = data.get("pinCode");

    // Validate the input fields
    if (!email || !locateme || !ambulancecategory || !pinCode) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    // Validate if the image is provided
    if (!image) {
      return NextResponse.json(
        { success: false, message: "Image file is required." },
        { status: 400 }
      );
    }

    // Convert the image to base64
    const fileBuffer = await image.arrayBuffer();
    const mime = image.type;

    // Validate the image format
    if (!mime.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Invalid image format." },
        { status: 400 }
      );
    }

    const base64Data = Buffer.from(fileBuffer).toString("base64");
    const fileUri = `data:${mime};base64,${base64Data}`;

    // Upload image to Cloudinary
    let imageUrl;
    try {
      const result = await cloudinary.uploader.upload(fileUri, {
        invalidate: true,
      });
      imageUrl = result.secure_url;
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return NextResponse.json(
        { success: false, message: "Failed to upload image to Cloudinary." },
        { status: 500 }
      );
    }

    // Check if the patient with the provided email already exists
    let patient = await db.Patient.findUnique({ where: { email } });

    // If the patient does not exist, create a new patient entry
    if (!patient) {
      // Generate a temporary password
      const tempPassword = generateTempPassword();

      // Hash the temporary password
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      // Create the new patient record in the database
      patient = await db.Patient.create({
        data: {
          firstName,
          middleName,
          lastName,
          dateOfBirth,
          gender,
          aadharCardNumber,
          mobile: mobileNumber,
          email,
          password: hashedPassword, // Store the hashed password
        },
      });

      // Send email with the temporary password
      await sendTempPasswordEmail(email, tempPassword);
    }

    // Insert the new entry into the database
    try {
      const emergencyAmbulance = await db.EmergencyAmbulance.create({
        data: {
          email,
          locateme,
          ambulancecategory,
          image: imageUrl,
          pinCode,
          patientId: patient.id, // Link the booking to the patient
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Ambulance booked successfully",
          emergencyAmbulance,
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { success: false, message: "Failed to save booking information." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error booking ambulance:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred during the booking process.",
      },
      { status: 500 }
    );
  }
}

// Function to generate a temporary password
function generateTempPassword() {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const specialChars = "@#$%^&*";

  const getRandomChar = (chars) =>
    chars[Math.floor(Math.random() * chars.length)];

  // Ensuring at least one character from each required set
  const randomUppercase = getRandomChar(uppercase);
  const randomLowercase = getRandomChar(lowercase);
  const randomDigit = getRandomChar(digits);
  const randomSpecial = getRandomChar(specialChars);

  // Filling the rest of the password with random characters from all sets
  const allChars = uppercase + lowercase + digits + specialChars;
  const remainingChars = Array.from({ length: 4 }, () =>
    getRandomChar(allChars)
  ).join("");

  // Shuffle the characters to avoid predictable patterns
  const password = (
    randomUppercase +
    randomLowercase +
    randomDigit +
    randomSpecial +
    remainingChars
  )
    .split("")
    .sort(() => Math.random() - 0.5) // Randomize order
    .join("");

  return password;
}

async function sendTempPasswordEmail(email, tempPassword) {
  // Configure your email transport
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email service (e.g., Gmail)
    auth: {
      user: process.env.EMAIL_USER, // Your email address from environment variables
      pass: process.env.EMAIL_PASS, // Your email password or app password from environment variables
    },
  });

  // Define the email options
  const mailOptions = {
    from: process.env.EMAIL_USER, // Your email address
    to: email,
    subject: "Your Temporary Password for Account Access",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #555;">
        <p style="font-size: 14px;">This is an Automatic Mail, Don’t Reply</p>
        <h3 style="color: #243460;">Dear User,</h3>
        <p>We have received a request to reset the password associated with your account. As a security measure, we have generated a temporary password for you to access your account.</p>
        <p style="font-size: 20px; font-weight: bold; color: #4CAF50;">Temporary Password: ${tempPassword}</p>
        <h4 style="color: #243460;">Please Note:</h4>
        <ol>
          <li>This temporary password is only valid for <strong>24 hours</strong>. If you do not log in and reset your password within this timeframe, you may need to request another reset.</li>
          <li>We strongly recommend changing your password immediately upon login to secure your account.</li>
        </ol>
        <h4 style="color: #243460;">To Change Your Password:</h4>
        <ol>
          <li>Log in to your account with the temporary password.</li>
          <li>Go to the “Account Settings” or “Security Settings” section.</li>
          <li>Choose “Change Password” and follow the prompts to set a new password of your choice.</li>
        </ol>
        <p>If you did not request a password reset, please contact our support team immediately at 
          <a href="mailto:info@aarogyaaadhar.com" style="text-decoration: none; color: #243460;">info@aarogyaaadhar.com</a> 
          or call us at +91 79-72-72-7498 & +91 91-45-07-8001 to secure your account.</p>
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
          This email may contain confidential and/or legally privileged information and is intended for the designated recipient(s) only. If you have received this email in error, please delete it immediately. Internet communications cannot be guaranteed to be secure or error-free as information could be delayed, intercepted, corrupted, or lost. Aarogya Aadhar does not accept any liability for errors, omissions, or disruptions caused by this email.
        </p>
      </div>
    `,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Temporary password email sent successfully");
  } catch (error) {
    console.error("Error sending temporary password email:", error);
  }
}
