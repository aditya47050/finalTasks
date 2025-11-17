import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// ✅ Update address
export async function PUT(req, { params }) {
  try {
    const { id } = params
    const body = await req.json()
    const { name, phone, address, city, state, district, taluka, pincode, isDefault, userId } = body

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 })
    }

    // If new default, remove old default for this user
    if (isDefault) {
      await db.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      })
    }

    const updatedAddress = await db.address.update({
      where: { id },
      data: {
        name,
        phone,
        address,
        city,
        state,
        district,
        taluka,
        pincode,
        isDefault: isDefault || false,
      },
    })

    return NextResponse.json({ success: true, data: updatedAddress })
  } catch (err) {
    console.error("Update Address Error:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

// ✅ Delete address
export async function DELETE(req, { params }) {
  try {
    const { id } = params

    await db.address.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: "Address deleted successfully" })
  } catch (err) {
    console.error("Delete Address Error:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
