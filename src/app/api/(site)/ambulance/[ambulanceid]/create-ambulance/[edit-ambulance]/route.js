import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";

export async function PUT(req, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const ambulance = await db.ambulance.findFirst({
      where: { email: session.email },
      select: { id: true },
    });

    const ambulanceId = ambulance?.id;
    if (!ambulanceId) {
      return NextResponse.json(
        { success: false, message: "Ambulance not found for user." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      id, // ID of the vehicle to update
      ambulancemodel,
      ambulancecharges,
      ambulanceareapincode,
      ambulanceregdate,
      ambulancercno,
      ambulancercbook,
      ambulancetype,
      ambulancecategory,
      ambulanceFront,
      ambulanceRight,
      ambulanceLeft,
      ambulanceBack,
      ambulanceinternal,
      latitude,
      longitude,
      status,
      puc,
      insurance,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Vehicle ID is required for update." },
        { status: 400 }
      );
    }

    const vehicleExists = await db.ambulanceVaichicle.findUnique({
      where: { id },
    });

    if (!vehicleExists || vehicleExists.ambulanceId !== ambulanceId) {
      return NextResponse.json(
        { success: false, message: "Vehicle not found or unauthorized." },
        { status: 404 }
      );
    }

    const updatedVehicle = await db.ambulanceVaichicle.update({
      where: { id },
      data: {
        ambulancemodel,
        ambulancecharges,
        ambulanceareapincode,
        ambulanceregdate,
        ambulancercno,
        ambulancercbook,
        ambulancetype,
        ambulancecategory,
        puc: puc,
        insurance: insurance,
        ambulanceimagefront: body.ambulanceFront || "",
        ambulanceimageright: body.ambulanceRight || "",
        ambulanceimageleft: body.ambulanceLeft || "",
        ambulanceimageback: body.ambulanceBack || "",
        ambulanceimageinternal: body.ambulanceinternal || "",
        latitude: parseFloat(latitude || "0"),
        longitude: parseFloat(longitude || "0"),
        status: status || vehicleExists.status,
      },
    });

    return NextResponse.json(
      { success: true, message: "Vehicle updated", vehicle: updatedVehicle },
      { status: 200 }
    );
  } catch (err) {
    console.error("Vehicle Update Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error. Try again later." },
      { status: 500 }
    );
  }
}
