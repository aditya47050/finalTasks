import Razorpay from "razorpay";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Initialize Razorpay client
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { patientId } = body;

    if (!patientId) {
      return NextResponse.json({ error: "Missing patientId" }, { status: 400 });
    }

    // Fetch patient from DB (optional validation)
    const patient = await db.Patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return NextResponse.json(
        { error: "Invalid Patient ID" },
        { status: 404 }
      );
    }

    // Amount in paise (₹100 = 10000 paise)
    const amount = 10000;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: `rcpt_${patientId.slice(0, 8)}_${Date.now()}`,

      payment_capture: 1, // Auto-capture payment
    });

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}
