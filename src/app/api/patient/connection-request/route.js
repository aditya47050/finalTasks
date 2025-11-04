import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const user = await getSession(); // parent (sender)
    if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { receiverEmail, remark, action, status, requestId } = await req.json();

    if (!action || action === "sendRequest") {
      // 1️⃣ Send connection request
      const child = await db.patient.findUnique({ where: { email: receiverEmail } });
      if (!child) return NextResponse.json({ error: "No patient found", status: 404 });

      const existing = await db.connectionRequest.findFirst({
        where: { senderEmail: user.email, receiverEmail, status: "PENDING" },
      });
      if (existing) return NextResponse.json({ error: "Request already sent", status: 400 });

      const request = await db.connectionRequest.create({
        data: {
          senderEmail: user.email,
          receiverEmail,
          remark,
          parentId: user.id,
        },
      });

      // Send email to receiver
      await sendEmail(
        receiverEmail,
        "Connection Request Received",
        `You have a connection request from ${user.firstName} ${user.lastName}. Remark: ${remark}`
      );

      return NextResponse.json({ success: true, request });
    }

    if (action === "approveReject") {
      // 2️⃣ Approve/Reject connection request
      const request = await db.connectionRequest.findUnique({ where: { id: requestId } });
      if (!request) return NextResponse.json({ error: "Request not found", status: 404 });

      await db.connectionRequest.update({
        where: { id: requestId },
        data: { status, remark },
      });

      if (status === "APPROVED") {
        // Add child to parent’s family
        await db.familyMember.create({
          data: {
            parentId: request.parentId,
            patientId: request.receiverId,
            relation: request.remark || "Child",
          },
        });

        // Send emails
        await sendEmail(request.receiverEmail, "Request Approved", `Your request was approved by ${user.firstName}`);
        await sendEmail(request.senderEmail, "Request Approved", `You approved ${request.receiverEmail}`);
      }

      if (status === "REJECTED") {
        await sendEmail(request.receiverEmail, "Request Rejected", `Your request was rejected by ${user.firstName}`);
      }

      return NextResponse.json({ success: true, status });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// 🔹 Helper function to send mail
async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Replace with your email service
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

  await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, text });
}


export async function GET() {
  try {
    const user = await getSession(); // logged-in user
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all connection requests where user is sender OR receiver
    const requests = await db.connectionRequest.findMany({
      where: {
        OR: [
          { senderEmail: user.email },
          { receiverEmail: user.email },
        ],
      },
      include: {
        parent: true, // include parent info
      },
      orderBy: { createdAt: "desc" },
    });

    // Map each request to include child info if exists
    const results = await Promise.all(
      requests.map(async (req) => {
        const child = await db.patient.findUnique({
          where: { email: req.receiverEmail },
        });

        return {
          id: req.id,
          senderEmail: req.senderEmail,
          receiverEmail: req.receiverEmail,
          status: req.status,
          remark: req.remark,
          createdAt: req.createdAt,
          updatedAt: req.updatedAt,
          parent: req.parent,
          child: child || null,
        };
      })
    );

    return NextResponse.json(results);
  } catch (err) {
    console.error("Failed to fetch connection requests:", err);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}

// Relationship mapping logic — determines reciprocal relationships automatically
const reverseRelationMap = {
  Father: "Son",
  Mother: "Son",
  Son: "Father",
  Daughter: "Father",
  Husband: "Wife",
  Wife: "Husband",
  Brother: "Brother",
  Sister: "Sister",
  Grandfather: "Grandson",
  Grandmother: "Grandson",
  Grandson: "Grandfather",
  Granddaughter: "Grandfather",
};

export async function PUT(req) {
  try {
    const user = await getSession(); // logged-in user (the one approving/rejecting)
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId, status, remark } = await req.json();
    if (!requestId || !status) {
      return NextResponse.json({ error: "Missing requestId or status" }, { status: 400 });
    }

    // Find connection request
    const request = await db.connectionRequest.findUnique({
      where: { id: requestId },
    });
    if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });

    // Update request status + remark
    const updatedRequest = await db.connectionRequest.update({
      where: { id: requestId },
      data: { status, remark },
    });

    // ✅ If approved, create family records for both sender & receiver
    if (status === "APPROVED") {
      // Fetch both users
      const sender = await db.patient.findUnique({
        where: { email: request.senderEmail },
      });
      const receiver = await db.patient.findUnique({
        where: { email: request.receiverEmail },
      });

      if (!sender || !receiver) {
        return NextResponse.json({ error: "Patient(s) not found" }, { status: 404 });
      }

      // Determine relationship based on remark (user input) or existing request logic
      const senderRelation = remark || "Family"; // fallback if remark missing
      const receiverRelation = reverseRelationMap[senderRelation] || "Family";

      // ✅ Create entry for sender’s family (receiver appears in sender’s family list)
      await db.familyMember.create({
        data: {
          patientId: sender.id,
          registeredPatientId: receiver.id,
          relation: senderRelation,
          approvalStatus: "APPROVED",
          email: receiver.email,
          firstName: receiver.firstName,
          middleName: receiver.middleName,
          lastName: receiver.lastName,
          gender: receiver.gender,
          mobile: receiver.mobile,
          bloodgroup: receiver.bloodgroup,
          aadharCardNumber: receiver.aadharCardNumber,
          presentAddress: receiver.presentAddress,
          city: receiver.city,
          pincode: receiver.pincode,
          state: receiver.state,
          district: receiver.district,
          taluka: receiver.taluka,
        },
      });

      // ✅ Create reverse entry (sender appears in receiver’s family list)
      await db.familyMember.create({
        data: {
          patientId: receiver.id,
          registeredPatientId: sender.id,
          relation: receiverRelation,
          approvalStatus: "APPROVED",
          email: sender.email,
          firstName: sender.firstName,
          middleName: sender.middleName,
          lastName: sender.lastName,
          gender: sender.gender,
          mobile: sender.mobile,
          bloodgroup: sender.bloodgroup,
          aadharCardNumber: sender.aadharCardNumber,
          presentAddress: sender.presentAddress,
          city: sender.city,
          pincode: sender.pincode,
          state: sender.state,
          district: sender.district,
          taluka: sender.taluka,
        },
      });
    }

    // ✅ If rejected, optionally send an email notification
    if (status === "REJECTED") {
      try {
        await sendEmail(
          request.receiverEmail,
          "Connection Request Rejected",
          `Your connection request was rejected by ${user.email}`
        );
      } catch (mailError) {
        console.warn("Email send failed:", mailError.message);
      }
    }

    return NextResponse.json({ success: true, updatedRequest });
  } catch (err) {
    console.error("Failed to update connection request:", err);
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 });
  }
}