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
  const hospitalId = params.hospitalid; // Assume the hospital ID is passed as a URL parameter

  try {
    const data = await request.formData();

    // Extract branch details from the request body
    const branchname = data.get("branchname");
    const branchregno = data.get("branchregno");
    const branchcity = data.get("branchcity");
    const branchpincode = data.get("branchpincode");
    const branchreceptionno1 = data.get("branchreceptionno1");
    const branchreceptionno2 = data.get("branchreceptionno2");
    const branchreceptionemail = data.get("branchreceptionemail");
    const branchaddress = data.get("branchaddress");
    const branchmanagername = data.get("branchmanagername");
    const branchmanagerno = data.get("branchmanagerno");
    const branchmanageremail = data.get("branchmanageremail");
    const branchadminname = data.get("branchadminname");
    const branchadminno = data.get("branchadminno");
    const branchadminemail = data.get("branchadminemail");
    const state = data.get("state");
    const district = data.get("district");
    const taluka = data.get("taluka");

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

    // Create a new branch and associate it with the hospital
    const newHspbranch = await db.Hspbranch.create({
      data: {
        branchname,
        branchregno,
        branchcity,
        branchpincode,
        branchreceptionno1,
        branchreceptionno2,
        branchreceptionemail,
        branchaddress,
        branchmanagername,
        branchmanagerno,
        branchmanageremail,
        branchadminname,
        branchadminno,
        branchadminemail,
        hospitalId, // Link the new branch to the hospital
        state,
        district,
        taluka,
      },
    });

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: hospital.email,
      subject: "New Branch Created - Aarogya Aadhar",
      html: `<p>Hello,</p>
             <p>A new branch has been created for your hospital:</p>
             <p><strong>Branch Name:</strong> ${branchname}</p>
             <p><strong>Location:</strong> ${branchcity}, ${branchpincode}</p>
             <p>Best regards,<br/>Aarogya Aadhar Team</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Notification email sent successfully to:", hospital.email);

    return NextResponse.json(newHspbranch);
  } catch (error) {
    console.error("Error creating new branch:", error);
    return NextResponse.json(
      { error: "An error occurred: " + error.message },
      { status: 500 }
    );
  }
}
