
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
    const { hospitalId } = body;

    if (!hospitalId) {
      return NextResponse.json({ error: "Missing hospitalId" }, { status: 400 });
    }

    // Fetch hospital from DB
    const hospital = await db.Hospital.findUnique({ where: { id: hospitalId } });
    if (!hospital) {
      return NextResponse.json(
        { error: "Invalid Hospital ID" },
        { status: 404 }
      );
    }

    // Calculate yearly amount depending on role
    let amountRs = 1825; // default for Clinic, homehealthcare, Pathology, DiagnosticCenter
    if (hospital.role === "Hospital") {
      amountRs = 3650;
    }
    // check role explicitly for all other types if you want
    // if (["Clinic", "homehealthcare", "Pathology", "DiagnosticCenter"].includes(hospital.role)) amountRs = 1825;

    const amountPaise = amountRs * 100; // Razorpay uses paise

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `rcpt_${hospitalId.slice(0, 8)}_${Date.now()}`,
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