import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Setup mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  try {
    const {
      employerName,
      email,
      phone,
      companyName,
      logoUrl,
      documents, // { panCardUrl, gstNumberUrl, addressProofUrl, idProofUrl }
      password,
    } = await request.json();

    // 1️⃣ Check if email exists
    const existingUser = await db.jObUser.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );
    }

    // 2️⃣ Check if phone exists
    const existingPhone = await db.jObUser.findUnique({ where: { phone } });
    if (existingPhone) {
      return NextResponse.json(
        { success: false, message: "Phone number already registered" },
        { status: 400 }
      );
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create User with role EMPLOYER
    const user = await db.jObUser.create({
      data: {
        role: "EMPLOYER",
        fullName: employerName,
        email,
        phone,
        password: hashedPassword,
      },
    });

    // 5️⃣ Create Company
    const company = await db.company.create({
      data: {
        name: companyName,
        logoUrl: logoUrl || null,
      },
    });

    // 6️⃣ Create Employer with pending status
    const employer = await db.employer.create({
      data: {
        userId: user.id,
        companyId: company.id,
        status: "pending", // <-- pending until admin approves
      },
    });

    // 7️⃣ Add Documents
    const docTypes = [
      { type: "PAN", url: documents.panCardUrl },
      { type: "GST", url: documents.gstNumberUrl },
      { type: "Address Proof", url: documents.addressProofUrl },
      { type: "ID Proof", url: documents.idProofUrl },
    ];

    for (let doc of docTypes) {
      if (doc.url) {
        await db.document.create({
          data: {
            employerId: employer.id,
            type: doc.type,
            fileUrl: doc.url,
          },
        });
      }
    }

    // 8️⃣ Send Welcome Email
    try {
      const host = request.headers.get("host");
      let appUrl = process.env.NEXT_PUBLIC_APP_URL;

      // Fix link if alternate domain
      if (host && host.includes("aarogyaadhar.in")) {
        appUrl = process.env.NEXT_PUBLIC_APP_URL_ALT || appUrl;
      }

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to Job Aadhar – Employer Account Created!",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p>This is an automated email. Please do not reply.</p>
            <h3>Dear ${employerName},</h3>
            <p>Welcome to Job Aadhar!</p>
            <p>Your employer account has been successfully created and is currently <strong>pending admin approval</strong>.</p>
            <ul>
              <li><strong>Company:</strong> ${companyName}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Phone:</strong> ${phone}</li>
            </ul>
            <p>👉 <a href="${appUrl}/jobaadhar/login" target="_blank">Login Here</a> (You will be able to login after admin approval)</p>
            <p>Thank you for joining Job Aadhar!</p>
            <br/>
            <p>Best Regards,<br/>Job Aadhar Team</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send welcome email:", emailErr);
    }

    return NextResponse.json(
      { success: true, message: "Employer registered successfully. Await admin approval.", user },
      { status: 201 }
    );
  } catch (err) {
    console.error("Employer Registration Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
