import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import nodemailer from "nodemailer"

// ✅ configure transporter once
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

async function sendAdRequestEmail(adRequest, newStatus, adminRemarks) {
  const { userEmail, userName, adTitle, cityTargets, startDate, endDate } = adRequest

  const subject =
    newStatus === "APPROVED"
      ? `✅ Your Ad Request has been Approved`
      : `❌ Your Ad Request has been Rejected`

  const statusColor = newStatus === "APPROVED" ? "#4CAF50" : "#E53935"
  const remarksHtml = adminRemarks
    ? `<p><strong>Admin Remarks:</strong> ${adminRemarks}</p>`
    : ""

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p style="font-size: 14px; color: #555;">This is an automated email from Aarogya Aadhar.</p>
        <h2 style="color:${statusColor};">Your Ad Request has been ${newStatus}</h2>
        <p>Dear ${userName || "User"},</p>
        <p>We wanted to let you know that your advertisement request has been <strong>${newStatus}</strong>.</p>
        
        <h3>📋 Ad Request Details:</h3>
        <ul>
          <li><strong>Target Cities:</strong> ${cityTargets || "N/A"}</li>
          <li><strong>Start Date:</strong> ${new Date(startDate).toLocaleDateString()}</li>
          <li><strong>End Date:</strong> ${new Date(endDate).toLocaleDateString()}</li>
          <li><strong>Status:</strong> ${newStatus}</li>
        </ul>

        ${remarksHtml}

        <p>If you have any questions, please contact us at 
        <a href="mailto:support@aarogyaaadhar.com">support@aarogyaaadhar.com</a>.</p>

        <hr/>
        <p>Best Regards,<br/><strong>Aarogya Aadhar Team</strong></p>
        <a href="https://aarogyaaadhar.com" target="_blank">
          <img src="https://res.cloudinary.com/dnckhli5u/image/upload/v1728891425/Picture1_c31red.png"
               alt="Aarogya Aadhar Logo"
               style="width: 200px;height: full; margin-top: 10px;" />
        </a>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

// ✅ GET /api/ad-request/[id]
export async function GET(request, { params }) {
  try {
    const { id } = params
    const item = await db.adRequest.findUnique({ where: { id } })

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error fetching AdRequest:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// ✅ PATCH /api/ad-request/[id]
export async function PATCH(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const action = body?.action
    const adminRemarks = body?.adminRemarks || null
    console.log(action);
    if (!action || !["approved", "rejected"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const newStatus = action === "approved" ? "APPROVED" : "REJECTED"

    const existing = await db.adRequest.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // ✅ update DB
    const updated = await db.adRequest.update({
      where: { id },
      data: {
        status: newStatus,
        adminRemarks,
        updatedAt: new Date(),
      },
    })

    // ✅ send email notification
    try {
      await sendAdRequestEmail(updated, newStatus, adminRemarks)
    } catch (emailError) {
      console.error("⚠️ Failed to send Ad Request email:", emailError)
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating AdRequest status:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
