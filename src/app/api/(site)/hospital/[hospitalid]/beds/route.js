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
  try {
    const hospitalId = params.hospitalid;

    if (!hospitalId) {
      return NextResponse.json(
        { error: "Hospital ID is missing." },
        { status: 400 }
      );
    }

    const data = await request.json(); // Changed to parse JSON payload

    // Extract bed details
    const { bedtype, bedcount, chargetype, isavilable, minprice, maxprice } =
      data;

    // Verify the hospital exists
    const hospital = await db.Hospital.findUnique({
      where: { id: hospitalId },
    });

    if (!hospital) {
      return NextResponse.json(
        { error: "Hospital not found." },
        { status: 404 }
      );
    }

    // Create a new bed and associate it with the hospital
    const newBed = await db.Bed.create({
      data: {
        bedtype,
        bedcount: bedcount.toString(),
        chargetype,
        isavilable : isavilable === "true",
        minprice: minprice.toString(),
        maxprice: maxprice.toString(),
     
        hospital: {
            connect: { id: hospitalId }, // Link the bed to the hospital
          },
      },
    });

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: hospital.email,
      subject: "New Bed Added - Aarogya Aadhar",
      html: `<p>Hello,</p>
             <p>A new bed has been added to your hospital:</p>
             <p><strong>Bed Type:</strong> ${bedtype.replace(/_/g, " ")}</p>
             <p><strong>Charge Type:</strong> ${chargetype}</p>
             <p><strong>Available:</strong> ${isavilable ? "Yes" : "No"}</p>
             <p><strong>Price Range:</strong> ₹${minprice} - ₹${maxprice}</p>
             <p>Best regards,<br/>Aarogya Aadhar Team</p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(newBed);
  } catch (error) {
    console.error("Error adding new bed:", error);
    return NextResponse.json(
      { error: "An error occurred: " + error.message },
      { status: 500 }
    );
  }
}
