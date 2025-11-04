import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const { email, password, mobile, apikey } = await request.json();

    if (!apikey || !email || !mobile || !password || apikey !== "479693736527271") {
      throw new Error("Invalid credentials");
    }

    let user = await db.Ambulance.findUnique({ where: { email } });
    let userType = "Ambulance";

    if (!user) {
      user = await db.AmbulanceDriver.findUnique({ where: { email } });
      userType = "AmbulanceDriver";
    }

    if (!user) {
      throw new Error("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Incorrect password, Please try again.");
    }

    if (user.mobile !== mobile) {
      throw new Error("Incorrect mobile number.");
    }

    return NextResponse.json({ userType }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error.message);
    return NextResponse.json({ msg: error.message }, { status: 400 });
  }
}