import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      patientId,
      amount,
      esevaId,
      subAdminId,
    } = body;

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !patientId
    ) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    // ✅ Step 1: Verify signature
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

    // ✅ Step 2: Save payment to DB
    const paymentRecord = await db.PatientPayment.create({
      data: {
        patientId,
        amount: amount / 100,
        paymentStatus: "SUCCESS",
        transactionId: razorpay_payment_id,
        forwhat: "Registration",
        esevaId: esevaId || null,
        esevaSubAdminId: subAdminId || null,
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
