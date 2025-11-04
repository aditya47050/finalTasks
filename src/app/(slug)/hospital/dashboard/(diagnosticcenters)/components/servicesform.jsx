"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "react-toastify";

const facilitiesData = [
  {
    facility: "Radiology",
    categories: [
      {
        category: "Digital X-Ray",
        subCategories: [
          "X Ray Skull",
          "X Ray Lower Extremity",
          "X Ray Upper Extremity",
          "X Ray Spine",
          "X Ray Shoulder",
          "X Ray Hand",
          "X Ray Joints",
          "X Ray Elbow",
          "X Ray PBH",
          "X Ray Chest",
          "X Ray PNS",
          "X Ray Dental",
          "X Ray Orbit",
          "X Ray Knee",
          "X Ray Foot",
          "X Ray Leg",
        ],
      },
      {
        category: "Sonography (USG)",
        subCategories: [
          "Abdominal Ultrasound",
          "Pelvic Ultrasound",
          "Transabdominal Ultrasound",
          "Transvaginal Ultrasound",
          "Transrectal Ultrasound",
          "Obstetric Ultrasound",
          "Carotid & Abdominal Aorta Ultrasound",
          "Liver Ultrasound",
          "Renal Artery with Doppler for Stenosis Ultrasound",
          "Vascular Ultrasound",
          "Thyroid Ultrasound",
        ],
      },
      {
        category: "CT Scan",
        subCategories: [
          "CT Brain",
          "CT Joints",
          "CT Abdomen Plain",
          "CT Pelvis Plain",
          "CT 3D Scan",
          "CT Angiography / Pulmonary / Upper & Lower Limb",
          "CT Cardiac Angio",
          "CT Calcium Scoring",
          "CT Contrast Study",
        ],
      },
      {
        category: "MRI Scan",
        subCategories: [
          "MRI Brain",
          "MRI Spine",
          "MRI MRCP",
          "MRI Angiography / Venogram / Spectroscopy",
          "MRI Defecography / Fistulography",
          "MRI Breast",
          "MRI Knee",
          "MRI Screening",
          "MRI Upper Extremity",
          "MRI Lower Extremity",
          "MRI Contrast Study",
        ],
      },
      {
        category: "Nucleus Test",
        subCategories: [
          "THYROID SCAN",
          "RADIO-IODINE ABLATION 08 mCi",
          "RADIO-IODINE ABLATION 10 mCi",
          "RADIO-IODINE ABLATION 12 mCi",
          "RADIO-IODINE ABLATION 100 mCi",
          "THALLIUM SCAN",
          "CAPTOPRIL RENAL SCAN and baseline",
          "DTPA RENAL SCAN",
          "EC RENAL SCAN",
          "DMSA RENAL",
          "VUR STUDY / MCU",
          "BONE SCAN",
          "LUNG PERFUSION SCAN",
          "LUNG VENTILATION SCAN",
          "LIVER COLLOID SCAN",
          "HEPATOBILLARY SCAN (HIDA)",
          "MECKEL'S SCAN",
          "GI BLEED SCAN / RBC SCAN",
          "MECKEL'S SCAN/ GI Bleed(Package)",
          "MIBG(conditions apply)",
          "BRAIN SPECT (EPILEPSY / ALZEIMERS)",
          "GASTRIC EMPTING",
          "G.E. REFLUX / MILK SCAN",
          "TESTICULAR SCAN FOR TORSION",
          "MUGA",
          "PARATHYROID SCAN",
          "IODINE SCAN",
          "PHARMACOLOGICAL STRESS THALLIUM",
          "LYMPHOSCINTIGRAPHY",
          "DACROSCINTIGRAPHY",
          "Colonic Transit Time",
          "FDG Whole Body Pet",
          "Cardiac Pet",
          "Neurology Brain Pet",
          "GA 68 Dota Scan (By Appointment)",
          "GA 68 PSMA Scan",
        ],
      },
    ],
  },
];

