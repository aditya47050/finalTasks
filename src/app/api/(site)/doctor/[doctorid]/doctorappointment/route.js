import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getLoggedInUser } from "@/lib/getLoggedInUser";

export async function POST(request) {
  try {
    const {
      firstName,
        middleName,
      lastName,
      mobileNumber,
      email,
      city,
      pinCode,
      gender,
      expertDoctorsCategoryId,
      dateOfBirth,
      patientId,
      doctorId,
      preferredDate,
      preferredTime,
      notes
    } = await request.json();

        const loggedIn = await getLoggedInUser();

    const appointmentData = {
      firstName,
        middleName: middleName || null,
      lastName,
      mobileNumber,
      email,
      city: city || "",
      pinCode,
      gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      preferredDate: preferredDate ? new Date(preferredDate) : null,
      preferredTime: preferredTime || null,
      notes: notes || "",
      status: "PENDING",
      patient: { connect: { id: patientId } },
      doctor: { connect: { id: doctorId } },
      bookedByType: loggedIn.bookedByType,
      bookedById: loggedIn.id,
      hospitalId: loggedIn.hospitalId,
      hspRole: loggedIn.hspRole,
        ...(expertDoctorsCategoryId && {
    category: { connect: { id: expertDoctorsCategoryId } },
  }),
    };

    const appointment = await db.bookFreeAppointment.create({
      data: appointmentData,
      include: { category: true },
    });
    

    return NextResponse.json(
      {
        success: true,
        message: "Appointment booked successfully!",
        appointment: {
          ...appointment,
          category: appointment.category?.title || null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Appointment creation error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}