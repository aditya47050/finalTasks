// src/app/api/wishlist/[userId]/route.js
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

// Get Wishlist
export async function GET(req, { params }) {
  try {
    const { userId } = params

    let wishlist = await db.wishlist.findUnique({
      where: { userId },
      include: { items: true },
    })

    // Auto-create wishlist if not exists
    if (!wishlist) {
      wishlist = await db.wishlist.create({
        data: { userId },
        include: { items: true },
      })
    }

    return NextResponse.json(wishlist, { status: 200 })
  } catch (err) {
    console.error("GET wishlist error:", err)
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
  }
}

// Add Item
export async function POST(req, { params }) {
  try {
    const { userId } = params
    const body = await req.json()
    const { productId, name, price, image, brand } = body

    let wishlist = await db.wishlist.findUnique({ where: { userId } })
    if (!wishlist) {
      wishlist = await db.wishlist.create({ data: { userId } })
    }

    const item = await db.wishlistItem.create({
      data: {
        productId,
        name,
        price,
        image,
        brand,
        wishlistId: wishlist.id,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (err) {
    console.error("POST wishlist error:", err)
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 })
  }
}

// Remove Item
export async function DELETE(req, { params }) {
  try {
    const { userId } = params
    const { searchParams } = new URL(req.url)
    const itemId = searchParams.get("itemId")

    if (!itemId) {
      return NextResponse.json({ error: "itemId required" }, { status: 400 })
    }

    await db.wishlistItem.delete({ where: { id: itemId } })

    return NextResponse.json({ message: "Item removed" }, { status: 200 })
  } catch (err) {
    console.error("DELETE wishlist error:", err)
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 })
  }
}
