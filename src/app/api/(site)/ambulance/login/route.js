import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { encrypt } from "@/lib/getsession";

export async function POST(request, params) {
  try {
    const { email, password, mobile } = await request.json();
    const host = request.headers.get("host");
    
    let apiUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (host.includes("aarogyaadhar.in")) {
      apiUrl = process.env.NEXT_PUBLIC_APP_URL_ALT;
    }

    const resp = await fetch(
      `${apiUrl}/api/ambulance/auth`,
      {
        method: "POST", // Ensure the method is POST
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, mobile, apikey: "479693736527271" })
      }
    );

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({})); // Handle non-JSON responses
      throw new Error(errorData.msg || "Failed to login an account");
    }

    const data = await resp.json();

    // Validate returned user structure
    if (!data?.userType) {
      throw new Error("Invalid response structure");
    }

    const payload = {
      email,
      password,
      mobile,
      role: data.userType,
    };

    // Encrypt and store session cookie
    const session = await encrypt(payload);
    await cookies().set("session", session, { httpOnly: true }); // Ensure cookies() is awaited

    return new NextResponse(JSON.stringify({ msg: "Login successfully!", userType: data.userType }));
  } catch (error) {
    console.log("Login Error:", error);
    return new NextResponse(JSON.stringify({ msg: error.message }), {
      status: 500,
    });
  }
}