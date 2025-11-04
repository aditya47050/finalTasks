import { db } from "@/lib/db"; // Make sure your db connection is correctly set up
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, otp } = await request.json();

  // Find OTP entry for the provided email
  const otpEntry = await db.AmbulanceBookingOTP.findUnique({
    where: { email },
  });

  // Check if OTP entry exists and the OTP matches
  if (!otpEntry || otpEntry.otp !== otp) {
    return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
  }

 
  // Delete the OTP entry after successful verification
  await db.AmbulanceBookingOTP.delete({
    where: { email },
  });

  return NextResponse.json({ success: true, message: "OTP verified" }, { status: 200 });
}
