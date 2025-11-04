import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getSession } from "@/lib/getsession"

export async function GET(request, { params }) {
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

    const { id } = params

    // Fetch prescription
    const prescription = await db.prescription.findFirst({
      where: {
        id: id,
        doctorId: doctor.id,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            mobile: true,
            dateOfBirth: true,
            gender: true,
            presentAddress: true,
          },
        },
        appointment: {
          select: {
            id: true,
            preferredDate: true,
            preferredTime: true,
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

    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 })
    }

    return NextResponse.json(prescription)
  } catch (error) {
    console.error("Error fetching prescription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
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

    const { id } = params
    const data = await request.json()

    // Check if prescription belongs to doctor
    const existingPrescription = await db.prescription.findFirst({
      where: {
        id: id,
        doctorId: doctor.id,
      },
    })

    if (!existingPrescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 })
    }

    // Update prescription
    const prescription = await db.prescription.update({
      where: { id: id },
      data: {
        ...data,
        prescriptionDate: data.prescriptionDate ? new Date(data.prescriptionDate) : undefined,
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

    return NextResponse.json(prescription)
  } catch (error) {
    console.error("Error updating prescription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
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

    const { id } = params

    // Check if prescription belongs to doctor
    const existingPrescription = await db.prescription.findFirst({
      where: {
        id: id,
        doctorId: doctor.id,
      },
    })

    if (!existingPrescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 })
    }

    // Delete prescription
    await db.prescription.delete({
      where: { id: id },
    })

    return NextResponse.json({ message: "Prescription deleted successfully" })
  } catch (error) {
    console.error("Error deleting prescription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
