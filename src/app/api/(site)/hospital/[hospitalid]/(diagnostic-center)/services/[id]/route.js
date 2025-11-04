import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
      const { id } = params;
      const { facility, category, subCategory, available, minPrice, maxPrice, hospitalId } = await request.json();
  
      const updatedService = await db.diagnosticCenterServices.update({
        where: { id },
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
  
      return NextResponse.json({ success: true, service: updatedService }, { status: 200 });
    } catch (error) {
      console.error("Error updating service:", error);
      return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
  }