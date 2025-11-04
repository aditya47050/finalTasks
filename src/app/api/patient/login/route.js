import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { encrypt } from "@/lib/getsession";
import { db } from '@/lib/db';

export async function POST(request, params) {
  try {
    const { email, password, mobile } = await request.json();
    const host = request.headers.get("host");

    let apiUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (host.includes("aarogyaadhar.in")) {
      apiUrl = process.env.NEXT_PUBLIC_APP_URL_ALT;
    }

    const resp = await fetch(
      `${apiUrl}/api/patient/auth/?apikey=479693736527271&email=${email}&password=${password}&mobile=${mobile}`
    );

    if (!resp.ok) {
      const errorData = await resp.json(); // ✅ get the actual message
      return new NextResponse(JSON.stringify({ msg: errorData?.msg || "Failed to login an account" }), {
        status: resp.status,
      });
    }

    const data = await resp.json();

    if (!data?.id || !data?.email) {
      return new NextResponse(JSON.stringify({ msg: "Unexpected response from auth service." }), {
        status: 500,
      });
    }

    // 🧠 Fetch connection info for this patient
    const connections = await db.connectionRequest.findMany({
      where: {
        OR: [
          { senderEmail: data.email },
          { receiverEmail: data.email },
        ],
      },
      select: {
        id: true,
        senderEmail: true,
        receiverEmail: true,
        status: true,
      },
    });

    const Payload = {
      id: data.id,
      password: data.password,
      email: data.email,
      mobile: data.mobile,
      firstName: data.firstName,
      city: data.city,
      mode: "main", // ✅ start in main mode
      connections,  // ✅ add connection data
    };

    const session = await encrypt(Payload); // ✅ fixed
    cookies().set("session", session, {
      httpOnly: true,
    });

    return new NextResponse(JSON.stringify({ msg: "Login successful." }), {
      status: 200,
    });
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage =
      error instanceof SyntaxError
        ? "Invalid response from server"
        : error.message || "Unexpected error";
    return new NextResponse(JSON.stringify({ msg: errorMessage }), {
      status: 500,
    });
  }
}
