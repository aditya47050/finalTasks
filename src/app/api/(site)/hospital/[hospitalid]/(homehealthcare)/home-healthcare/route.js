import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      hospitalId,
      serviceName,
      startingPrice,
      isAvailable,
      minPrice,
      maxPrice,
      finalprice,
      discount,
    } = body;

    if (!hospitalId || !serviceName) {
      return NextResponse.json(
        { success: false, message: "hospitalId and serviceName are required." },
        { status: 400 }
      );
    }

    // Create the HomeHealthcare record
    const homeHealthcare = await db.homeHealthcare.create({
      data: {
        hospitalId,
        serviceName,
        startingPrice: startingPrice ? startingPrice.toString() : null,
        isAvailable:
          typeof isAvailable === "boolean" ? isAvailable : true,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        finalprice: finalprice || null,
        discount: discount || null,
      },
    });

    return NextResponse.json({ success: true, data: homeHealthcare });
  } catch (error) {
    console.error("[HomeHealthcare Book API]", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
