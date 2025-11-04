import { NextResponse } from "next/server"
import { db } from "@/lib/db";


export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[0-9+\-\s()]{10,}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 })
    }

    // ✅ Save to database using Prisma
    const savedContact = await db.contact.create({
      data: {
        name,
        email,
        phone,
        message,
      },
    })

    console.log("[v1] Contact form saved:", savedContact)

    return NextResponse.json(
      {
        success: true,
        message: "Thank You For Submitting Form, We Will Shortly Connect With You!",
        data: savedContact,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v1] Contact form error:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
