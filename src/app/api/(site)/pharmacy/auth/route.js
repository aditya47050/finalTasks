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

    if (!apikey || !email || !mobile || !password || apikey !== "479693736527271") {
      throw new Error("Invalid credentials");
    }

    // ✅ Change model from Patient → Pharmacy
    const pharmacyUser = await db.Pharmacy.findUnique({
      where: { email: email },
    });
                if (!pharmacyUser) {
      return new NextResponse(JSON.stringify({ msg: "User not found." }), {
        status: 404,
      });
    }

    // ✅ Compare password hash
    const passwordMatch = await bcrypt.compare(password, pharmacyUser.password);
    if (!passwordMatch) {
      throw new Error("Incorrect password, Please try again.");
    }

    // ✅ Check mobile
    if (mobile !== pharmacyUser.mobile) {
      throw new Error("Incorrect Mobile Number, Please try again.");
    }

    return new NextResponse(JSON.stringify(pharmacyUser), { status: 200 });
  } catch (error) {
    console.log("Pharmacy login error:", error);
    return new NextResponse(JSON.stringify({ msg: error.message }), {
      status: 500,
    });
  }
}
