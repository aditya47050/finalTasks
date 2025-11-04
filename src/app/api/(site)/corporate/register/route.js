import bcrypt from "bcryptjs";
import { db } from "@/lib/db"; // Make sure your db connection is correctly set up
import { NextResponse } from "next/server";

export async function POST(request) {
  const { mobile, email, password, pincode } = await request.json();

  // Check if the email is already registered
  const existingUser = await db.Corporate.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { success: false, message: "Email already registered" },
      { status: 400 }
    );
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user in the database
  const user = await db.Corporate.create({
    data: { mobile, email, pincode, password: hashedPassword },
  });

  return NextResponse.json(
    { success: true, message: "New Doctor created", user },
    { status: 201 }
  );
}
