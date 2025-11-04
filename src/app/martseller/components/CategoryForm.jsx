"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CategoryForm({ id }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await fetch(`/api/aarogyamart/categories/${id}`);
      const j = await res.json();
      if (j.success) {
        setName(j.data.name || "");
        setDescription(j.data.description || "");
        setImage(j.data.image || "");
      }
    })();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const payload = { name, description, image };
    const url = id ? `/api/aarogyamart/categories/${id}` : "/api/aarogyamart/categories";
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await res.json();
    setLoading(false);
    if (j.success) {
      router.push("/martseller/dashboard");
    } else {
      alert(j.error || "Error");
    }
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="max-w-xl bg-white p-8 rounded-2xl shadow-lg space-y-6 animate-fadeIn"
    >
      <h3 className="text-2xl font-bold text-blue-500">
        {id ? "Edit Category" : "Create Category"}
      </h3>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <Input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          className="border-blue-500 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="w-full border border-blue-500 rounded-xl p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <Input 
          value={image} 
          onChange={(e) => setImage(e.target.value)} 
          className="border-blue-500 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      <div className="flex gap-2 mt-4">
        <Button 
          type="submit" 
          disabled={loading} 
          className="bg-blue-500 hover:bg-blue-600 text-white transition-all rounded-xl"
        >
          {id ? "Update Category" : "Create Category"}
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="text-blue-500 hover:text-blue-600 transition-all"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
