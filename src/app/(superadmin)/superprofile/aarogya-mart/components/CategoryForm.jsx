"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadButton } from "@uploadthing/react"; // adjust path to where your UploadButton is exported
import { toast } from "react-hot-toast"; // if you’re using react-hot-toast

export default function CategoryForm({ id, onSuccess, onCancel }) {
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
    const url = id
      ? `/api/aarogyamart/categories/${id}`
      : "/api/aarogyamart/categories";
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await res.json();
    setLoading(false);

    if (j.success) {
      toast.success(`Category ${id ? "updated" : "created"} successfully`);
      onSuccess?.();
    } else {
      toast.error(j.error || "Error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 animate-fadeIn"
    >
      {/* Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border-blue-500 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          className="w-full bg-transparent border border-blue-500 rounded-xl p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Category Image
        </label>
        <div className="flex items-center gap-4">
          {image && (
            <img
              src={image}
              alt="preview"
              className="w-16 h-16 rounded-md object-cover border"
            />
          )}
          <UploadButton
            endpoint="fileUploader"
            content={{
              button({ ready }) {
                return <div>{ready && <div>Upload</div>}</div>;
              },
              allowedContent: () => "",
            }}
            appearance={{
              button:
                "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
              container:
                "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
              allowedContent: "hidden",
            }}
            onClientUploadComplete={(res) => {
              if (res.length > 0) {
                setImage(res[0].url); // ✅ set image state
                toast.success("Upload Completed");
              }
            }}
            onUploadError={(error) => {
              toast.error(`ERROR! ${error.message}`);
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white transition-all rounded-xl"
        >
          {id ? "Update Category" : "Create Category"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="text-blue-500 hover:text-blue-600 transition-all"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
