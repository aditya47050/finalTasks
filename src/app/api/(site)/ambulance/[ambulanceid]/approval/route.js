import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})
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
export async function PUT(request, context) {
 const { params } = context
  const ambulanceId = params?.ambulanceid

  if (!ambulanceId) {
    return NextResponse.json({ error: "Ambulance ID is required." }, { status: 400 })
  }

  try {
    const { action, remark } = await request.json()

    if (!action) {
      return NextResponse.json({ error: "Action is required." }, { status: 400 })
    }

    const ambulance = await db.Ambulance.findUnique({
      where: { id: ambulanceId },
    })

    if (!ambulance) {
      return NextResponse.json({ error: "Ambulance not found." }, { status: 404 })
    }

    const approvalStatus = action === "approve" ? "APPROVED" : "REJECTED"

    const updatedAmbulance = await db.Ambulance.update({
      where: { id: ambulanceId },
      data: {
        approvalStatus,
        adminRemarks: remark || null,
      },
    })
    let cardNo = null;
    
        if (approvalStatus === "APPROVED") {
          // Generate a new unique card number
          cardNo = await generateUniqueCardNumber();
        }
    
         // Check if DoctorCertificate exists
        const existingCertificate = await db.AmbulanceCertificate.findFirst({
          where: { ambulanceId },
        });
    
        let updatedCertificate;
    
        if (existingCertificate) {
          // Update existing certificate
          updatedCertificate = await db.AmbulanceCertificate.update({
            where: { id: existingCertificate.id },
            data: { approvalStatus, remarks: remark || null, cardNo },
          });
        } else {
          // Create new certificate
          updatedCertificate = await db.AmbulanceCertificate.create({
            data: {
              ambulanceId,
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
        to: ambulance.email,
        subject: `Your Ambulance Service Application Update - Aarogya Aadhar`,
        text: `Dear ${ambulance.ownerfirstname} ${ambulance.ownerlastname},\n\nYour ambulance service application has been ${approvalStatus.toLowerCase()}.\n\n${remark ? `Remarks: ${remark}\n\n` : ""}Regards,\nAarogya Aadhar Team`,
      }

      await transporter.sendMail(mailOptions)
      console.log(`Approval status updated to ${approvalStatus} and email sent to:`, ambulance.email)
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
    }

    return NextResponse.json({
      message: `Ambulance ${approvalStatus.toLowerCase()} successfully`,
      data: updatedAmbulance,
    })
  } catch (error) {
    console.error("Error updating ambulance:", error)
    return NextResponse.json({ error: `An error occurred: ${error.message}` }, { status: 500 })
  }
}
