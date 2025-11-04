"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UploadButton } from "@uploadthing/react";

export default function ProductsPage({sellerId}) {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    discount: "",
    categoryId: "",
    brandId: "",
    images: [],
    keywords: [""],
    features: [""],
    description: "",
    inStock: true,
    stockCount: "",
    specifications: [{ key: "", value: "" }], // ✅ added
  });
  const [categories, setCategories] = useState([]);
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrand();
  }, []);
  function updateSpecification(idx, field, value) {
  setForm(prev => {
    const copy = [...prev.specifications];
    copy[idx][field] = value;
    return { ...prev, specifications: copy };
  });
}

function addSpecification() {
  setForm(prev => ({
    ...prev,
    specifications: [...prev.specifications, { key: "", value: "" }]
  }));
}

function removeSpecification(idx) {
  setForm(prev => ({
    ...prev,
    specifications: prev.specifications.filter((_, i) => i !== idx)
  }));
}


  async function fetchProducts() {
    const res = await fetch(`/api/aarogyamart/martseller/products?sellerId=${sellerId}`);
    const j = await res.json();
    if (j.success) setProducts(j.data);
  }

  async function fetchCategories() {
    const res = await fetch("/api/aarogyamart/categories");
    const j = await res.json();
    setCategories(j);
  }
   async function fetchBrand() {
    const res = await fetch(`/api/aarogyamart/martseller/brand?sellerId=${sellerId}`);
    const j = await res.json();
    if (j.success && j.data) {
      setBrand(j.data);
      setForm((prev) => ({ ...prev, brandId: j.data.id })); // auto-set brandId
    }
  }

  function openEdit(product) {
  setEditingProduct(product);
  const specArray = product.specifications
    ? Object.entries(product.specifications).map(([key, value]) => ({ key, value }))
    : [{ key: "", value: "" }];
  setForm({
    name: product.name || "",
    price: product.price || "",
    originalPrice: product.originalPrice || "",
    discount: product.discount ?? "",
    categoryId: product.categoryId || "",
    brandId: product.brandId || brand?.id || "",
    images: product.images || [],
    keywords: Array.isArray(product.keywords) ? product.keywords : [],
    features: Array.isArray(product.features) ? product.features : [],
    description: product.description || "",
    inStock: !!product.inStock,
    stockCount: product.stockCount ?? "",
    specifications: specArray, // ✅ fixed
  });
  setOpen(true);
}

