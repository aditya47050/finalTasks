import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

async function generateUniqueCorporateCardNumber() {
  const now = new Date();
  const datePart = `${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;

  const last = await db.CorporateCertificate.findFirst({
    where: { cardNo: { startsWith: `COR${datePart}` } },
    orderBy: { cardNo: "desc" },
  });

  let newNumber = 1;
  if (last?.cardNo) {
    const lastNumber = parseInt(last.cardNo.slice(-5), 10);
    if (!Number.isNaN(lastNumber)) newNumber = lastNumber + 1;
  }
  return `COR${datePart}${String(newNumber).padStart(5, "0")}`;
}

export async function PUT(request, context) {
  const { params } = await context;
  const corporateId = params?.corporateId;
  if (!corporateId) {
    return NextResponse.json({ error: "Corporate ID is required." }, { status: 400 });
  }

  try {
    const { approvalStatus, remark } = await request.json();
    if (!approvalStatus) {
      return NextResponse.json({ error: "Approval status is required." }, { status: 400 });
    }

    const corp = await db.Corporate.findUnique({ where: { id: corporateId } });
    if (!corp) {
      return NextResponse.json({ error: "Corporate not found." }, { status: 404 });
    }

    let cardNo = null;
    if (approvalStatus === "APPROVED") {
      cardNo = await generateUniqueCorporateCardNumber();
    }

    const existing = await db.CorporateCertificate.findFirst({
      where: { corporateId },
    });

    const updatedCertificate = existing
      ? await db.CorporateCertificate.update({
          where: { id: existing.id },
          data: { approvalStatus, remarks: remark || null, cardNo },
        })
      : await db.CorporateCertificate.create({
          data: { corporateId, approvalStatus, remarks: remark || null, cardNo },
        });

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: corp.email,
        subject: `Your Corporate Profile Review Update - Aarogya Aadhar`,
        text: `Dear ${corp.companyName || "Corporate User"},\n\nYour corporate profile review status has been updated.\n\nApproval Status: ${approvalStatus}\n\n${
          cardNo ? `Your corporate certificate number: ${cardNo}\n\n` : ""
        }Regards,\nAarogya Aadhar Team`,
      };
      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.error("Corporate approval email failed:", emailErr);
    }

    return NextResponse.json({ updatedCorporateCertificate: updatedCertificate, cardNo });
  } catch (error) {
    console.error("Corporate approval error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}