const DiagnosticServiceForm = ({ hospitalId, id = null }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    facility: "",
    category: "",
    subCategory: "",
    available: false,
    minPrice: "",
    maxPrice: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchService = async () => {
      try {
        // Mock API call for demonstration
        const mockServiceData = {
          success: true,
          service: {
            facility: "Radiology",
            category: "CT Scan",
            subCategory: "CT Brain",
            available: true,
            minPrice: "1500",
            maxPrice: "3000",
          },
        };
        // const res = await fetch(`/api/diagnostic-center-services/${id}`);
        // const data = await res.json();
        const data = mockServiceData; // Using mock data

        if (data.success) {
          const {
            facility,
            category,
            subCategory,
            available,
            minPrice,
            maxPrice,
          } = data.service;
          setForm({
            facility,
            category,
            subCategory,
            available,
            minPrice,
            maxPrice,
          });
          setOpen(true);
        }
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch service data.",
        });
        console.error(err);
      }
    };
    fetchService();
  }, [id, toast]);

  const handleSubmit = async () => {
    if (!form.facility || !form.category || !form.subCategory) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields.",
      });
      return;
    }
    setLoading(true);
    try {
      // Perform the API call
      const res = await fetch(
        id
          ? `/api/diagnostic-center-services/${id}`
          : `/api/hospital/${hospitalId}/services`,
        {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, hospitalId }),
        }
      );

      const data = await res.json(); // Use the actual API response

      if (data.success) {
        toast({
          title: "Success",
          description: `Service ${id ? "updated" : "added"} successfully!`,
        });
        setOpen(false);
        setForm({
          facility: "",
          category: "",
          subCategory: "",
          available: false,
          minPrice: "",
          maxPrice: "",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save service.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Server error during submission.",
      });
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentFacility = facilitiesData.find(
    (f) => f.facility === form.facility
  );
  const currentCategory = currentFacility?.categories.find(
    (c) => c.category === form.category
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!id && (
        <DialogTrigger asChild>
          <Button className="bg-[#5271FF] hover:bg-[#4460e6] text-white font-bold rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
            Add Diagnostic Service
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-2xl">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-3xl font-extrabold text-[#5271FF] drop-shadow-sm">
            {id ? "Edit Diagnostic Service" : "Add Diagnostic Service"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Facility Selection */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 transition-all duration-200 hover:border-[#5271FF]">
            <Label
              htmlFor="facility"
              className="text-base font-semibold text-gray-700 mb-2 block"
            >
              Facility *
            </Label>
            <Select
              value={form.facility}
              onValueChange={(value) =>
                setForm({
                  ...form,
                  facility: value,
                  category: "",
                  subCategory: "",
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Facility" />
              </SelectTrigger>
              <SelectContent>
                {facilitiesData.map((facility) => (
                  <SelectItem key={facility.facility} value={facility.facility}>
                    {facility.facility}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Selection */}
          {form.facility && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 transition-all duration-200 hover:border-[#5271FF]">
              <Label
                htmlFor="category"
                className="text-base font-semibold text-gray-700 mb-2 block"
              >
                Category *
              </Label>
              <Select
                value={form.category}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    category: value,
                    subCategory: "",
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {currentFacility?.categories.map((cat) => (
                    <SelectItem key={cat.category} value={cat.category}>
                      {cat.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Sub-Category Radio Buttons */}
          {form.category && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 transition-all duration-200 hover:border-[#5271FF]">
              <Label className="text-base font-semibold text-gray-700 mb-2 block">
                Sub-Category *
              </Label>
              <RadioGroup
                value={form.subCategory}
                onValueChange={(value) =>
                  setForm({ ...form, subCategory: value })
                }
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {currentCategory?.subCategories.map((sub) => (
                  <div
                    key={sub}
                    className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50 transition-colors duration-150"
                  >
                    <RadioGroupItem
                      value={sub}
                      id={`sub-${sub.replace(/\s/g, "-")}`}
                    />
                    <Label
                      htmlFor={`sub-${sub.replace(/\s/g, "-")}`}
                      className="cursor-pointer text-sm font-medium text-gray-800"
                    >
                      {sub}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Availability Checkbox */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 transition-all duration-200 hover:border-[#5271FF] flex items-center space-x-3">
            <Checkbox
              id="available"
              checked={form.available}
              onCheckedChange={(checked) =>
                setForm({ ...form, available: !!checked })
              }
              className="h-5 w-5"
            />
            <Label
              htmlFor="available"
              className="text-base font-semibold text-gray-700 cursor-pointer"
            >
              Available
            </Label>
          </div>

          {/* Price Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 transition-all duration-200 hover:border-[#5271FF]">
              <Label
                htmlFor="minPrice"
                className="text-base font-semibold text-gray-700 mb-2 block"
              >
                Min Price
              </Label>
              <Input
                id="minPrice"
                type="number"
                value={form.minPrice}
                onChange={(e) => setForm({ ...form, minPrice: e.target.value })}
                placeholder="Enter minimum price"
                className="mt-1"
              />
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 transition-all duration-200 hover:border-[#5271FF]">
              <Label
                htmlFor="maxPrice"
                className="text-base font-semibold text-gray-700 mb-2 block"
              >
                Max Price
              </Label>
              <Input
                id="maxPrice"
                type="number"
                value={form.maxPrice}
                onChange={(e) => setForm({ ...form, maxPrice: e.target.value })}
                placeholder="Enter maximum price"
                className="mt-1"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-lg tracking-wide"
          >
            {loading
              ? "Submitting..."
              : id
              ? "Update Service"
              : "Submit Service"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiagnosticServiceForm;
