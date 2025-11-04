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
  const branchId = params.hspbranchid; // Assume branch ID is also passed as a URL parameter

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

    // Verify the branch exists under the specified hospital
    const branch = await db.Hspbranch.findFirst({
      where: {
        id: branchId,
        hospitalId, // Ensure this branch belongs to the specified hospital
      },
    });

    if (!branch) {
      return NextResponse.json(
        { error: "Branch not found for this hospital." },
        { status: 404 }
      );
    }

    // Update the existing branch
    const updatedBranch = await db.Hspbranch.update({
      where: { id: branchId },
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
        state,
        district,
        taluka,
      },
    });

    // Send email notification for the update
    const hospital = await db.Hospital.findUnique({
      where: { id: hospitalId },
    });
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: hospital.email,
      subject: "Branch Information Updated - Aarogya Aadhar",
      html: `<p>Hello,</p>
             <p>The following branch information has been updated for your hospital:</p>
             <p><strong>Branch Name:</strong> ${branchname}</p>
             <p><strong>Location:</strong> ${branchcity}, ${branchpincode}</p>
             <p>Best regards,<br/>Aarogya Aadhar Team</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Update notification email sent successfully to:", hospital.email);

    return NextResponse.json(updatedBranch);
  } catch (error) {
    console.error("Error updating branch information:", error);
    return NextResponse.json(
      { error: "An error occurred: " + error.message },
      { status: 500 }
    );
  }
}
