import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/lib/db";

// 🔹 Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email (set in .env)
    pass: process.env.EMAIL_PASS, // Your app password (set in .env)
  },
});

export async function POST(req, { params }) {
  try {
    const hospitalId = params.hospitalid;
    const { doctors } = await req.json();

    if (!doctors || doctors.length === 0) {
      return NextResponse.json(
        { error: "Hospital ID and doctors are required" },
        { status: 400 }
      );
    }

    console.log("Received doctors:", doctors);
    console.log("Hospital ID:", hospitalId);

    // 🔹 Check if hospital exists
    const hospital = await db.hospital.findFirst({
      where: { id: hospitalId },
      include: { hspInfo: true }, // Get hospital name
    });

    if (!hospital) {
      return NextResponse.json(
        { error: "Hospital not found" },
        { status: 404 }
      );
    }

    // 🔹 Check if doctors are already assigned to this hospital
    const existingDoctors = await db.hospitalDoctor.findMany({
      where: {
        hospitalId,
        doctorId: { in: doctors },
      },
    });

    const existingDoctorIds = new Set(existingDoctors.map((d) => d.doctorId));

    // 🔹 Filter out doctors who are already assigned
    const newDoctors = doctors.filter((id) => !existingDoctorIds.has(id));

    if (newDoctors.length === 0) {
      return NextResponse.json(
        { error: "All selected doctors are already assigned to this hospital" },
        { status: 400 }
      );
    }

    console.log("New doctors being added:", newDoctors);

    // 🔹 Get details of new doctors
    const doctorList = await db.doctor.findMany({
      where: { id: { in: newDoctors } },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    if (doctorList.length === 0) {
      return NextResponse.json(
        { error: "No valid doctors found" },
        { status: 404 }
      );
    }

    // 🔹 Add new doctors to HospitalDoctor table
    const hospitalDoctorEntries = newDoctors.map((doctorId) => ({
      hospitalId,
      doctorId,
    }));

    await db.hospitalDoctor.createMany({ data: hospitalDoctorEntries });

    // 🔹 Verify that doctors were added
    const addedDoctors = await db.hospitalDoctor.findMany({
      where: { hospitalId },
    });

    console.log("Doctors now in hospital:", addedDoctors);

    // 🔹 Send Emails to Newly Added Doctors
    await Promise.all(
      doctorList.map(async (doctor) => {
        const mailOptions = {
          from: `"${hospital.hspInfo?.regname || "Hospital"}" <${
            process.env.EMAIL_USER
          }>`,
          to: doctor.email,
          subject: `You've been added as a Doctor at ${hospital.hspInfo?.regname}`,
          html: `
            <p>Dear Dr. ${doctor.firstName} ${doctor.lastName},</p>
            <p>We are pleased to inform you that we have requested to add as a doctor at <strong>${hospital.hspInfo?.regname}</strong>.</p>
            <p>Please log in to your account for further details.</p>
            <p>Best Regards,</p>
            <p><strong>${hospital.hspInfo?.regname}</strong></p>
          `,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Email sent to: ${doctor.email}`);
        } catch (error) {
          console.error(`Failed to send email to ${doctor.email}:`, error);
        }
      })
    );

    return NextResponse.json(
      { message: "Doctors added successfully and emails sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding doctors:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
