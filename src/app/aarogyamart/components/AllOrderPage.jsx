"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Search, Eye, Download, Truck, Calendar, MapPin, Phone, RotateCcw } from "lucide-react"
import Link from "next/link"
import { jsPDF } from "jspdf"

export default function AllOrdersEnhanced({ id }) {
  const userId = id
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/aarogyamart/order?userId=${userId}`)
        if (!res.ok) throw new Error("Failed to fetch orders")
        const data = await res.json()
        setOrders(data.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [userId])

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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    return matchesSearch && order.status === activeTab.toLowerCase()
  })

  const downloadInvoice = (orderData) => {
    const pdf = new jsPDF("p", "mm", "a4")
    const lineHeight = 8
    let y = 20

    pdf.setFontSize(18)
    pdf.text("Invoice", 105, y, { align: "center" })

    y += lineHeight * 2
    pdf.setFontSize(12)
    pdf.text(`Order ID: ${orderData.orderId}`, 20, y)
    pdf.text(`Payment ID: ${orderData.paymentId}`, 20, y + lineHeight)
    pdf.text(`Order Date: ${new Date(orderData.orderDate).toLocaleDateString()}`, 20, y + lineHeight * 2)

    y += lineHeight * 4
    pdf.text(`Customer: ${orderData.address.name}`, 20, y)
    pdf.text(`Phone: ${orderData.address.phone}`, 20, y + lineHeight)
    pdf.text(
      `Address: ${orderData.address.address}, ${orderData.address.city}, ${orderData.address.state} - ${orderData.address.pincode}`,
      20,
      y + lineHeight * 2,
    )

    y += lineHeight * 4
    pdf.setFontSize(12)
    pdf.text("Items:", 20, y)
    y += lineHeight

    pdf.setFontSize(11)
    pdf.text("Item", 20, y)
    pdf.text("Qty", 100, y, { align: "right" })
    pdf.text("Price", 120, y, { align: "right" })
    pdf.text("Subtotal", 150, y, { align: "right" })
    y += lineHeight

    let subtotal = 0
    orderData.items.forEach((item) => {
      const itemTotal = item.price * item.quantity
      subtotal += itemTotal
      pdf.text(item.name, 20, y)
      pdf.text(item.quantity.toString(), 100, y, { align: "right" })
      pdf.text(`₹${item.price.toFixed(2)}`, 120, y, { align: "right" })
      pdf.text(`₹${itemTotal.toFixed(2)}`, 150, y, { align: "right" })
      y += lineHeight
    })

    y += lineHeight
    pdf.setFontSize(12)
    pdf.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 150, y, { align: "right" })

    const tax = subtotal * 0.18
    y += lineHeight
    pdf.text(`Tax (18% GST): ₹${tax.toFixed(2)}`, 150, y, { align: "right" })

    const totalAmount = subtotal + tax
    y += lineHeight
    pdf.setFontSize(14)
    pdf.text(`Total: ₹${totalAmount.toFixed(2)}`, 150, y, { align: "right" })

    y += lineHeight * 3
    pdf.setFontSize(10)
    pdf.text("Thank you for shopping with AarogyaMart!", 105, y, { align: "center" })

    pdf.save(`Invoice_${orderData.orderId}.pdf`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="h-10 w-1/3 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full animate-pulse"></div>
          <div className="h-6 w-1/4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full animate-pulse"></div>

          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-0 shadow-lg rounded-2xl">
              <CardContent className="space-y-4 pt-6">
                <div className="h-6 w-1/4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full animate-pulse"></div>
                {[1, 2].map((j) => (
                  <div key={j} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full animate-pulse"></div>
                      <div className="h-3 w-1/2 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
            My Orders
          </h1>
          <p className="text-gray-600 text-lg">Track and manage all your orders</p>
        </div>

        {/* Search */}
        <div className="mb-6 animate-fade-in">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search by order ID or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto bg-white border border-gray-200 rounded-full p-1 shadow-sm">
            <TabsTrigger
              value="all"
              className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
            >
              All Orders
            </TabsTrigger>
            <TabsTrigger
              value="Pending"
              className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="confirmed"
              className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
            >
              Confirmed
            </TabsTrigger>
            <TabsTrigger
              value="processing"
              className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
            >
              Processing
            </TabsTrigger>
            <TabsTrigger
              value="shipped"
              className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
            >
              Shipped
            </TabsTrigger>
            <TabsTrigger
              value="delivered"
              className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
            >
              Delivered
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredOrders.length === 0 ? (
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardContent className="text-center py-16">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm ? "No orders match your search." : "You haven't placed any orders yet."}
                  </p>
                  <Link href="/">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                      Start Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order, index) => (
                  <Card
                    key={order.id}
                    className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden hover:translate-y-[-4px] animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <CardTitle className="text-xl">Order #{order.orderId}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            Placed on{" "}
                            {new Date(order.orderDate).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(order.status)} rounded-full px-4 py-1`}>
                            <span className="capitalize">{order.status}</span>
                          </Badge>
                          <span className="text-2xl font-bold text-blue-600">₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Order Items */}
                        <div className="lg:col-span-2">
                          <h4 className="font-semibold text-gray-900 mb-4">Items ({order.items.length})</h4>
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group"
                              >
                                <img
                                  src={item.product?.images?.[0] || item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  className="w-14 h-14 object-cover rounded-lg group-hover:scale-105 transition-transform"
                                />
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">{item.name}</p>
                                  <p className="text-sm text-gray-600">Brand: {item.brand}</p>
                                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-blue-600">
                                  ₹{(item.price * item.quantity).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="space-y-4">
                          {/* Delivery Address */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              Delivery Address
                            </h4>
                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                              <p className="font-semibold text-gray-900">{order.address.name}</p>
                              <p className="flex items-center gap-1 mt-1">
                                <Phone className="h-3 w-3" />
                                {order.address.phone}
                              </p>
                              <p className="mt-2 leading-relaxed">
                                {order.address.address}, {order.address.city}, {order.address.state} -{" "}
                                {order.address.pincode}
                              </p>
                            </div>
                          </div>

                          {/* Delivery Status */}
                          {order.timeline && order.timeline.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <Truck className="h-4 w-4 text-blue-600" />
                                Status
                              </h4>
                              <div className="space-y-2 bg-gray-50 p-3 rounded-xl">
                                {order.timeline.slice(0, 2).map((step) => (
                                  <div key={step.id} className="flex items-center gap-2">
                                    <div
                                      className={`w-2 h-2 rounded-full ${step.completed ? "bg-green-500" : "bg-gray-300"}`}
                                    ></div>
                                    <p
                                      className={`text-sm font-medium ${step.completed ? "text-green-700" : "text-gray-700"}`}
                                    >
                                      {step.status}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Expected Delivery */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              Expected Delivery
                            </h4>
                            <div className="text-sm bg-green-50 p-3 rounded-xl">
                              <p className="font-semibold text-green-700">
                                {new Date(
                                  new Date(order.timeline[0].date).setDate(
                                    new Date(order.timeline[0].date).getDate() + 10,
                                  ),
                                ).toLocaleDateString("en-IN", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2 pt-2">
                            <Link href={`/aarogyamart/order/${order.id}`} className="w-full">
                              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              className="w-full rounded-xl bg-gray-50 hover:bg-gray-100 border-gray-200 font-medium transition-all"
                              onClick={() => downloadInvoice(order)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Invoice
                            </Button>
                            {order.status?.toLowerCase() === "delivered" && (
                              <Button
                                variant="outline"
                                className="w-full rounded-xl bg-red-50 hover:bg-red-100 border-red-200 text-red-600 font-medium transition-all"
                              >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Return
                              </Button>
                            )}
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
  )
}
