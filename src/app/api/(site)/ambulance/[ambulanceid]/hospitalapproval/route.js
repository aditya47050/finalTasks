import { db } from "@/lib/db";
import { NextResponse } from "next/server";
// import nodemailer from "nodemailer"; // 

export async function POST(req, { params }) {
  try {
    const { ambulanceid } = params; // no need to await
    const { hospitalId, approved, rejectionNote } = await req.json();

    if (!hospitalId || !ambulanceid) {
      return NextResponse.json(
        { error: "Hospital ID and Ambulance ID are required" },
        { status: 400 }
      );
    }

    // 🔹 Check if record already exists
    let existing = await db.hospitalAmbulance.findFirst({
      where: { hospitalId, ambulanceId: ambulanceid },
      include: { hospital: true, ambulance: true },
    });

    let updatedAssociation;
    if (existing) {
      // 🔹 Update existing
      updatedAssociation = await db.hospitalAmbulance.update({
        where: { id: existing.id },
        data: {
          status: approved ? "APPROVED" : "REJECTED",
          remark: approved ? null : rejectionNote || null,
          approvedBy: "ambulance", // you can pass logged-in user instead
          approvedAt: new Date(),
        },
        include: { hospital: true, ambulance: true },
      });
    } else {
      // 🔹 Create new if not found
      updatedAssociation = await db.hospitalAmbulance.create({
        data: {
          hospitalId,
          ambulanceId: ambulanceid,
          status: approved ? "APPROVED" : "REJECTED",
          remark: approved ? null : rejectionNote || null,
          approvedBy: "ambulance",
          approvedAt: new Date(),
        },
        include: { hospital: true, ambulance: true },
      });
    }


    /*
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const subject = approved
      ? "Ambulance Association Approved"
      : "Ambulance Association Rejected";

    const message = approved
      ? `Dear ${updatedAssociation.hospital.name},\n\nThe ambulance (${updatedAssociation.ambulance.category}, ${updatedAssociation.ambulance.mobile}) has been successfully associated with your hospital.\n\nRegards,\nAarogya Aadhar`
      : `Dear ${updatedAssociation.hospital.name},\n\nThe association request for ambulance (${updatedAssociation.ambulance.category}, ${updatedAssociation.ambulance.mobile}) has been rejected.\n\nReason: ${rejectionNote || "No reason provided"}\n\nRegards,\nAarogya Aadhar`;

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
        message: "Hospital approval updated (email disabled)",
        data: updatedAssociation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating hospital approval:", error);
    return NextResponse.json(
      { error: "Failed to update hospital approval" },
      { status: 500 }
    );
  }
}
