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

async function generateUniqueCardNumber() {
  const now = new Date();
  const datePart = `${now.getFullYear().toString().slice(-2)}${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;

  const lastCertificate = await db.PhotographerCertificate.findFirst({
    where: { cardNo: { startsWith: `PHO${datePart}` } },
    orderBy: { cardNo: "desc" },
  });

  let newNumber = 1;
  if (lastCertificate?.cardNo) {
    const lastNumber = parseInt(lastCertificate.cardNo.slice(-5), 10);
    newNumber = lastNumber + 1;
  }

  return `PHO${datePart}${String(newNumber).padStart(5, "0")}`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const photographerId = body.photographerId || body.photographerid;
    const { newStatus, remark } = body;


    const validStatuses = ["PENDING", "SUBMITTED", "APPROVED", "REJECTED"];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    // Update photographer main status
    const updatedPhotographer = await db.photographer.update({
      where: { id: photographerId },
      data: { status: newStatus },
    });

    let cardNo = null;
    if (newStatus === "APPROVED") {
      cardNo = await generateUniqueCardNumber();
    }

    // Check if certificate exists
    const existingCertificate = await db.PhotographerCertificate.findFirst({
      where: { photographerId },
    });

    let updatedCertificate;

    if (existingCertificate) {
      updatedCertificate = await db.PhotographerCertificate.update({
        where: { id: existingCertificate.id },
        data: {
          approvalStatus: newStatus,
          remarks: remark || null,
          cardNo,
        },
      });
    } else {
      updatedCertificate = await db.PhotographerCertificate.create({
        data: {
          photographerId,
          approvalStatus: newStatus,
          remarks: remark || null,
          cardNo,
        },
      });
    }

    // Send notification email
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: updatedPhotographer.email,
        subject: `Your Profile Review Update - Aarogya Aadhar`,
        text: `Dear ${updatedPhotographer.fullname || "Photographer"},\n\nYour profile review status has been updated.\n\nApproval Status: ${newStatus}\n\n${
          cardNo ? `Your card number: ${cardNo}\n\n` : ""
        }Regards,\nAarogya Aadhar Team`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${updatedPhotographer.email}`);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    return NextResponse.json(
      { message: "Status updated", updatedPhotographer, updatedCertificate },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating photographer certificate:", error);
    return NextResponse.json(
      { error: `An error occurred: ${error.message}` },
      { status: 500 }
    );
  }
}
