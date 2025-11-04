import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      esevaId,
      amount, // Ensure amount is included in the request body
    } = await req.json();

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !esevaId ||
      amount === undefined // Check if amount is provided
    ) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Signature mismatch" },
        { status: 400 }
      );
    }

    const paymentRecord = await db.EsevaPayment.create({
      data: {
        esevaId,
        amount: amount/100, // Include the amount in the payment record
        paymentStatus: "SUCCESS",
        forwhat: "Registration",
        transactionId: razorpay_payment_id,
      },
    });

    return NextResponse.json(
      { success: true, payment: paymentRecord },
      { status: 200 }
    );
  } catch (err) {
    console.error("Verification Error:", err);
    return NextResponse.json(
      { success: false, message: "Verification failed" },
      { status: 500 }
    );
  }
}