import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { token, newPassword } = await request.json();

  if (!token) {
    return NextResponse.json({ success: false, message: "Token is required" }, { status: 400 });
  }

  const pharmacy = await db.Pharmacy.findFirst({
    where: { resetToken: token },
  });

  if (!pharmacy || pharmacy.resetTokenExpiration < new Date()) {
    return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.Pharmacy.update({
    where: { email: pharmacy.email },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiration: null,
    },
  });

  return NextResponse.json({ success: true, message: "Password has been reset successfully" });
}
