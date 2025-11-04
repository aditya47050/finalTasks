import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await req.json();

    const ambulance = await db.ambulance.findFirst({
      where: { email: session.email },
      select: { id: true },
    });

    const ambulanceId = ambulance?.id;

    const requiredFields = [
      "firstname",
      "lastname",
      "mobile",
      "aadharcardno",
      "panno",
      "drivinglicence",
    ];

    const missingFields = requiredFields.filter(
      (field) => !data[field] || data[field].toString().trim() === ""
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: missingFields.map((field) => ({
            field,
            message: `${field} is required`,
          })),
        },
        { status: 400 }
      );
    }

    const newDriver = await db.ambulanceDriver.create({
      data: {
        firstname: data.firstname,
        middlename: data.middlename || "",
        lastname: data.lastname,
        mobile: data.mobile,
        alternatemobileno: data.alternatemobileno || "",
        aadharcardno: data.aadharcardno,
        aadharcardfront: data.aadharcardfront || "",
        aadharcardback: data.aadharcardback || "",
        panno: data.panno,
        panfront: data.panfront || "",
        drivinglicence: data.drivinglicence,
        drivinglicencefront: data.drivinglicencefront || "",
        photo: data.photo || "",
        dateofbirth: data.dateofbirth || null,
        gender: data.gender || "",
        password : data.password
          ? await bcrypt.hash(data.password, 10)
          : "",
        email: data.email || "",
        bloodgroup: data.bloodgroup || "",
        pincode: data.pincode || "",
        firstaidtraining: data.firstaidtraining || false,
        ambulanceId,
        AmbulanceVaichicle: data.assignedAmbulanceId
          ? {
              connect: { id: data.assignedAmbulanceId },
            }
          : undefined,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Driver created",
        driver: newDriver,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Driver creation error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
