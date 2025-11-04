import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generateEmailContent } from "@/lib/bedmails";

const validStatuses = [
  "AVAILABLE",
  "BOOKED",
  "RESERVED",
  "ADMITTED",
  "DISCHARGED",
  "AVAILABLE_SOON",
  "CONFIRMED",
];

export async function PATCH(req, { params }) {
  const bedId = params.bedid;

  try {
    const body = await req.json();
    const { status, doctorId } = body;

    // Validate status
    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Update bed status and connect doctor
    const updatedBed = await db.bed.update({
      where: { id: bedId },
      data: {
        status,
        doctor: {
          connect: { id: doctorId },
        },
      },
    });

    // Fetch hospital email and other necessary details
    const hospital = await db.hospital.findUnique({
      where: { id: updatedBed.hospitalId },
      select: { email: true, name: true },
    });

    // Generate email content based on status
    const emailContent = generateEmailContent(status, {
      patientName: updatedBed.patientName,
      bookingDate: updatedBed.bookingDate,
      bookingTime: updatedBed.bookingTime,
      bedType: updatedBed.bedType,
      insuranceDetails: updatedBed.insuranceDetails,
      mobileNumber: updatedBed.mobileNumber,
      hospitalName: hospital.name,
    });

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: '"Aarogya Aadhar" <your-email@gmail.com>',
      to: hospital.email,
      subject: `Bed Status Update: ${status}`,
      html: emailContent,
    });

    return NextResponse.json(updatedBed);
  } catch (error) {
    console.error("Error updating bed status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}