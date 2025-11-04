import bcrypt from "bcryptjs";
import { db } from "@/lib/db"; // Ensure your db connection is correctly set up
import { NextResponse } from "next/server";

export async function POST(request) {
  const { mobile, email, password, pincode ,role } = await request.json();

  // Check if the email is already registered
  const existingUser = await db.Hospital.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
const allowedRoles = ["Hospital", "Clinic", "Center", "PathologyLab", "DiagnosticCenter"];
if (!allowedRoles.includes(role)) {
  return res.status(400).json({ message: "Invalid role" });
}

  // Create the new hospital with the required relations
  const hospital = await db.Hospital.create({
    data: {
      mobile: mobile || "",
      email: email || "",
      password: hashedPassword,
      pincode: pincode || "",
      role: role || "hospital",
      hspInfo: {
        create: {
      
        },
      },
      hspdetails: {
        create: {
  
        },
      },
      hspcontact: {
        create: {
  
        },
      },
    },
  });

  return NextResponse.json(
    { success: true, message: "New Hospital created", hospital },
    { status: 201 }
  );
}
