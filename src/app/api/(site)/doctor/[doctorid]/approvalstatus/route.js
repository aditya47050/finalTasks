import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to generate a unique and incremented card number
async function generateUniqueCardNumber() {
  const now = new Date();
  const datePart = `${now.getFullYear().toString().slice(-2)}${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;

  // Find the latest card number assigned
  const lastDoctor = await db.DoctorCertificate.findFirst({
    where: { cardNo: { startsWith: `DRS${datePart}` } },
    orderBy: { cardNo: "desc" },
  });

  let newNumber = 1; // Default if no previous records

  if (lastDoctor && lastDoctor.cardNo) {
    const lastNumber = parseInt(lastDoctor.cardNo.slice(-5), 10); // Extract last 5 digits
    newNumber = lastNumber + 1;
  }

  const newCardNo = `DRS${datePart}${String(newNumber).padStart(5, "0")}`;
  return newCardNo;
}

export async function PUT(request, context) {
  const { params } = await context; 
  const doctorId = params?.doctorid;

  if (!doctorId) {
    return NextResponse.json({ error: "Doctor ID is required." }, { status: 400 });
  }

  try {
    const { approvalStatus, remark } = await request.json();

    if (!approvalStatus) {
      return NextResponse.json({ error: "Approval status is required." }, { status: 400 });
    }

    const doctor = await db.Doctor.findUnique({ where: {id: doctorId } });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
    }

    let cardNo = null;

    if (approvalStatus === "APPROVED") {
      // Generate a new unique card number
      cardNo = await generateUniqueCardNumber();
    }

     // Check if DoctorCertificate exists
    const existingCertificate = await db.DoctorCertificate.findFirst({
      where: { doctorId },
    });

    let updatedCertificate;

    if (existingCertificate) {
      // Update existing certificate
      updatedCertificate = await db.DoctorCertificate.update({
        where: { id: existingCertificate.id },
        data: { approvalStatus, remarks: remark || null, cardNo },
      });
    } else {
      // Create new certificate
      updatedCertificate = await db.DoctorCertificate.create({
        data: {
          doctorId,
          approvalStatus,
          remarks: remark || null,
          cardNo,
        },
      });
    }

    try {
      // Send email notification
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: doctor.email,
        subject: `Your Profile Review Update - Aarogya Aadhar`,
        text: `Dear ${doctor.firstName},\n\nYour profile review status has been updated.\n\nApproval Status: ${approvalStatus}\n\n${cardNo ? `Your card number: ${cardNo}\n\n` : ""}Regards,\nAarogya Aadhar Team`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Approval status updated to ${approvalStatus} and email sent to:`, doctor.email);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    return NextResponse.json({ updatedCertificate, cardNo });
  } catch (error) {
    console.error("Error updating doctor certificate:", error);
    return NextResponse.json({ error: `An error occurred: ${error.message}` }, { status: 500 });
  }
}
