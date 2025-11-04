import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { format } from "date-fns";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { bookingId, preferredDate, preferredTimeSlot } = body;

    if (!bookingId || !preferredDate || !preferredTimeSlot) {
      return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
    }

    const dateOnly = new Date(preferredDate).toISOString().split("T")[0];

    // Check if slot is already taken
    const existing = await db.BookLabTest.findMany({
      where: {
        preferredDate: {
          gte: new Date(`${dateOnly}T00:00:00Z`),
          lte: new Date(`${dateOnly}T23:59:59Z`),
        },
        preferredTimeSlot,
        NOT: { id: bookingId },
      },
    });

    if (existing.length > 0) {
      return NextResponse.json({ message: "Time slot already booked" }, { status: 409 });
    }

    // Update the booking
    const updated = await db.BookLabTest.update({
      where: { id: bookingId },
      data: {
        preferredDate: new Date(preferredDate),
        preferredTimeSlot,
        status: "PENDING",
      },
      include: {
        patient: true,
        service: true,
        Hospital: true,
      },
    });

    // Send confirmation email
    await sendConfirmationEmail(updated.patient.email, {
      name: updated.patient.name,
      serviceName: updated.service.name,
      date: preferredDate,
      time: preferredTimeSlot,
    });

    return NextResponse.json({ success: true, updated }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}

async function sendConfirmationEmail(email, { name, serviceName, date, time }) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const formattedDate = format(new Date(date), "MMMM dd, yyyy");

  const htmlContent = `
    <h2>Appointment Rescheduled Successfully</h2>
    <p>Dear ${name},</p>
    <p>Your labtest service appointment has been successfully rescheduled.</p>
    <p><strong>Service:</strong> ${serviceName}</p>
    <p><strong>Date:</strong> ${formattedDate}</p>
    <p><strong>Time:</strong> ${time}</p>
    <p>Thank you for choosing our services!</p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: "Rescheduled Appointment Confirmation",
    html: htmlContent,
  });
}
