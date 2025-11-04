import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, designation, email, mobile, hspname, city, message } =
      await req.json();

    // Validations
    if (
      !name ||
      !designation ||
      !email ||
      !mobile ||
      !hspname ||
      !city ||
      !message
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(mobile)) {
      return NextResponse.json(
        { error: "Mobile number must be 10 digits." },
        { status: 400 }
      );
    }

    // Save to database
    const newEnquiry = await db.teleRadiologyEnq.create({
      data: { name, designation, email, mobile, hspname, city, message },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry Submitted successfully! Our team will connect you shortly",
        data: newEnquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting enquiry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
