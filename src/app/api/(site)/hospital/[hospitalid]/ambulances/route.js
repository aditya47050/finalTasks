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
    const { ambulances } = await req.json();

    if (!ambulances || ambulances.length === 0) {
      return NextResponse.json(
        { error: "Hospital ID and ambulances are required" },
        { status: 400 }
      );
    }

    console.log("Received ambulances:", ambulances);
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

    // 🔹 Check if ambulances are already assigned to this hospital
    const existingAmbulances = await db.hospitalAmbulance.findMany({
      where: {
        hospitalId,
        ambulanceId: { in: ambulances },
      },
    });

    const existingAmbulanceIds = new Set(
      existingAmbulances.map((d) => d.ambulanceId)
    );

    // 🔹 Filter out ambulances that are already assigned
    const newAmbulances = ambulances.filter(
      (id) => !existingAmbulanceIds.has(id)
    );

    if (newAmbulances.length === 0) {
      return NextResponse.json(
        {
          error: "All selected ambulances are already assigned to this hospital",
        },
        { status: 400 }
      );
    }

    console.log("New ambulances being added:", newAmbulances);

    // 🔹 Get details of new ambulances
    const ambulanceList = await db.ambulance.findMany({
      where: { id: { in: newAmbulances } },
    });

    if (ambulanceList.length === 0) {
      return NextResponse.json(
        { error: "No valid ambulances found" },
        { status: 404 }
      );
    }

    // 🔹 Add new ambulances to HospitalAmbulance table
    const hospitalAmbulanceEntries = newAmbulances.map((ambulanceId) => ({
      hospitalId,
      ambulanceId,
      status: "PENDING"
    }));

    await db.hospitalAmbulance.createMany({ data: hospitalAmbulanceEntries });

    // 🔹 Verify that ambulances were added
    const addedAmbulances = await db.hospitalAmbulance.findMany({
      where: { hospitalId },
    });

    console.log("Ambulances now in hospital:", addedAmbulances);

    // 🔹 Send Emails to Newly Added ambulances
    await Promise.all(
      ambulanceList.map(async (ambulance) => {
        const mailOptions = {
          from: `"${hospital.hspInfo?.regname || "Hospital"}" <${
            process.env.EMAIL_USER
          }>`,

          to: ambulance.email,
          subject: `You've been assigned to ${hospital.hspInfo?.regname} as an Ambulance`,
          html: `
            <p>Dear Ambulance Service Provider,</p>
            <p>We are pleased to inform you that your ambulance has been requested to be associated with <strong>${hospital.hspInfo?.regname}</strong>.</p>
              <p>Please log in to your account to approve or reject this request.</p>
            <p>Best Regards,</p>
            <p><strong>${hospital.hspInfo?.regname}</strong></p>
          `,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Email sent to: ${ambulance.email}`);
        } catch (error) {
          console.error(`Failed to send email to ${ambulance.email}:`, error);
        }
      })
    );

    return NextResponse.json(
      { message: "Ambulances added successfully and emails sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding ambulances:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
