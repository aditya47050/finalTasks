"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminSellerApproval() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchSellers() {
    const res = await fetch("/api/aarogyamart/martseller/list");
    const data = await res.json();
    if (data.success) setSellers(data.data);
  }

  useEffect(() => {
    fetchSellers();
  }, []);

  async function updateStatus(id, status) {
    setLoading(true);
    const res = await fetch("/api/aarogyamart/martseller/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (data.success) fetchSellers();
    setLoading(false);
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-blue-500">Seller Approval Dashboard</h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 hover:bg-gray-100">
              <th className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Email</th>
              <th className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Mobile</th>
              <th className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Pincode</th>
              <th className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Address</th>
              <th className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Status</th>
              <th className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((s, index) => (
              <tr
                key={s.id}
                className={`transition-colors duration-150 ease-in-out
                  hover:bg-gray-50/50 
                  ${index % 2 === 0 ? "bg-white" : "bg-gray-50/20"}
                  border-[1px] border-gray-100`}
              >
                <td className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap">{s.email}</td>
                <td className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap">{s.mobile}</td>
                <td className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap">{s.pincode || "—"}</td>
                <td className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap">{s.address || "—"}</td>
                <td className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap">{s.status}</td>

                <td className="p-3 border border-gray-200 flex gap-2 flex-wrap">
                  {/* ✅ View Button */}
                  <Link href={`/superprofile/aarogya-mart/mart-seller/${s.id}`}>
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                    >
                      View
                    </Button>
                  </Link>

                  {/* ✅ Approve / Reject Buttons */}
                  {s.status === "PENDING" ? (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                        onClick={() => updateStatus(s.id, "APPROVED")}
                        disabled={loading}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                        onClick={() => updateStatus(s.id, "REJECTED")}
                        disabled={loading}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <span className="text-gray-500">{s.status}</span>
                  )}
                </td>
              </tr>
            ))}
            {sellers.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No sellers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
