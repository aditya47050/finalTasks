import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request, { params }) {
  try {
    // Await the params object first
    const resolvedParams = await params;  
    const { pharmacyId } = resolvedParams; // now it's safe

    const body = await request.json();
    const { patientId, paymentMethod, totalAmount, items } = body;

    if (!patientId || !paymentMethod || !totalAmount || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const order = await db.pharmacyOrder.create({
      data: {
        pharmacyId,
        patientId,
        paymentMethod,
        totalAmount,
        status: "PENDING",
        items: {
          create: items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            unitLabel: item.unitLabel,
            unitCountPerPack: item.unitCountPerPack || 1,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discountPercent: item.discountPercent || 0,
            discountedUnitPrice: item.discountedUnitPrice,
            lineTotal: item.lineTotal,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, orderId: order.id, order });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

