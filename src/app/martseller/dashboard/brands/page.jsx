"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/aarogyamart/brands");
      const j = await res.json();
      if (j.success) setBrands(j.data);
    })();
  }, []);

  return (
    <div className="animate-fadeIn container my-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-500">Brands</h2>
        <Link href="/martseller/dashboard/brands/new">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white transition-all rounded-xl">
            Add Brand
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-3 text-left border border-blue-600">Name</th>
              <th className="p-3 text-left border border-blue-600">Image</th>
              <th className="p-3 text-left border border-blue-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id} className="hover:bg-blue-50 transition-colors">
                <td className="p-3 border border-gray-200">{b.name}</td>
                <td className="p-3 border border-gray-200">
                  {b.image ? (
                    <Image
                      width={300}
                      height={300}
                      src={b.image}
                      alt={b.name}
                      className="h-12 w-12 object-contain rounded-xl shadow-sm"
                    />
                  ) : (
                    `—`
                  )}
                </td>
                <td className="p-3 border border-gray-200">
                  <Link href={`/martseller/dashboard/brands/${b.id}`}>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white transition-all rounded-xl">
                      Edit
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
            {brands.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No brands found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
