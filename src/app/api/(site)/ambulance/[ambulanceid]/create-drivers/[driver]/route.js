import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";

export async function PUT(req) {
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

    if (!data.id) {
      return NextResponse.json(
        { success: false, message: "Driver ID is required for update." },
        { status: 400 }
      );
    }

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

    const updatedDriver = await db.ambulanceDriver.update({
      where: { id: data.id },
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
        message: "Driver updated",
        driver: updatedDriver,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Driver update error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
