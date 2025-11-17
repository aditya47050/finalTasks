"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DiagnosticServiceForm({
  hospitalId,
  initialData,
  open,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState({
    facility: "",
    category: "",
    subCategory: "",
    machinemodel: "",
    minPrice: "",
    maxPrice: "",
    finalPrice: "",
    discount: "",
    available: true,
  });

  const isAvailable = form.available;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData && open) {
      setForm({
        facility: initialData.facility || "",
        category: initialData.category || "",
        subCategory: initialData.subCategory || "",
        machinemodel: initialData.machinemodel || "",
        minPrice: initialData.minPrice || "",
        maxPrice: initialData.maxPrice || "",
        finalPrice: initialData.finalPrice || "",
        discount: initialData.discount || "",
        available: initialData.available ?? true,
      });
    }
  }, [initialData, open]);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `/api/hospital/${hospitalId}/diagnostic-services`,
        form
      );

      if (res.data.success) {
        onSaved?.();
        onClose();
      }
    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-4 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">
            {initialData ? "Edit Diagnostic Service" : "Add Diagnostic Service"}
          </DialogTitle>
        </DialogHeader>

        {/* --- TOGGLE --- */}
        <div className="flex items-center justify-between py-2">
          <Label className="text-xs font-medium text-gray-700">Available</Label>

          <div
            onClick={() => update("available", !isAvailable)}
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
            Enable “Available” to edit diagnostic service.
          </p>
        )}

        {/* --- FORM FIELDS --- */}
        <div className={`${isAvailable ? "" : "opacity-50 pointer-events-none"}`}>
          {/* Facility */}
          <div className="py-1">
            <Label className="text-xs">Facility</Label>
            <Input
              className="h-8 text-xs"
              value={form.facility}
              onChange={(e) => update("facility", e.target.value)}
              placeholder="CT Scan"
            />
          </div>

          {/* Category */}
          <div className="py-1">
            <Label className="text-xs">Category</Label>
            <Input
              className="h-8 text-xs"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              placeholder="Radiology"
            />
          </div>

          {/* Sub Category */}
          <div className="py-1">
            <Label className="text-xs">Sub Category</Label>
            <Input
              className="h-8 text-xs"
              value={form.subCategory}
              onChange={(e) => update("subCategory", e.target.value)}
              placeholder="Head Scan"
            />
          </div>

          {/* Machine Model */}
          <div className="py-1">
            <Label className="text-xs">Machine Model</Label>
            <Input
              className="h-8 text-xs"
              value={form.machinemodel}
              onChange={(e) => update("machinemodel", e.target.value)}
              placeholder="Siemens Somatom"
            />
          </div>

          {/* Price fields */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">Min Price</Label>
              <Input
                type="number"
                className="h-8 text-xs"
                value={form.minPrice}
                onChange={(e) => update("minPrice", e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs">Max Price</Label>
              <Input
                type="number"
                className="h-8 text-xs"
                value={form.maxPrice}
                onChange={(e) => update("maxPrice", e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs">Final Price</Label>
              <Input
                type="number"
                className="h-8 text-xs"
                value={form.finalPrice}
                onChange={(e) => update("finalPrice", e.target.value)}
              />
            </div>
          </div>

          {/* Discount */}
          <div className="py-1">
            <Label className="text-xs">Discount</Label>
            <Input
              className="h-8 text-xs"
              value={form.discount}
              onChange={(e) => update("discount", e.target.value)}
              placeholder="10%"
            />
          </div>
        </div>

        {/* --- SAVE BUTTON --- */}
        <Button
          className={`
            w-full mt-4 h-10 text-sm font-medium
            bg-gradient-to-r from-[#1E3B90] to-[#3D85EF]
            hover:from-[#1a337c] hover:to-[#3475d5]
            text-white rounded-lg shadow-md transition-all
            ${!isAvailable ? "opacity-60 cursor-not-allowed" : ""}
          `}
          disabled={!isAvailable || loading}
          onClick={save}
        >
          {loading ? "Saving..." : "Save Diagnostic Service"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
