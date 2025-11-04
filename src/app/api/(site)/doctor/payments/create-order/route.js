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
    const { doctorId } = body;

    if (!doctorId) {
      return NextResponse.json({ error: "Missing doctorId" }, { status: 400 });
    }

    // Fetch doctor from DB
    const doctor = await db.Doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      return NextResponse.json(
        { error: "Invalid Doctor ID" },
        { status: 404 }
      );
    }

    // Fixed yearly charge for doctors (₹365 = 36500 paise)
    const amountPaise = 36500;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `rcpt_${doctorId.slice(0, 8)}_${Date.now()}`,
      payment_capture: 1,
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
