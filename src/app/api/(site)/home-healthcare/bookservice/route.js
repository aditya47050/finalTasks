import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const { patientId, homeHealthcareId, preferredDate, preferredTimeSlot, notes } = await request.json();

    // Validate required fields
    if (!patientId || !homeHealthcareId || !preferredDate || !preferredTimeSlot) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the home healthcare service exists and is available
    const homeHealthcareService = await db.homeHealthcare.findUnique({
      where: { id: homeHealthcareId },
    });

    if (!homeHealthcareService || !homeHealthcareService.isAvailable) {
      return NextResponse.json(
        { success: false, message: "Service not available" },
        { status: 404 }
      );
    }

    // Create the booking
    const booking = await db.bookHomeHealthcare.create({
      data: {
        patientId,
        homeHealthcareId,
        preferredDate: new Date(preferredDate),
        preferredTimeSlot,
        notes,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Home healthcare service booked successfully",
      bookingId: booking.id,
    });
  } catch (error) {
    console.error("Error booking home healthcare service:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}