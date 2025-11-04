"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, User, Home, Edit2, MapPin, X, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function AccountDetailsEnhanced({ userData, orders = [] }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [addresses, setAddresses] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const safeUser = userData || {};
  const previewOrders = Array.isArray(orders) ? orders.slice(0, 3) : [];
  const returnOrders = orders.filter((o) => o.status === "delivered");

  // 🧠 Fetch addresses
  useEffect(() => {
    if (!safeUser?.id) return;
    fetch(`/api/aarogyamart/address?userId=${safeUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAddresses(data.data);
      })
      .catch(console.error);
  }, [safeUser?.id]);

  // ✏️ Handle Edit Click
  const handleEdit = (address) => {
    setSelectedAddress(address);
    setShowEditModal(true);
  };

  const handleSaveAddress = async () => {
    if (!selectedAddress) return;
    const res = await fetch(`/api/address/${selectedAddress.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...selectedAddress, userId: safeUser.id }),
    });
    const data = await res.json();
    if (data.success) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === selectedAddress.id ? data.data : a))
      );
      setShowEditModal(false);
    } else {
      alert(data.error || "Failed to update");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                My Account
              </h1>
              <p className="text-gray-600">Manage your profile and orders</p>
            </div>
            <div className="hidden sm:flex gap-3">
              <Link href={'/patient/dashboard/profile'}>
                <Button className="rounded-xl text-blue-500 border border-blue-600">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{orders.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Delivered</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {orders.filter((o) => o.status === "delivered").length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Spent</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    ₹{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl">
                  <ShoppingCart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 gap-2 bg-white p-1 border border-gray-200 rounded-xl">
            <TabsTrigger value="profile" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <User className="h-4 w-4 mr-2" /> Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Package className="h-4 w-4 mr-2" /> Orders
            </TabsTrigger>
            <TabsTrigger value="returns" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Package className="h-4 w-4 mr-2" /> Returns
            </TabsTrigger>
            <TabsTrigger value="address" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <MapPin className="h-4 w-4 mr-2" /> Address
            </TabsTrigger>
          </TabsList>

          {/* 🧍 Profile Tab */}
          <TabsContent value="profile" className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-blue-500 to-blue-600">
                  <CardHeader>
                    <CardTitle className="text-white text-4xl ">Profile Information</CardTitle>
                  </CardHeader>
                </div>
                <CardContent className="space-y-6">
                  {safeUser?.email ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Name</label>
                          <p className="text-lg text-gray-900 mt-2 font-medium">
                            {safeUser.name || safeUser.role || "Not provided"}
                          </p>
                        </div>
                        <div className="group">
                          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Email</label>
                          <p className="text-lg text-gray-900 mt-2 font-medium flex items-center gap-2">
                            <Mail className="h-4 w-4 text-blue-600" />
                            {safeUser.email}
                          </p>
                        </div>
                        <div className="group">
                          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Phone</label>
                          <p className="text-lg text-gray-900 mt-2 font-medium flex items-center gap-2">
                            <Phone className="h-4 w-4 text-blue-600" />
                            {safeUser.mobile ? `+91-${safeUser.mobile}` : "Not provided"}
                          </p>
                        </div>
                        <div className="group">
                          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                            Member Since
                          </label>
                          <p className="text-lg text-gray-900 mt-2 font-medium">
                            {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long" })}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">Please log in to view profile details.</p>
                      <Button className="bg-blue-600 hover:bg-blue-700 rounded-full">Sign In</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <Link href="/aarogyamart/cart">
                    <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl justify-start">
                      <ShoppingCart className="h-4 w-4 mr-2" /> Cart
                    </Button>
                  </Link>
                  <Link href="/aarogyamart/orders">
                    <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl justify-start">
                      <Package className="h-4 w-4 mr-2" /> All Orders
                    </Button>
                  </Link>
                  <Link href="/patient/dashboard">
                    <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl justify-start">
                      <Home className="h-4 w-4 mr-2" /> Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 📦 Orders Tab */}
          <TabsContent value="orders" className="animate-fade-in">
            {previewOrders.length === 0 ? (
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardContent className="text-center py-16">
                  <div className="mb-4">
                    <Package className="h-16 w-16 text-gray-300 mx-auto" />
                  </div>
                  <p className="text-gray-600 mb-4 text-lg">You haven't placed any orders yet.</p>
                  <Link href="/aarogyamart/orders">
                    <Button className="bg-blue-600 hover:bg-blue-700 rounded-full">Start Shopping</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {previewOrders.map((order, index) => (
                    <Card
                      key={order.id}
                      className="border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-2xl overflow-hidden animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">Order #{order.orderId}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(order.orderDate).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">₹{order.total.toLocaleString()}</p>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "shipped"
                                    ? "bg-blue-100 text-blue-700"
                                    : order.status === "processing"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-gray-600">
                          {order.items.length} item{order.items.length > 1 ? "s" : ""} in this order
                        </p>
                        <Link href={`/aarogyamart/order/${order.id}`}>
                          <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-full">
                            View Details
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link href="/aarogyamart/orders">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                      View All Orders
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </TabsContent>

          {/* 🔁 Returns Tab */}
          <TabsContent value="returns">
            {returnOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No delivered orders to return.</p>
            ) : (
              returnOrders.map((order) => (
                <Card key={order.id} className="mb-4 border-0 shadow-md rounded-2xl">
                  <CardHeader>
                    <CardTitle>Delivered Order #{order.orderId}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Total: ₹{order.total}</p>
                    <p>Status: {order.status}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* 📍 Address Tab */}
          <TabsContent value="address">
            {addresses.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No addresses found.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {addresses.map((addr,index) => (
                  <Card
                    key={addr.id}
                    className="border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-2xl overflow-hidden animate-fade-in"
                  >
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-4">
                      <CardTitle>{addr.name}</CardTitle>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-3 right-3"
                        onClick={() => handleEdit(addr)}
                      >
                        <Edit2 className="h-4 w-4 text-blue-600 hover:text-blue-500" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="col-span-2">{addr.address}</p>
                        <div className="flex items-center gap-1"><MapPin className="h-5 w-5"/><div className="text-base">{addr.city}, {addr.state}, {addr.pincode}</div></div>
                        <div className="flex items-center gap-1"><Phone className="h-5 w-5"/><div>{addr.phone}</div></div>
                        {addr.isDefault && <p className="text-sm text-blue-600 mt-2">(Default)</p>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* 🪟 Edit Address Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative">
            <button className="absolute top-4 right-4" onClick={() => setShowEditModal(false)}>
              <X className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Address</h2>
            <div className="space-y-3">
              <input
                className="border w-full p-2 rounded"
                placeholder="Name"
                value={selectedAddress?.name || ""}
                onChange={(e) =>
                  setSelectedAddress({ ...selectedAddress, name: e.target.value })
                }
              />
              <input
                className="border w-full p-2 rounded"
                placeholder="Phone"
                value={selectedAddress?.phone || ""}
                onChange={(e) =>
                  setSelectedAddress({ ...selectedAddress, phone: e.target.value })
                }
              />
              <input
                className="border w-full p-2 rounded"
                placeholder="Address"
                value={selectedAddress?.address || ""}
                onChange={(e) =>
                  setSelectedAddress({ ...selectedAddress, address: e.target.value })
                }
              />
              <input
                className="border w-full p-2 rounded"
                placeholder="City"
                value={selectedAddress?.city || ""}
                onChange={(e) =>
                  setSelectedAddress({ ...selectedAddress, city: e.target.value })
                }
              />
              <input
                className="border w-full p-2 rounded"
                placeholder="Pincode"
                value={selectedAddress?.pincode || ""}
                onChange={(e) =>
                  setSelectedAddress({ ...selectedAddress, pincode: e.target.value })
                }
              />
              <Button onClick={handleSaveAddress} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
