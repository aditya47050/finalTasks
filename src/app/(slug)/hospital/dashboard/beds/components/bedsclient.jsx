"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/cutommaindailog";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  
const ChargeTypes = ["Hourly", "daily", "weekly", "monthly"];
const BedTypes = [
  "MALE_WARD",
  "FEMALE_WARD",
  "GENERAL_WARD",
  "NON_AC_SEMI_PRIVATE_SHARING_ROOM",
  "SEMI_PRIVATE_SHARING_ROOM",
  "NON_AC_PRIVATE_SINGLE_SHARING_ROOM",
  "PRIVATE_SINGLE_SHARING_ROOM",
  "DELUXE_ROOM",
  "SUITE_ROOM",
  "HDU",
  "NICU",
  "PICU",
  "ICU",
  "ICU_VENTILATOR",
];

const Bedclient = ({ userdata, bedid }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formdata, setFormdata] = useState({
    bedtype: "",
    bedcount: "",
    chargetype: "",
    isavilable: "",
    minprice: "",
    maxprice: "",
  });

  const router = useRouter();

  // Populate formdata if editing an existing bed
  useEffect(() => {
    if (userdata?.Bed && bedid) {
      const selectedBed = userdata.Bed.find((bed) => bed.id === bedid);
      if (selectedBed) {
        setFormdata({
          bedtype: selectedBed.bedtype || "",
          bedcount: selectedBed.bedcount || "",
          chargetype: selectedBed.chargetype || "",
          isavilable: selectedBed.isavilable ? "true" : "false", // Convert boolean to string
          minprice: selectedBed.minprice || "",
          maxprice: selectedBed.maxprice || "",
        });
      }
    }
  }, [userdata, bedid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlebeds = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsLoading(true);

    try {
      const endpoint = bedid
        ? `/api/hospital/${userdata.id}/beds/${bedid}`
        : `/api/hospital/${userdata.id}/beds`;

      const response = await fetch(endpoint, {
        method: bedid ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formdata,
          isavilable: formdata.isavilable === "true", // Convert back to boolean
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update the form.");
      }

      toast("Bed information updated successfully!");
      router.push(`/hospital/dashboard/beds`);
    } catch (error) {
      toast(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <span className="bg-[#243460] px-4 py-2 text-white rounded-xl">
          {bedid ? "Edit" : "Add New Bed"}
        </span>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-[#2b73ec] text-2xl font-bold">
            {bedid ? "Edit Bed Information" : "Add New Bed"}
          </DialogTitle>
          <DialogDescription>
            <form onSubmit={handlebeds} className="grid gap-6 p-4 lg:grid-cols-2">
              {/* Bed Type */}
              <div>
                <label className="block text-sm font-medium text-[#243460]">
                  Bed Type
                </label>
                <select
                  name="bedtype"
                  value={formdata.bedtype}
                  onChange={handleChange}
                  className="w-full border rounded-[15px] p-2"
                  required
                >
                  <option value="">Select Bed Type</option>
                  {BedTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Charge Type */}
              <div>
                <label className="block text-sm font-medium text-[#243460]">
                  Charge Type
                </label>
                <select
                  name="chargetype"
                  value={formdata.chargetype}
                  onChange={handleChange}
                  className="w-full border rounded-[15px] p-2"
                  required
                >
                  <option value="">Select Charge Type</option>
                  {ChargeTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bed Count */}
              <div>
                <label className="block text-sm font-medium text-[#243460]">
                  Bed Count
                </label>
                <input
                  type="number"
                  name="bedcount"
                  value={formdata.bedcount}
                  onChange={handleChange}
                  className="w-full border rounded-[15px] p-2"
                  placeholder="Enter number of beds"
                  required
                />
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-[#243460]">
                  Is Available
                </label>
                <select
                  name="isavilable"
                  value={formdata.isavilable}
                  onChange={handleChange}
                  className="w-full border rounded-[15px] p-2"
                  required
                >
                  <option value="">Select Availability</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              {/* Minimum Price */}
              <div>
                <label className="block text-sm font-medium text-[#243460]">
                  Minimum Price
                </label>
                <input
                  type="number"
                  name="minprice"
                  value={formdata.minprice}
                  onChange={handleChange}
                  className="w-full border rounded-[15px] p-2"
                  placeholder="Enter minimum price"
                  required
                />
              </div>

              {/* Maximum Price */}
              <div>
                <label className="block text-sm font-medium text-[#243460]">
                  Maximum Price
                </label>
                <input
                  type="number"
                  name="maxprice"
                  value={formdata.maxprice}
                  onChange={handleChange}
                  className="w-full border rounded-[15px] p-2"
                  placeholder="Enter maximum price"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="col-span-full">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-2 rounded-[15px]"
                  disabled={isSubmitting}
                >
                  {isLoading ? "Submitting..." : "Save Bed Information"}
                </button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Bedclient;
