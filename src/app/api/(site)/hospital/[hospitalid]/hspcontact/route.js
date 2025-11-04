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

    const address = data.get("address");
    const city = data.get("city");
    const state = data.get("state");
    const dist = data.get("dist");
    const taluka = data.get("taluka");
    const pincode = data.get("pincode");
    const receptioncontact1 = data.get("receptioncontact1");
    const receptioncontact2 = data.get("receptioncontact2");
    const receptionemail = data.get("receptionemail");
    const managername = data.get("managername");
    const managercontact = data.get("managercontact");
    const manageremail = data.get("manageremail");
    const adminname = data.get("adminname");
    const admincontact = data.get("admincontact");
    const adminemail = data.get("adminemail");
    const escalationmatrixsheet = data.get("escalationmatrixsheet");
    const alternateno = data.get("alternateno");
    const hospital = await db.Hospital.findUnique({
      where: { id },
      include: { hspdetails: true },
    });

    if (!hospital) {
      return NextResponse.json(
        { error: "Hospital not found." },
        { status: 404 }
      );
    }

    let updatedHspcontact;
    if (hospital.hspcontact) {
      // Update existing HspInfo record
      updatedHspcontact = await db.Hspcontact.update({
        where: { id: hospital.hspcontact.id },
        data: {
          address,
          city,
          state,
          dist,
          taluka,
          pincode,
          receptioncontact1,
          receptioncontact2,
          receptionemail,
          managername,
          managercontact,
          manageremail,
          adminname,
          admincontact,
          adminemail,
          escalationmatrixsheet,
          alternateno,
        },
      });
    } else {
      // Create a new HspInfo record and link it to the Hospital
      const newHspcontact = await db.Hspcontact.create({
        data: {
          
            address,
            city,
            state,
            dist,
            taluka,
            pincode,
            receptioncontact1,
            receptioncontact2,
            receptionemail,
            managername,
            managercontact,
            manageremail,
            adminname,
            admincontact,
            adminemail,
            escalationmatrixsheet,
            alternateno,
        },
        
      });

      // Update the Hospital record to link to this new HspInfo record
      await db.Hospital.update({
        where: { id },
        data: { hspcontactId: newHspcontact.id },
      });

      updatedHspcontact = newHspcontact;
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

    return NextResponse.json(updatedHspcontact);
  } catch (error) {
    console.error("Error updating hospital info:", error);
    return NextResponse.json(
      { error: "An error occurred: " + error.message },
      { status: 500 }
    );
  }
}
