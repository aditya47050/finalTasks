import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = params; // order ID

  try {
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 });
    }

    // Fetch existing order with timeline
    const order = await db.order.findUnique({
      where: { id },
      include: { timeline: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update previous timeline steps
    const completedTimelineIds = order.timeline
      .filter((step) => step.status === status || step.completed)
      .map((step) => step.id);

    await db.orderTimeline.updateMany({
      where: { id: { in: completedTimelineIds } },
      data: { completed: true },
    });

    // Add new timeline step if it doesn't exist
    const existingStatus = order.timeline.find((t) => t.status === status);
    if (!existingStatus) {
      await db.orderTimeline.create({
        data: {
          status,
          description: `Order moved to ${status}`,
          completed: true,
          orderId: id,
        },
      });
    }

    // Update order status
    const updatedOrder = await db.order.update({
      where: { id },
      data: { status },
      include: { timeline: true, items: true, address: true },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error("Update Order Status Error:", err);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
