"use client";

import { useState, useEffect } from "react";
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

export default function HospitalSpecialityForm({ hospitalId, availableSpecialties }) {
  const [loading, setLoading] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]); // Selected specialty IDs
  const [errors, setErrors] = useState({});

  const handleCheckboxChange = (id) => {
    setSelectedSpecialties((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (selectedSpecialties.length === 0) {
      setErrors({ specialties: "Please select at least one specialty." });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/hospital/${hospitalId}/doctor-specialities`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hospitalId,
            specialties: selectedSpecialties,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to add specialties");
      toast.success("Specialties added successfully!");
      setSelectedSpecialties([]); // Reset selection
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
            Add Specialties
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="xs:max-w-[90%] md:max-w-lg max-h-[75vh] bg-gradient-to-br from-white to-blue-50 overflow-y-auto">
        <DialogHeader>
          <DialogDescription>
            <div className=" flex flex-col text-center items-center justify-center">
              <DialogTitle className="text-center text-xl font-bold text-[#243460]">Hospital Specialties</DialogTitle>
              <DialogTitle className="text-center text-lg font-bold text-[#243460]">Select Specialties</DialogTitle>
            </div>
          </DialogDescription>
        </DialogHeader>
              <form
                onSubmit={onSubmit}
              >
                <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
                  <div className="grid grid-cols-1  gap-3">
                    <div className=" rounded p-2 max-h-60 overflow-y-auto">
                      {availableSpecialties.map((specialty) => (
                        <div
                          key={specialty.id}
                          className="flex items-center gap-2 p-2"
                        >
                          <Checkbox
                            id={specialty.id}
                            checked={selectedSpecialties.includes(specialty.id)}
                            onCheckedChange={() =>
                              handleCheckboxChange(specialty.id)
                            }
                          />
                          <label htmlFor={specialty.id} className="text-sm">
                            {specialty.title}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.specialties && (
                      <p className="text-red-500 text-sm">{errors.specialties}</p>
                    )}
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
