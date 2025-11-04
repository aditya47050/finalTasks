import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// 🔹 Generate unique card number with role-based prefix
async function generateUniqueCardNumber(role) {
  console.log("🔹 [generateUniqueCardNumber] Start | Role:", role)

  const now = new Date()
  const datePart = `${now.getFullYear().toString().slice(-2)}${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`

  console.log("📅 [generateUniqueCardNumber] Date part:", datePart)

  const prefix = role === "Asha" ? "ASHA" : "ESEVA"
  console.log("🔠 [generateUniqueCardNumber] Prefix:", prefix)

  const lastCertificate = await db.ESevaCertificate.findFirst({
    where: { cardNo: { startsWith: `${prefix}${datePart}` } },
    orderBy: { cardNo: "desc" },
  })

  console.log("📑 [generateUniqueCardNumber] Last Certificate:", lastCertificate)

  let newNumber = 1
  if (lastCertificate?.cardNo) {
    const lastNumber = parseInt(lastCertificate.cardNo.slice(-5), 10)
    newNumber = lastNumber + 1
    console.log("➕ [generateUniqueCardNumber] Incremented Number:", newNumber)
  }

  const finalCard = `${prefix}${datePart}${String(newNumber).padStart(5, "0")}`
  console.log("✅ [generateUniqueCardNumber] Final Generated Card:", finalCard)

  return finalCard
}

export async function PUT(request, { params }) {
  console.log("🚀 [PUT] Request started with params:", params)

  const { esevaId } = params

  if (!esevaId) {
    console.error("❌ [PUT] esevaId missing")
    return NextResponse.json(
      { error: "Center ID is required." },
      { status: 400 }
    )
  }

  try {
    const body = await request.json()
    console.log("📩 [PUT] Request body:", body)

    const { action, remark, issues } = body

    if (!action) {
      console.error("❌ [PUT] Action missing")
      return NextResponse.json(
        { error: "Action is required." },
        { status: 400 }
      )
    }

    const eseva = await db.Eseva.findUnique({
      where: { id: esevaId },
    })

    console.log("🏢 [PUT] Eseva record fetched:", eseva)

    if (!eseva) {
      console.error("❌ [PUT] Eseva not found for ID:", esevaId)
      return NextResponse.json(
        { error: "Center not found." },
        { status: 404 }
      )
    }

    const roleLabel = eseva.role === "Asha" ? "ASHA Center" : "E-seva Center"
    console.log("🏷️ [PUT] Role label resolved:", roleLabel)

    // 🔹 Build remarks
    let finalRemarks = ""
    if (remark && issues?.length > 0) {
      finalRemarks = `${remark}\n\nIssues:\n- ${issues.join("\n- ")}`
    } else if (issues?.length > 0) {
      finalRemarks = `Issues:\n- ${issues.join("\n- ")}`
    } else if (remark) {
      finalRemarks = remark
    }
    console.log("📝 [PUT] Final remarks:", finalRemarks)

    const approvalStatus = action === "approve" ? "APPROVED" : "REJECTED"
    console.log("⚖️ [PUT] Approval Status:", approvalStatus)

    // 🔑 Generate card number if approved
    let cardNo = null
    if (approvalStatus === "APPROVED") {
      console.log("🔑 [PUT] Generating card number for approved Eseva")
      cardNo = await generateUniqueCardNumber(eseva.role)
    }

    // 🔹 Single update for Eseva (status + remarks + code)
    const updateData = {
      status: approvalStatus,
      updatedAt: new Date(),
      ...(finalRemarks && { adminRemarks: finalRemarks }),
      ...(approvalStatus === "APPROVED"
        ? { esevacode: cardNo }
        : { esevacode: null }),
    }
    console.log("🛠️ [PUT] Final update data for Eseva:", updateData)

    const updatedEseva = await db.Eseva.update({
      where: { id: esevaId },
      data: updateData,
    })
    console.log("✅ [PUT] Eseva updated:", updatedEseva)

    // 🔹 Suspend subadmins if rejected
if (approvalStatus === "REJECTED") {
  console.log("⛔ [PUT] Suspending all subadmins for E-seva:", esevaId);

  await db.EsevaSubAdmin.updateMany({
    where: { esevaId: esevaId },
    data: {
      status: "SUSPENDED",
      suspendedAt: new Date(),
    },
  });

  console.log("✅ [PUT] All subadmins suspended successfully");
}

    // 🔹 Update or create certificate record
    const existingCertificate = await db.ESevaCertificate.findFirst({
      where: { esevaid: esevaId },
    })
    console.log("📜 [PUT] Existing certificate check:", existingCertificate)

    const certData = {
      approvalStatus,
      remarks: finalRemarks || null,
      cardNo, // ⚠️ must match your Prisma schema field name
    }
    console.log("🛠️ [PUT] Certificate update data:", certData)

    if (existingCertificate) {
      await db.ESevaCertificate.update({
        where: { id: existingCertificate.id },
        data: certData,
      })
      console.log("🔄 [PUT] Certificate updated")
    } else {
      await db.ESevaCertificate.create({
        data: {
          esevaid: esevaId,
          ...certData,
        },
      })
      console.log("🆕 [PUT] Certificate created")
    }

    // 🔹 Send email notification
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: eseva.email,
        subject: `Your ${roleLabel} Application Update - Aarogya Aadhar`,
        text: `Dear ${eseva.incharge || roleLabel},\n\nYour ${roleLabel.toLowerCase()} application has been ${approvalStatus.toLowerCase()}.\n\n${
          finalRemarks ? `Remarks: ${finalRemarks}\n\n` : ""
        }${
          cardNo ? `Your unique ${roleLabel} code: ${cardNo}\n\n` : ""
        }Center Details:\nName: ${eseva.name}\nLocation: ${eseva.district}, ${eseva.state}\n\nRegards,\nAarogya Aadhar Team`,
      }

      console.log("📧 [PUT] Email options:", mailOptions)

      await transporter.sendMail(mailOptions)
      console.log(
        `✅ [PUT] Email sent to ${eseva.email} for status: ${approvalStatus}`
      )
    } catch (emailError) {
      console.error("❌ [PUT] Email sending failed:", emailError)
    }

    console.log("🎉 [PUT] Process completed successfully")
    return NextResponse.json({
      message: `${roleLabel} ${approvalStatus.toLowerCase()} successfully`,
      data: updatedEseva,
    })
  } catch (error) {
    console.error("💥 [PUT] Error updating center:", error)
    return NextResponse.json(
      { error: `An error occurred: ${error.message}` },
      { status: 500 }
    )
  }
}
