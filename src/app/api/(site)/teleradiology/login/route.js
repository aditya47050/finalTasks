import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { encrypt } from "@/lib/getsession";

export async function POST(request, params) {
  try {
    const { email, password ,mobile } = await request.json();
    const host = request.headers.get("host");
    let apiUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (host.includes('aarogyaadhar.in')) {
      apiUrl = process.env.NEXT_PUBLIC_APP_URL_ALT; // Use the alternate URL for .in domain
    }

    const resp = await fetch(
      `${apiUrl}/api/teleradiology/auth/?apikey=479693736527271&email=${email}&password=${password}&mobile=${mobile}`
    );

    if (!resp.ok) {
      const errorData = await resp.json(); // Capture the error response
      throw new Error(errorData.msg || "Failed to login an account");
    }

    const data = await resp.json();

    // Validate the structure of `data` before accessing properties
    if (!data || !data.id || !data.email) {
      throw new Error("Invalid response structure");
    }

    const payload = {
      email: data.email,
      password: data.password,
      mobile :data.mobile
    };

    // Create the session
    const session = await encrypt({ ...payload });

    // Save the session in a cookie
    cookies().set("session", session, { httpOnly: true });

    return new NextResponse(JSON.stringify({ msg: "login Susscesfully !!" }));
  } catch (error) {
    console.log("Login ", error);
    return new NextResponse(JSON.stringify({ msg: error.response.data.msg }), {
      status: 500,
    });
  }
}
