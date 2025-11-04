import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const id = params.orderId;

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Update order status to cancelled
    const updatedOrder = await db.Order.update({
      where: { id },
      data: { status: "cancelled" },
    });

    return NextResponse.json({ order: updatedOrder }, { status: 200 });
  } catch (err) {
    console.error("Cancel order error:", err);
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
  }
}
