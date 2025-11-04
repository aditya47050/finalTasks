// src/app/api/prescription/upload/route.js
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PUT(request) {
  const { prescriptionId, receipt, note } = await request.json()

  try {
    const updatedPrescription = await db.prescription.update({
      where: { id: prescriptionId },
      data: {
        receipt: receipt || undefined,
        note: note || undefined,
      },
    })

    return NextResponse.json({ success: true, updatedPrescription })
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}