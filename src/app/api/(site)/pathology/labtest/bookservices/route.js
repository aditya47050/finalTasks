import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { format } from "date-fns";


export async function POST(req) {
  try {
    const body = await req.json();
    const { patientId, serviceId, hospitalId ,preferredDate, preferredTimeSlot, notes } =
      body;

    if (!patientId || !serviceId || !hospitalId || !preferredDate || !preferredTimeSlot) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const patient = await db.patient.findFirst({ where: { id: patientId } });
    const hospital = await db.Hospital.findFirst({ where: { id: hospitalId } });
    const email = patient?.email;
    if (!email) {
      return NextResponse.json(
        { message: "Patient email not found" },
        { status: 400 }
      );
    }

    const dateOnly = new Date(preferredDate).toISOString().split("T")[0];

    // Get all bookings on selected date
    const bookings = await db.BookLabTest.findMany({
      where: {
        preferredDate: {
          gte: new Date(`${dateOnly}T00:00:00Z`),
          lte: new Date(`${dateOnly}T23:59:59Z`),
        },
      },
      select: { preferredTimeSlot: true },
    });

    const takenSlots = bookings.map((b) => b.preferredTimeSlot);
    const isSlotAvailable = !takenSlots.includes(preferredTimeSlot);

    // Save booking anyway
    const booking = await db.BookLabTest.create({
      data: {
        patientId,
        serviceId,
        hospitalId,
        preferredDate: new Date(preferredDate),
        preferredTimeSlot,
        notes,
        status: "PENDING",
      },
    });

    const allSlots = generateTimeSlots("09:00", "17:00", 15);
    const availableSlots = allSlots.filter(
      (slot) => !takenSlots.includes(slot)
    );

    if (isSlotAvailable) {
      await sendConfirmationEmail(email, {
        bookingId: booking.id,
        patientId,
        serviceId,
        hospitalId,
        preferredDate: dateOnly,
        preferredTimeSlot,
      });
      return NextResponse.json(
        {
          success: true,
          message: "Slot booked. Confirmation email sent.",
          booking,
        },
        { status: 201 }
      );
    } else {
      await sendUnavailableEmail(email, {
        bookingId: booking.id,
        patientId,
        serviceId,
        hospitalId,
        date: dateOnly,
        availableSlots,
      });
      return NextResponse.json(
        {
          success: true,
          message: "Slot unavailable. Booking saved and email sent.",
          booking,
        },
        { status: 202 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// Generates 15-min interval slots between 09:00 and 17:00
function generateTimeSlots(startTime, endTime, interval) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const slots = [];
  const current = new Date();
  current.setHours(startHour, startMinute, 0, 0);
  const end = new Date();
  end.setHours(endHour, endMinute, 0, 0);

  while (current < end) {
    const hour = current.getHours().toString().padStart(2, "0");
    const minute = current.getMinutes().toString().padStart(2, "0");
    slots.push(`${hour}:${minute}`);
    current.setMinutes(current.getMinutes() + interval);
  }
  return slots;
}

// 📧 If slot is available
async function sendConfirmationEmail(
  email,
  { bookingId, patientId, serviceId, preferredDate, preferredTimeSlot }
) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const formattedDate = format(new Date(preferredDate), "MMMM dd, yyyy");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
        <img src="https://res.cloudinary.com/dnckhli5u/image/upload/v1724307243/aarogya%20aadhar/ytwdebp7hhsjd56z0vdb.png" alt="Company Logo" style="max-width: 150px; height: auto; margin-bottom: 10px;">
        <h1 style="color: #28a745; margin: 0;">Booking Confirmed!</h1>
      </div>
      <div style="padding: 20px 0;">
        <p style="font-size: 16px;">Dear Patient,</p>
        <p style="font-size: 16px;">Your labtest service has been successfully booked.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #eee; background-color: #f0f0f0; font-weight: bold;">Date:</td>
            <td style="padding: 8px; border: 1px solid #eee;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee; background-color: #f0f0f0; font-weight: bold;">Time:</td>
            <td style="padding: 8px; border: 1px solid #eee;">${preferredTimeSlot}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #eee; background-color: #f0f0f0; font-weight: bold;">Booking ID:</td>
            <td style="padding: 8px; border: 1px solid #eee;">${bookingId}</td>
          </tr>
        </table>
        <p style="font-size: 16px; margin-top: 20px;">Thank you for choosing our services! We look forward to seeing you.</p>
      </div>
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
        <p>&copy; ${new Date().getFullYear()}Aarogya Aadhar. All rights reserved.</p>
        <p>123 Health St, Wellness City, HC 12345</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: "Labtest Service Booking Confirmation",
    html: htmlContent,
  });
}

// 📧 If slot is not available
async function sendUnavailableEmail(
  email,
  { bookingId, patientId, serviceId, date, availableSlots }
) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://yourfrontend.com";
  const formattedDate = format(new Date(date), "MMMM dd, yyyy");

  const slotsHtml = availableSlots
    .map(
      (
        slot
      ) => `<li style="margin-bottom: 12px; padding: 12px 16px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
      <span style="font-weight: 600; font-size: 16px; color: #333;">
        ${slot}
      </span>
      <a href="${baseUrl}/labtest/reschedule-confirmation?bookingId=${bookingId}&patientId=${patientId}&serviceId=${serviceId}&preferredDate=${date}&preferredTimeSlot=${slot}"
         style="background-color: #007bff; color: #ffffff; padding: 8px 16px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600; display: inline-block;">
        Book Now
      </a>
    </li>`
    )
    .join("");
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
        <img src="https://res.cloudinary.com/dnckhli5u/image/upload/v1724307243/aarogya%20aadhar/ytwdebp7hhsjd56z0vdb.png" alt="Company Logo" style="max-width: 150px; height: auto; margin-bottom: 10px;">
        <h1 style="color: #dc3545; margin: 0;">Slot Unavailable</h1>
      </div>
      <div style="padding: 20px 0;">
        <p style="font-size: 16px;">Dear Patient,</p>
        <p style="font-size: 16px;">You requested a labtest service on <strong>${formattedDate}</strong>, but the selected time is already taken.</p>
        <p style="font-size: 16px; margin-top: 20px;">Here are some available time slots for your convenience:</p>
        <ul style="list-style: none; padding: 0; margin: 20px 0;">${slotsHtml}</ul>
        <p style="font-size: 16px; margin-top: 20px;">Click a "Book Now" link above to reschedule instantly.</p>
      </div>
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
        <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        <p>123 Health St, Wellness City, HC 12345</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Labtest Service Slot Unavailable - Please Reschedule",
    html: htmlContent,
  });
}
