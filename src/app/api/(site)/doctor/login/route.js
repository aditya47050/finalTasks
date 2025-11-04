import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { encrypt } from "@/lib/getsession";

export async function POST(request, params) {
  const host = request.headers.get("host");

  try {
    const { email, password ,mobile } = await request.json();
    if (host.includes('aarogyaadhar.in')) {
      apiUrl = process.env.NEXT_PUBLIC_APP_URL_ALT; // Use the alternate URL for .in domain
    }
    let apiUrl = process.env.NEXT_PUBLIC_APP_URL;

    const resp = await fetch(
      `${apiUrl}/api/doctor/auth/?apikey=479693736527271&email=${email}&password=${password}&mobile=${mobile}`
    );

    const data = await resp.json();

        if (!resp.ok) {
      // Return a friendly message from the API if it exists
      return new NextResponse(JSON.stringify({ msg: data?.msg || "Login failed. Please check your credentials." }), {
        status: resp.status,
      });
    }

// Validate the structure of `data` before accessing properties
if (!data || !data.doctor || !data.doctor.id || !data.doctor.email) {
  throw new Error("Invalid response structure");
}

const payload = {
  id: data.doctor.id,
  email: data.doctor.email,
  mobile: data.doctor.mobile,
  password: data.doctor.password, 
  role: data.doctor.role
};

    // Create the session
    const session = await encrypt({ ...payload });

    // Save the session in a cookie
    cookies().set("session", session, { httpOnly: true });

    return new NextResponse(JSON.stringify({ msg: "login Susscesfully !!" }), { status: 200 });
  } catch (error) {
    console.log("Login ", error);
    const errorMessage = error.message || "Something went wrong. Please try again.";
    return new NextResponse(JSON.stringify({ msg: errorMessage }), { status: 500 });
  }
}
