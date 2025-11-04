import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export async function POST(request, { params }) {
  const doctorId = params.doctorid; // Get doctor ID from the URL

  try {
    // Parse JSON request body
    const data = await request.json();

    // Extract fields
    const {
      hospitalname,
      hospitalconsultationfee,
      hospitalinouttime,
      hospitalconsultationdays, // This is an array, we need to convert it
      hospitalcontactno,
      pincode,
      state,
      district,
      taluka,
      presentAddress,
      city,
    } = data;

    // Ensure Prisma gets a string, not an array
    const formattedConsultationDays = Array.isArray(hospitalconsultationdays)
      ? hospitalconsultationdays.join(",") // Convert ["Saturday", "Thursday"] → "Saturday,Thursday"
      : hospitalconsultationdays;

    // Ensure the doctor exists
    const doctor = await db.Doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
    }

    // Create a new hospital entry
    const newHospital = await db.DoctorVisitingHospitals.create({
      data: {
        doctorid: doctor.id,
        hospitalname,
        hospitalconsultationfee,
        hospitalinouttime,
        hospitalconsultationdays: formattedConsultationDays, // Store as a string
        hospitalcontactno,
        pincode,
        state,
        district,
        taluka,
        presentAddress,
        city,
      },
    });

    return NextResponse.json(newHospital);
  } catch (error) {
    console.error("Error creating new hospital:", error);
    return NextResponse.json(
      { error: "An error occurred: " + error.message },
      { status: 500 }
    );
  }
}

