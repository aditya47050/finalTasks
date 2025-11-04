// src/app/api/pathology/reschedule/route.js
import { db } from "@/lib/db"; // Make sure this is your Prisma client import
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { bookingId, preferredDate, preferredTimeSlot, status, type } = await request.json();

    if (!bookingId || !type) {
      return NextResponse.json({ success: false, error: "bookingId and type are required" }, { status: 400 });
    }

    let updatedBooking;

    switch (type) {
      case "LabTest":
        updatedBooking = await db.bookLabTest.update({
          where: { id: bookingId },
          data: {
            preferredDate: preferredDate ? new Date(preferredDate) : null,
            preferredTimeSlot: preferredTimeSlot || null,
            status,
          },
        });
        break;

      case "Wellness":
        updatedBooking = await db.bookWellnesspackage.update({
          where: { id: bookingId },
          data: {
            preferredDate: preferredDate ? new Date(preferredDate) : null,
            preferredTimeSlot: preferredTimeSlot || null,
            status,
          },
        });
        break;

      case "Bloodbank":
        updatedBooking = await db.bookBloodbank.update({
          where: { id: bookingId },
          data: {
            preferredDate: preferredDate ? new Date(preferredDate) : null,
            preferredTimeSlot: preferredTimeSlot || null,
            status,
          },
        });
        break;

      default:
        return NextResponse.json({ success: false, error: "Invalid booking type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, updatedBooking });
  } catch (err) {
    console.error("Error updating booking:", err);
    return NextResponse.json({ success: false, error: err.message || "Something went wrong" }, { status: 500 });
  }
}
