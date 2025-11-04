import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    const body = await req.json();
    const { email, mobile, name, designation, gender, category } = body;

    // Validation
    if (!name || !designation || !email || !mobile || !gender || !category) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!/^\d+$/.test(mobile)) {
      return NextResponse.json({ error: "Mobile must be a valid number" }, { status: 400 });
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return NextResponse.json({ error: "Name must contain only letters" }, { status: 400 });
    }

    if (!/^[a-zA-Z\s]+$/.test(designation)) {
      return NextResponse.json({ error: "Designation must contain only letters" }, { status: 400 });
    }

    // Store in database
    const newEntry = await db.corporateHealthEnq.create({
      data: { email, mobile, name, designation, gender, category },
    });

    return NextResponse.json({ success: true, data: newEntry }, { status: 201 });
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
