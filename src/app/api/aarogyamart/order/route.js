import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { format } from "date-fns";
import { getSession } from "@/lib/getsession";

// ============================
// 📦 GET - Fetch all orders by userId
// ============================
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // ✅ Fetch all orders for that user
    const orders = await db.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                seller: true,
                category: true,
                brand: true,
              },
            },
          },
        },
        address: true,
        timeline: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!orders.length) {
      return NextResponse.json({ success: true, message: "No orders found", data: [] }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// ============================
// 🧾 POST - Create New Order
// ============================
export async function POST(req) {
  try {
    const body = await req.json();
    const { orderId, paymentId, signature, userId, addressId, items, total } = body;

    if (!orderId || !paymentId || !userId || !addressId || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Get user session
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "User not logged in" }, { status: 401 });
    }
    const userEmail = session.email;

    // ✅ Create order
    const order = await db.order.create({
      data: {
        orderId,
        paymentId,
        total,
        status: "pending",
        addressId,
        userId,
        items: {
          create: items.map((item) => ({
            name: item.name,
            brand: item.brand || null,
            price: item.price,
            quantity: item.quantity,
            image: item.image ?? "",
            productId: item.productId || null,
          })),
        },
        timeline: {
          create: [
            { status: "Order Placed", description: "Your order has been placed successfully.", completed: true },
            { status: "Processing", description: "Your order is being prepared.", completed: false },
            { status: "Shipped", description: "Your order has been shipped.", completed: false },
            { status: "Delivered", description: "Your order has been delivered.", completed: false },
          ],
        },
      },
      include: { items: true, address: true, timeline: true },
    });

    // ✅ Update stock
    for (const item of items) {
      if (item.productId) {
        await db.productMart.update({
          where: { id: item.productId },
          data: { stockCount: { decrement: item.quantity } },
        });
      }
    }

    // ✅ Send order confirmation email
    await sendOrderConfirmationEmail(userEmail, order);

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// ============================
// 📧 Email Function
// ============================
async function sendOrderConfirmationEmail(email, order) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const formattedDate = format(new Date(order.orderDate), "MMMM dd, yyyy");
  const estimatedDate = order.estimatedDelivery
    ? format(new Date(order.estimatedDelivery), "MMMM dd, yyyy")
    : "N/A";

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border:1px solid #eee;">${item.name}</td>
        <td style="padding:8px;border:1px solid #eee;">${item.quantity}</td>
        <td style="padding:8px;border:1px solid #eee;">₹${item.price}</td>
        <td style="padding:8px;border:1px solid #eee;">₹${item.price * item.quantity}</td>
      </tr>
    `
    )
    .join("");

  const htmlContent = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:20px auto;padding:20px;border:1px solid #ddd;border-radius:8px;background:#f9f9f9;">
      <h2 style="color:#1D4ED8;">Thank you for your order!</h2>
      <p>Your order <strong>${order.orderId}</strong> has been placed on <strong>${formattedDate}</strong>.</p>
      
      <h3>Order Summary</h3>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <thead>
          <tr>
            <th style="padding:8px;border:1px solid #eee;background:#f0f0f0;">Item</th>
            <th style="padding:8px;border:1px solid #eee;background:#f0f0f0;">Qty</th>
            <th style="padding:8px;border:1px solid #eee;background:#f0f0f0;">Price</th>
            <th style="padding:8px;border:1px solid #eee;background:#f0f0f0;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <p><strong>Total: ₹${order.total}</strong></p>
      <p><strong>Estimated Delivery:</strong> ${estimatedDate}</p>

      <h3>Delivery Address</h3>
      <p>${order.address.address}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}</p>

      <p style="margin-top:20px;">We’ll notify you once your order is shipped!</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Order Confirmation - ${order.orderId}`,
    html: htmlContent,
  });
}
