import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export async function POST(req) {
  try {
    const { subAdminId, esevaId } = await req.json();

    if (!subAdminId) {
      return NextResponse.json({ error: "Missing subAdminId" }, { status: 400 });
    }

    const amount = 365 * 100; // Rs. 365 in paise

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `subadmin_rcpt_${subAdminId}_${Date.now()}`.slice(0, 40),
      payment_capture: 1,
    });

    // Check for existing pending payment
    const existingPayment = await db.esevaSubAdminPayment.findFirst({
      where: {
        subAdminId,
        paymentStatus: "PENDING",
      },
    });

    if (existingPayment) {
      // Update the existing payment record
      await db.esevaSubAdminPayment.update({
        where: { id: existingPayment.id },
        data: {
          transactionId: order.id, // Update with new order ID if needed
          // Other fields to update if necessary
        },
      });
    } else {
      // Create a new payment record if no pending payment exists
      await db.esevaSubAdminPayment.create({
        data: {
          subAdminId,
          esevaId,
          amount: amount / 100, // store in rupees
          paymentStatus: "PENDING",
          transactionId: order.id, // Razorpay order id
          forwhat: "SUBADMIN_REGISTRATION",
        },
      });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}