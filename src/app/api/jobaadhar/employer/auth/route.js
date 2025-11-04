import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const email = searchParams.get("email");
    const password = searchParams.get("password");
    const mobile = searchParams.get("mobile");
    const apikey = searchParams.get("apikey");

    if (!apikey || apikey !== "479693736527271" || !email || !password || !mobile) {
      return new NextResponse(JSON.stringify({ msg: "Invalid credentials provided." }), { status: 400 });
    }

    // Find the user
    const user = await db.JObUser.findUnique({
      where: { email },
      include: { employer: true }, // include employer info
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ msg: "User not found." }), { status: 404 });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return new NextResponse(JSON.stringify({ msg: "Incorrect password." }), { status: 401 });
    }

    // Check mobile
    if (mobile !== user.phone) {
      return new NextResponse(JSON.stringify({ msg: "Incorrect Mobile Number." }), { status: 401 });
    }

    // Check if user is an employer
    if (!user.employer) {
      return new NextResponse(JSON.stringify({ msg: "Not an employer account." }), { status: 403 });
    }

    // ✅ Check employer status
    if (user.employer.status !== "approved") {
      return new NextResponse(
        JSON.stringify({ msg: "Your account is pending admin approval." }),
        { status: 403 }
      );
    }

    // Success
    return new NextResponse(JSON.stringify(user), { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return new NextResponse(JSON.stringify({ msg: "Server error. Please try again later." }), { status: 500 });
  }
}
