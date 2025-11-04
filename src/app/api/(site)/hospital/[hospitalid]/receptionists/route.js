import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { generateSecurePassword } from "@/lib/utils/passwordGenerator";
import { sendPasswordEmail } from "@/lib/utils/sendrandompasswordmail";

export async function GET(req, { params }) {
  try {
    const hospitalId = params.hospitalid;
    if (!hospitalId) {
      return NextResponse.json({ error: "Hospital ID is required" }, { status: 400 });
    }

    // Ensure hospital exists
    const hospital = await db.hospital.findFirst({ where: { id: hospitalId } });
    if (!hospital) {
      return NextResponse.json({ error: "Hospital not found" }, { status: 404 });
    }

    const receptionists = await db.receptionist.findMany({
      where: { hospitalId },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, mobile: true, createdAt: true },
    });

    return NextResponse.json({ receptionists });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    const hospitalId = params.hospitalid;
    const { name, email, mobile, password } = await req.json();

    if (!hospitalId || !name || !email || !mobile) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate hospital
    const hospital = await db.hospital.findFirst({ where: { id: hospitalId } });
    if (!hospital) {
      return NextResponse.json({ error: "Hospital not found" }, { status: 404 });
    }

    // Check if email already used
    const existing = await db.receptionist.findFirst({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Receptionist with this email already exists" },
        { status: 409 }
      );
    }

    const plainPassword = password && String(password).length >= 6 ? String(password) : generateSecurePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const receptionist = await db.receptionist.create({
      data: {
        name,
        email,
        mobile,
        password: hashedPassword,
        hospital: { connect: { id: hospitalId } },
      },
      select: { id: true, name: true, email: true, mobile: true, createdAt: true },
    });

    // Send credentials via email
    try {
      await sendPasswordEmail(email, plainPassword || "", "Receptionist");
    } catch (mailError) {
      // Do not fail creation if email fails; return warning
      return NextResponse.json(
        { receptionist, warning: "Receptionist created but email could not be sent" },
        { status: 201 }
      );
    }

    return NextResponse.json({ receptionist }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}


