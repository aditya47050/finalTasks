import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { encrypt } from "@/lib/getsession";

export async function POST(request) {
  try {
    const { email, password, mobile } = await request.json();
    const host = request.headers.get("host") || "";
    let apiUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (host.includes("aarogyaadhar.in")) {
      apiUrl = process.env.NEXT_PUBLIC_APP_URL_ALT;
    }

    const resp = await fetch(
      `${apiUrl}/api/pharmacy/auth/?apikey=479693736527271&email=${email}&password=${password}&mobile=${mobile}`
    );

    const data = await resp.json();

    if (!resp.ok) {
      return new NextResponse(
        JSON.stringify({ msg: data.msg || "Failed to login pharmacy account" }),
        { status: resp.status }
      );
    }

    if (!data?.email) {
      return new NextResponse(
        JSON.stringify({ msg: "Invalid pharmacy credentials" }),
        { status: 400 }
      );
    }

    const payload = {
      email: data.email,
      password: data.password,
      mobile: data.mobile,
      role: "Pharmacy"
    };

    const session = await encrypt(payload);

    cookies().set("session", session, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return new NextResponse(
      JSON.stringify({ msg: "Pharmacy Login Successfully!!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Pharmacy login error:", error);
    return new NextResponse(
      JSON.stringify({ msg: error.message || "Something went wrong" }),
      { status: 500 }
    );
  }
}
