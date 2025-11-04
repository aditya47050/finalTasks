import { NextResponse } from "next/server"
import { db } from "@/lib/db"   // adjust path if needed

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query") || ""

    if (!query.trim()) {
      return NextResponse.json({ products: [] }, { status: 200 })
    }

    const products = await db.productMart.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { keywords: { hasSome: [query.toLowerCase()] } }, 
        ],
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        category: { select: { name: true } },
        brand: { select: { name: true } },
        keywords:true,
        description:true,
        inStock:true,
        reviews:true,
      },
      take: 8,
    })

    return NextResponse.json({ products }, { status: 200 })
  } catch (error) {
    console.error("Search API Error:", error)
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 })
  }
}
