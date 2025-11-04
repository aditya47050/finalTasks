import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      subAdminId,
      amount,
    } = await req.json();

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !subAdminId ||
      amount === undefined
    ) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await db.esevaSubAdminPayment.update({
        where: { transactionId: razorpay_order_id },
        data: { paymentStatus: "FAILED" },
      });
      return NextResponse.json(
        { success: false, message: "Signature mismatch" },
        { status: 400 }
      );
    }

    // Fetch subAdmin to get its parent Eseva ID
    const subAdmin = await db.EsevaSubAdmin.findUnique({
      where: { id: subAdminId },
    });

    if (!subAdmin) {
      return NextResponse.json(
        { success: false, message: "SubAdmin not found" },
        { status: 404 }
      );
    }

    const updatedPayment = await db.esevaSubAdminPayment.update({
      where: { transactionId: razorpay_order_id },
      data: {
        paymentStatus: "SUCCESS",
        transactionId: razorpay_payment_id,
      },
    });

    // Update subadmin status to ACTIVE after successful payment
    await db.EsevaSubAdmin.update({
      where: { id: subAdminId },
      data: {
        status: "ACTIVE",
      },
    });

    return NextResponse.json(
      { success: true, payment: updatedPayment },
      { status: 200 }
    );

  } catch (err) {
    console.error("Payment Verification Error:", err);
    return NextResponse.json(
      { success: false, message: "Verification failed" },
      { status: 500 }
    );
  }
}