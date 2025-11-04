import { db } from "@/lib/db"; // Make sure your db connection is correctly set up
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, otp } = await request.json();

  // Find OTP entry for the provided email
  const otpEntry = await db.Otp.findUnique({
    where: { email },
  });

  // Check if OTP entry exists and the OTP matches
  if (!otpEntry || otpEntry.otp !== otp) {
    return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
  }

  // Optionally, you can check if the OTP has expired (implement this if needed)
  // const otpExpirationTime = new Date(otpEntry.createdAt);
  // otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 5);
  // if (new Date() > otpExpirationTime) {
  //   return NextResponse.json({ success: false, message: "OTP expired" }, { status: 400 });
  // }

  // Delete the OTP entry after successful verification
  await db.Otp.delete({
    where: { email },
  });

  return NextResponse.json({ success: true, message: "OTP verified" }, { status: 200 });
}
