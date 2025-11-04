// src/app/api/aarogyamart/products/related/[id]/route.js
import { db } from "@/lib/db"

export async function GET(req, { params }) {
  try {
    const { id } = params   // ✅ no need for await

    // Fetch current product
    const product = await db.ProductMart.findUnique({
      where: { id },
      select: { brand: true },
    })

    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 })
    }

    // Fetch related products by category
    const relatedProducts = await db.ProductMart.findMany({
      where: {
        brand: product.brand,
        NOT: { id },
      },
      take: 4, // limit for performance
    })

    return new Response(JSON.stringify({ relatedProducts }), { status: 200 })
  } catch (err) {
    console.error("Related products fetch error:", err)
    return new Response(JSON.stringify({ error: "Failed to fetch related products" }), { status: 500 })
  }
}
