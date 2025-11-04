import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { bookingId, preferredDate, preferredTimeSlot, status, notes, doctorIds } = body;
    console.log(doctorIds);
    if (!bookingId) {
      return NextResponse.json(
        { message: "Booking ID is required" },
        { status: 400 }
      );
    }

    const updatedBooking = await db.bookSurgeryTreatment.update({
      where: { id: bookingId },
      data: {
        preferredDate: preferredDate ? new Date(preferredDate) : undefined,
        preferredTimeSlot: preferredTimeSlot || undefined,
        status: status || undefined,
        notes: notes || undefined,
        // 🔹 Manage doctors (clear old ones and add new ones)
        doctors: {
          deleteMany: {}, // remove all old assigned doctors
          create: doctorIds?.map((id) => ({ doctorId: id })) || [],
        },
      },
      include: {
        patient: true,
        service: true,
        doctors: {
          include: {
            doctor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                mobile: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, message: "Surgery booking updated", updatedBooking },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update surgery booking error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
