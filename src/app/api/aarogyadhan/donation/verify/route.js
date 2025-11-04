import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      donationId,
    } = body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      // Update the donation status to SUCCESS
      await db.donation.update({
        where: { id: donationId },
        data: {
          paymentStatus: "SUCCESS",
          transactionId: razorpay_payment_id,
        },
      });

      // Retrieve the donation amount and the associated campaign
      const donation = await db.donation.findUnique({
        where: { id: donationId },
        select: {
          amount: true,
          campaign: {
            select: {
              id: true,
              recievedamount: true,
            },
          },
        },
      });

      // Calculate the new received amount
      const newReceivedAmount =
        parseFloat(donation.campaign.recievedamount || "0") +
        parseFloat(donation.amount);

      // Update the received amount in the fundraising campaign
      await db.fundraisingCampaign.update({
        where: { id: donation.campaign.id },
        data: {
          recievedamount: newReceivedAmount.toString(),
        },
      });

      return NextResponse.json({ success: true });
    } else {
      await db.donation.update({
        where: { id: donationId },
        data: {
          paymentStatus: "FAILED",
        },
      });

      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
