import bcrypt from "bcryptjs";
import { db } from "@/lib/db"; 
import { NextResponse } from "next/server";

export async function POST(request) {
  const { token, newPassword } = await request.json();

  // Validate that the token exists
  if (!token) {
    return NextResponse.json({ success: false, message: "Token is required" }, { status: 400 });
  }

  // Find the user with the reset token
  const user = await db.JObUser.findFirst({
    where: { resetToken: token }
  });


  if (!user || user.resetTokenExpiration < new Date()) {
    return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password and clear the reset token
  await db.JObUser.update({
    where: { email: user.email }, // Assuming email is unique
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiration: null
    }
  });

  return NextResponse.json({ success: true, message: "Password has been reset successfully" });
}
