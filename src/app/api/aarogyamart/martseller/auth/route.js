import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function GET(request, params) {
  try {
    const searchParams = new URL(request.url).searchParams
    const apikey = searchParams.get("apikey")
    const email = searchParams.get("email")
    const password = searchParams.get("password")
    const mobile = searchParams.get("mobile")

    if (!apikey || !email || !mobile || !password || apikey !== "479693736527271") {
      return new NextResponse(JSON.stringify({ msg: "Invalid credentials provided." }), {
        status: 400,
      });
    }

    const Patient = await db.MartSeller.findUnique({
      where: { email },
    });

    if (!Patient) {
      return new NextResponse(JSON.stringify({ msg: "User not found." }), {
        status: 404,
      });
    }

    const passwordMatch = await bcrypt.compare(password, Patient.password);
    if (!passwordMatch) {
      return new NextResponse(JSON.stringify({ msg: "Incorrect password. Please try again." }), {
        status: 401,
      });
    }

    if (mobile !== Patient.mobile) {
      return new NextResponse(JSON.stringify({ msg: "Incorrect Mobile Number." }), {
        status: 401,
      });
    }

    
    return new NextResponse(JSON.stringify(Patient), { status: 200 });
  } catch (error) {
    console.error("Patient:", error);
    return new NextResponse(JSON.stringify({ msg: "Server error. Please try again later." }), {
      status: 500,
    });
  }
}
