import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { decrypt } from "@/lib/getsession"
import { cookies } from "next/headers"

export async function GET(req) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("session")?.value

    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    const session = await decrypt(sessionCookie)
    const sellerId = session.id

    const { searchParams } = new URL(req.url)
    const range = searchParams.get("range") || "7d"

    // Total products
    const totalProducts = await db.productMart.count({ where: { sellerId } })

    // Fetch orders that have at least one product of this seller
    const sellerOrderItems = await db.orderItem.findMany({
      where: { product: { sellerId } },
      select: { orderId: true, price: true, quantity: true, order: { select: { orderDate: true, status: true, total: true } } }
    })

    // Get unique orders
    const uniqueOrdersMap = new Map()
    sellerOrderItems.forEach(item => {
      if (!uniqueOrdersMap.has(item.orderId)) {
        uniqueOrdersMap.set(item.orderId, item.order)
      }
    })
    const orders = Array.from(uniqueOrdersMap.values())

    const totalOrders = orders.length
    const totalRevenue = sellerOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const pendingOrders = orders.filter(o => o.status === "pending").length
    const deliveredOrders = orders.filter(o => o.status === "delivered").length

    // Order trends
    const now = new Date()
    let orderTrends = []

    if (range === "7d") {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(now.getDate() - i)
        const startOfDay = new Date(date.setHours(0,0,0,0))
        const endOfDay = new Date(date.setHours(23,59,59,999))

        const dailyOrders = orders.filter(
          o => new Date(o.orderDate) >= startOfDay && new Date(o.orderDate) <= endOfDay
        ).length

        orderTrends.push({ date: startOfDay.toISOString().slice(0,10), orders: dailyOrders })
      }
    }
  else if (range === "6m") {
  // monthly trends for last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

    const monthlyOrders = orders.filter(
      o => new Date(o.orderDate) >= startOfMonth && new Date(o.orderDate) <= endOfMonth
    ).length;

    orderTrends.push({ date: `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}`, orders: monthlyOrders });
  }
} else if (range === "1y") {
  // monthly trends for last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

    const monthlyOrders = orders.filter(
      o => new Date(o.orderDate) >= startOfMonth && new Date(o.orderDate) <= endOfMonth
    ).length;

    orderTrends.push({ date: `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}`, orders: monthlyOrders });
  }
}


    // Recent growth rate (last 7 days)
    const last7Days = new Date(now.getTime() - 7*24*60*60*1000)
    const previous7Days = new Date(now.getTime() - 14*24*60*60*1000)
    const recentOrders = orders.filter(o => new Date(o.orderDate) >= last7Days).length
    const previousOrders = orders.filter(o => new Date(o.orderDate) >= previous7Days && new Date(o.orderDate) < last7Days).length

    const recentOrdersGrowth = previousOrders === 0 && recentOrders > 0 ? 100 : previousOrders > 0 ? Math.round(((recentOrders - previousOrders)/previousOrders)*100) : 0

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        deliveredOrders,
        recentOrdersGrowth,
        orderTrends
      }
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
