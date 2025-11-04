import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import nodemailer from "nodemailer";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Function to generate a random password
function generateRandomPassword() {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*()_+[]{}|;:,.<>?";
  const all = upper + lower + numbers + special;

  let password = "";
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  for (let i = 4; i < 8; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  return password;
}

// Function to send email
async function sendEmail(to, password) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Welcome to Aarogya Dhan",
    text: `Thank you for your donation! Your account has been created. Here is your password: ${password}`,
  };

  await transporter.sendMail(mailOptions);
}

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      donorName,
      donorEmail,
      donorMobile,
      amount,
      wantsTaxBenefit,
      panNumber,
      panCardImage,
      aadharNumber,
      aadharCardImage,
      campaignId,
    } = body;

    // Check if donor exists
    let donor = await db.donor.findUnique({
      where: { email: donorEmail },
    });

    // If donor does not exist, create a new donor
    if (!donor) {
      const password = generateRandomPassword();
      donor = await db.donor.create({
        data: {
          fullname: donorName,
          email: donorEmail,
          mobile: donorMobile,
          password,
          pancardno: panNumber,
          pancardimage: panCardImage,
          aadharcardno: aadharNumber,
          aadharcardimage: aadharCardImage,
        },
      });

      // Send email with the password
      await sendEmail(donorEmail, password);
    }

    // Create donation
    const donation = await db.donation.create({
      data: {
        donorName,
        donorEmail,
        donorMobile,
        amount,
        wantsTaxBenefit,
        panNumber,
        panCardImage,
        aadharNumber,
        aadharCardImage,
        campaignId,
        paymentStatus: "PENDING",
        donorId: donor.id,
      },
    });

    const order = await razorpay.orders.create({
      amount: Number(amount) * 100, // Razorpay uses paise
      currency: "INR",
      receipt: donation.id,
    });

    return NextResponse.json({
      success: true,
      donationId: donation.id,
      orderId: order.id,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
