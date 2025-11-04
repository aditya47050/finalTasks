"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/aarogyamart/orders?id=${id}`);
        const data = await res.json();
        if (data.success) setOrder(data.orders[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  async function changeStatus(newStatus) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/aarogyamart/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) setOrder(data.order);
      else alert(data.error || "Failed to update status");
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <p className="text-blue-500 animate-pulse">Loading order...</p>;
  if (!order) return <p className="text-red-500">Order not found.</p>;

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      {/* Order Info */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-2xl font-bold text-blue-500 mb-4">Order Details</h1>
        <p><strong>Order ID:</strong> {order.orderId}</p>
        <p>
          <strong>Status:</strong>
          <span className={`ml-2 px-2 py-1 rounded text-white ${
            order.status === "pending" ? "bg-yellow-500" :
            order.status === "processing" ? "bg-blue-500" :
            order.status === "shipped" ? "bg-indigo-500" :
            order.status === "delivered" ? "bg-green-500" : "bg-red-500"
          }`}>
            {order.status}
          </span>
        </p>
        <p><strong>Total:</strong> ₹{order.total}</p>
        <p><strong>Customer:</strong> {order.address?.name}</p>
        <p><strong>Address:</strong> {order.address?.address}, {order.address?.city}</p>
      </div>

      {/* Order Items */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold text-blue-500 mb-2">Items</h2>
        <table className="w-full mb-4">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Brand</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Qty</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b hover:bg-blue-50 transition-all duration-300">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.brand}</td>
                <td className="p-2">₹{item.price}</td>
                <td className="p-2">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Timeline */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold text-blue-500 mb-4">Timeline</h2>
        <div className="flex flex-col space-y-3">
          {order.timeline.map((t) => (
            <div
              key={t.id}
              className={`p-3 rounded border-l-4 transition-all duration-300
                ${t.completed ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50"}`}
            >
              <p className="font-semibold">{t.status}</p>
              <p className="text-sm text-gray-600">{t.description}</p>
              <p className="text-xs text-gray-400">{new Date(t.date).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Change Status */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold text-blue-500 mb-2">Change Status</h2>
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((s) => (
            <Button
              key={s}
              disabled={updating || order.status === s}
              className={`${
                order.status === s ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              } text-white transition-all duration-300`}
              onClick={() => changeStatus(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
