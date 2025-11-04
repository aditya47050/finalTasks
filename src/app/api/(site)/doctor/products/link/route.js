// src/app/api/(site)/doctor/products/link/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, doctorId, pharmacyId } = await request.json();

    if (!productId || !doctorId || !pharmacyId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if the product is already linked to the doctor
    const alreadyLinked = await db.product.findFirst({
      where: {
        pharmacyLinkedProductId: productId,
        doctorId: doctorId,
      },
    });

    if (alreadyLinked) {
      return NextResponse.json(
        { error: "You have already linked this product to your list." },
        { status: 409 }
      );
    }

    // Retrieve the original product to determine its current state
    const originalProduct = await db.product.findUnique({
      where: { id: productId }
    });

    if (!originalProduct) {
      return NextResponse.json(
        { error: "Original product not found." },
        { status: 404 }
      );
    }

    // Link the product without creating a duplicate
    const linkedProduct = await db.product.update({
      where: {
        id: productId,
      },
      data: {
        doctorId: doctorId,
        pharmacyLinkedProductId: originalProduct.pharmacyLinkedProductId || productId,
      },
    });

    return NextResponse.json({ product: linkedProduct });

  } catch (error) {
    console.error("Error linking product to doctor:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while linking the product." },
      { status: 500 }
    );
  }
}