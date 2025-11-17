"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@uploadthing/react";
import { toast } from "react-toastify";

const UploadDialog = ({ campaignId }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    video1: null,
    video2: null,
    image1: null,
    image2: null,
    image3: null,
    frontimage: null,
  });
  const [videoFiles, setVideoFiles] = useState({ video1: null, video2: null });
  const [loading, setLoading] = useState(false);

  const handleFileUploadComplete = (field, res) => {
    if (res?.[0]?.url) {
      setForm((prev) => ({ ...prev, [field]: res[0].url }));
      toast.success(`${field} uploaded successfully`);
    }
  };

  const handleSubmit = async () => {
    if (!campaignId) return toast.error("Campaign ID missing");

    setLoading(true);
    try {
      const videoUpload = new FormData();
      if (videoFiles.video1) videoUpload.append("video1", videoFiles.video1);
      if (videoFiles.video2) videoUpload.append("video2", videoFiles.video2);

      const res = await fetch("/api/aarogyadhan/photographer/video-upload", {
        method: "POST",
        body: videoUpload,
      });

      const videoData = await res.json();
      if (!res.ok) throw new Error(videoData.message);

      // Merge video + image URLs
      const allData = {
        campaignId,
        ...form,
        video1: videoData.video1 || null,
        video2: videoData.video2 || null,
      };

      const updateRes = await fetch(
        "/api/aarogyadhan/photographer/video-upload/final-upload",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(allData),
        }
      );

      const updateData = await updateRes.json();
      if (!updateRes.ok) throw new Error(updateData.message);

      toast.success("Campaign updated successfully");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded">
          Upload Media
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-bold text-[#5271FF]">
            Upload Videos and Images
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Upload */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
              Upload Videos
            </Label>
            <Input
              type="file"
              accept="video/*"
              onChange={(e) =>
                setVideoFiles((prev) => ({
                  ...prev,
                  video1: e.target.files?.[0] || null,
                }))
              }
              className="mt-2"
            />
            <Input
              type="file"
              accept="video/*"
              onChange={(e) =>
                setVideoFiles((prev) => ({
                  ...prev,
                  video2: e.target.files?.[0] || null,
                }))
              }
              className="mt-2"
            />
          </div>

          {/* Image Upload */}
          <div className="bg-white p-4 rounded-xl shadow-sm border space-y-3">
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
              Upload Images
            </Label>
            {["frontimage", "image1", "image2", "image3"].map((field) => (
              <UploadButton
                key={field}
                endpoint="fileUploader"
                onClientUploadComplete={(res) =>
                  handleFileUploadComplete(field, res)
                }
                appearance={{
                  button:
                    "w-full bg-[#5271FF] hover:bg-[#4460e6] text-white py-2 px-4 rounded font-medium flex justify-center items-center",
                  allowedContent: "text-xs text-gray-500 mt-2",
                }}
              />
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            {loading ? "Uploading..." : "Submit Media"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
