"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadButton } from "@uploadthing/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import HeadingClientMain from "@/app/components/heading";
import { toast } from "react-toastify";
import { useEffect } from "react";

const ambulanceTypes = [
  "Patient Transport Ambulance",
  "Basic Life Support Ambulance",
  "Advanced Life Support Ambulance",
  "Neo-natal & Pediatric Ambulance",
  "Air Ambulance",
  "Boat Ambulance",
  "Bike Ambulance",
  "Mobile Medical Unit",
];
const ambulanceCategory = [
  "102 Ambulance",
  "108 Ambulance",
  "Private Ambulance",
  "Hospital Ambulance",
  "RED Health Ambulance",
  "Medulance Ambulance",
  "AmbiPalm Ambulance",
  "MedCap Ambulance",
  "Ziqitza Ambulance",
];
const facilityOptions = [
  "Oxygen Supply",
  "ECG Monitor",
  "Defibrillator",
  "Ventilator",
  "Stretcher",
  "Incubator",
  "Suction Unit",
  "Infusion Pumps",
  "Pediatric Monitoring",
  "First Aid Kit",
  "Advanced Airway Tools",
];

export function AddAmbulanceVehicleDialog({
  mainambulanceId,
  ambulanceId,
  ambulance,
}) {
  const [formData, setFormData] = React.useState({
  ambulancemodel: "",
  ambulancecharges: "",
  ambulancefinalcharge: "",   // NEW
  ambulancediscount: "",      // NEW
  ambulanceareapincode: "",
  ambulanceregdate: "",
  ambulancercno: "",
  ambulancetype: "",
  status: "pending",
  latitude: "",
  longitude: "",
  ambulancercbook: "",
  ambulancecategory: "",
  ambulanceFront: "",
  ambulanceBack: "",
  ambulanceLeft: "",
  ambulanceRight: "",
  ambulanceinternal: "",
  puc: "",
  insurance: "",
  facilities: "",
});

  const [selectedAmbulanceTypes, setSelectedAmbulanceTypes] = React.useState(
    []
  );
  const [selectedFacilities, setSelectedFacilities] = React.useState([]);

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            latitude: pos.coords.latitude.toString(),
            longitude: pos.coords.longitude.toString(),
          }));
        },
        (error) => {
          console.log(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  const updateForm = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedForm = {
      ...formData,

      facilities: selectedFacilities.join(","),
    };

    const requiredFields = [
      "ambulancemodel",
      "ambulancecharges",
      "ambulanceareapincode",
      "ambulanceregdate",
      "ambulancercno",
      "ambulancetype",
      "ambulancecategory",
      "ambulancercbook",
    ];

    for (const field of requiredFields) {
      if (!updatedForm[field] || updatedForm[field].toString().trim() === "") {
        toast.error(`Please fill in the ${field} field.`);
        setLoading(false);
        return;
      }
    }

    try {
      const payload = {
        ...updatedForm,
        id: ambulanceId,
      };

      const method = ambulanceId ? "PUT" : "POST";
      const url = ambulanceId
        ? `/api/ambulance/${mainambulanceId}/create-ambulance/${ambulanceId}`
        : `/api/ambulance/${mainambulanceId}/create-ambulance`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error saving ambulance");

      toast.success(
        `Ambulance ${ambulanceId ? "updated" : "created"} successfully.`
      );
    } catch (err) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // Populate form fields if editing (ambulanceId and ambulance provided)
  useEffect(() => {
  if (ambulanceId && ambulance) {
    setFormData((prev) => ({
      ...prev,
      ambulancemodel: ambulance.ambulancemodel || "",
      ambulancecharges: ambulance.ambulancecharges || "",
      ambulancefinalcharge: ambulance.ambulancefinalcharge || "",   // NEW
      ambulancediscount: ambulance.ambulancediscount || "",         // NEW
      ambulanceareapincode: ambulance.ambulanceareapincode || "",
      ambulanceregdate: ambulance.ambulanceregdate
        ? new Date(ambulance.ambulanceregdate)
        : "",
      ambulancercno: ambulance.ambulancercno || "",
      ambulancetype: ambulance.ambulancetype || "",
      status: ambulance.status || "pending",
      latitude: ambulance.latitude || "",
      longitude: ambulance.longitude || "",
      ambulancercbook: ambulance.ambulancercbook || "",
      ambulanceimages: ambulance.ambulanceimages
        ? JSON.stringify(ambulance.ambulanceimages)
        : "[]",
      ambulanceFront: ambulance.ambulanceimagefront || "",
      ambulanceBack: ambulance.ambulanceimageback || "",
      ambulanceLeft: ambulance.ambulanceimageleft || "",
      ambulanceRight: ambulance.ambulanceimageright || "",
      ambulanceinternal: ambulance.ambulanceimageinteral || "",
      ambulancecategory: ambulance.ambulancecategory || "",
      puc: ambulance.puc || "",
      insurance: ambulance.insurance || "",
    }));
  }
}, [ambulanceId, ambulance]);

  return (
    <Dialog>
      <div className="flex justify-end">
        <DialogTrigger>
          <span className="bg-blue-500 px-3 py-2 text-white rounded-[10px]">
            {ambulanceId ? "Edit" : "Add"} Ambulance
          </span>
        </DialogTrigger>
      </div>

      <DialogContent className="lg:!max-w-xl w-full bg-white overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <HeadingClientMain
            main={`${ambulanceId ? "Edit" : "Create"} Ambulance`}
          />
          <DialogDescription>
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Ambulance Model"
                  value={formData.ambulancemodel}
                  onChange={(e) => updateForm("ambulancemodel", e.target.value)}
                />
                    <Input
                      placeholder="Charges/km"
                      value={formData.ambulancecharges}
                      onChange={(e) => updateForm("ambulancecharges", e.target.value)}
                    />

                    <Input
                      placeholder="Discount (%)"
                      value={formData.ambulancediscount}
                      onChange={(e) => updateForm("ambulancediscount", e.target.value)}
                    />

                    <Input
                      placeholder="Final Charge"
                      value={formData.ambulancefinalcharge}
                      onChange={(e) => updateForm("ambulancefinalcharge", e.target.value)}
                    />

                <Input
                  placeholder="Pincode"
                  value={formData.ambulanceareapincode}
                  onChange={(e) =>
                    updateForm("ambulanceareapincode", e.target.value)
                  }
                />
                <DatePicker
                  selected={formData.ambulanceregdate}
                  onChange={(date) => updateForm("ambulanceregdate", date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select Registration Date"
                  className="w-full border-[1px] border-black text-black placeholder:text-black rounded-xl p-2"
                  showYearDropdown
                  showMonthDropdown
                  suppressHydrationWarning={true}
                />

                <Input
                  placeholder="RC No"
                  value={formData.ambulancercno}
                  onChange={(e) => updateForm("ambulancercno", e.target.value)}
                />

                <Select
                  value={formData.ambulancecategory}
                  onValueChange={(val) => updateForm("ambulancecategory", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Ambulance Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {ambulanceCategory.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  value={formData.ambulancetype}
                  onValueChange={(val) => updateForm("ambulancetype", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Ambulance Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {ambulanceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Input
                  value={formData.latitude}
                  placeholder="Latitude"
                  disabled
                />
                <Input
                  value={formData.longitude}
                  placeholder="Longitude"
                  disabled
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Upload PUC</label>
                <UploadButton
                  endpoint="fileUploader"
                  content={{
                    button({ ready }) {
                      return <div>{ready && "Upload"}</div>;
                    },
                  }}
                  appearance={{
                    button:
                      "w-auto bg-transparent text-sm text-white font-bold",
                    container: "rounded border w-auto px-4 py-1 bg-[#243460]",
                    allowedContent: "hidden",
                  }}
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.url) {
                      updateForm("puc", res[0].url);
                      toast("PUC uploaded successfully");
                    }
                  }}
                  onUploadError={(err) => toast(`Upload error: ${err.message}`)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Upload Insurance</label>
                <UploadButton
                  endpoint="fileUploader"
                  content={{
                    button({ ready }) {
                      return <div>{ready && "Upload"}</div>;
                    },
                  }}
                  appearance={{
                    button:
                      "w-auto bg-transparent text-sm text-white font-bold",
                    container: "rounded border w-auto px-4 py-1 bg-[#243460]",
                    allowedContent: "hidden",
                  }}
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.url) {
                      updateForm("insurance", res[0].url);
                      toast("Insurance uploaded successfully");
                    }
                  }}
                  onUploadError={(err) => toast(`Upload error: ${err.message}`)}
                />
              </div>
              {/* RC Book Upload */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Upload RC Book (1 image)
                </label>
                <UploadButton
                  endpoint="fileUploader"
                  content={{
                    button({ ready }) {
                      return <div>{ready && "Upload"}</div>;
                    },
                  }}
                  appearance={{
                    button:
                      "w-auto bg-transparent text-sm text-white font-bold",
                    container: "rounded border w-auto px-4 py-1 bg-[#243460]",
                    allowedContent: "hidden",
                  }}
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.url) {
                      updateForm("ambulancercbook", res[0].url);
                      toast("RC Book uploaded successfully");
                    }
                  }}
                  onUploadError={(err) => toast(`Upload error: ${err.message}`)}
                />
              </div>

              {/* Ambulance Images Upload */}
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Upload Ambulance Image Front
                </label>
                <UploadButton
                  endpoint="fileUploader"
                  content={{
                    button({ ready }) {
                      return <div>{ready && "Upload"}</div>;
                    },
                  }}
                  appearance={{
                    button:
                      "w-auto bg-transparent text-sm text-white font-bold",
                    container: "rounded border w-auto px-4 py-1 bg-[#243460]",
                    allowedContent: "hidden",
                  }}
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.url) {
                      updateForm("ambulanceFront", res[0].url);
                      toast("Ambulance images uploaded successfully");
                    }
                  }}
                  onUploadError={(err) => toast(`Upload error: ${err.message}`)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Upload Ambulance Image Back
                </label>
                <UploadButton
                  endpoint="fileUploader"
                  content={{
                    button({ ready }) {
                      return <div>{ready && "Upload"}</div>;
                    },
                  }}
                  appearance={{
                    button:
                      "w-auto bg-transparent text-sm text-white font-bold",
                    container: "rounded border w-auto px-4 py-1 bg-[#243460]",
                    allowedContent: "hidden",
                  }}
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.url) {
                      updateForm("ambulanceBack", res[0].url);
                      toast("Ambulance images uploaded successfully");
                    }
                  }}
                  onUploadError={(err) => toast(`Upload error: ${err.message}`)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Upload Ambulance Image Left
                </label>
                <UploadButton
                  endpoint="fileUploader"
                  content={{
                    button({ ready }) {
                      return <div>{ready && "Upload"}</div>;
                    },
                  }}
                  appearance={{
                    button:
                      "w-auto bg-transparent text-sm text-white font-bold",
                    container: "rounded border w-auto px-4 py-1 bg-[#243460]",
                    allowedContent: "hidden",
                  }}
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.url) {
                      updateForm("ambulanceLeft", res[0].url);
                      toast("Ambulance images uploaded successfully");
                    }
                  }}
                  onUploadError={(err) => toast(`Upload error: ${err.message}`)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Upload Ambulance Image Right
                </label>
                <UploadButton
                  endpoint="fileUploader"
                  content={{
                    button({ ready }) {
                      return <div>{ready && "Upload"}</div>;
                    },
                  }}
                  appearance={{
                    button:
                      "w-auto bg-transparent text-sm text-white font-bold",
                    container: "rounded border w-auto px-4 py-1 bg-[#243460]",
                    allowedContent: "hidden",
                  }}
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.url) {
                      updateForm("ambulanceRight", res[0].url);
                      toast("Ambulance images uploaded successfully");
                    }
                  }}
                  onUploadError={(err) => toast(`Upload error: ${err.message}`)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Upload Ambulance Image Internal
                </label>
                <UploadButton
                  endpoint="fileUploader"
                  content={{
                    button({ ready }) {
                      return <div>{ready && "Upload"}</div>;
                    },
                  }}
                  appearance={{
                    button:
                      "w-auto bg-transparent text-sm text-white font-bold",
                    container: "rounded border w-auto px-4 py-1 bg-[#243460]",
                    allowedContent: "hidden",
                  }}
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.url) {
                      updateForm("ambulanceinternal", res[0].url);
                      toast("Ambulance images uploaded successfully");
                    }
                  }}
                  onUploadError={(err) => toast(`Upload error: ${err.message}`)}
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-[10px] text-white hover:bg-blue-600 bg-blue-500"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
