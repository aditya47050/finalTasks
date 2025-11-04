"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Eye, Download, Truck, Calendar, MapPin, Phone, Search } from "lucide-react";
import Link from "next/link";
import { jsPDF } from "jspdf";

const Viewallorders = ({ orders }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && order.status === activeTab;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const downloadInvoice = (orderData) => {
    const pdf = new jsPDF("p", "mm", "a4");
    let y = 20;
    const lineHeight = 8;

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
    pdf.text("Items:", 20, y);
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
    pdf.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 150, y, { align: "right" });
    const tax = subtotal * 0.18;
    y += lineHeight;
    pdf.text(`Tax (18% GST): ₹${tax.toFixed(2)}`, 150, y, { align: "right" });
    const totalAmount = subtotal + tax;
    y += lineHeight;
    pdf.setFontSize(14);
    pdf.text(`Total: ₹${totalAmount.toFixed(2)}`, 150, y, { align: "right" });

    y += lineHeight * 3;
    pdf.setFontSize(10);
    pdf.text("Thank you for shopping!", 105, y, { align: "center" });

    pdf.save(`Invoice_${orderData.orderId}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your orders</p>
        </div>

        <div className="mb-6 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? "No orders match your search." : "You haven't placed any orders yet."}
                  </p>
                  <Link href="/">
                    <Button>Start Shopping</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg">Order #{order.orderId}</CardTitle>
                          <p className="text-sm text-gray-600">
                            Placed on {new Date(order.orderDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </Badge>
                          <span className="text-lg font-semibold text-blue-600">₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-3">
                          <h4 className="font-medium mb-3">Items ({order.items.length})</h4>
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <img src={item.product.images[0] || "/placeholder.svg"} alt={item.name} className="w-12 h-12 object-cover rounded" />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-600">Brand: {item.brand || "N/A"}</p>
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-blue-500" /> Delivery Address
                            </h4>
                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                              <p className="font-medium text-gray-900">{order.address.name}</p>
                              <p className="flex items-center gap-1 mt-1">
                                <Phone className="h-3 w-3" />
                                {order.address.phone}
                              </p>
                              <p className="mt-1">
                                {order.address.address}, {order.address.city}, {order.address.state} - {order.address.pincode}
                              </p>
                            </div>
                          </div>

                          {order.timeline && order.timeline.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Truck className="h-4 w-4 text-blue-500" /> Delivery Status
                              </h4>
                              <div className="space-y-4 bg-gray-50 p-3 rounded-lg">
                                {order.timeline.map((step, i) => (
                                  <div key={i} className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${step.completed ? "bg-green-500" : "bg-gray-300"}`}></div>
                                    <div>
                                      <p className={`font-medium ${step.completed ? "text-green-700" : "text-gray-700"}`}>{step.status}</p>
                                      <p className="text-sm text-gray-600">
                                        {step.completed
                                          ? new Date(step.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
                                          : "Pending"}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-500" /> Expected Delivery
                            </h4>
                            <div className="text-sm bg-gray-50 p-3 rounded-lg">
                              <p className="font-medium text-green-700">
                                {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Link href={`/aarogyamart/order/${order.id}`}>
                              <Button className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 text-white">
                                <Eye className="h-4 w-4 mr-2" /> View Details
                              </Button>
                            </Link>
                            <Button variant="outline" className="w-full rounded-xl" onClick={() => downloadInvoice(order)}>
                              <Download className="h-4 w-4 mr-2" /> Download Invoice
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Viewallorders;
