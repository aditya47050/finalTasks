import bcrypt from "bcryptjs";
import { db } from "@/lib/db"; // Make sure your db connection is correctly set up
import { NextResponse } from "next/server";
import nodemailer from "nodemailer"; // For sending emails
import { getLoggedInUser } from "@/lib/getLoggedInUser";

export async function POST(request) {
  const {
    mobileNumber,
    email,
    pinCode,
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    gender,
    category, // This is now the string, e.g., "General Physician"
    aadharCardNumber,
    city,
    preferredDate, 
    preferredTime  
  } = await request.json();

  const loggedIn = await getLoggedInUser();

  // Validate required fields
  if (!mobileNumber || !email || !pinCode || !firstName || !lastName || !gender || !category || !city) {
    return NextResponse.json(
      { success: false, message: "Missing required fields." },
      { status: 400 }
    );
  }

  // Check if the patient with the provided email already exists
  let patient = await db.Patient.findUnique({ where: { email } });

  if (!patient) {
    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

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
        password: hashedPassword,
      },
    });

    try {
      await sendTempPasswordEmail(email, tempPassword);
    } catch (error) {
      console.error("Failed to send temporary password email:", error);
      return NextResponse.json(
        { success: false, message: "Failed to send temporary password email." },
        { status: 500 }
      );
    }
  }

  // Fetch the related ExpertDoctorsCategory record
  const expertDoctorsCategory = await db.ExpertDoctorsCategory.findFirst({
    where: { title: category },
  });

  if (!expertDoctorsCategory) {
    return NextResponse.json(
      { success: false, message: `Category '${category}' does not exist.` },
      { status: 400 }
    );
  }

  // Create the new booking
  const booking = await db.BookFreeAppointment.create({
    data: {
      mobileNumber,
      email,
      pinCode,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      gender,
      aadharCardNumber,
      city,
      status : "PENDING",
      patientId: patient.id,
      expertDoctorsCategoryId: expertDoctorsCategory.id, // Use the related ID
      preferredDate: preferredDate ? new Date(preferredDate) : null,
      preferredTime: preferredTime || null,
      bookedByType: loggedIn.bookedByType,
      bookedById: loggedIn.id,
      hospitalId: loggedIn.hospitalId,
      hspRole: loggedIn.hspRole,
    },
    include: {
      category: true, // Include the related category data in the response
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: "Booking created successfully!",
      booking: {
        ...booking,
        category: expertDoctorsCategory.title, // Include the title for clarity
      },
    },
    { status: 201 }
  );
}

// Function to generate a temporary password
function generateTempPassword() {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const specialChars = "@#$%^&*";
  
  const getRandomChar = (chars) => chars[Math.floor(Math.random() * chars.length)];
  
  // Ensuring at least one character from each required set
  const randomUppercase = getRandomChar(uppercase);
  const randomLowercase = getRandomChar(lowercase);
  const randomDigit = getRandomChar(digits);
  const randomSpecial = getRandomChar(specialChars);
  
  // Filling the rest of the password with random characters from all sets
  const allChars = uppercase + lowercase + digits + specialChars;
  const remainingChars = Array.from({ length: 4 }, () => getRandomChar(allChars)).join("");
  
  // Shuffle the characters to avoid predictable patterns
  const password = (randomUppercase + randomLowercase + randomDigit + randomSpecial + remainingChars)
    .split("")
    .sort(() => Math.random() - 0.5) // Randomize order
    .join("");
  
  return password;
}





async function sendTempPasswordEmail(email,  tempPassword) {
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
