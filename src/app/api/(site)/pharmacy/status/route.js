import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "PHARMACY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status } = await request.json();

    // Verify the order belongs to the logged-in pharmacy
    const order = await db.pharmacyOrder.findFirst({
      where: { 
        id: orderId,
        pharmacy: { email: session.user.email }
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update the order status
    const updatedOrder = await db.pharmacyOrder.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({ 
      message: "Order status updated successfully", 
      order: updatedOrder 
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}