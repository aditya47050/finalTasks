import bcrypt from "bcryptjs";
import { db } from "@/lib/db"; // Ensure your db connection is correctly set up
import { NextResponse } from "next/server";
import nodemailer from "nodemailer"; // For sending emails
import { generateEmailContent } from "@/lib/bookingmail";
import { sendEmail } from "@/lib/mailer";

export async function POST(request) {
  const formData = await request.formData();

  const data = {
    firstName: formData.get("firstName"),
    middleName: formData.get("middleName"),
    lastName: formData.get("lastName"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender"),
    aadharCardNumber: formData.get("aadharCardNumber"),
    mobileNumber: formData.get("mobileNumber"),
    email: formData.get("email"),
    ambulancetype: formData.get("ambulancetype"),
    hospitaltype: formData.get("hospitaltype"),
    ambulancecategory: formData.get("ambulancecategory"),
    aadharCardImage: formData.get("aadharCardImage"),
    healthcard: formData.get("healthcard"),
    medicaldoc1: formData.get("medicaldoc1"),
    medicaldoc2: formData.get("medicaldoc2"),
    medicaldoc3: formData.get("medicaldoc3"),
    healthInsurance: formData.get("healthInsurance"),
    healthInsuranceNumber: formData.get("healthInsuranceNumber"),
    healthInsuranceDocument: formData.get("healthInsuranceDocument"),
    ayushmancard: formData.get("ayushmancard"),
    ayushmanCardNumber: formData.get("ayushmanCardNumber"),
    ayushmanCardFront: formData.get("ayushmanCardFront"),
    bloodGroup: formData.get("bloodGroup"),
    diseaseDetails: formData.get("diseaseDetails"),
    ambulanceVaichicleId: formData.get("ambulanceVaichicleId"),
  };

  const {
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    gender,
    aadharCardNumber,
    mobileNumber,
    email,
    ambulancetype,
    hospitaltype,
    ambulancecategory,
    aadharCardImage,
    healthcard,
    medicaldoc1,
    medicaldoc2,
    medicaldoc3,
    healthInsurance,
    healthInsuranceNumber,
    healthInsuranceDocument,
    ayushmancard,
    ayushmanCardNumber,
    ayushmanCardFront,
    bloodGroup,
    diseaseDetails,
    ambulanceVaichicleId,
  } = data;

  // Check if a patient with the provided email already exists
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
        dateOfBirth: new Date(dateOfBirth), // Ensure date is correctly formatted
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

  // Create the new booking in the database linked to the patient
  const result = await db.BookAmbulance.create({
    data: {
      firstName,
      middleName,
      lastName,
      dateOfBirth: new Date(dateOfBirth), // Ensure date is correctly formatted
      gender,
      aadharCardNumber,
      mobileNumber,
      email,
      ambulancetype,
      hospitaltype,
      ambulancecategory,
      aadharCardImage,
      healthcard: healthcard === "true", // Convert to boolean
      medicaldoc1,
      medicaldoc2,
      medicaldoc3,
      healthInsurance: healthInsurance === "true", // Convert to boolean
      healthInsuranceNumber,
      healthInsuranceDocument,
      ayushmancard: ayushmancard === "true", // Convert to boolean
      ayushmanCardNumber,
      ayushmanCardFront,
      diseaseDetails,
      bloodgroup: bloodGroup,
      patientId: patient.id, // Link the booking to the patient
      ambulanceVaichicleId: ambulanceVaichicleId || null, // Handle optional field
    },
  });

  // Update the status of the ambulance vehicle to "BOOKED"
  if (ambulanceVaichicleId) {
    const updatedVehicle = await db.AmbulanceVaichicle.update({
      where: { id: ambulanceVaichicleId },
      data: { status: "BOOKED" },
      include: {
        driver: true,
        ambulance: {
          include: {
            AmbulanceHsp: true,
          },
        },
      },
    });

    // Prepare email data
    const emailData = {
      patientName: firstName,
      bookingDate: new Date().toLocaleDateString(),
      bookingTime: new Date().toLocaleTimeString(),
      ambulanceType: ambulancetype,
      hospitalType: hospitaltype,
      insuranceDetails: healthInsurance === "true" ? "Yes" : "No",
      mobileNumber: mobileNumber,
      hospitalName: updatedVehicle.ambulance?.AmbulanceHsp?.hspregname || "Aarogya Aadhar",
    };

    // Send booking confirmation email to patient
    await sendBookingConfirmationEmail(email, emailData);

    // Send booking request email to ambulance owner and driver
    if (updatedVehicle.ambulance?.email) {
      await sendEmail(updatedVehicle.ambulance.email, `Ambulance Booking Request - ${emailData.hospitalName}`, generateEmailContent("BOOKED", emailData));
    }
    if (updatedVehicle.driver?.email) {
      await sendEmail(updatedVehicle.driver.email, `Ambulance Booking Request - ${emailData.hospitalName}`, generateEmailContent("BOOKED", emailData));
    }
  }

  return NextResponse.json(
    { success: true, message: "Booking created successfully!", result },
    { status: 201 }
  );
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

async function sendBookingConfirmationEmail(email, bookingData) {
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
    subject: `Ambulance Booking Confirmation for ${bookingData.patientName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #555;">
        <h3 style="color: #243460;">Dear ${bookingData.patientName},</h3>
        <p>We are pleased to inform you that your ambulance booking has been successfully processed. Here are the details:</p>
        <ul>
          <li>Patient Name: ${bookingData.patientName}</li>
          <li>Booking Date: ${bookingData.bookingDate}</li>
          <li>Ambulance Type: ${bookingData.ambulanceType}</li>
          <li>Hospital Type: ${bookingData.hospitalType}</li>
          <li>Insurance Details: ${bookingData.insuranceDetails}</li>
          <li>Mobile No.: ${bookingData.mobileNumber}</li>
        </ul>
        <p>Our team will contact you shortly to confirm availability and complete the necessary procedures.</p>
        <p>For any urgent queries, please feel free to contact us.</p>
        <hr/>
        <p>Best Regards,<br/>Aarogya Aadhar Team</p>
        <a href="https://aarogyaaadhar.com/" target="_blank">
          <img src="https://res.cloudinary.com/dnckhli5u/image/upload/v1728891425/Picture1_c31red.png" alt="Aarogya Aadhar Logo" style="width: 100%; max-width: 400px;" />
        </a>
      </div>
    `,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
  }
}