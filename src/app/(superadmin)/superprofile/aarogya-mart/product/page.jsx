"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function SuperadminProductsPage() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [badge, setBadge] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/aarogyamart/products"); // superadmin endpoint
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setBadge(product.badge || "");
    setOpen(true);
  };

  const saveBadge = async () => {
    try {
      const res = await fetch(`/api/aarogyamart/superadmin/product/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ badge }),
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
        setOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Superadmin - Products</h1>

      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Price</th>
              <th className="border px-4 py-2 text-left">Category</th>
              <th className="border px-4 py-2 text-left">Brand</th>
              <th className="border px-4 py-2 text-left">Badge</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{p.name}</td>
                <td className="border px-4 py-2">₹{p.price}</td>
                <td className="border px-4 py-2">{p.category?.name || "—"}</td>
                <td className="border px-4 py-2">{p.brand?.name || "—"}</td>
                <td className="border px-4 py-2">{p.badge || "—"}</td>
                <td className="border px-4 py-2">
                  <Button onClick={() => openEdit(p)} className="bg-blue-500 text-white rounded-xl">
                    Edit / Add Badge
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Badge Modal */}
      <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
        <DialogContent className="max-w-md bg-white rounded-xl p-6">
          <DialogHeader>
            <DialogTitle>Edit Product Badge</DialogTitle>
          </DialogHeader>

          {editingProduct && (
            <div className="space-y-4 mt-4">
              <p>
                <strong>Product:</strong> {editingProduct.name}
              </p>
              <Input
                placeholder="Badge"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
              />
              <Button onClick={saveBadge} className="bg-blue-500 text-white w-full">
                Save Badge
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
