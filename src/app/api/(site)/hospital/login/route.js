import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { encrypt } from "@/lib/getsession";
import { db } from "@/lib/db";

export async function POST(request, params) {
  try {
    const { email, password, mobile, role } = await request.json();
    const host = request.headers.get("host");
    let apiUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (host.includes("aarogyaadhar.in")) {
      apiUrl = process.env.NEXT_PUBLIC_APP_URL_ALT; // Use the alternate URL for .in domain
    }

    const resp = await fetch(
      `${apiUrl}/api/hospital/auth/?apikey=479693736527271&email=${email}&password=${password}&mobile=${mobile}&role=${role}`
    );

      const data = await resp.json();

    if (!resp.ok) {
       throw new Error(data.msg || "Failed to login an account");
    }

    // Validate the structure of `data` before accessing properties
    if (!data || !data.id || !data.email) {
      throw new Error("Invalid response structure");
    }

    // Check if this is a receptionist login by checking if the email exists in receptionist table
    const isReceptionist = await db.receptionist.findUnique({ 
      where: { email: email } 
    });

    let payload;
    if (isReceptionist) {
      // For receptionist, store receptionist data but include hospital info for dashboard
      payload = {
        id: isReceptionist.id,
        email: isReceptionist.email,
        mobile: isReceptionist.mobile,
        role: isReceptionist.role || 'receptionist',
        hospitalId: isReceptionist.hospitalId,
        password:isReceptionist.password,
        hospital: data
      };
    } else {
      // For hospital, store hospital data
      payload = {
        email: data.email,
        password,
        mobile: data.mobile,
        role: data.role,
        
      };
    }

    // Create the session
    const session = await encrypt({ ...payload });

    // Save the session in a cookie
const cookieStore = await cookies();
cookieStore.set("session", session, {
  httpOnly: true,
  path: "/",  // ✅ makes cookie accessible across whole app
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
});

    return new NextResponse(JSON.stringify({ msg: "login Susscesfully !!" }));
  } catch (error) {
    console.log("Login ", error);
    return new NextResponse(JSON.stringify({ msg: error.message }), { 
      status: 500 
    });
  }
}
