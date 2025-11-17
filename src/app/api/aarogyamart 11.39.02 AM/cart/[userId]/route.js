// GET /api/aarogyamart/cart/[userId]
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req, { params }) {
  try {
    const { userId } = await params

    const cart = await db.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: { include: { brand: true } },
          },
        },
      },
    })

    if (!cart) {
      return NextResponse.json({ success: true, data: { items: [] } })
    }

    return NextResponse.json({ success: true, data: cart })
  } catch (err) {
    console.error("Get Cart Error:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req, { params }) {
  try {
    const { userId } = params
    const body = await req.json()
    const { productId, quantity = 1 } = body

    // Get product details
    const product = await db.productMart.findUnique({
      where: { id: productId },
      include: { brand: true },
    })

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    // Ensure user cart exists
    let cart = await db.cart.findUnique({ where: { userId } })
    if (!cart) {
      cart = await db.cart.create({ data: { userId } })
    }

    // Check if product already in cart
    const existingItem = await db.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    })

    if (existingItem) {
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      })
    } else {
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price: product.price,
          name: product.name,
          image: product.image,
          brand: product.brand?.name || null,
        },
      })
    }

    // Return full updated cart
    const updatedCart = await db.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: { include: { brand: true } },
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: updatedCart })
  } catch (err) {
    console.error("Add to Cart Error:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
