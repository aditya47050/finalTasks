// src/app/api/patient/switch-mode/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { encrypt, decrypt } from "@/lib/getsession";
import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { mode, childEmail } = await req.json();
    const cookieStore = cookies();
    const sessionCookie = await cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ msg: "No active session" }, { status: 401 });
    }

    const currentSession = await decrypt(sessionCookie);
    let newSessionData;
    console.log(childEmail);
    if (mode === "kids") {
      if (!childEmail) return NextResponse.json({ msg: "No child selected" }, { status: 400 });

      const child = await db.patient.findUnique({ where: { email: childEmail } });
      if (!child) return NextResponse.json({ msg: "Child not found" }, { status: 404 });

      newSessionData = {
        id: child.id,
        email: child.email,
        mobile: child.mobile,
        firstName: child.firstName,
        city: child.city,
        mode: "kids",
        parentEmail: currentSession.email,
      };
    } else if (mode === "main") {
      const parentEmail = currentSession.parentEmail || currentSession.email;
      const parent = await db.patient.findUnique({ where: { email: parentEmail } });
      if (!parent) return NextResponse.json({ msg: "Parent not found" }, { status: 404 });

      newSessionData = {
        id: parent.id,
        email: parent.email,
        mobile: parent.mobile,
        firstName: parent.firstName,
        city: parent.city,
        mode: "main",
      };
    } else {
      return NextResponse.json({ msg: "Invalid mode" }, { status: 400 });
    }

    // Encrypt new session
    const encryptedSession = await encrypt(newSessionData);

    // Set the cookie properly
    cookieStore.set({
      name: "session",
      value: encryptedSession,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({ msg: `Switched to ${mode} mode`, session: newSessionData });
  } catch (error) {
    console.error("Switch Mode Error:", error);
    return NextResponse.json({ msg: error.message }, { status: 500 });
  }
}
