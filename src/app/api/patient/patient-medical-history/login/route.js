import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { encrypt } from "@/lib/getsession";

export async function POST(request, params) {
  try {
    const { email } = await request.json();

    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/patient/patient-medical-history/auth/?apikey=479693736527271&email=${email}`
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
