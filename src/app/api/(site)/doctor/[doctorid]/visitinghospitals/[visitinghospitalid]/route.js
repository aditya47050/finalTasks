import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function PUT(request, context) {
  const { doctorid, visitinghospitalid } = await context.params;
  const branchId = visitinghospitalid;

  try {
    const data = await request.json();

    const {
      hospitalname,
      hospitalconsultationfee,
      hospitalinouttime,
      hospitalconsultationdays,
      hospitalcontactno,
      pincode,
      state,
      district,
      presentAddress,
      taluka,
      city,
    } = data;

    // Verify the branch exists
    const branch = await db.DoctorVisitingHospitals.findFirst({
      where: {
        id: branchId,
        doctorid,
      },
    });

    if (!branch) {
      return NextResponse.json(
        { error: "Hospital not found for this doctor." },
        { status: 404 }
      );
    }

    // Update branch
    const updatedBranch = await db.DoctorVisitingHospitals.update({
      where: { id: branchId },
      data: {
        doctorid,
        hospitalname,
        hospitalconsultationfee,
        hospitalinouttime,
        hospitalconsultationdays,
        hospitalcontactno,
        pincode,
        state,
        district,
        presentAddress,
        taluka,
        city,
      },
    });

    // Fetch doctor info
    const doctor = await db.Doctor.findUnique({
      where: { id: doctorid },
    });

    if (!doctor?.email) {
      return NextResponse.json(
        { error: "Doctor email not found." },
        { status: 404 }
      );
    }

     // Get hospital email from doctor (assuming it's stored in the doctor's record or related model)
    const hospitalEmail = doctor.email; // Change this if the hospital's email is elsewhere

    // Email setup
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: hospitalEmail,
      subject: "Hospital Information Updated - Aarogya Aadhar",
      html: `
        <p>Hello,</p>
        <p>The following hospital information has been updated for your hospital:</p>
        <p><strong>Hospital Name:</strong> ${hospitalname}</p>
        <p><strong>Consultation Fee:</strong> ${hospitalconsultationfee}</p>
        <p><strong>In/Out Time:</strong> ${hospitalinouttime}</p>
        <p><strong>Consultation Days:</strong> ${hospitalconsultationdays}</p>
        <p><strong>Contact No:</strong> ${hospitalcontactno}</p>
        <p>Best regards,<br/>Aarogya Aadhar Team</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(" Update notification email sent to:", doctor.email);
    } catch (mailErr) {
      console.error("⚠️ Email sending failed:", mailErr.message);
      // don’t block the API response if email fails
    }

    return NextResponse.json(updatedBranch);
  } catch (error) {
    console.error("❌ Error updating branch information:", error);
    return NextResponse.json(
      { error: "An error occurred: " + error.message },
      { status: 500 }
    );
  }
}
