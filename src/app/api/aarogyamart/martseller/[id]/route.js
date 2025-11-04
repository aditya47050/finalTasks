import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subDays, subMonths, startOfDay } from "date-fns";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ success: false, error: "Seller ID is required" }, { status: 400 });
    }

    // Fetch seller with products, brands, reviews
    const seller = await db.martSeller.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            category: true,
            brand: true,
            reviews: true,
            orderItems: {
              include: {
                order: true,
              },
            },
          },
        },
        brands: true,
      },
    });

    if (!seller) {
      return NextResponse.json({ success: false, error: "Seller not found" }, { status: 404 });
    }

    // Fetch all orders linked to seller's products
    const orders = await db.order.findMany({
      where: {
        items: {
          some: { product: { sellerId: id } },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        timeline: true,
        address: true,
      },
    });

    // ---- Compute Stats ----
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const shippedOrders = orders.filter((o) => o.status === "shipped").length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    // ---- Chart Data ----
    const now = new Date();

    const groupByDateDetailed = (orders, keyFn) => {
  const map = new Map();
  orders.forEach(o => {
    const key = keyFn(o);
    const prev = map.get(key) || { totalRevenue: 0, deliveredOrders: 0, pendingOrders: 0 };
    map.set(key, {
      totalRevenue: prev.totalRevenue + o.total,
      deliveredOrders: prev.deliveredOrders + (o.status === "delivered" ? 1 : 0),
      pendingOrders: prev.pendingOrders + (o.status === "pending" ? 1 : 0),
    });
  });
  return Array.from(map, ([date, stats]) => ({ date, ...stats }));
};

// Last 7 days
const recent7 = orders.filter(o => o.orderDate >= subDays(now, 7));
const chart7Days = groupByDateDetailed(recent7, o => startOfDay(o.orderDate).toISOString().slice(0, 10));

// Last month
const recent30 = orders.filter(o => o.orderDate >= subMonths(now, 1));
const chartMonth = groupByDateDetailed(recent30, o => startOfDay(o.orderDate).toISOString().slice(0, 10));

// Last year (grouped by month)
const recentYear = orders.filter(o => o.orderDate >= subMonths(now, 12));
const chartYear = groupByDateDetailed(recentYear, o => o.orderDate.toISOString().slice(0, 7));


    return NextResponse.json({
      success: true,
      data: {
        ...seller,
        orderStats: {
          totalOrders,
          deliveredOrders,
          pendingOrders,
          shippedOrders,
          totalRevenue,
        },
        chartData: {
          last7Days: chart7Days,
          lastMonth: chartMonth,
          lastYear: chartYear,
        },
        orders,
      },
    });
  } catch (error) {
    console.error("Error fetching seller details:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
