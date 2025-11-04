import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const orderId  = await params.orderId;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Fetch order with address and items
    const order = await db.Order.findUnique({
      where: { orderId : orderId },
      include: {
        address: true,
        items: {
          include:{
            product:true,
          }
        },
        timeline: true, // optional, for delivery status
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (err) {
    console.error("Fetch order error:", err);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
