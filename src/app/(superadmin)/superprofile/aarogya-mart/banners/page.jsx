"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { UploadButton } from "@uploadthing/react";
import { toast } from "sonner"; // optional toast lib if you use it

export default function BannerDashboard() {
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ title: "", subtitle: "", image: "", cta: "", link: "" });
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);

  async function fetchBanners() {
    const res = await fetch("/api/aarogyamart/banners");
    const data = await res.json();
    setBanners(data);
  }

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
    resetForm();
    fetchBanners();
    setOpen(false);
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
    setOpen(true);
  }

  function resetForm() {
    setForm({ title: "", subtitle: "", image: "", cta: "", link: "" });
    setEditingId(null);
  }

  async function deleteBanner(id) {
    await fetch(`/api/aarogyamart/banners/${id}`, { method: "DELETE" });
    fetchBanners();
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-500">Banner Management</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-blue-500">
                {editingId ? "Edit Banner" : "Add Banner"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <Input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Input
                placeholder="Subtitle"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              />

              {/* UploadThing Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">Upload Image</label>
                <UploadButton
                  endpoint="fileUploader"
                  content={{
                    button({ ready }) {
                      return <div>{ready && <div>Upload</div>}</div>;
                    },
                    allowedContent: () => "",
                  }}
                  appearance={{
                    button: "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
                    container: "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
                    allowedContent: "hidden",
                  }}
                  onClientUploadComplete={(res) => {
                    if (res.length > 0) {
                      setForm({ ...form, image: res[0].url });
                      toast.success("Upload Completed");
                    }
                  }}
                  onUploadError={(error) => {
                    toast.error(`ERROR! ${error.message}`);
                  }}
                />
                {form.image && (
                  <div className="mt-2 relative w-full h-32">
                    <Image
                      src={form.image}
                      alt="Preview"
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                )}
              </div>

              <Input
                placeholder="CTA"
                value={form.cta}
                onChange={(e) => setForm({ ...form, cta: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium mb-1">Link to Product</label>
                <select
                  className="border rounded px-2 py-1 w-full"
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
              <Button onClick={saveBanner} className="bg-blue-500 hover:bg-blue-600 text-white w-full">
                {editingId ? "Update Banner" : "Add Banner"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Banner List */}
      <div className="grid md:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <Card
            key={banner.id}
            className="bg-white shadow-md rounded-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
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
                <Button className="bg-blue-500 hover:bg-blue-600 rounded-xl text-white" onClick={() => editBanner(banner)}>
                  Edit
                </Button>
                <Button className="bg-red-500 hover:bg-red-600 rounded-xl text-white" onClick={() => deleteBanner(banner.id)}>
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
