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

export async function PUT(request, context) {
  const { params } = await context
  const vehicleId = params?.vehicleid

  if (!vehicleId) {
    return NextResponse.json({ error: "Vehicle ID is required." }, { status: 400 })
  }

  try {
    const { action, remark } = await request.json()

    if (!action) {
      return NextResponse.json({ error: "Action is required." }, { status: 400 })
    }

    const vehicle = await db.AmbulanceVaichicle.findUnique({
      where: { id: vehicleId },
      include: {
        ambulance: true,
      },
    })

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found." }, { status: 404 })
    }

    const approvalStatus = action === "approve" ? "APPROVED" : "REJECTED"

    // Add approval status field to vehicle (you may need to add this to your schema)
    const updatedVehicle = await db.AmbulanceVaichicle.update({
      where: { id: vehicleId },
      data: {
         approvalStatus, // Add this field to your schema if needed
         adminRemarks: remark || null, // Add this field to your schema if needed,
         approvedAt: new Date(),
      },
    })

    try {
      // Send email notification to ambulance owner
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: vehicle.ambulance.email,
        subject: `Your Ambulance Vehicle Update - Aarogya Aadhar`,
        text: `Dear ${vehicle.ambulance.ownerfirstname} ${vehicle.ambulance.ownerlastname},\n\nYour ambulance vehicle (${vehicle.ambulancemodel || "Vehicle"} - ${vehicle.ambulancercno || "N/A"}) has been ${approvalStatus.toLowerCase()}.\n\n${remark ? `Remarks: ${remark}\n\n` : ""}Regards,\nAarogya Aadhar Team`,
      }

      await transporter.sendMail(mailOptions)
      console.log(`Vehicle approval status updated to ${approvalStatus} and email sent to:`, vehicle.ambulance.email)
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
    }

    return NextResponse.json({
      message: `Vehicle ${approvalStatus.toLowerCase()} successfully`,
      data: updatedVehicle,
    })
  } catch (error) {
    console.error("Error updating vehicle:", error)
    return NextResponse.json({ error: `An error occurred: ${error.message}` }, { status: 500 })
  }
}
