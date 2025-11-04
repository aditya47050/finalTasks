"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { X,Building2, Package, FileText, Truck, BarChart3, Loader2, Star, Users, CreditCard } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Link } from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
export default function SellerDetailsPage({ params }) {
  const { id } = params;
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    async function fetchSeller() {
      try {
        const res = await fetch(`/api/aarogyamart/martseller/${id}`);
        const data = await res.json();
        if (data.success) setSeller(data.data);
      } catch (err) {
        console.error("Failed to fetch seller:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSeller();
  }, [id]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="mt-2 text-lg font-medium">Loading seller details...</p>
      </div>
    );

  if (!seller) return <div className="p-10 text-center text-red-500 text-xl">Seller not found.</div>;

  const stats = seller.orderStats || {};
const ChartView = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
      <YAxis />
      <Tooltip formatter={(value, name) => [value, name]} />
      <Area type="monotone" dataKey="totalRevenue" stroke="#3b82f6" fill="url(#colorRevenue)" name="Revenue"/>
      <Area type="monotone" dataKey="deliveredOrders" stroke="#10b981" fill="url(#colorDelivered)" name="Delivered Orders"/>
      <Area type="monotone" dataKey="pendingOrders" stroke="#f59e0b" fill="url(#colorPending)" name="Pending Orders"/>
    </AreaChart>
  </ResponsiveContainer>
);
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">

      {/* Seller Info */}
      <Card className="border-none shadow-lg transform hover:scale-[1.02] transition-all duration-300 bg-blue-50">
        <CardHeader className="flex flex-row items-center rounded-xl p-4">
          <CardTitle className="inline-flex items-center text-xl font-semibold text-blue-800 gap-2">
            <Building2 className="w-6 h-6 text-blue-600" /> Seller Information
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-row justify-between items-start space-y-1 text-gray-700">
          <div>
            <p><strong>Email:</strong> {seller.email}</p>
            <p><strong>Mobile:</strong> {seller.mobile}</p>
            <p><strong>Address:</strong> {seller.address || "N/A"}</p>
            <p><strong>Pincode:</strong> {seller.pincode || "N/A"}</p>
            <p><strong>Status:</strong> <span className={`px-2 py-1 rounded ${seller.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{seller.status}</span></p>
            <p><strong>Created:</strong> {new Date(seller.createdAt).toLocaleDateString()}</p>
            <p><strong>Updated:</strong> {new Date(seller.updatedAt).toLocaleDateString()}</p>
          </div>
          {/* Brand info on the right */}
          <div className="flex items-center gap-3 ">
              <div key={seller?.brands[0]?.id} className="w-full h-full flex flex-col items-center gap-2 px-3 py-1 rounded-lg shadow">
                <img src={seller?.brands[0]?.image} alt={seller?.brands[0]?.name} className="w-20 h-20 bg-blue-500 object-contain rounded" />
                <span className="font-bold text-blue-500">{seller?.brands[0]?.name}</span>
              </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="shadow-lg p-4 animate-fadeIn bg-green-50">
        <CardHeader className="flex flex-row items-center gap-2 mb-3  p-2 rounded-lg">
          <BarChart3 className="w-5 h-5 text-green-700" />
          <CardTitle>Order Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-green-200 rounded-lg shadow hover:shadow-md transition-all text-center">
            <Users className="mx-auto w-6 h-6 text-green-800 mb-1" />
            <p className="text-lg font-bold text-green-800">{stats.totalOrders || 0}</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
          <div className="p-4 bg-blue-200 rounded-lg shadow hover:shadow-md transition-all text-center">
            <CreditCard className="mx-auto w-6 h-6 text-blue-700 mb-1" />
            <p className="text-lg font-bold text-blue-700">{stats.deliveredOrders || 0}</p>
            <p className="text-sm text-gray-600">Delivered</p>
          </div>
          <div className="p-4 bg-yellow-200 rounded-lg shadow hover:shadow-md transition-all text-center">
            <Truck className="mx-auto w-6 h-6 text-yellow-700 mb-1" />
            <p className="text-lg font-bold text-yellow-700">{stats.pendingOrders || 0}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="p-4 bg-purple-200 rounded-lg shadow hover:shadow-md transition-all text-center">
            <Package className="mx-auto w-6 h-6 text-purple-700 mb-1" />
            <p className="text-lg font-bold text-purple-700">{stats.shippedOrders || 0}</p>
            <p className="text-sm text-gray-600">Shipped</p>
          </div>
          <div className="col-span-2 sm:col-span-4 p-4 bg-green-100 rounded-lg shadow text-center animate-pulse">
            <p className="text-2xl font-semibold text-green-900">₹{stats.totalRevenue?.toFixed(2) || 0}</p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card className="shadow-lg p-4 animate-fadeIn bg-yellow-50">
        <CardHeader className="flex flex-row items-center gap-2 mb-3 p-2 rounded-lg">
          <FileText className="w-5 h-5 text-yellow-700" />
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4">
          {seller.documents ? (
            Object.entries(seller.documents).map(([key, value]) => (
              <div key={key} className="p-3 space-y-2 border rounded-xl bg-white shadow hover:shadow-md transition-all">
                <p className="font-medium capitalize text-gray-700">{key}</p>
                <p className="font-medium capitalize text-gray-600">{value.number}</p>
                <div>
                  {value.fileUrl && <a href={value.fileUrl} target="_blank" className="text-white text-sm bg-blue-500 p-2 mt-2 rounded-xl">
                    View Document
                  </a>}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No documents uploaded</p>
          )}
        </CardContent>
      </Card>

      {/* Revenue Analytics */}
      <Card className="shadow-lg p-4 animate-fadeIn bg-purple-50">
        <CardHeader className="flex flex-row items-center gap-2 mb-3 p-2 rounded-lg">
          <BarChart3 className="w-5 h-5 text-purple-700" />
          <CardTitle>Revenue Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="7days">
            <TabsList>
              <TabsTrigger value="7days">Last 7 Days</TabsTrigger>
              <TabsTrigger value="month">Last Month</TabsTrigger>
              <TabsTrigger value="year">Last Year</TabsTrigger>
            </TabsList>
            <TabsContent value="7days">
              <ChartView data={seller.chartData.last7Days} />
            </TabsContent>
            <TabsContent value="month">
              <ChartView data={seller.chartData.lastMonth} />
            </TabsContent>
            <TabsContent value="year">
              <ChartView data={seller.chartData.lastYear} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Products */}
      <Card className="shadow-lg p-4 animate-fadeIn bg-pink-50">
        <CardHeader className="flex flex-row items-center gap-2 mb-3  p-2 rounded-lg">
          <Package className="w-5 h-5 text-pink-700" />
          <CardTitle>Products ({seller.products.length})</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {seller.products.map((p) => (
            <div key={p.id} className="p-4 border rounded-lg bg-white shadow hover:shadow-xl transition-transform hover:-translate-y-1 duration-300">
              <img src={p.images[0]} alt={p.name} className="h-40 w-full object-cover rounded-md" />
              <h3 className="mt-2 font-semibold text-gray-800">{p.name}</h3>
              <p className="text-xs text-gray-400">{p.category.name}</p>
              {p.reviews?.length > 0 && (
                <div className="mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4" />
                    {p.rating?.toFixed(1) || "N/A"}
                  </div>
                  <p>{p.reviews.length} Reviews</p>
                </div>
              )}
              <p className={`mt-1 font-medium ${p.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {p.inStock ? `In Stock: ${p.stockCount}` : 'Out of Stock'}
              </p>
              {p.discount && (
                <p className="text-sm line-through block text-gray-400">
                  ₹{p.originalPrice} <span className="pl-2 text-sm inline-block text-blue-500">₹{p.price}</span>
                </p>
              )}
              <div className="w-full mt-2 flex justify-center">
                <a href={`/aarogyamart/product/${p.id}`} className="w-full text-center bg-blue-500 text-white px-4 py-2 rounded-xl">View Product</a>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Orders */}
      <Card className="shadow-lg p-4 animate-fadeIn bg-teal-50">
        <CardHeader className="flex flex-row items-center gap-2 mb-3 p-2 rounded-xl">
          <Truck className="w-5 h-5 text-teal-700" />
          <CardTitle>Orders ({seller.orders.length})</CardTitle>
        </CardHeader>
        <CardContent className="rounded-xl grid grid-cols-4 gap-4">
          {seller.orders.length > 0 ? (
            seller.orders.map((o) => (
              <div key={o.id} className="p-4 border rounded-xl bg-white shadow hover:shadow-md transition-all">
                <p><strong>Order ID:</strong> {o.orderId}</p>
                <p><strong>Status:</strong> <span className={`px-2 py-1 rounded ${o.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{o.status}</span></p>
                <p><strong>Total:</strong> ₹{o.total}</p>
                <p className="text-sm text-gray-500">{new Date(o.orderDate).toLocaleDateString()}</p>
                {o.timeline?.length > 0 && (
                  <p className="text-xs text-gray-400">
                    Last Update: {o.timeline[o.timeline.length - 1].status} on {new Date(o.timeline[o.timeline.length - 1].date).toLocaleDateString()}
                  </p>
                )}
                <button
                  onClick={() => setSelectedOrder(o)}
                  className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No orders found</p>
          )}
        </CardContent>
      </Card>
       {/* Modal for order details */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl h-[70vh] rounded-xl p-6 bg-white shadow-xl">
          <DialogHeader className="flex justify-between items-center mb-4">
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Total:</strong> ₹{selectedOrder.total}</p>
              <p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
              <p><strong>Payment ID:</strong> {selectedOrder.paymentId}</p>

              {/* Address */}
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p><strong>Shipping Address:</strong></p>
                <p>{selectedOrder.address?.name}</p>
                <p>{selectedOrder.address?.address}</p>
                <p>{selectedOrder.address?.city}, {selectedOrder.address?.pincode}</p>
                <p>{selectedOrder.address?.phone}</p>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <p className="font-semibold">Items:</p>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border">
                    {item.image && <img src={item.image} className="w-16 h-16 object-cover rounded" />}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Brand: {item.brand}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-500">Price: ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div className="space-y-2 mt-4">
                <p className="font-semibold">Timeline:</p>
                {selectedOrder.timeline.map((t, index) => (
                  <div key={index} className="flex flex-col justify-between bg-gray-100 p-2 rounded-lg">
                    <p>{t.status}</p>
                    <p>{t.description}</p>
                    <p className="text-sm text-gray-500">{new Date(t.date).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
