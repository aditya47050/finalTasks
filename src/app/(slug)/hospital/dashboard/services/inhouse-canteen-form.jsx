"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

export default function InhouseCanteenForm({
  hospitalId,
  initialData,
  open,
  onClose,
  onSaved,
}) {
  // Sync form state with initialData when dialog opens
  const [form, setForm] = useState({
    available: false,
    capacity: "",
    openHours: "",
    menuHighlights: [""],
    hygieneCertified: false,
    managedBy: "",
    contact: { managerName: "", phone: "" },
  });

  const isAvailable = form.available;

  // Re-sync when initialData or open changes
  useEffect(() => {
    if (initialData && open) {
      setForm({
        ...initialData,
        // Ensure menuHighlights is always array
        menuHighlights: Array.isArray(initialData.menuHighlights)
          ? initialData.menuHighlights
          : [""],
      });
    } else if (!initialData && open) {
      setForm({
        available: false,
        capacity: "",
        openHours: "",
        menuHighlights: [""],
        hygieneCertified: false,
        managedBy: "",
        contact: { managerName: "", phone: "" },
      });
    }
  }, [initialData, open]);

  // ---------- Time parsing ----------
  const initialOpening = form.openHours?.split(" - ")[0] || "07:00 AM";
  const initialClosing = form.openHours?.split(" - ")[1] || "10:00 PM";

  const [openingHour, setOpeningHour] = useState(initialOpening.split(":")[0] || "07");
  const [openingMinute, setOpeningMinute] = useState(
    initialOpening.split(":")[1]?.split(" ")[0] || "00"
  );
  const [openingPeriod, setOpeningPeriod] = useState(initialOpening.split(" ")[1] || "AM");

  const [closingHour, setClosingHour] = useState(initialClosing.split(":")[0] || "10");
  const [closingMinute, setClosingMinute] = useState(
    initialClosing.split(":")[1]?.split(" ")[0] || "00"
  );
  const [closingPeriod, setClosingPeriod] = useState(initialClosing.split(" ")[1] || "PM");

  // Update time fields when openHours changes
  useEffect(() => {
    if (form.openHours) {
      const [open, close] = form.openHours.split(" - ");
      if (open) {
        const [h, mP] = open.split(":");
        const [m, p] = mP.split(" ");
        setOpeningHour(h);
        setOpeningMinute(m);
        setOpeningPeriod(p);
      }
      if (close) {
        const [h, mP] = close.split(":");
        const [m, p] = mP.split(" ");
        setClosingHour(h);
        setClosingMinute(m);
        setClosingPeriod(p);
      }
    }
  }, [form.openHours]);

  // ---------- Helpers ----------
  const update = (field, value) => setForm((s) => ({ ...s, [field]: value }));
  const updateContact = (field, value) =>
    setForm((s) => ({
      ...s,
      contact: { ...s.contact, [field]: value },
    }));

  const updateMenu = (idx, value) => {
    const arr = [...form.menuHighlights];
    arr[idx] = value;
    update("menuHighlights", arr);
  };
  const addMenuItem = () => update("menuHighlights", [...form.menuHighlights, ""]);

  // ---------- Save ----------
  const save = async () => {
    const formattedHours = `${openingHour}:${openingMinute} ${openingPeriod} - ${closingHour}:${closingMinute} ${closingPeriod}`;

    await axios.put(`/api/hospital/${hospitalId}/inhouse-canteen`, {
      ...form,
      openHours: formattedHours,
    });

    onSaved();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-4 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">
            Inhouse Canteen Details
          </DialogTitle>
        </DialogHeader>

        {/* TOGGLE: Shows correct state from API */}
        <div className="flex items-center justify-between py-2">
          <Label className="text-xs font-medium text-gray-700">Available</Label>

          {/* Custom Blue Toggle - Synced with form.available */}
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

        {/* Help text */}
        {!isAvailable && (
          <p className="text-xs text-amber-600 mt-1 italic">
            Enable “Available” to fill canteen details.
          </p>
        )}

        {/* Form Fields */}
        <div className={isAvailable ? "" : "opacity-50 pointer-events-none"}>
          {/* Capacity */}
          <div className="py-1">
            <Label className="text-xs">Capacity</Label>
            <Input
              disabled={!isAvailable}
              className="h-8 text-xs"
              placeholder="150 people"
              value={form.capacity}
              onChange={(e) => update("capacity", e.target.value)}
            />
          </div>

          {/* Operating Hours */}
          <div className="py-1">
            <Label className="text-xs font-medium">Operating Hours</Label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <div>
                <Label className="text-[10px] text-gray-600">Opening</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    disabled={!isAvailable}
                    className="h-8 w-12 text-xs"
                    placeholder="HH"
                    maxLength={2}
                    value={openingHour}
                    onChange={(e) => setOpeningHour(e.target.value)}
                  />
                  <Input
                    disabled={!isAvailable}
                    className="h-8 w-12 text-xs"
                    placeholder="MM"
                    maxLength={2}
                    value={openingMinute}
                    onChange={(e) => setOpeningMinute(e.target.value)}
                  />
                  <select
                    disabled={!isAvailable}
                    value={openingPeriod}
                    onChange={(e) => setOpeningPeriod(e.target.value)}
                    className="h-8 text-xs border rounded-md px-2 bg-transparent disabled:bg-gray-100"
                  >
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-[10px] text-gray-600">Closing</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    disabled={!isAvailable}
                    className="h-8 w-12 text-xs"
                    placeholder="HH"
                    maxLength={2}
                    value={closingHour}
                    onChange={(e) => setClosingHour(e.target.value)}
                  />
                  <Input
                    disabled={!isAvailable}
                    className="h-8 w-12 text-xs"
                    placeholder="MM"
                    maxLength={2}
                    value={closingMinute}
                    onChange={(e) => setClosingMinute(e.target.value)}
                  />
                  <select
                    disabled={!isAvailable}
                    value={closingPeriod}
                    onChange={(e) => setClosingPeriod(e.target.value)}
                    className="h-8 text-xs border rounded-md px-2 bg-transparent disabled:bg-gray-100"
                  >
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="py-1">
            <Label className="text-xs">Menu Highlights</Label>
            {form.menuHighlights.map((item, idx) => (
              <Input
                key={idx}
                disabled={!isAvailable}
                className="h-8 text-xs mt-2"
                placeholder="Eg: Fresh Juices"
                value={item}
                onChange={(e) => updateMenu(idx, e.target.value)}
              />
            ))}
            <Button
              disabled={!isAvailable}
              className="mt-2 h-8 text-xs"
              variant="outline"
              onClick={addMenuItem}
            >
              + Add Item
            </Button>
          </div>

          {/* Hygiene */}
          <div className="flex items-center justify-between py-1">
            <Label className="text-xs">Hygiene Certified</Label>
            <div
              onClick={() => !isAvailable || update("hygieneCertified", !form.hygieneCertified)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full cursor-pointer transition-all ${
                form.hygieneCertified && isAvailable ? "bg-[#2563EB]" : "bg-gray-300"
              } ${!isAvailable ? "cursor-not-allowed" : ""}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-all ${
                  form.hygieneCertified ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </div>
          </div>

          {/* Managed By */}
          <div className="py-1">
            <Label className="text-xs">Managed By</Label>
            <Input
              disabled={!isAvailable}
              className="h-8 text-xs"
              placeholder="HealthyBite Pvt Ltd"
              value={form.managedBy}
              onChange={(e) => update("managedBy", e.target.value)}
            />
          </div>

          {/* Contact */}
          <div className="py-1">
            <Label className="text-xs">Manager Name</Label>
            <Input
              disabled={!isAvailable}
              className="h-8 text-xs"
              placeholder="Ramesh Patil"
              value={form.contact.managerName}
              onChange={(e) => updateContact("managerName", e.target.value)}
            />
          </div>

          <div className="py-1">
            <Label className="text-xs">Phone</Label>
            <Input
              disabled={!isAvailable}
              className="h-8 text-xs"
              placeholder="9876543210"
              value={form.contact.phone}
              onChange={(e) => updateContact("phone", e.target.value)}
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
          disabled={!isAvailable}
        >
          {isAvailable ? "Save Canteen Details" : "Enable to Save"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}