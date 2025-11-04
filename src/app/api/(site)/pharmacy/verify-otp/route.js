import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, otp } = await request.json();

  // ✅ 1. Find OTP entry for pharmacy email
  const otpEntry = await db.Otp.findFirst({
    where: { email },
  });

  if (!otpEntry || otpEntry.otp !== otp) {
    return NextResponse.json(
      { success: false, message: "Invalid OTP" },
      { status: 400 }
    );
  }

  // ✅ 2. (Optional) Check OTP expiry (5 minutes)
  // const otpExpirationTime = new Date(otpEntry.createdAt);
  // otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 5);
  // if (new Date() > otpExpirationTime) {
  //   return NextResponse.json({ success: false, message: "OTP expired" }, { status: 400 });
  // }

  // ✅ 3. Delete OTP after successful verification
  await db.Otp.delete({
    where: { id: otpEntry.id },
  });

  return NextResponse.json(
    { success: true, message: "OTP verified successfully" },
    { status: 200 }
  );
}
