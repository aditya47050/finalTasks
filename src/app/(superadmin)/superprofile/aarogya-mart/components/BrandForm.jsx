"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadButton } from "@uploadthing/react";
import { toast } from "react-hot-toast";

export default function BrandForm({ id, onSuccess, onCancel }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    const payload = { name, image };
    const url = id ? `/api/aarogyamart/brands/${id}` : "/api/aarogyamart/brands";
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await res.json();

    setLoading(false);

    if (j.success) {
      toast.success(`Brand ${id ? "updated" : "created"} successfully`);
      onSuccess?.();
    } else {
      toast.error(j.error || "Error");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
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

      {/* Image */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Brand Image</label>
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
              button: "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
              container: "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
              allowedContent: "hidden",
            }}
            onClientUploadComplete={(res) => {
              if (res.length > 0) {
                setImage(res[0].url);
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
          {id ? "Update Brand" : "Create Brand"}
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
