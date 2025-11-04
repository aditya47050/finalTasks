"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BrandForm({ id }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await fetch(`/api/aarogyamart/brands/${id}`);
      const j = await res.json();
      if (j.success) {
        setName(j.data.name || "");
        setImage(j.data.image || "");
      }
    })();
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    const payload = { name, image };
    const url = id ? `/api/aarogyamart/brands/${id}` : "/api/aarogyamart/brands";
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
      onSubmit={submit} 
      className="max-w-xl bg-white p-8 rounded-2xl shadow-lg space-y-6 animate-fadeIn"
    >
      <h3 className="text-2xl font-bold text-blue-500">
        {id ? "Edit Brand" : "Create Brand"}
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
          className="bg-blue-500 hover:bg-blue-600 text-white transition-all rounded-xl"
        >
          {id ? "Update Brand" : "Create Brand"}
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
