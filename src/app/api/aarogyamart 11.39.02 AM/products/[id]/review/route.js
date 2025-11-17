// src/app/api/aarogyamart/products/[id]/review/route.js
import { db } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth" // your NextAuth config

export async function GET(req, { params }) {
  const productId = await params.id

  try {
    const reviews = await db.review.findMany({
      where: { productId },
      orderBy: { date: "desc" },
    })
    return new Response(JSON.stringify({ reviews }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Failed to fetch reviews" }), { status: 500 })
  }
}

export async function POST(req, { params }) {
  const productId = params.id

  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response(JSON.stringify({ error: "You must be logged in to submit a review" }), {
        status: 401,
      })
    }

    const body = await req.json()
    const { rating, comment } = body

    if (!rating || !comment) {
      return new Response(JSON.stringify({ error: "Rating and comment are required" }), { status: 400 })
    }

    const userEmail = session.user.email
    const userId = session.user.id
    const userType = session.user.role || "patient"
    const verified = userType === "patient"

    const newReview = await db.review.create({
      data: {
        rating,
        comment,
        verified,
        productId,
        userId,
        userEmail,
        userType,
      },
    })

    return new Response(JSON.stringify({ review: newReview }), { status: 201 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Failed to add review" }), { status: 500 })
  }
}
