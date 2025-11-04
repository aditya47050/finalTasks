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
  const id = params.hospitalid;

  try {
    const data = await request.formData();

    const hsplogo = data.get("hsplogo");
    const hspregno = data.get("hspregno");
    const hspregcertificate = data.get("hspregcertificate");
    const hspregdate = data.get("hspregdate");
    const nabhnablapproved = data.get("nabhnablapproved");
    const nabhnablcertificate = data.get("nabhnablcertificate");
    const nabhnabllevel = data.get("nabhnabllevel");
    const pancardno = data.get("pancardno");
    const pancardimg = data.get("pancardimg");
    const isoapproved = data.get("isoapproved");
    const bankname = data.get("bankname");
    const bankaccountno = data.get("bankaccountno");
    const ifsccode = data.get("ifsccode");
    const accounttype = data.get("accounttype");
    const cancelledcheque = data.get("cancelledcheque");
    const micrcode = data.get("micrcode");

    const hospital = await db.Hospital.findUnique({
      where: { id },
      include: { hspdetails: true },
    });

    if (!hospital) {
      return NextResponse.json({ error: "Hospital not found." }, { status: 404 });
    }

    let updatedHspdetails;
    if (hospital.hspdetails) {
      // Update existing HspInfo record
      updatedHspdetails = await db.Hspdetails.update({
        where: { id: hospital.hspdetails.id },
        data: {
            hsplogo,
            hspregno,
            hspregcertificate,
            hspregdate,
            nabhnablapproved,
            nabhnablcertificate,
            nabhnabllevel,
            pancardno,
            pancardimg,
            isoapproved,
            bankname,
            bankaccountno,
            ifsccode,
            accounttype,
            cancelledcheque,
            micrcode,
          },
      });
    } else {
      // Create a new HspInfo record and link it to the Hospital
      const newHspdetails = await db.Hspdetails.create({
        data: {
            hsplogo,
            hspregno,
            hspregcertificate,
            hspregdate,
            nabhnablapproved,
            nabhnablcertificate,
            nabhnabllevel,
            pancardno,
            pancardimg,
            isoapproved,
            bankname,
            bankaccountno,
            ifsccode,
            accounttype,
            cancelledcheque,
            micrcode,
          },
      });

      // Update the Hospital record to link to this new HspInfo record
      await db.Hospital.update({
        where: { id },
        data: { hspdetailsId: newHspdetails.id },
      });

      updatedHspdetails = newHspdetails;
    }

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: hospital.email,
      subject: "Your Profile Update is Under Review - Aarogya Aadhar",
      // Email HTML content here
    };

    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully to:", hospital.email);

    return NextResponse.json(updatedHspdetails);
  } catch (error) {
    console.error("Error updating hospital info:", error);
    return NextResponse.json({ error: "An error occurred: " + error.message }, { status: 500 });
  }
}
