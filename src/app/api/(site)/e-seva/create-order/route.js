import Razorpay from "razorpay";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export async function POST(req) {
  try {
    const { esevaId } = await req.json();

    if (!esevaId) {
      return NextResponse.json({ error: "Missing esevaId" }, { status: 400 });
    }

    const amount = 1000 * 100; // Amount in paise

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${esevaId}_${Date.now()}`.slice(0, 40),
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
