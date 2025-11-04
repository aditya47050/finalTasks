
import { NextRequest, NextResponse } from "next/server";



import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";

export async function POST(req) {
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
    const body = await req.json();

    const requiredFields = [
      "ambulancemodel",
      "ambulancecharges",
      "ambulanceareapincode",
      "ambulanceregdate",
      "ambulancercno",
      "ambulancercbook",
      "ambulancetype",
      "ambulancecategory",
    ];

    const missingFields = requiredFields.filter(
      (field) => !body[field] || body[field].toString().trim() === ""
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

    const vehicle = await db.ambulanceVaichicle.create({
      data: {
        ambulanceId,
        ambulancemodel: body.ambulancemodel,
        ambulancecharges: body.ambulancecharges,
        ambulanceareapincode: body.ambulanceareapincode,
        ambulanceregdate: body.ambulanceregdate,
        ambulancercno: body.ambulancercno,
        ambulancercbook: body.ambulancercbook,
        ambulancetype: body.ambulancetype,
        puc: body.puc || "",
        insurance: body.insurance || "",
        ambulanceimagefront: body.ambulanceFront || "",
        ambulanceimageright: body.ambulanceRight || "",
        ambulanceimageleft: body.ambulanceLeft || "",
        ambulanceimageback: body.ambulanceBack || "",
        ambulanceimageinternal: body.ambulanceinternal || "",
        ambulancecategory: body.ambulancecategory,
        latitude: parseFloat(body.latitude || "0"),
        longitude: parseFloat(body.longitude || "0"),

        // ✅ New fields
        ambulancediscount: body.ambulancediscount || "",
        ambulancefinalcharge: body.ambulancefinalcharge || "",
      },
    });

    return NextResponse.json(
      { success: true, message: "Ambulance created", vehicle },
      { status: 201 }
    );
  } catch (err) {
    console.error("Vehicle Creation Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error. Try again later." },
      { status: 500 }
    );
  }
}
