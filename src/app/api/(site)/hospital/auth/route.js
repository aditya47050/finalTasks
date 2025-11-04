import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const apikey = searchParams.get("apikey");
    const email = searchParams.get("email");
    const password = searchParams.get("password");
    const mobile = searchParams.get("mobile");
    const role = searchParams.get("role");

    if (!apikey || !email || !password || !role || apikey !== "479693736527271") {
      return NextResponse.json({ msg: "Invalid credentials" }, { status: 401 });
    }

    // 1️⃣ Check receptionist first
    const receptionist = await db.receptionist.findUnique({ where: { email } });
    if (receptionist) {
      const passOk = await bcrypt.compare(password, receptionist.password);
      if (!passOk) return NextResponse.json({ msg: "Incorrect password" }, { status: 401 });
      if (mobile && mobile !== receptionist.mobile) return NextResponse.json({ msg: "Incorrect mobile" }, { status: 401 });

      const linkedHospital = await db.hospital.findUnique({ where: { id: receptionist.hospitalId } });
      if (!linkedHospital) return NextResponse.json({ msg: "No linked hospital found" }, { status: 404 });

      return NextResponse.json({ ...linkedHospital, receptionistId: receptionist.id }, { status: 200 });
    }

    // 2️⃣ Then check hospital
    const hospital = await db.hospital.findUnique({ where: { email } });
    if (hospital) {
      const passwordMatch = await bcrypt.compare(password, hospital.password);
      if (!passwordMatch) return NextResponse.json({ msg: "Incorrect password" }, { status: 401 });
      if (mobile && mobile !== hospital.mobile) return NextResponse.json({ msg: "Incorrect mobile" }, { status: 401 });

      return NextResponse.json(hospital, { status: 200 });
    }

    return NextResponse.json({ msg: "User not found" }, { status: 404 });

  } catch (error) {
    console.error("Hospital login error:", error);
    return NextResponse.json({ msg: error.message || "Unexpected error" }, { status: 500 });
  }
}

