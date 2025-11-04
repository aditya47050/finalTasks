import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Prevent multiple Prisma instances in development

// POST - Add or Update Staff
export async function POST(req) {
  try {
    const {
      mobileNumber,

      email,
      department,
      hospitalId,
    } = await req.json();

    if (!email || !mobileNumber || !hospitalId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Match ole nameAmbulance

    const departmentnames = [
      { name: "Ambulance" },

      { name: "Patient Coordinator" },
      { name: "Appointment Booking" },
      { name: "Billing" },
      { name: "Health Insurance" },
      { name: "Pathology & Laboratory" },
      { name: "Radiology & Imaging " },
      { name: "Pharmacy" },
      { name: "Intensive Care Unit (ICU)" },
      { name: "Administration & Management" },
    ];

    const staff = await db.HospitalDepartment.create({
      data: {
        mobileNumber,

        email,
        department,
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
