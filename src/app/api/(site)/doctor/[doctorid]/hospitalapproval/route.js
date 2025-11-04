import { db } from "@/lib/db";
import { NextResponse } from "next/server";
// import nodemailer from "nodemailer"; // Uncomment if email functionality is needed

export async function POST(req, { params }) {
  try {
    const { doctorid } = params;
    const { hospitalDoctorId, approved, rejectionNote } = await req.json();

    if (!hospitalDoctorId || !doctorid) {
      return NextResponse.json(
        { error: "HospitalDoctor ID and Doctor ID are required" },
        { status: 400 }
      );
    }

    // Verify the doctor exists
    const doctor = await db.Doctor.findUnique({
      where: { id: doctorid },
    });

    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      );
    }

    // Check if the HospitalDoctor association exists
    const existingAssociation = await db.HospitalDoctor.findUnique({
      where: { id: hospitalDoctorId },
      include: {
        hospital: {
          include: {
            hspInfo: true,
            hspcontact: true
          }
        },
        doctor: true
      }
    });

    if (!existingAssociation) {
      return NextResponse.json(
        { error: "Hospital-Doctor association not found" },
        { status: 404 }
      );
    }

    // Verify the doctor has permission to update this association
    if (existingAssociation.doctorId !== doctorid) {
      return NextResponse.json(
        { error: "Unauthorized to update this association" },
        { status: 403 }
      );
    }

    // Update the HospitalDoctor association
    const updatedAssociation = await db.HospitalDoctor.update({
      where: { id: hospitalDoctorId },
      data: {
        status: approved ? "APPROVED" : "REJECTED",
        remark: approved ? null : rejectionNote || null,
        approvedBy: doctor.name || doctor.email,
        approvedAt: new Date(),
      },
      include: {
        hospital: {
          include: {
            hspInfo: true,
            hspcontact: true
          }
        },
        doctor: true
      }
    });

    /*
    // Email notification (commented out for now)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const subject = approved
      ? "Doctor Association Approved"
      : "Doctor Association Rejected";

    const message = approved
      ? `Dear ${updatedAssociation.hospital.hspInfo?.regname || "Hospital"},\n\nDr. ${doctor.name} has been successfully associated with your hospital.\n\nRegards,\nAarogya Aadhar`
      : `Dear ${updatedAssociation.hospital.hspInfo?.regname || "Hospital"},\n\nThe association request for Dr. ${doctor.name} has been rejected.\n\nReason: ${rejectionNote || "No reason provided"}\n\nRegards,\nAarogya Aadhar`;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: updatedAssociation.hospital.email,
      subject,
      text: message,
    });
    */

    return NextResponse.json(
      {
        success: true,
        message: "Doctor hospital approval updated successfully",
        data: updatedAssociation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating doctor hospital approval:", error);
    return NextResponse.json(
      { error: "Failed to update doctor hospital approval" },
      { status: 500 }
    );
  }
}