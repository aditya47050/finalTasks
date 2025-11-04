"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProductForm({ id }) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [images, setImages] = useState([""]);
  const [keywords, setKeywords] = useState([""]);
  const [features, setFeatures] = useState([""]);
  const [description, setDescription] = useState("");
  const [badge, setBadge] = useState("");
  const [inStock, setInStock] = useState(true);
  const [stockCount, setStockCount] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    (async () => {
      const [cRes, bRes] = await Promise.all([
        fetch("/api/aarogyamart/categories"),
        fetch("/api/aarogyamart/brands"),
      ]);
      const [cJson, bJson] = await Promise.all([cRes.json(), bRes.json()]);
      if (cJson.success) setCategories(cJson.data);
      if (bJson.success) setBrands(bJson.data);
    })();
  }, []);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await fetch(`/api/aarogyamart/products/${id}`);
      const j = await res.json();
      if (j.success) {
        const p = j.data;
        setName(p.name || "");
        setPrice(p.price || "");
        setOriginalPrice(p.originalPrice || "");
        setDiscount(p.discount ?? "");
        setCategoryId(p.categoryId || "");
        setBrandId(p.brandId || "");
        setImages(p.images?.length ? p.images : [""]);
        setKeywords(p.keywords?.length ? p.keywords : [""]);
        setFeatures(p.features?.length ? p.features : [""]);
        setDescription(p.description || "");
        setBadge(p.badge || "");
        setInStock(!!p.inStock);
        setStockCount(p.stockCount ?? "");
      }
    })();
  }, [id]);

  function updateArray(setter, idx, value) {
    setter(prev => {
      const copy = [...prev];
      copy[idx] = value;
      return copy;
    });
  }

  function addArrayItem(setter) {
    setter(prev => [...prev, ""]);
  }

  function removeArrayItem(setter, idx) {
    setter(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      name,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      discount: discount ? Number(discount) : null,
      categoryId,
      brandId,
      images: images.filter(Boolean),
      keywords: keywords.filter(Boolean),
      features: features.filter(Boolean),
      description,
      badge,
      inStock,
      stockCount: stockCount ? Number(stockCount) : null,
    };

    const url = id ? `/api/aarogyamart/products/${id}` : "/api/aarogyamart/products";
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await res.json();
    if (j.success) router.push("/martseller/dashboard");
    else alert(j.error || "Error");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-4xl mx-auto animate-fadeIn"
    >
      <h2 className="text-3xl font-bold text-blue-500 mb-4">{id ? "Edit Product" : "Create Product"}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} required className="focus:ring-blue-500 border-gray-300" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Price</label>
          <Input value={price} onChange={e => setPrice(e.target.value)} required className="focus:ring-blue-500 border-gray-300" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Original Price</label>
          <Input value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} className="focus:ring-blue-500 border-gray-300" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Discount (%)</label>
          <Input value={discount} onChange={e => setDiscount(e.target.value)} className="focus:ring-blue-500 border-gray-300" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Select category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Brand</label>
          <select
            value={brandId}
            onChange={e => setBrandId(e.target.value)}
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Select brand</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Images (URLs)</label>
        {images.map((img, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input value={img} onChange={e => updateArray(setImages, i, e.target.value)} className="focus:ring-blue-500 border-gray-300" />
            <Button type="button" variant="ghost" onClick={() => removeArrayItem(setImages, i)} className="text-red-500 hover:text-red-600 transition">Remove</Button>
          </div>
        ))}
        <Button type="button" onClick={() => addArrayItem(setImages)} className="bg-blue-500 hover:bg-blue-600 text-white transition-all rounded-xl">
          Add Image
        </Button>
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Keywords (tags)</label>
        {keywords.map((k, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input value={k} onChange={e => updateArray(setKeywords, i, e.target.value)} className="focus:ring-blue-500 border-gray-300" />
            <Button type="button" variant="ghost" onClick={() => removeArrayItem(setKeywords, i)} className="text-red-500 hover:text-red-600 transition">Remove</Button>
          </div>
        ))}
        <Button type="button" onClick={() => addArrayItem(setKeywords)} className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all">
          Add Keyword
        </Button>
        <p className="text-xs text-gray-400 mt-1">Example: [`stethoscope`,`acoustic`,`medical`]</p>
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Features (one per line)</label>
        {features.map((f, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input value={f} onChange={e => updateArray(setFeatures, i, e.target.value)} className="focus:ring-blue-500 border-gray-300" />
            <Button type="button" variant="ghost" onClick={() => removeArrayItem(setFeatures, i)} className="text-red-500 hover:text-red-600 transition">Remove</Button>
          </div>
        ))}
        <Button type="button" onClick={() => addArrayItem(setFeatures)} className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all">
          Add Feature
        </Button>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Badge & Stock */}
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Badge</label>
          <Input value={badge} onChange={e => setBadge(e.target.value)} className="focus:ring-blue-500 border-gray-300" />
        </div>
        <label className="inline-flex items-center gap-2 mt-4">
          <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} className="accent-blue-500" />
          <span className="text-gray-700">In stock</span>
        </label>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Stock Count</label>
          <Input value={stockCount} onChange={e => setStockCount(e.target.value)} className="focus:ring-blue-500 border-gray-300" />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all">
          {id ? "Update Product" : "Create Product"}
        </Button>
        <Button variant="ghost" onClick={() => router.back()} className="border border-gray-300 hover:bg-gray-100 transition-all rounded-xl">
          Cancel
        </Button>
      </div>
    </form>
  );
}
