"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image';

export default function BannerDashboard() {
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ title: "", subtitle: "", image: "", cta: "", link: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch banners
  async function fetchBanners() {
    const res = await fetch("/api/aarogyamart/banners");
    const data = await res.json();
    setBanners(data);
  }

  // Fetch products for dropdown
  async function fetchProducts() {
    const res = await fetch("/api/aarogyamart/products");
    const data = await res.json();
    setProducts(data?.data);
  }

  useEffect(() => {
    fetchBanners();
    fetchProducts();
  }, []);

  async function saveBanner() {
    if (editingId) {
      await fetch(`/api/aarogyamart/banners/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/aarogyamart/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ title: "", subtitle: "", image: "", cta: "", link: "" });
    setEditingId(null);
    fetchBanners();
  }

  function editBanner(banner) {
    setForm({
      title: banner.title,
      subtitle: banner.subtitle || "",
      image: banner.image,
      cta: banner.cta || "",
      link: banner.link || "",
    });
    setEditingId(banner.id);
  }

  async function deleteBanner(id) {
    await fetch(`/api/aarogyamart/banners/${id}`, { method: "DELETE" });
    fetchBanners();
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-3xl font-bold text-blue-500 animate-fadeIn">Banner Management</h1>

      {/* Add / Edit Banner */}
      <Card className="bg-white shadow-md rounded-lg hover:shadow-xl transition-all duration-300 animate-fadeIn">
        <CardHeader>
          <CardTitle className="text-blue-500">{editingId ? "Edit Banner" : "Add Banner"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border-blue-500 focus:ring-blue-500"
          />
          <Input
            placeholder="Subtitle"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className="border-blue-500 focus:ring-blue-500"
          />
          <Input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="border-blue-500 focus:ring-blue-500"
          />
          <Input
            placeholder="CTA"
            value={form.cta}
            onChange={(e) => setForm({ ...form, cta: e.target.value })}
            className="border-blue-500 focus:ring-blue-500"
          />

          {/* Product Link Dropdown */}
          <div>
            <label className="block mb-1 font-medium text-blue-500">Link to Product</label>
            <select
              className="border rounded px-2 py-1 w-full border-blue-500 focus:ring-blue-500"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            >
              <option value="">Select a Product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={saveBanner}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 mt-2"
          >
            {editingId ? "Update Banner" : "Add Banner"}
          </Button>
        </CardContent>
      </Card>

      {/* Banner List */}
      <div className="grid md:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <Card
            key={banner.id}
            className="bg-white shadow-md rounded-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 animate-fadeIn"
          >
            <CardHeader>
              <CardTitle className="text-blue-500">{banner.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {banner.subtitle && <p className="text-gray-600">{banner.subtitle}</p>}
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              {banner.cta && <p className="text-blue-500 font-medium">CTA: {banner.cta}</p>}
              {banner.link && (
                <p className="text-gray-700">
                  Linked Product: {products.find((p) => p.id === banner.link)?.name || "Deleted"}
                </p>
              )}
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  className="border-blue-500 text-blue-500 hover:bg-blue-50 transition-all duration-300"
                  onClick={() => editBanner(banner)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600 text-white transition-all duration-300"
                  onClick={() => deleteBanner(banner.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
