import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET(request, { params }) {
  try {
    const { id } = params;
    const service = await db.diagnosticCenterServices.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, service }, { status: 200 });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { facility, category, subCategory, available, minPrice, maxPrice, hospitalId } = await request.json();

    const newService = await db.diagnosticCenterServices.create({
      data: {
        facility,
        category,
        subCategory,
        available,
        minPrice,
        maxPrice,
        hospitalId,
      },
    });

    return NextResponse.json({ success: true, service: newService }, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

