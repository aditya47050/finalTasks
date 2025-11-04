import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getSession } from "@/lib/getsession"

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

    // Check if template belongs to doctor
    const existingTemplate = await db.prescriptionTemplate.findFirst({
      where: {
        id: id,
        doctorId: doctor.id,
      },
    })

    if (!existingTemplate) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    // Update template
    const template = await db.prescriptionTemplate.update({
      where: { id: id },
      data: data,
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error("Error updating prescription template:", error)
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

    // Check if template belongs to doctor
    const existingTemplate = await db.prescriptionTemplate.findFirst({
      where: {
        id: id,
        doctorId: doctor.id,
      },
    })

    if (!existingTemplate) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    // Delete template
    await db.prescriptionTemplate.delete({
      where: { id: id },
    })

    return NextResponse.json({ message: "Template deleted successfully" })
  } catch (error) {
    console.error("Error deleting prescription template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
