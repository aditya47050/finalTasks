import { db } from "@/lib/db"; // Prisma client import
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send an email
async function sendEmail(mailOptions) {
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", mailOptions.to);
  } catch (error) {
    console.error("Failed to send email to:", mailOptions.to, "Error:", error);
  }
}

function generateEmailTemplate(firstName) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h3>Dear ${firstName},</h3>
      <p>Thank you for updating your profile with Aarogya Aadhar. Your changes have been received and are currently under review by our Aarogya Rakshak Team. We will notify you once the verification process is complete. In the meantime, your account will remain active, but certain services may be temporarily unavailable until the review is finished.</p>
      
      <h4>What Happens Next:</h4>
      <ul>
        <li>Our Aarogya Rakshak Team is reviewing your profile updates.</li>
        <li>You will receive a confirmation email once the review is complete.</li>
        <li>The process typically takes 48 business hours.</li>
        <li>If your profile information is not correct, we will block your profile on our end.</li>
        <li>If your account is blocked, please email <a href="mailto:patient@aarogyaaadhar.com">patient@aarogyaaadhar.com</a> or contact us at +91 79-72-72-7498 & +91 91-45-07-8001.</li>
        <li>When your account is unblocked, you will be able to access your profile page and update the correct information.</li>
        <li>Aarogya Aadhar allows a total of three attempts to update your account profile.</li>
      </ul>

      <p>If you have any questions or need further assistance during this period, please feel free to contact our support team at <a href="mailto:patient@aarogyaaadhar.com">patient@aarogyaaadhar.com</a> or call us at +91 79-72-72-7498 & +91 91-45-07-8001.</p>

      <p>We appreciate your patience and understanding!</p>
   
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
    </div>
  `;
}

// PUT Handler
export async function PUT(request, { params }) {
  const id = params.patientid;

  try {
    const data = await request.formData();
    const emaildata = await db.Patient.findUnique({ where: { id } });
    const cardNo = await generateUniqueCardNumber();
    if (!emaildata) {
      return NextResponse.json(
        { error: "Patient not found." },
        { status: 404 }
      );
    }

    // Parse formData and handle booleans properly
    const formData = Object.fromEntries(data);
    const patientUpdateData = {
      ...formData,
      hasPanCard: formData.hasPanCard === "true",
      ayushmancard: formData.ayushmancard === "true",
      isCompanyRegistered: formData.isCompanyRegistered === "true",
      income: formData.income === "true",
    };

    // Remove empty or undefined fields
    Object.keys(patientUpdateData).forEach((key) => {
      if (!patientUpdateData[key]) delete patientUpdateData[key];
    });

    const updatedPatient = await db.$transaction(async (prisma) => {
      const patientUpdate = await prisma.Patient.update({
        where: { id },
        data: patientUpdateData,
      });

      // Check if a HealthCard exists, then update or create
      const healthCardData = {
        firstName: patientUpdate.firstName || emaildata.firstName,
        middleName: patientUpdate.middleName || emaildata.middleName,
        lastName: patientUpdate.lastName || emaildata.lastName,
        dateOfBirth: patientUpdate.dateOfBirth || emaildata.dateOfBirth,
        gender: patientUpdate.gender || emaildata.gender,
        city: patientUpdate.city || emaildata.city,
        aadharCardNumber: emaildata.aadharCardNumber,
        mobileNumber: emaildata.mobile,
        email: emaildata.email,
        approvalStatus: "SUBMITTED",
        requestfrom: "Profile",
        cardNo,
      };

      await prisma.HealthCard.upsert({
        where: { email: emaildata.email },
        update: healthCardData,
        create: { ...healthCardData, patientId: id },
      });

      return patientUpdate;
    },
  { timeout: 20000 });

    // Send email after the transaction
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emaildata.email,
      subject: "Profile Update Under Review - Aarogya Aadhar",
      html: generateEmailTemplate(
        patientUpdateData.firstName || emaildata.firstName
      ),
    };

    sendEmail(mailOptions);

    return NextResponse.json({
  success: true,
  message: "Application Submitted successfully!",
  patient: updatedPatient,
});
  } catch (error) {
    console.error("Error updating patient:", error);
return NextResponse.json(
  { success: false, message: `An error occurred: ${error.message}` },
  { status: 500 }
);

  }
}

async function generateUniqueCardNumber() {
  const now = new Date();
  const datePart = `${now.getFullYear().toString().slice(-2)}${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;

  let uniqueNumber;
  let isUnique = false;

  while (!isUnique) {
    uniqueNumber =
      "PTS" + datePart + Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    const existingCard = await db.HealthCard.findFirst({
      where: { cardNo: uniqueNumber },
    });

    if (!existingCard) {
      isUnique = true;
    }
  }

  return uniqueNumber;
}
