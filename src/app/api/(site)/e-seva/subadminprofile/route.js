import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Razorpay from "razorpay";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export async function POST(request) {
  const {
    name,
    email,
    mobile,
    address,
    aadharno,
    aadhardoc,
    panno,
    pandoc,
    profilepic,
    password,
    esevaId,
    role,
  } = await request.json();

  try {
    const existingUser = await db.EsevaSubAdmin.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "SubAdmin with this email already exists" },
        { status: 400 }
      );
    }

    const activeSubAdminCount = await db.EsevaSubAdmin.count({
      where: { esevaId, status: "ACTIVE" },
    });

    const isPaymentRequired = activeSubAdminCount >= 4;

    const hashedPassword = await bcrypt.hash(password, 10);

    const subAdmin = await db.EsevaSubAdmin.create({
      data: {
        name,
        email,
        mobile,
        address,
        aadharno,
        aadhardoc,
        panno,
        pandoc,
        profilepic,
        password: hashedPassword,
        esevaId,
        role,
        status: isPaymentRequired ? "INACTIVE" : "ACTIVE",
      },
    });

    // Generate unique subadmin code
    const subAdminCode = await generateUniqueSubAdminCode();

    // Update the subadmin with the generated code
    await db.EsevaSubAdmin.update({
      where: { id: subAdmin.id },
      data: { subAdminCode },
    });

    if (isPaymentRequired) {
      // Logic to initiate payment of Rs. 365
      const amount = 365 * 100; // Amount in paise

      const order = await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt: `subadmin_rcpt_${subAdmin.id}_${Date.now()}`.slice(0, 40),
        payment_capture: 1,
      });

      await db.esevaSubAdminPayment.create({
        data: {
          subAdminId: subAdmin.id,
          esevaId,
          amount: amount / 100, // store in rupees
          paymentStatus: "PENDING",
          transactionId: order.id, // Razorpay order id
          forwhat: "SUBADMIN_REGISTRATION",
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Eseva SubAdmin created successfully! Payment required.",
          subAdmin,
          order,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Eseva SubAdmin created successfully!",
        subAdmin,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("SubAdmin creation error:", error);
    return NextResponse.json(
      { success: false, message: "SubAdmin creation failed", error: error.message },
      { status: 500 }
    );
  }
}

// Function to generate unique subadmin code
async function generateUniqueSubAdminCode() {
  const now = new Date();
  const datePart = `${now.getFullYear().toString().slice(-2)}${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;

  let uniqueCode;
  let isUnique = false;

  while (!isUnique) {
    uniqueCode =
      "SUB" + datePart + Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    const existingCode = await db.EsevaSubAdmin.findFirst({
      where: { subAdminCode: uniqueCode },
    });

    if (!existingCode) {
      isUnique = true;
    }
  }

  return uniqueCode;
}