function resetForm() {
  setEditingProduct(null);
  setForm({
    name: "",
    price: "",
    originalPrice: "",
    discount: "",
    categoryId: "",
    brandId: brand?.id || "",
    images: [],
    keywords: [""],
    features: [""],
    description: "",
    inStock: true,
    stockCount: "",
  });
}


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

  async function saveProduct() {
    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      discount: form.discount ? Number(form.discount) : null,
      stockCount: form.stockCount ? Number(form.stockCount) : null,
      sellerId : sellerId ,
      brandId: brand?.id,
      specifications: form.specifications.reduce((acc, spec) => {
      if (spec.key && spec.value) acc[spec.key] = spec.value;
      return acc;
    }, {}),
    };

    const url = editingProduct ? `/api/aarogyamart/products/${editingProduct.id}` : "/api/aarogyamart/products";
    const method = editingProduct ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await res.json();
    if (j.success) {
      fetchProducts();
      setOpen(false);
      resetForm();
    } else {
      console.error(j.error || "Error");
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6 container animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-500">Products</h2>
        <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all">Add Product</Button>
          </DialogTrigger>

          <DialogContent className="max-w-xl h-[80vh] bg-white">
            <DialogHeader>
              <DialogTitle className="text-blue-500 text-center">{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                <Input placeholder="Original Price" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                <Input placeholder="Discount Price" type="number" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} />
                <Input placeholder="Discount (%)" type="number" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} />
                 <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="flex h-10 w-full rounded-xl border border-gray-500 px-3 py-2 text-sm"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {/* ✅ Brand Auto Display */}
                {brand && (
                  <div className="text-sm text-gray-700">
                    <p><strong>Brand:</strong> {brand.name}</p>
                    {brand.image && <img src={brand.image} alt={brand.name} className="h-12 mt-1 rounded-md border" />}
                  </div>
                )}
              </div>

              {/* Images Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">Images</label>
                <UploadButton
                  endpoint="fileUploader"
                  onClientUploadComplete={(res) => {
                    if (res.length > 0) setForm({...form, images: [...form.images, res[0].url]});
                  }}
                  className="bg-blue-500 rounded-xl text-white"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 border rounded overflow-hidden">
                      <img src={img} alt="" className="object-cover w-full h-full" />
                      <Button type="button" size="sm" className="absolute top-0 right-0 text-red-500" onClick={() => setForm({...form, images: form.images.filter((_, idx) => idx !== i)})}>×</Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <label className="block text-sm font-medium mb-1">Keywords</label>
              {form.keywords.map((k, i) => (
                <div key={i} className="flex gap-2 mb-1">
                  <Input
                    value={k}
                    onChange={e => {
                      const newKeywords = [...form.keywords];
                      newKeywords[i] = e.target.value;
                      setForm({...form, keywords: newKeywords});
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      const newKeywords = form.keywords.filter((_, idx) => idx !== i);
                      setForm({...form, keywords: newKeywords});
                    }}
                    className="text-red-500"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => setForm({...form, keywords: [...form.keywords, ""]})}
              >
                Add Keyword
              </Button>
              <div>
                <label className="block text-sm font-medium mb-1">Specifications</label>
                {form?.specifications?.map((spec, i) => (
                  <div key={i} className="flex gap-2 mb-1">
                    <Input
                      placeholder="Key"
                      value={spec.key}
                      onChange={e => updateSpecification(i, "key", e.target.value)}
                    />
                    <Input
                      placeholder="Value"
                      value={spec.value}
                      onChange={e => updateSpecification(i, "value", e.target.value)}
                    />
                    <Button
                      type="button"
                      onClick={() => removeSpecification(i)}
                      className="text-red-500"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={addSpecification}>
                  Add Specification
                </Button>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium mb-1">Features</label>
                {form.features.map((f, i) => (
                  <div key={i} className="flex gap-2 mb-1">
                    <Input
                      value={f}
                      onChange={e => {
                        const newFeatures = [...form.features];
                        newFeatures[i] = e.target.value;
                        setForm({...form, features: newFeatures});
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const newFeatures = form.features.filter((_, idx) => idx !== i);
                        setForm({...form, features: newFeatures});
                      }}
                      className="text-red-500"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => setForm({...form, features: [...form.features, ""]})}
                >
                  Add Feature
                </Button>
              </div>

              {/* Description */}
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded p-2" />

              {/* Stock */}
              <div className="flex items-center gap-4">
                <label>
                  <input type="checkbox" checked={form.inStock} onChange={e => setForm({...form, inStock: e.target.checked})} /> In Stock
                </label>
                <Input placeholder="Stock Count" type="number" value={form.stockCount} onChange={e => setForm({...form, stockCount: e.target.value})} />
              </div>

              <Button onClick={saveProduct} className="bg-blue-500 text-white w-full">{editingProduct ? "Update Product" : "Add Product"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white animate-fadeIn">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 hover:bg-gray-100">
              <th className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Name</th>
              <th className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Price</th>
              <th className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Category</th>
              <th className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Brand</th>
              <th className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p,index) => (
              <tr key={p.id} className={`transition-colors duration-150 ease-in-out
                  hover:bg-gray-50/50 
                  ${index % 2 === 0 ? "bg-white" : "bg-gray-50/20"}
                  border-[1px] border-gray-100`}>
                <td className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap">{p.name}</td>
                <td className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap">₹{p.price.toLocaleString()}</td>
                <td className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap">{p.category?.name || "—"}</td>
                <td className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap">{p.brand?.name || "—"}</td>
                <td className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap">
                  <Button onClick={() => openEdit(p)} className="bg-blue-500 text-white rounded-xl">Edit</Button>
                </td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan={5} className="text-center p-4 text-gray-500">No products found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
