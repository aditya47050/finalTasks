// route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // make sure lib/db exports `db`
import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function PUT(request, { params }) {
  try {
    const { bookingId } = await params;
    const body = await request.json();

    // Validate input
    if (!body.approvalStatus || !["APPROVED", "REJECTED"].includes(body.approvalStatus)) {
      return NextResponse.json(
        { error: "Invalid approval status. Must be 'APPROVED' or 'REJECTED'" },
        { status: 400 }
      );
    }

    // Find the booking with relations
    const booking = await db.bookAmbulance.findUnique({
      where: { id: bookingId },
      include: {
        patient: true,
        ambulanceVaichicle: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Prepare transaction
    const updateData = {
      status: body.approvalStatus === "APPROVED" ? "CONFIRMED" : "REJECTED",
      remark: body.remark || null,
      approvedBy: "Admin", // Or get from session
      approvedAt: new Date(),
    };

    const transaction = [
      db.bookAmbulance.update({
        where: { id: bookingId },
        data: updateData,
        include: { patient: true, ambulanceVaichicle: true },
      }),
    ];

    // Only update vehicle status if approved and vehicle exists
    if (body.approvalStatus === "APPROVED" && booking.ambulanceVaichicleId) {
      transaction.push(
        db.ambulanceVaichicle.update({
          where: { id: booking.ambulanceVaichicleId },
          data: { 
            status: "BOOKED",
            approvalStatus: "APPROVED" 
          },
        })
      );
    } else if (body.approvalStatus === "REJECTED" && booking.ambulanceVaichicleId) {
      transaction.push(
        db.ambulanceVaichicle.update({
          where: { id: booking.ambulanceVaichicleId },
          data: { 
            status: "AVAILABLE",
            approvalStatus: "REJECTED",
            adminRemarks: body.remark || null
          },
        })
      );
    }

    // Execute transaction
    const [updatedBooking, updatedVehicle] = await db.$transaction(transaction);

    // Send email notification
    if (updatedBooking.patient?.email || updatedBooking.email) {
      const email = updatedBooking.patient?.email || updatedBooking.email;
      const subject =
        body.approvalStatus === "APPROVED"
          ? "Your Ambulance Booking is Confirmed"
          : "Your Ambulance Booking Request";
      
      const html = `
        <p>Dear ${updatedBooking.firstName},</p>
        <p>Your ambulance booking (ID: ${updatedBooking.id}) has been ${
        body.approvalStatus === "APPROVED" ? "approved" : "rejected"
      }.</p>
        ${body.remark ? `<p><strong>Remarks:</strong> ${body.remark}</p>` : ""}
        <p>Thank you for using our service.</p>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        booking: updatedBooking,
        vehicle: updatedVehicle || null,
      },
    });
  } catch (error) {
    console.error("Approval error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
