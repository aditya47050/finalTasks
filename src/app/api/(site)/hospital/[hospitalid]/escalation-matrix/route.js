import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Prevent multiple Prisma instances in development




// POST - Add or Update Staff
export async function POST(req) {
  try {
    const { fullName, mobileNumber, alternateMobile, email, level, hospitalId } = await req.json();

    if (!fullName || !mobileNumber || !level || !hospitalId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Match level to role name
    const roles = [
      { level: 1, name: "Front Desk / Reception Desk" },
      { level: 2, name: "Patient Coordinator" },
      { level: 3, name: "Front Desk - Department Supervisor" },
      { level: 4, name: "HSP / Hospital - Head / Manager" },
      { level: 5, name: "Patient Safety Operation Head" },
      { level: 6, name: "Hospital Administrator Executive" },
      { level: 7, name: "Chief Medical Officer (CMO)" },
      { level: 8, name: "Chief Operation Officer (COO)" },
      { level: 9, name: "HSP / Hospital Administrator" },
      { level: 10, name: "CEO / Owner / Board of Director" },
    ];

    const role = roles.find((r) => r.level === Number(level))?.name || "Unknown";

    const staff = await db.staff.create({
      data: {
        fullName,
        mobileNumber,
        alternateMobile,
        email,
        role,
        level: Number(level),
        hospitalId,
      },
    });

    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
