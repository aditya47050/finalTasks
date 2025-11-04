import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, mobile, why, cost } = body;

    // Backend validation
    if (!name || /\d/.test(name)) {
      return NextResponse.json({ message: "Name cannot contain numbers" }, { status: 400 });
    }
    if (!/^\d{10}$/.test(mobile)) {
      return NextResponse.json({ message: "Mobile must be exactly 10 digits" }, { status: 400 });
    }
    if (!why || !cost) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Save to database
    const enquiry = await prisma.aarogyadhanEnq.create({
      data: { name, mobile, why, cost },
    });

    return NextResponse.json({ message: "Enquiry submitted successfully", enquiry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
