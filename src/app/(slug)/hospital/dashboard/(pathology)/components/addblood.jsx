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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "react-toastify";

const bloodTypes = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  // add more custom types if needed
];

const AddBlood = ({ hospitalId }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    bloodname: "",
    price: "",
    finalprice: "",
    discount: "",
    available: false,
  });
  const [loading, setLoading] = useState(false);

  // Calculate finalprice based on price and discount
  const calculateFinalPrice = (price, discount) => {
    const p = parseFloat(price);
    if (isNaN(p) || p <= 0) return "";
    if (!discount) return p;

    let discVal = 0;
    if (discount.trim().endsWith("%")) {
      discVal = parseFloat(discount.trim().slice(0, -1));
      if (isNaN(discVal)) return p;
      return Math.round(p - (p * discVal) / 100);
    } else {
      discVal = parseFloat(discount);
      if (isNaN(discVal)) return p;
      return Math.round(p - discVal);
    }
  };

  const handlePriceOrDiscountChange = (field, value) => {
    const newForm = { ...form, [field]: value };
    let finalPrice = calculateFinalPrice(newForm.price, newForm.discount);
    if (finalPrice === "") finalPrice = "";
    newForm.finalprice = finalPrice;
    setForm(newForm);
  };

  const handleSubmit = async () => {
    if (!form.bloodname) {
      toast.error("Please select blood name/type.");
      return;
    }
    if (!form.price) {
      toast.error("Please enter the price.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/hospital/${hospitalId}/bloodbank`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bloodname: form.bloodname,
          price: parseFloat(form.price) * 100,
          discount: form.discount.trim() || null,
          finalprice: typeof form.finalprice === "number" ? form.finalprice * 100 : parseFloat(form.price) * 100,
          available: form.available,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Blood bank entry added successfully!");
        setOpen(false);
        setForm({
          bloodname: "",
          price: "",
          discount: "",
          finalprice: "",
          available: false,
        });
      } else {
        toast.error(data.error || "Failed to add blood info.");
      }
    } catch (err) {
      toast.error("Server error during submission.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5271FF] hover:bg-[#4460e6] text-white font-bold rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
          Add Blood Info
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-2xl bg-gradient-to-br from-white to-blue-50">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-3xl font-extrabold text-[#5271FF] drop-shadow-sm">
            Add Blood Bank Entry
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 max-h-48 overflow-y-auto">
            <Label className="mb-2 block font-semibold text-gray-700">Select Blood Type *</Label>
            <RadioGroup
              value={form.bloodname}
              onValueChange={(value) => setForm({ ...form, bloodname: value })}
              className="grid grid-cols-4 gap-2"
            >
              {bloodTypes.map((type) => (
                <div
                  key={type}
                  className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                >
                  <RadioGroupItem value={type} id={`blood-${type.replace(/[^a-zA-Z0-9]/g, "-")}`} />
                  <Label
                    htmlFor={`blood-${type.replace(/[^a-zA-Z0-9]/g, "-")}`}
                    className="cursor-pointer text-sm font-medium text-gray-800"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <Label htmlFor="price" className="mb-2 block font-semibold text-gray-700">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => handlePriceOrDiscountChange("price", e.target.value)}
                placeholder="Enter price"
              />
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <Label htmlFor="discount" className="mb-2 block font-semibold text-gray-700">
                Discount (e.g. 10% or 100)
              </Label>
              <Input
                id="discount"
                type="text"
                value={form.discount}
                onChange={(e) => handlePriceOrDiscountChange("discount", e.target.value)}
                placeholder="Enter discount"
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <Label htmlFor="finalprice" className="mb-2 block font-semibold text-gray-700">
              Final Price
            </Label>
            <Input
              id="finalprice"
              type="number"
              min={0}
              value={form.finalprice}
              readOnly
            />
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-3 hover:border-[#5271FF] transition-all duration-200">
            <Checkbox
              id="available"
              checked={form.available}
              onCheckedChange={(checked) => setForm({ ...form, available: !!checked })}
              className="h-5 w-5"
            />
            <Label htmlFor="available" className="text-base font-semibold text-gray-700 cursor-pointer">
              Available
            </Label>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-green-600 to-green-700 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-green-800 hover:shadow-xl"
          >
            {loading ? "Submitting..." : "Submit Blood Info"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddBlood;