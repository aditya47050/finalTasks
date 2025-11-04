import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const appointmentId = params.appointmentid;

  try {
    const body = await req.json();
    const { doctorId, status } = body;

    if (!doctorId || !status) {
      return NextResponse.json(
        { error: "doctorId and status are required" },
        { status: 400 }
      );
    }

    const updated = await db.BookFreeAppointment.update({
      where: { id: appointmentId },
      data: {
        doctor: {
          connect: { id: doctorId },
        },
        status,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ message: "Appointment updated", updated });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}
