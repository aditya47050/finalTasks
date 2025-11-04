// /api/aarogyamart/orders.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getSession } from '@/lib/getsession';

export async function GET(req) {
  try {
    const session = await getSession();
    const sellerId = session.id;

    if (!sellerId) {
      return NextResponse.json(
        { success: false, error: "sellerId is required" },
        { status: 400 }
      );
    }

    // Fetch orders that contain at least one item from this seller
    const orders = await db.order.findMany({
      where: {
        items: {
          some: {
            product: {
              sellerId: sellerId,
            },
          },
        },
      },
      include: {
        items: {
          include: {
            product: true, // include product details
          },
        },
        address: true,
        timeline: {
          orderBy: { date: "asc" },
        },
      },
      orderBy: { orderDate: "desc" },
    });

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}
