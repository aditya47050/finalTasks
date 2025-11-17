"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function HomeHealthcareForm({
  hospitalId,
  initialData,
  open,
  onClose,
  onSaved,
}) {

  const [form, setForm] = useState({
    serviceName: "",
    startingPrice: "",
    minPrice: "",
    maxPrice: "",
    finalprice: "",
    discount: "",
    isAvailable: true,
  });

  const isAvailable = form.isAvailable;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData && open) {
      setForm({
        serviceName: initialData.serviceName || "",
        startingPrice: initialData.startingPrice || "",
        minPrice: initialData.minPrice || "",
        maxPrice: initialData.maxPrice || "",
        finalprice: initialData.finalprice || "",
        discount: initialData.discount || "",
        isAvailable: initialData.isAvailable ?? true,
      });
    }
  }, [initialData, open]);

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const save = async () => {
    try {
      setLoading(true);

      const payload = { ...form, hospitalId };
      let res;

      if (initialData) {
        res = await axios.put(
          `/api/hospital/${hospitalId}/home-healthcare/${initialData.id}`,
          payload
        );
      } else {
        res = await axios.post(
          `/api/hospital/${hospitalId}/home-healthcare`,
          payload
        );
      }

      if (res.data.success) {
        toast.success(initialData ? "Service updated!" : "Service added!");
        onSaved?.();
        onClose();
      } else {
        toast.error("Something went wrong.");
      }
    } catch (err) {
      console.error("SAVE ERROR:", err);
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-4 max-h-[80vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">
            {initialData ? "Edit Home Healthcare Service" : "Add Home Healthcare Service"}
          </DialogTitle>
        </DialogHeader>

        {/* --- TOGGLE --- */}
        <div className="flex items-center justify-between py-2">
          <Label className="text-xs font-medium text-gray-700">Available</Label>

          <div
            onClick={() => update("isAvailable", !isAvailable)}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer
              transition-all duration-300 select-none
              ${isAvailable ? "bg-[#2563EB]" : "bg-gray-300"}
            `}
          >
            <span
              className={`
                inline-block h-5 w-5 transform rounded-full bg-white shadow-md
                transition-all duration-300
                ${isAvailable ? "translate-x-5" : "translate-x-1"}
              `}
            />
          </div>
        </div>

        {!isAvailable && (
          <p className="text-xs text-amber-600 italic">
            Enable “Available” to fill home healthcare details.
          </p>
        )}

        {/* FORM FIELDS */}
        <div className={`${isAvailable ? "" : "opacity-50 pointer-events-none"}`}>
          {/* Service Name */}
          <div className="py-1">
            <Label className="text-xs">Service Name</Label>
            <Input
              className="h-8 text-xs"
              value={form.serviceName}
              onChange={(e) => update("serviceName", e.target.value)}
            />
          </div>

          {/* Starting Price */}
          <div className="py-1">
            <Label className="text-xs">Starting Price</Label>
            <Input
              className="h-8 text-xs"
              value={form.startingPrice}
              onChange={(e) => update("startingPrice", e.target.value)}
              placeholder="Eg: 300"
            />
          </div>

          {/* Min Price */}
          <div className="py-1">
            <Label className="text-xs">Minimum Price</Label>
            <Input
              className="h-8 text-xs"
              value={form.minPrice}
              onChange={(e) => update("minPrice", e.target.value)}
              placeholder="Eg: 200"
            />
          </div>

          {/* Max Price */}
          <div className="py-1">
            <Label className="text-xs">Maximum Price</Label>
            <Input
              className="h-8 text-xs"
              value={form.maxPrice}
              onChange={(e) => update("maxPrice", e.target.value)}
              placeholder="Eg: 500"
            />
          </div>

          {/* Final Price */}
          <div className="py-1">
            <Label className="text-xs">Final Price</Label>
            <Input
              className="h-8 text-xs"
              value={form.finalprice}
              onChange={(e) => update("finalprice", e.target.value)}
              placeholder="Eg: 400"
            />
          </div>

          {/* Discount */}
          <div className="py-1">
            <Label className="text-xs">Discount</Label>
            <Input
              className="h-8 text-xs"
              value={form.discount}
              onChange={(e) => update("discount", e.target.value)}
              placeholder="Eg: 10%"
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <Button
          className={`
            w-full mt-4 h-10 text-sm font-medium
            bg-gradient-to-r from-[#1E3B90] to-[#3D85EF]
            hover:from-[#1a337c] hover:to-[#3475d5]
            text-white rounded-lg shadow-md transition-all
            ${!isAvailable ? "opacity-60 cursor-not-allowed" : ""}
          `}
          onClick={save}
          disabled={!isAvailable || loading}
        >
          {loading ? "Saving..." : initialData ? "Update" : "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
