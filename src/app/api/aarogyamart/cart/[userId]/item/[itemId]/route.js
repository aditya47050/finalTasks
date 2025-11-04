// PUT /api/aarogyamart/cart/item/[itemId]
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PUT(req, { params }) {
  try {
    const { itemId } = params
    const { quantity } = await req.json()

    if (quantity < 1) {
      await db.cartItem.delete({ where: { id: itemId } })
      return NextResponse.json({ success: true, message: "Item removed" })
    }

    const item = await db.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    })

    return NextResponse.json({ success: true, data: item },{status:200})
  } catch (err) {
    console.error("Update Cart Item Error:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const { itemId } = params
    await db.cartItem.delete({ where: { id: itemId } })

    return NextResponse.json({ success: true, message: "Item deleted" })
  } catch (err) {
    console.error("Delete Cart Item Error:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}