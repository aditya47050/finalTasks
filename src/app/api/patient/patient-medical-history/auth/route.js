import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";

export async function GET(request, params) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const apikey = searchParams.get("apikey");
    const email = searchParams.get("email");

    if (!apikey || !email || apikey !== "479693736527271") {
      throw new Error("Invalid credentials");
    }

    const Patient = await db.Patient.findUniqueOrThrow({
      where: { email: email },
    });

    return new NextResponse(JSON.stringify(Patient), { status: 200 });
  } catch (error) {
    console.log("Patient", error);
    return new NextResponse(JSON.stringify({ msg: error.message }), {
      status: 500,
    });
  }
}
