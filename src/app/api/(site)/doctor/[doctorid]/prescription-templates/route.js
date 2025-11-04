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

    // Create template
    const template = await db.prescriptionTemplate.create({
      data: {
        ...data,
        doctorId: doctor.id,
      },
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error("Error creating prescription template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
