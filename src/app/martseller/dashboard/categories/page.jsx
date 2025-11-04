"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/aarogyamart/categories");
      const j = await res.json();
      if (j.success) setCategories(j.data);
    })();
  }, []);

  return (
    <div className="container my-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-500">Categories</h2>
        <Link href="/martseller/dashboard/categories/new">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white transition-all rounded-xl">
            Add Category
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg bg-white animate-fadeIn">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="border-b hover:bg-blue-50 transition-colors"
              >
                <td className="p-3">{cat.name}</td>
                <td className="p-3">{cat.description || "—"}</td>
                <td className="p-3">
                  <Link href={`/martseller/dashboard/categories/${cat.id}`}>
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white transition-all"
                    >
                      Edit
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
