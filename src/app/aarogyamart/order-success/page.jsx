"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Truck, MapPin, Calendar, Download } from "lucide-react"
import Link from "next/link"
import { Footer } from './../components/footer';
import { jsPDF } from "jspdf"

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderData, setOrderData] = useState(null)
  const orderId = searchParams.get("orderId")

  useEffect(() => {
    if (!orderId) {

      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/aarogyamart/order/success/${orderId}`);
        const data = await res.json();
        if (data.order) {
          setOrderData(data.order);
        } else {
          router.push("/");
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
        router.push("/aarogyamart/checkout");
      }
    };

    fetchOrder();
  }, [orderId, router]);
  
const downloadInvoice = (orderData) => {
  const pdf = new jsPDF("p", "mm", "a4");
  let y = 20;
  const lineHeight = 8;

  // -------------------- Header --------------------
  pdf.setFontSize(20);
  pdf.setTextColor("#1D4ED8");
  pdf.text("AarogyaMart Invoice", 105, y, { align: "center" });

  y += lineHeight * 2;
  pdf.setFontSize(12);
  pdf.setTextColor(0);

  pdf.text(`Order ID: ${orderData.orderId}`, 20, y);
  pdf.text(`Payment ID: ${orderData.paymentId}`, 20, y + lineHeight);
  pdf.text(`Order Date: ${new Date(orderData.orderDate).toLocaleDateString()}`, 20, y + lineHeight * 2);

  y += lineHeight * 4;
  pdf.text(`Customer: ${orderData.address.name}`, 20, y);
  pdf.text(`Phone: ${orderData.address.phone}`, 20, y + lineHeight);
  pdf.text(
    `Address: ${orderData.address.address}, ${orderData.address.city}, ${orderData.address.state} - ${orderData.address.pincode}`,
    20,
    y + lineHeight * 2
  );

  y += lineHeight * 4;

  // -------------------- Table Header --------------------
  pdf.setFillColor(29, 78, 216); // Blue
  pdf.setTextColor(255, 255, 255); // White
  pdf.rect(20, y - 5, 170, lineHeight, "F");
  pdf.text("Item", 25, y);
  pdf.text("Qty", 110, y, { align: "right" });
  pdf.text("Price", 140, y, { align: "right" });
  pdf.text("Subtotal", 180, y, { align: "right" });

  y += lineHeight;
  pdf.setTextColor(0);

  // -------------------- Table Rows --------------------
  let subtotal = 0;
  orderData.items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    if (index % 2 === 0) {
      pdf.setFillColor(241, 245, 249); // Light gray
      pdf.rect(20, y - 5, 170, lineHeight, "F");
    }

    pdf.text(item.name, 25, y);
    pdf.text(item.quantity.toString(), 110, y, { align: "right" });
    pdf.text(`₹${item.price.toFixed(2)}`, 140, y, { align: "right" });
    pdf.text(`₹${itemTotal.toFixed(2)}`, 180, y, { align: "right" });
    y += lineHeight;
  });

  y += lineHeight;

  // -------------------- Totals Box --------------------
  const totalsX = 120;
  const totalsWidth = 70;
  const totalsLabelX = totalsX + 2;
  const totalsValueX = totalsX + totalsWidth - 2;

  const tax = subtotal * 0.18;
  const totalAmount = subtotal + tax;

  const totals = [
    { label: "Subtotal", value: subtotal, isTotal: false },
    { label: "Tax (18% GST)", value: tax, isTotal: false },
    { label: "Total", value: totalAmount, isTotal: true },
  ];

  totals.forEach((t) => {
    if (t.isTotal) {
      pdf.setFillColor(29, 78, 216); // Blue
      pdf.setTextColor("#FFFFFF"); // White
    } else {
      pdf.setFillColor(241, 245, 249); // Light gray
      pdf.setTextColor(0); // Black
    }

    pdf.setFont("courier"); // Monospace for perfect alignment
    pdf.setFontSize(t.isTotal ? 12 : 10);
    pdf.rect(totalsX, y - 6, totalsWidth, lineHeight, "F");
    pdf.text(`${t.label}:`, totalsLabelX, y);
    
    // Right-align numbers with monospace
    const formattedValue = `₹${t.value.toFixed(2)}`;
    const textWidth = pdf.getTextWidth(formattedValue);
    pdf.text(formattedValue, totalsX + totalsWidth - textWidth - 2, y);

    y += lineHeight;
  });

  // -------------------- Footer --------------------
  y += lineHeight * 2;
  pdf.setFont("helvetica"); // Reset to default
  pdf.setFontSize(10);
  pdf.setTextColor(0);
  pdf.text("Thank you for shopping with AarogyaMart!", 105, y, { align: "center" });
  pdf.text("Visit us at: www.aarogyamart.com", 105, y + lineHeight, { align: "center" });

  pdf.save(`Invoice_${orderData.orderId}.pdf`);
};




  if (!orderData) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Skeleton */}
            <div className="text-center space-y-4">
              <Skeleton className="h-16 w-16 mx-auto rounded-full" />
              <Skeleton className="h-6 w-1/3 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Info Skeleton */}
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>

              {/* Sidebar Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            </div>

            {/* Footer Skeleton */}
            <div className="flex gap-2">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
        <Footer/>
      </>
    );
  }

  const expectedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-2">
              {/* Order Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-500" />
                    Order Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-medium">{orderData.orderId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment ID</p>
                      <p className="font-medium">{orderData.paymentId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-medium">
                        {new Date(orderData.orderDate).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-medium text-blue-600">₹{orderData.total.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-900">{orderData.address.name}</p>
                    <p className="text-sm text-gray-600">{orderData.address.phone}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {orderData.address.address}, {orderData.address.city}, {orderData.address.state} -{" "}
                      {orderData.address.pincode}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items ({orderData.items.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderData.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Brand: {item.brand}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                          <p className="text-sm text-gray-600">₹{item.price.toLocaleString()} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-500" />
                  Delivery Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.timeline.map((step) => (
                    <div key={step.id} className="flex items-center gap-3">
                      {/* Status Dot */}
                      <div
                        className={`w-3 h-3 rounded-full ${
                          step.completed ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>

                      {/* Status Info */}
                      <div>
                        <p
                          className={`font-medium ${
                            step.completed ? "text-green-700" : "text-gray-700"
                          }`}
                        >
                          {step.status}
                        </p>
                        <p className="text-sm text-gray-600">
                          {step.completed
                            ? new Date(step.date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Pending"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-2 py-4">
            <Button
              className="w-full bg-transparent rounded-xl"
              variant="outline"
              onClick={() => downloadInvoice(orderData)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
            <Link href="/aarogyamart/orders" className="block w-full">
              <Button className="w-full bg-transparent rounded-xl" variant="outline">
                Track Order
              </Button>
            </Link>
            <Link href="/aarogyamart" className="block w-full">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl text-white">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}
  