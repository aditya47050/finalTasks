import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getSession } from "@/lib/getsession"

export async function POST(request) {
  try {
    const session = await getSession()

    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get doctor
    const doctor = await db.doctor.findUnique({
      where: { email: session.email },
    })

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    // Create prescription
    const prescription = await db.prescription.create({
      data: {
        doctorId: doctor.id,
        patientId: data.patientId,
        appointmentId: data.appointmentId || null,
        templateId: data.templateId || null,
        patientName: data.patientName,
        patientAge: data.patientAge || null,
        patientGender: data.patientGender || null,
        patientPhone: data.patientPhone || null,
        patientAddress: data.patientAddress || null,
        doctorName: data.doctorName,
        doctorSpecialty: data.doctorSpecialty || null,
        doctorRegistration: data.doctorRegistration || null,
        prescriptionDate: data.prescriptionDate ? new Date(data.prescriptionDate) : new Date(),
        bloodPressure: data.bloodPressure || null,
        pulseRate: data.pulseRate || null,
        weight: data.weight || null,
        temperature: data.temperature || null,
        diagnosis: data.diagnosis || null,
        allergies: data.allergies ? "Yes" : "None", // must be string
        disabilities: data.disabilities || null,
        medications: data.medications || [],
        dietInstructions: data.dietInstructions || null,
        patientHistory: data.patientHistory || null,
        followUpInstructions: data.followUpInstructions || null,
        status: data.status || "ACTIVE",
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            mobile: true,
          },
        },
        template: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(prescription, { status: 201 })
  } catch (error) {
    console.error("Error creating prescription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
