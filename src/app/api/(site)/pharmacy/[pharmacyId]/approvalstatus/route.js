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

// Function to generate a unique and incremented card number for pharmacy
async function generateUniquePharmacyCardNumber() {
  const now = new Date();
  const datePart = `${now.getFullYear().toString().slice(-2)}${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;

  // Find the latest card number assigned
  const lastPharmacy = await db.PharmacyCertificate.findFirst({
    where: { cardNo: { startsWith: `PHR${datePart}` } },
    orderBy: { cardNo: "desc" },
  });

  let newNumber = 1; // Default if no previous records

  if (lastPharmacy && lastPharmacy.cardNo) {
    const lastNumber = parseInt(lastPharmacy.cardNo.slice(-5), 10); // Extract last 5 digits
    newNumber = lastNumber + 1;
  }

  const newCardNo = `PHR${datePart}${String(newNumber).padStart(5, "0")}`;
  return newCardNo;
}

export async function PUT(request, context) {
  const { params } = await context; 
  const pharmacyId = params?.pharmacyId;

  if (!pharmacyId) {
    return NextResponse.json({ error: "Pharmacy ID is required." }, { status: 400 });
  }

  try {
    const { approvalStatus, remark } = await request.json();

    if (!approvalStatus) {
      return NextResponse.json({ error: "Approval status is required." }, { status: 400 });
    }

    const pharmacy = await db.Pharmacy.findUnique({ where: { id: pharmacyId } });

    if (!pharmacy) {
      return NextResponse.json({ error: "Pharmacy not found." }, { status: 404 });
    }

    let cardNo = null;

    if (approvalStatus === "APPROVED") {
      // Generate a new unique card number
      cardNo = await generateUniquePharmacyCardNumber();
    }

    // Check if PharmacyCertificate exists
    const existingCertificate = await db.PharmacyCertificate.findFirst({
      where: { pharmacyId },
    });

    let updatedCertificate;

    if (existingCertificate) {
      // Update existing certificate
      updatedCertificate = await db.PharmacyCertificate.update({
        where: { id: existingCertificate.id },
        data: { approvalStatus, remarks: remark || null, cardNo },
      });
    } else {
      // Create new certificate
      updatedCertificate = await db.PharmacyCertificate.create({
        data: {
          pharmacyId,
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
        to: pharmacy.email,
        subject: `Your Pharmacy Profile Review Update - Aarogya Aadhar`,
        text: `Dear ${pharmacy.regname || 'Pharmacy Owner'},\n\nYour pharmacy profile review status has been updated.\n\nApproval Status: ${approvalStatus}\n\n${cardNo ? `Your pharmacy certificate number: ${cardNo}\n\n` : ""}Regards,\nAarogya Aadhar Team`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Pharmacy approval status updated to ${approvalStatus} and email sent to:`, pharmacy.email);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    return NextResponse.json({ updatedPharmacyCertificate: updatedCertificate, cardNo });
  } catch (error) {
    console.error("Error updating pharmacy certificate:", error);
    return NextResponse.json({ error: `An error occurred: ${error.message}` }, { status: 500 });
  }
}