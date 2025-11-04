import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// ✅ Create Address
export async function POST(req) {
  try {
    const body = await req.json()
    const { name, phone, address, city, state, district, taluka, pincode, isDefault, userId } = body

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 })
    }

    // If new address is default, remove old default
    if (isDefault) {
      await db.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      })
    }

    const newAddress = await db.address.create({
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
        userId,
      },
    })

    return NextResponse.json({ success: true, data: newAddress }, { status: 201 })
  } catch (err) {
    console.error("Create Address Error:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

// ✅ Get all addresses of a user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 })
    }

    const addresses = await db.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: addresses })
  } catch (err) {
    console.error("Get Addresses Error:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
