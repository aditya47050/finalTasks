import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { encrypt } from "@/lib/getsession";

export async function POST(request) {
  try {
    const { email, password, mobile } = await request.json();
    const host = request.headers.get("host");
    let apiUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (host.includes("aarogyaadhar.in")) {
      apiUrl = process.env.NEXT_PUBLIC_APP_URL_ALT; // Use the alternate URL for .in domain
    }

    const resp = await fetch(
      `${apiUrl}/api/corporate/auth/?apikey=479693736527271&email=${email}&password=${password}&mobile=${mobile}`
    );
    let data = {};

    try {
      data = await resp.json();
    } catch {
      // If the response is not JSON, provide a default message
      return new NextResponse(JSON.stringify({ msg: "Invalid response from auth server" }), { status: 500 });
    }

    if (!resp.ok) {
      return new NextResponse(JSON.stringify({ msg: data?.msg || "Failed to login" }), { status: resp.status });
    }

    // Validate the structure of `data` before accessing properties
    if (!data || !data.id || !data.email) {
      throw new Error("Invalid response structure");
    }

    const payload = {
      email: data.email,
      password: data.password,
      mobile: data.mobile,
    };

    // Create the session
    const session = await encrypt({ ...payload });

    // ✅ Correct: await cookies()
    const cookieStore = await cookies();
    cookieStore.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return new NextResponse(JSON.stringify({ msg: "login Susscesfully !!" }));
  } catch (error) {
    console.log("Login ", error);
 return new NextResponse(JSON.stringify({ msg: error?.message || "Unexpected error" }), { status: 500 });
  }
}
