import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { bookingId, type, report, receipt } = await request.json();

    if (!bookingId || !type) {
      return NextResponse.json(
        { success: false, error: "bookingId and type are required" },
        { status: 400 }
      );
    }

    let updatedBooking;

    switch (type) {
      case "LabTest":
        updatedBooking = await db.bookLabTest.update({
          where: { id: bookingId },
          data: { report, receipt },
        });
        break;

      case "Wellness":
        updatedBooking = await db.bookWellnesspackage.update({
          where: { id: bookingId },
          data: { report, receipt },
        });
        break;

      case "Bloodbank":
        updatedBooking = await db.bookBloodbank.update({
          where: { id: bookingId },
          data: { report, receipt },
        });
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Invalid booking type" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, updatedBooking });
  } catch (err) {
    console.error("Error updating booking:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
