"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { Calendar } from "lucide-react";

// React Icons
import {
  FaHeartbeat,
  FaBrain,
  FaHospitalUser,
  FaProcedures,
  FaLungs,
  FaHeart,
  FaHandsHelping,
  FaBone,
  FaUserNurse,
  FaBed,
  FaWheelchair,
} from "react-icons/fa";

// Service list with icons and default prices
const HOME_HEALTHCARE_SERVICES = [
  { name: "ICU at Home", icon: FaHospitalUser, startingPrice: 5000 },
  { name: "Neurological Care & Rehabilitation", icon: FaBrain, startingPrice: 4500 },
  { name: "Cancer Care on Bed", icon: FaHeartbeat, startingPrice: 6000 },
  { name: "Transplant & Post-Op Care", icon: FaProcedures, startingPrice: 5500 },
  { name: "Pregnancy Care", icon: FaProcedures, startingPrice: 5500 },
  { name: "Mother & Child Care", icon: FaProcedures, startingPrice: 5500 },
  { name: "COPD Care", icon: FaLungs, startingPrice: 4000 },
  { name: "Cardiac Care", icon: FaHeart, startingPrice: 4800 },
  { name: "Palliative Care", icon: FaHandsHelping, startingPrice: 4700 },
  { name: "Orthopaedic Care", icon: FaBone, startingPrice: 4300 },
  { name: "General Nursing", icon: FaUserNurse, startingPrice: 3000 },
  { name: "Bed Sores Care", icon: FaBed, startingPrice: 3200 },
  { name: "Stroke Care", icon: FaWheelchair, startingPrice: 5200 },
  { name: "Dialysis Care", icon: FaProcedures, startingPrice: 5500 },
  { name: "Old Age Health Care", icon: FaProcedures, startingPrice: 5500 },
];

const HomeHealthcareDialog = ({ hospitalId }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
  serviceName: "",
  startingPrice: "",
  isAvailable: true,
  minPrice: "",
  maxPrice: "",
  finalprice: "",
  discount: "",
});

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "serviceName") {
      const selected = HOME_HEALTHCARE_SERVICES.find((s) => s.name === value);
      setForm((prev) => ({
        ...prev,
        serviceName: value,
        startingPrice: selected?.startingPrice || "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async () => {
  if (!form.serviceName) {
    toast.error("Please select a service");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch(`/api/hospital/${hospitalId}/home-healthcare`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hospitalId, ...form }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success("Home Healthcare service saved successfully!");
      setOpen(false);
      setForm({
        serviceName: "",
        startingPrice: "",
        isAvailable: true,
        minPrice: "",
        maxPrice: "",
        finalprice: "",
        discount: "",
      });
    } else {
      toast.error(data.message || "Save failed.");
    }
  } catch (err) {
    toast.error("Server error during save.");
    console.error("Save error:", err);
  }
  setLoading(false);
};


  return (
    <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button className="bg-[#5271FF] hover:bg-[#4460e6] text-white font-bold rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
      <Calendar className="w-4 h-4 mr-1" />
      Add Home Healthcare Service
    </Button>
  </DialogTrigger>
  <DialogContent className="max-w-md max-h-[70vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50">
    <DialogHeader className="text-center pb-4">
      <DialogTitle className="text-2xl font-bold text-[#5271FF] flex items-center justify-center">
        <Calendar className="w-6 h-6 mr-2 text-blue-500" />
        Add Home Healthcare Service
      </DialogTitle>
      <p className="text-gray-600 mt-2">
        Fill in the details to add a home healthcare service for this hospital
      </p>
    </DialogHeader>

    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
        {/* Service Name */}
        <div>
          <Label htmlFor="serviceName">Home Healthcare Service *</Label>
          <select
            id="serviceName"
            name="serviceName"
            value={form.serviceName}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded"
            required
          >
            <option value="">Select a service</option>
            {HOME_HEALTHCARE_SERVICES.map((service) => (
              <option key={service.name} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>

          {form.serviceName && (
            <div className="flex items-center mt-3">
              {(() => {
                const selected = HOME_HEALTHCARE_SERVICES.find(
                  (s) => s.name === form.serviceName
                );
                const Icon = selected?.icon;
                return Icon ? (
                  <Icon className="w-6 h-6 text-blue-500 mr-2" />
                ) : null;
              })()}
              <span className="font-semibold">{form.serviceName}</span>
            </div>
          )}
        </div>

        {/* Starting Price */}
        <div>
          <Label htmlFor="startingPrice">Starting Price</Label>
          <Input
            id="startingPrice"
            name="startingPrice"
            type="number"
            value={form.startingPrice}
            onChange={handleChange}
            disabled
            className="bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Min Price */}
        <div>
          <Label htmlFor="minPrice">Min Price</Label>
          <Input
            id="minPrice"
            name="minPrice"
            type="number"
            value={form.minPrice}
            onChange={handleChange}
            placeholder="Enter minimum price"
          />
        </div>

        {/* Max Price */}
        <div>
          <Label htmlFor="maxPrice">Max Price</Label>
          <Input
            id="maxPrice"
            name="maxPrice"
            type="number"
            value={form.maxPrice}
            onChange={handleChange}
            placeholder="Enter maximum price"
          />
        </div>

        {/* Final Price */}
        <div>
          <Label htmlFor="finalprice">Final Price</Label>
          <Input
            id="finalprice"
            name="finalprice"
            type="number"
            value={form.finalprice}
            onChange={handleChange}
            placeholder="Enter final price"
          />
        </div>

        {/* Discount */}
        <div>
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            name="discount"
            type="number"
            value={form.discount}
            onChange={handleChange}
            placeholder="Enter discount percentage"
          />
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2">
          <input
            id="isAvailable"
            name="isAvailable"
            type="checkbox"
            checked={form.isAvailable}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <Label htmlFor="isAvailable">Available</Label>
        </div>

        {/* Save Button */}
        <Button
          className="w-full bg-[#5271FF] hover:bg-[#4460e6] text-white font-bold mt-4"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Service"}
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>

  );
};

export default HomeHealthcareDialog;
