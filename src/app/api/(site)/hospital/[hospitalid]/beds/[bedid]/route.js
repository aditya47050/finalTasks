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

export async function PUT(request, { params }) {
  const hospitalId = params.hospitalid; // Assume hospital ID is passed as a URL parameter
  const bedId = params.bedid; // Assume branch ID is also passed as a URL parameter

  try {
    const data = await request.json(); // Changed to parse JSON payload

    // Extract bed details
    const { bedtype, bedcount, chargetype, isavilable, minprice, maxprice } =
      data;

    // Verify the branch exists under the specified hospital
    const bed = await db.Bed.findFirst({
      where: {
        id: bedId,
        hospitalid: hospitalId, // Ensure this branch belongs to the specified hospital
      },
    });

    if (!bed) {
      return NextResponse.json(
        { error: "Bed not found for this hospital." },
        { status: 404 }
      );
    }

    // Update the existing branch
    const updatedBed = await db.Bed.update({
      where: { id: bed.id },

      data: {
        bedtype,
        bedcount: bedcount.toString(),
        chargetype,
        isavilable: isavilable === "true",
        minprice: minprice.toString(),
        maxprice: maxprice.toString(),
     
        hospital: {
          connect: { id: hospitalId }, // Link the bed to the hospital
        },
      },
    });

    // Send email notification for the update
    const hospital = await db.Hospital.findUnique({
      where: { id: hospitalId },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: hospital.email,
      subject: "Bed Information Updated - Aarogya Aadhar",
      html: `<p>Hello,</p>
             <p>The following bed information has been updated for your hospital:</p>
            `,
    };

    await transporter.sendMail(mailOptions);
    console.log(
      "Update notification email sent successfully to:",
      hospital.email
    );

    return NextResponse.json(updatedBed);
  } catch (error) {
    console.error("Error updating branch information:", error);
    return NextResponse.json(
      { error: "An error occurred: " + error.message },
      { status: 500 }
    );
  }
}
