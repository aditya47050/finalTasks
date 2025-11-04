import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generateEmailContent } from "@/lib/bedmails";
import { getLoggedInUser } from "@/lib/getLoggedInUser";

export async function POST(request) {
  const body = await request.json();
  const {
    userId,
    bedId,
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    gender,
    aadharCardNumber,
    mobileNumber,
    email,
    hospitalType,
    bedCategory,
    advanceSearch,
    hospitalName,
    pinCode,
    city,
    aadharCardImage,
    medicaldoc1,
    medicaldoc2,
    medicaldoc3,
    medicaldoc4,
    medicaldoc5,
    healthInsurance,
    healthInsuranceNumber,
    healthInsuranceDocument,
    ayushmancard,
    ayushmanCardNumber,
    ayushmanCardFront,
    bloodGroup,
    diseaseDetails,
  } = body;

  const loggedIn = await getLoggedInUser();
    if (!loggedIn) {
    return NextResponse.json(
      { success: false, error: "Please login to book." },
      { status: 401 }
    );
  }
  const id = loggedIn.id;
  const formattedAdvanceSearch = Array.isArray(advanceSearch)
    ? advanceSearch.join(", ")
    : advanceSearch || "N/A";

  let patient;
  let hospitalEmail = null;
  let hospitalId = null;

  // -------------------------------
  // CASE 1: If userId is provided
  // -------------------------------
  if (id) {
    patient = await db.Patient.findUnique({ where: { id: id } });

    if (!patient) {
      return NextResponse.json(
        { success: false, error: "Patient with provided userId not found." },
        { status: 404 }
      );
    }

    let bed,
      hospitalNameResolved = hospitalName,
      pinCodeResolved = pinCode,
      cityResolved = city,
      bedCategoryResolved = bedCategory

    // If bedId is provided, get bed details
    if (bedId) {
      bed = await db.Bed.findFirst({
        where: { id: bedId },
        select: {
          id: true,
          category: true,
          hospitalId: true,
          hospital: {
            select: {
              hspInfo: {
                select: {
                  regname: true,
                },
              },
              hspcontact: {
                select: {
                  city: true,
                },
              },
              pincode: true,
            },
          },
        },
      });

      // Override booking fields from bed relations
      bedCategoryResolved = bed.category?.name || bedCategory;
      hospitalNameResolved = bed.hospital?.hspInfo.regname || hospitalName;
      pinCodeResolved = bed.hospital?.pincode || pinCode;
      cityResolved = bed.hospital?.hspcontact.city || city;
      hospitalId = bed.hospitalId;
      hospitalId = bed.hospitalId;
      hospitalEmail = bed.hospital?.hspInfo.email || null;
    }

    // Use provided data if available, otherwise fallback to existing patient data
    const booking = await db.BedBooking.create({
      data: {
        firstName: firstName || patient.firstName || "",
        middleName: middleName || patient.middleName,
        lastName: lastName || patient.lastName || "",
        dateOfBirth: dateOfBirth || patient.dateOfBirth || null,
        gender: gender || patient.gender || "Unknown",
        aadharCardNumber: aadharCardNumber || patient.aadharCardNumber || "N/A",
        mobileNumber: mobileNumber || patient.mobile,
        email: email || patient.email,
        hospitalType,
        bedCategory: bedCategoryResolved,
        advanceSearch: formattedAdvanceSearch,
        hospitalName: hospitalNameResolved,
        pinCode: pinCodeResolved,
        city: cityResolved,
        bed: {
          connect: {
            id: bedId
          }
        },
        patient: {
          connect: {
            id: patient.id
          }
        },
        hospital: hospitalId ? { connect: { id: hospitalId } } : undefined,
        aadharCardImage,
        medicaldoc1,
        medicaldoc2,
        medicaldoc3,
        medicaldoc4,
        medicaldoc5,
        healthInsurance: healthInsurance === "Yes",
        healthInsuranceNumber,
        healthInsuranceDocument,
        ayushmancard: ayushmancard === "Yes",
        ayushmanCardNumber,
        ayushmanCardFront,
        bloodgroup: bloodGroup,
        diseaseDetails,
        bookedByType: loggedIn.bookedByType,
        bookedById: loggedIn.id,
        hspRole: loggedIn.hspRole,
      },
    });
    await db.Bed.update({
      where: { id: bedId },
      data: {
        status: "BOOKED",
      },
    });

    // Send email to hospital
    if (hospitalEmail) {
      await sendEmailToHospital(hospitalEmail, {
        patientName: `${firstName} ${lastName}`,
        bookingDate: new Date().toLocaleDateString(),
        bookingTime: new Date().toLocaleTimeString(),
        bedType: bedCategoryResolved,
        insuranceDetails: healthInsurance === "Yes",
        mobileNumber,
      });
    }

    // Send email to patient
    await sendEmailToPatient(email, {
      patientName: `${firstName} ${lastName}`,
      bookingDate: new Date().toLocaleDateString(),
      bookingTime: new Date().toLocaleTimeString(),
      bedType: bedCategoryResolved,
      insuranceDetails: healthInsurance === "Yes",
      mobileNumber,
      hospitalName: hospitalNameResolved,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Bed booking created for existing patient.",
        booking,
      },
      { status: 201 }
    );
  }

  // -------------------------------
  // CASE 2: If no userId, register new patient and create booking
  // -------------------------------
  patient = await db.Patient.findUnique({ where: { id } });

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

    await sendTempPasswordEmail(email, tempPassword);
  }

  const booking = await db.BedBooking.create({
    data: {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      gender,
      aadharCardNumber,
      mobileNumber,
      email,
      hospitalType,
      bedCategory,
      advanceSearch: formattedAdvanceSearch,
      hospitalName,
      pinCode,
      city,
      bed: {
        connect: {
          id: bedId
        }
      },
      patient: {
        connect: {
          id: patient.id
        }
      },
       hospital: hospitalId ? { connect: { id: hospitalId } } : undefined,
      aadharCardImage,
      medicaldoc1,
      medicaldoc2,
      medicaldoc3,
      medicaldoc4,
      medicaldoc5,
      healthInsurance: healthInsurance === "Yes",
      healthInsuranceNumber,
      healthInsuranceDocument,
      ayushmancard: ayushmancard === "Yes",
      ayushmanCardNumber,
      ayushmanCardFront,
      bloodgroup: bloodGroup,
      diseaseDetails,
            bookedByType: loggedIn.bookedByType,
      bookedById: loggedIn.id,
      hspRole: loggedIn.hspRole,
    },
  });

  await db.Bed.update({
    where: { id: bedId },
    data: {
      status: "BOOKED",
    },
  });

  // Send email to hospital
  if (hospitalEmail) {
    await sendEmailToHospital(hospitalEmail, {
      patientName: `${firstName} ${lastName}`,
      bookingDate: new Date().toLocaleDateString(),
      bookingTime: new Date().toLocaleTimeString(),
      bedType: bedCategory,
      insuranceDetails: healthInsurance === "Yes",
      mobileNumber,
    });
  }

  // Send email to patient
  await sendEmailToPatient(email, {
    patientName: `${firstName} ${lastName}`,
    bookingDate: new Date().toLocaleDateString(),
    bookingTime: new Date().toLocaleTimeString(),
    bedType: bedCategory,
    insuranceDetails: healthInsurance === "Yes",
    mobileNumber,
    hospitalName,
  });

  return NextResponse.json(
    {
      success: true,
      message: "New patient registered and bed booking created.",
      booking,
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

async function sendEmailToHospital(hospitalEmail, data) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailContent = generateEmailContent("BOOKED", data);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: hospitalEmail, // Use the hospital's email address
    subject: `Bed Booking Request - ${data.hospitalName}`,
    html: emailContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to hospital successfully");
  } catch (error) {
    console.error("Error sending email to hospital:", error);
  }
}

async function sendEmailToPatient(email, data) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailContent = generateEmailContent("BOOKED", data);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Bed Booking Confirmation - ${data.hospitalName}`,
    html: emailContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to patient successfully");
  } catch (error) {
    console.error("Error sending email to patient:", error);
  }
}