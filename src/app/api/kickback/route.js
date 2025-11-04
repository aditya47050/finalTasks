import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  // Destroy the session by clearing the session cookie
  const cookieStore = cookies();
  cookieStore.set("session", "", { expires: new Date(0), path: '/' });

  return new NextResponse(JSON.stringify({ msg: "Logged out successfully!" }), {
    status: 200,
  });
}