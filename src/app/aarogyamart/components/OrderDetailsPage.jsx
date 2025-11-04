"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, Truck, MapPin, Calendar, Phone, Download, Star } from "lucide-react"
import Link from "next/link"
import jsPDF from "jspdf"

export default function OrderDetailsPage(id) {
  
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const orderId = id.id;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/aarogyamart/order/${orderId}`)
        if (!res.ok) throw new Error("Failed to fetch order")
        const data = await res.json()
        setOrder(data.order)
      } catch (err) {
        console.error(err)
        setError("Failed to load order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!order) return null

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 1000 ? 0 : 50
  const gst = Math.round(subtotal * 0.18)

    const downloadInvoice = (orderData) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const lineHeight = 8;
  let y = 20;

  // Header
  pdf.setFontSize(18);
  pdf.text("Invoice", 105, y, { align: "center" });

  y += lineHeight * 2;
  pdf.setFontSize(12);
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
  pdf.setFontSize(12);
  pdf.text("Items:", 20, y);
  y += lineHeight;

  // Table header
  pdf.setFontSize(11);
  pdf.text("Item", 20, y);
  pdf.text("Qty", 100, y, { align: "right" });
  pdf.text("Price", 120, y, { align: "right" });
  pdf.text("Subtotal", 150, y, { align: "right" });
  y += lineHeight;

  let subtotal = 0;

  orderData.items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    pdf.text(item.name, 20, y);
    pdf.text(item.quantity.toString(), 100, y, { align: "right" });
    pdf.text(`₹${item.price.toFixed(2)}`, 120, y, { align: "right" });
    pdf.text(`₹${itemTotal.toFixed(2)}`, 150, y, { align: "right" });
    y += lineHeight;
  });

  y += lineHeight;
  pdf.setFontSize(12);
  pdf.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 150, y, { align: "right" });

  // Tax (example 18%)
  const tax = subtotal * 0.18;
  y += lineHeight;
  pdf.text(`Tax (18% GST): ₹${tax.toFixed(2)}`, 150, y, { align: "right" });

  // Total
  const totalAmount = subtotal + tax;
  y += lineHeight;
  pdf.setFontSize(14);
  pdf.text(`Total: ₹${totalAmount.toFixed(2)}`, 150, y, { align: "right" });

  // Footer
  y += lineHeight * 3;
  pdf.setFontSize(10);
  pdf.text("Thank you for shopping with AarogyaMart!", 105, y, { align: "center" });

  pdf.save(`Invoice_${orderData.orderId}.pdf`);
};

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/aarogyamart/orders" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="md:text-3xl font-bold text-gray-900">Order #{order.orderId}</h1>
                <p className="text-gray-600 mt-1">
                  Placed on{" "}
                  {new Date(order.orderDate).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <Badge className={getStatusColor(order.status)}>
                <Package className="h-4 w-4 mr-1" />
                <span className="capitalize">{order.status}</span>
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-500" />
                    Order Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.timeline.map((event, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div
                          className={`w-4 h-4 rounded-full mt-1 ${event.completed ? "bg-green-500" : "bg-gray-300"}`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`font-medium ${event.completed ? "text-green-700" : "text-gray-700"}`}>
                              {event.status}
                            </p>
                            <p className="text-sm text-gray-500">
                              {event.completed
                                ? new Date(event.date).toLocaleDateString("en-IN", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "Expected: " +
                                  new Date(event.date).toLocaleDateString("en-IN", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items ({order.items.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <img
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Brand: {item.brand}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">({item.reviews} reviews)</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-lg">₹{(item.price * item.quantity).toLocaleString()}</p>
                          <p className="text-sm text-gray-600">₹{item.price.toLocaleString()} each</p>

                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({order.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST (18%)</span>
                    <span>₹{gst.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">₹{order.total.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    Delivery Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900">{order.address.name}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Phone className="h-3 w-3" />
                        {order.address.phone}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.address.address}, {order.address.city}, {order.address.state} - {order.address.pincode}
                      </p>
                    </div>

                    {order.trackingNumber && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">Tracking Number</p>
                        <p className="text-sm text-blue-700">{order.trackingNumber}</p>
                      </div>
                    )}

                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-medium">Expected Delivery</span>
                      </div>
                      <p className="text-sm text-green-600 mt-1">
                        {new Date(
                          new Date(order.timeline[0].date).setDate(
                            new Date(order.timeline[0].date).getDate() + 10
                          )
                        ).toLocaleDateString("en-IN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Button className="w-full bg-transparent rounded-xl" variant="outline" onClick={() => handleDownloadInvoice(order)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Invoice
                    </Button>
                    <Button className="w-full bg-blue-500 hover:bg-blue-500 text-white rounded-xl">
                      <Link href={'/contact-us'}>
                        Contact Support
                      </Link>
                    </Button>
                    {order.status?.toLowerCase() === "delivered" && (
                      <Button
                        className="w-full bg-red-500 hover:bg-red-400 rounded-xl text-white"
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/aarogyamart/order/${order.id}/cancel`, {
                              method: "POST",
                            });
                            if (!res.ok) throw new Error("Failed to cancel order");
                            setOrder((prev) => ({ ...prev, status: "cancelled" }));
                          } catch (err) {
                            console.error(err);
                            alert("Unable to cancel order. Please try again.");
                          }
                        }}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
  function handleDownloadInvoice(orderData) {
    // call your existing downloadInvoice function here
    downloadInvoice(orderData)
  }
}