import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request, { params }) {
  try {
    const { patientid } = await params
    const formData = await request.json()
    // Validate that form data exists
    if (!formData) {
      return NextResponse.json({ success: false, message: "No form data provided" }, { status: 400 })
    }
    const { diseaseDetails, ...medicalConditions } = formData
    const dataToSave = {
      ...medicalConditions,
      diseaseDetails: diseaseDetails || {},
    }
    // Check if medical history already exists for the patientId
    const existingMedicalHistory = await db.medicalHistory.findUnique({
      where: {
        patientId: patientid,
      },
    })
    if (existingMedicalHistory) {
      // Update the existing record
      const updatedMedicalHistory = await db.medicalHistory.update({
        where: {
          patientId: patientid,
        },
        data: {
          ...dataToSave,
          updatedAt: new Date(), // Ensure updatedAt is updated
        },
      })
      console.log("Updated medical history:", updatedMedicalHistory)
      return NextResponse.json({ success: true, message: "Medical history updated successfully" }, { status: 200 })
    } else {
      // Create a new medical history record using Patient relation
      const newMedicalHistory = await db.medicalHistory.create({
        data: {
          ...dataToSave,
          Patient: {
            connect: {
              id: patientid,
            },
          },
        },
      })
      console.log("Created new medical history:", newMedicalHistory)
      return NextResponse.json({ success: true, message: "Medical history created successfully" }, { status: 201 })
    }
  } catch (error) {
    console.error("Error saving medical history data:", error)
    return NextResponse.json(
      { success: false, message: "Failed to submit medical history data", error: error.message },
      { status: 500 },
    )
  }
}

export async function GET(request, { params }) {
  try {
    // Await params before using them
    const { patientid } = await params
    const medicalHistory = await db.medicalHistory.findUnique({
      where: {
        patientId: patientid,
      },
      include: {
        Patient: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })
    if (!medicalHistory) {
      return NextResponse.json({ success: false, message: "Medical history not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: medicalHistory }, { status: 200 })
  } catch (error) {
    console.error("Error fetching medical history:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch medical history" }, { status: 500 })
  }
}
