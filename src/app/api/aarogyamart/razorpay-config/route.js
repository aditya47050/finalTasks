import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Only return the public key ID that's safe to expose to client
    // The secret key remains server-side only
    return NextResponse.json(
      {
        keyId: process.env.RAZORPAY_KEY_ID,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Razorpay Config Error:", error)
    return NextResponse.json({ error: "Configuration failed" }, { status: 500 })
  }
}
