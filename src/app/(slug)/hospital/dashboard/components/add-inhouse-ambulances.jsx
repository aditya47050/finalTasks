"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import HeadingClientMain from "@/app/components/heading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Label } from '@/components/ui/label';

export default function HospitalAmbulanceForm({
  hospitalId,
  ambulances =[]
}) {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected ambulance category
  const [selectedAmbulances, setSelectedAmbulances] = useState([]); // Selected ambulance IDs
  const [search, setSearch] = useState(""); // Search input
  const [errors, setErrors] = useState({});

  // 🔹 Filter ambulances based on category & search term
  const filteredAmbulances = ambulances.filter(
    (ambulance) =>
      (!selectedCategory || ambulance.category === selectedCategory) &&
      (!search ||
        ambulance.email?.toLowerCase().includes(search.toLowerCase()) ||
        ambulance.mobile?.includes(search))
  );

  // 🔹 Handle checkbox selection
  const handleCheckboxChange = (checked, id) => {
    setSelectedAmbulances((prev) =>
      checked ? [...prev, id] : prev.filter((a) => a !== id)
    );
  };

  // 🔹 Form submission
  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (selectedAmbulances.length === 0) {
      setErrors({ ambulances: "Please select at least one ambulance." });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/hospital/${hospitalId}/ambulances`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hospitalId, ambulances: selectedAmbulances }),
      });

      if (!res.ok) throw new Error("Failed to add ambulances");
      toast.success("Ambulances added successfully!");
      setSelectedAmbulances([]); // Reset selection
      setErrors({});
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <div className="flex justify-end">
        <DialogTrigger>
          <Button className="bg-blue-500 text-white rounded-[10px] hover:bg-blue-500 hover:opacity-100 transition-none">
            Add Ambulances
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="xs:max-w-[90%] md:max-w-lg max-h-[75vh] bg-gradient-to-br from-white to-blue-50 overflow-hidden">
        <DialogHeader>
          <DialogDescription>
            <div className=" flex flex-col text-center items-center justify-center">
              <DialogTitle className="text-center text-xl font-bold text-[#243460]">Hospital Ambulances</DialogTitle>
              <DialogTitle className="text-center text-lg font-bold text-[#243460]">Select Ambulances</DialogTitle>
            </div>
          </DialogDescription>
        </DialogHeader>
              <form onSubmit={onSubmit}> 
                <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
                  <div className="grid grid-cols-1  gap-3">
                    <div>
                      {/* Category Selection */}
                      <Label className="text-[#243460] font-semibold ml-0">Select Category</Label>
                      <Select
                        onValueChange={setSelectedCategory}
                        value={selectedCategory}
                      >
                        <SelectTrigger className="w-full border">
                          <SelectValue placeholder="Select Ambulance Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Array.from(new Set(ambulances.map((a) => a.category))).map(
                              (category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              )
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      {/* Search Box */}
                      <Label className="text-[#243460] font-semibold ml-0">Enter Email ID or Mobile Number</Label>
                      <Input
                        type="text"
                        placeholder="Search Ambulance (Email or Mobile)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <div>
                      {/* Ambulance List */}
                      <div className="rounded p-2 max-h-36 overflow-y-auto border">
                        {filteredAmbulances.length > 0 ? (
                          filteredAmbulances.map((ambulance) => (
                            <div
                              key={ambulance.id}
                              className="flex items-center gap-4 p-2 border-b last:border-none"
                            >
                              {/* Ambulance Image */}
                              <Image
                                src="/ambulance-icon.png"
                                width={400}
                                height={400}
                                alt="Ambulance"
                                className="w-10 h-10 rounded-full object-cover border"
                              />

                              {/* Ambulance Details */}
                              <div className="flex flex-col flex-1">
                                <span className="text-xs font-medium truncate">
                                  {ambulance.email}
                                </span>
                                <span className="text-[10px] text-gray-500">
                                  {ambulance.mobile}
                                </span>
                              </div>

                              {/* Checkbox */}
                              <Checkbox
                                id={ambulance.id}
                                checked={selectedAmbulances.includes(ambulance.id)}
                                onCheckedChange={(checked) =>
                                  handleCheckboxChange(checked, ambulance.id)
                                }
                              />
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm text-center p-4">
                            No ambulances found
                          </p>
                        )}
                      </div>
                      {errors.ambulances && (
                        <p className="text-red-500 text-sm">{errors.ambulances}</p>
                      )}
                    </div>
                    <div className="!mt-6 text-center">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full lg:w-full bg-[#5271FF] hover:bg-[#5271FF] px-5 py-1 text-white  rounded-xl font-bold shadow-lg hover:shadow-xl transition"
                      >
                        {loading ? "Saving..." : "Submit"}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
      </DialogContent>
    </Dialog>
  );
}
