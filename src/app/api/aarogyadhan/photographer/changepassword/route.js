// pages/api/change-password.js
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const session = await getSession();
  const useremail = session?.email; // Assuming the email is stored in the session

  if (!useremail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { password } = await request.json();

  // Basic validation
  if (!password) {
    return NextResponse.json(
      { error: "New password is required" },
      { status: 400 }
    );
  }

  try {
    // Find the user
    const user = await db.photographer.findUnique({
      where: { email: useremail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await db.photographer.update({
      where: { email:useremail },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password changed successfully!" });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "An error occurred while changing the password." },
      { status: 500 }
    );
  }
}
