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
async function generateUniqueCardNumber() {
  const now = new Date();
  const datePart = `${now.getFullYear().toString().slice(-2)}${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;

  // Find the latest card number assigned
  const lastHospital = await db.HospitalCertificate.findFirst({
    where: { cardNo: { startsWith: `DRS${datePart}` } },
    orderBy: { cardNo: "desc" },
  });

  let newNumber = 1; // Default if no previous records

  if (lastHospital && lastHospital.cardNo) {
    const lastNumber = parseInt(lastHospital.cardNo.slice(-5), 10); // Extract last 5 digits
    newNumber = lastNumber + 1;
  }

  const newCardNo = `DRS${datePart}${String(newNumber).padStart(5, "0")}`;
  return newCardNo;
}
export async function PUT(request) {
  try {
    // Extract hospitalId from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const hospitalId = pathParts[pathParts.length - 2]; // Gets ID from /api/hospital/[id]/approval

    if (!hospitalId) {
      return NextResponse.json(
        { error: "Hospital ID is required." },
        { status: 400 }
      );
    }

    // Validate MongoDB ID format
    if (!/^[0-9a-fA-F]{24}$/.test(hospitalId)) {
      return NextResponse.json(
        { error: "Invalid Hospital ID format." },
        { status: 400 }
      );
    }

    const { action, remark } = await request.json();

    // Validate action
    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject".' },
        { status: 400 }
      );
    }

        // Additional validation for rejection with empty remark and no issues
    if (action === "reject" && (!remark || remark.trim() === "")) {
      return NextResponse.json(
        { error: "Rejection requires either a remark or selected issues." },
        { status: 400 }
      );
    }

    const approvalStatus = action === "approve" ? "APPROVED" : "REJECTED";

    // Update hospital status - using Prisma's update
    const updatedHospital = await db.hospital.update({
      where: { id: hospitalId },
      data: {
        approvalStatus,
        adminRemarks: remark || null,
        updatedAt: new Date(),
      },
      include: {
        hspInfo: true,
        hspcontact: true,
        hspdetails: true
      }
    });

    if (!updatedHospital) {
      return NextResponse.json(
        { error: "Hospital not found." },
        { status: 404 }
      );
    }
    let cardNo = null;

    if (approvalStatus === "APPROVED") {
      // Generate a new unique card number
      cardNo = await generateUniqueCardNumber();
    }

     // Check if DoctorCertificate exists
    const existingCertificate = await db.HospitalCertificate.findFirst({
      where: { hospitalId },
    });

    let updatedCertificate;

    if (existingCertificate) {
      // Update existing certificate
      updatedCertificate = await db.HospitalCertificate.update({
        where: { id: existingCertificate.id },
        data: { approvalStatus, remarks: remark || null, cardNo },
      });
    } else {
      // Create new certificate
      updatedCertificate = await db.HospitalCertificate.create({
        data: {
          hospitalId,
          approvalStatus,
          remarks: remark || null,
          cardNo,
        },
      });
    }
    // Prepare email notification (similar to health card approval)
    const hospitalName = updatedHospital.hspInfo?.regname || "Your Hospital";
    const contactPerson = updatedHospital.hspcontact?.contactPersonName || "Hospital Administrator";
    const hospitalEmail = updatedHospital.email;

    if (hospitalEmail) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: hospitalEmail,
          subject: approvalStatus === "APPROVED" 
            ? `${hospitalName} - Registration Approved` 
            : `${hospitalName} - Registration Update`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <p style="font-size: 14px; color: #555;">This is an Automatic Mail, Don't Reply</p>
              <h3>Dear ${contactPerson},</h3>
              
              ${approvalStatus === "APPROVED" ? `
                <p>We are pleased to inform you that your hospital registration has been approved.</p>
                <p><strong>Hospital Name:</strong> ${hospitalName}</p>
                <p><a href="https://aarogyaaadhar.com/hospital/login" style="color: #0066cc;">Login to your dashboard</a> to complete the setup process.</p>
              ` : `
               <p>We regret to inform you that your hospital registration application has been rejected.</p>
          ${remark.includes("Issues:") ? `
            <p><strong>Reasons for rejection:</strong></p>
            <ul style="margin-left: 20px;">
              ${remark.split("\n").slice(1).map(issue => 
                `<li>${issue.replace("- ", "").trim()}</li>`
              ).join("")}
            </ul>
          ` : `
            <p><strong>Reason:</strong> ${remark || "Please contact support for details"}</p>
          `}
        `}
              
              <p>For any queries, contact our support team:</p>
              <ul>
                <li>Email: hospital.support@aarogyaaadhar.com</li>
                <li>Phone: +91 79-72-72-7498</li>
              </ul>
              
              <div style="margin-top: 20px; text-align: center;">
                <img src="https://res.cloudinary.com/dnckhli5u/image/upload/v1728891425/Picture1_c31red.png" 
                     alt="Aarogya Aadhar Logo" 
                     style="max-width: 200px;">
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Notification email sent to ${hospitalEmail}`);
      } catch (emailError) {
        console.error("Failed to send notification email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedHospital.id,
        name: hospitalName,
        approvalStatus: approvalStatus,
        updatedAt: updatedHospital.updatedAt
      }
    });

  } catch (error) {
    console.error("Hospital approval error:", error);
    return NextResponse.json(
      { error: "Internal server error processing approval" },
      { status: 500 }
    );
  }
}