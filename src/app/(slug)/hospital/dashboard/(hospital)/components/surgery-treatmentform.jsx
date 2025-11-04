"use client";

import React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Stethoscope } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
const AddSurgeryClient = ({ hospitalid }) => {
  const { toast } = useToast();
  const categories = [
    {
      "Sr No": 1,
      Category: "Bone / Orthopedics",
      Services: [
        { Name: "Small Bone Fracture Procedure Study", Type: "Surgery" },
        { Name: "Big Bone Fracture Surgery", Type: "Surgery" },
        { Name: "Carpal Tunnel Syndrome", Type: "Surgery" },
        { Name: "ACL Tear", Type: "Surgery" },
        { Name: "Spine Surgery", Type: "Surgery" },
        { Name: "Knee Replacement", Type: "Surgery" },
        { Name: "Hip Replacement", Type: "Surgery" },
        { Name: "Physical Therapy", Type: "Treatment" },
        { Name: "Shoulder Dislocation", Type: "Treatment" },
        { Name: "Tendonitis", Type: "Treatment" },
        { Name: "Ligament Tear", Type: "Treatment" },
        { Name: "Sprains and Strains", Type: "Treatment" },
        { Name: "Frozen Shoulder", Type: "Treatment" },
        { Name: "Tennis Elbow", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 2,
      Category: "Gynecology",
      Services: [
        { Name: "Vaginal Cyst", Type: "Surgery" },
        { Name: "Hymenoplasty", Type: "Surgery" },
        { Name: "Ovarian Cyst", Type: "Surgery" },
        { Name: "Hysterectomy", Type: "Surgery" },
        { Name: "Vaginoplasty", Type: "Surgery" },
        { Name: "Labiaplasty", Type: "Surgery" },
        { Name: "Uterus Removal", Type: "Surgery" },
        { Name: "Vaginal Wart Removal", Type: "Treatment" },
        { Name: "Bartholin Cyst", Type: "Treatment" },
        { Name: "PCOD / PCOS Treatment", Type: "Treatment" },
        { Name: "Loose Vagina Treatment", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 3,
      Category: "Mother & Child Care",
      Services: [
        { Name: "Normal Delivery", Type: "Surgery" },
        { Name: "C - Section Delivery", Type: "Surgery" },
        { Name: "Family Planning / Tubectomy", Type: "Surgery" },
        { Name: "Abortion", Type: "Surgery" },
        { Name: "Fallopian Tube Surgery", Type: "Surgery" },
        { Name: "Fibroids", Type: "Surgery" },
        { Name: "Pregnancy Care", Type: "Treatment" },
        { Name: "Miscarriage", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 4,
      Category: "IVF",
      Services: [
        { Name: "IUI", Type: "Surgery" },
        { Name: "ICSI", Type: "Surgery" },
        { Name: "In Vitro Fertilisation (IVF)", Type: "Surgery" },
        { Name: "Blastocyst Culture and Transfer", Type: "Surgery" },
        { Name: "IVF-ICSI", Type: "Surgery" },
        { Name: "Egg Donor IVF-ICSI", Type: "Surgery" },
        { Name: "IVF-ICSI with PESA/TESA", Type: "Surgery" },
        { Name: "T.D.I. (donor)", Type: "Surgery" },
        { Name: "Laser Assisted Hatching", Type: "Surgery" },
        { Name: "Donor Sperm", Type: "Surgery" },
        { Name: "Embryo Freezing", Type: "Surgery" },
        {
          Name: "Cryopreservation for Embryo – per year or part thereof",
          Type: "Surgery",
        },
        { Name: "Sperm Freezing", Type: "Surgery" },
        { Name: "Sperm Freezing for IVF cycle", Type: "Surgery" },
        {
          Name: "Cryopreservation for Sperm – per year or part thereof",
          Type: "Surgery",
        },
        { Name: "Embryo (self) Thaw and Transfer", Type: "Surgery" },
        { Name: "Donor Embryo Transfer", Type: "Surgery" },
        { Name: "Semen Analysis", Type: "Surgery" },
        { Name: "Quality Semen Analysis", Type: "Surgery" },
        { Name: "Endometrial Biopsy (Lab extra)", Type: "Surgery" },
        { Name: "Cyst Aspiration", Type: "Surgery" },
        { Name: "Dilatation", Type: "Surgery" },
        { Name: "PESA/TESA", Type: "Surgery" },
      ],
    },
    {
      "Sr No": 5,
      Category: "Proctology / Lower Body / General",
      Services: [
        { Name: "Piles Surgery", Type: "Surgery" },
        { Name: "Anal Fistula", Type: "Surgery" },
        { Name: "Anal Fissure", Type: "Surgery" },
        { Name: "Pilonidal Sinus", Type: "Surgery" },
        { Name: "Piles Treatment", Type: "Treatment" },
        { Name: "Fistula Treatment", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 6,
      Category: "Abdomen",
      Services: [
        { Name: "Resection (Pancreas)", Type: "Surgery" },
        { Name: "Laparotomy (Small Intestine)", Type: "Surgery" },
        { Name: "Cholecystectomy (Large Intestine)", Type: "Surgery" },
        {
          Name: "Abdominoplasty / Tummy Tuck Surgery (Appendix) / Appendectomy",
          Type: "Surgery",
        },
      ],
    },
    {
      "Sr No": 7,
      Category: "Laparoscopy / Lower Body / General",
      Services: [
        { Name: "Hernia Surgery", Type: "Surgery" },
        { Name: "Gallstone Surgery", Type: "Surgery" },
        { Name: "Inguinal Hernia Surgery", Type: "Surgery" },
        { Name: "Umbilical Hernia Surgery", Type: "Surgery" },
        { Name: "Rectal Prolapse Surgery", Type: "Surgery" },
        { Name: "Appendicitis Treatment", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 8,
      Category: "Urology / Kidney",
      Services: [
        { Name: "Kidney Stones (PCNL / URSL) Surgery", Type: "Surgery" },
        { Name: "Hydrocele", Type: "Surgery" },
        { Name: "Phimosis", Type: "Surgery" },
        { Name: "Kidney Resection", Type: "Surgery" },
        { Name: "Ureter Blockage", Type: "Surgery" },
        { Name: "Kidney Transplant", Type: "Surgery" },
        { Name: "Cystoscopy", Type: "Treatment" },
        { Name: "Prostate Biopsy", Type: "Treatment" },
        { Name: "Dialysis", Type: "Treatment" },
        { Name: "Central Line", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 9,
      Category: "Vascular / General",
      Services: [
        { Name: "Deep Vein Thrombosis Surgery", Type: "Surgery" },
        { Name: "Varicose Veins Surgery", Type: "Surgery" },
        { Name: "Varicocele Surgery", Type: "Surgery" },
        { Name: "Uterine Fibroids Surgery", Type: "Surgery" },
        { Name: "Diabetic Foot Ulcer Surgery", Type: "Surgery" },
        { Name: "Obesity / Diet / Fibromuscular Dysplasia", Type: "Treatment" },
        { Name: "Blood Pressure / Thinners / Blood Clot", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 10,
      Category: "Aesthetic / Skin",
      Services: [
        { Name: "Gynecomastia (Man Boobs)", Type: "Surgery" },
        { Name: "Hair Transplant", Type: "Surgery" },
        { Name: "Liposuction", Type: "Surgery" },
        { Name: "Breast Surgery", Type: "Surgery" },
        { Name: "Lipoma", Type: "Surgery" },
        { Name: "Breast Augmentation", Type: "Surgery" },
        { Name: "Breast Reduction", Type: "Surgery" },
        { Name: "Hydrafacial", Type: "Treatment" },
        { Name: "Laser Toning", Type: "Treatment" },
        { Name: "Carbon Laser Peel", Type: "Treatment" },
        { Name: "Injectable Skin Boosters", Type: "Treatment" },
        { Name: "Chemical Peel", Type: "Treatment" },
        { Name: "Dermal Fillers", Type: "Treatment" },
        { Name: "Botox", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 11,
      Category: "Ophthalmology / Eye",
      Services: [
        { Name: "Eye Surgery", Type: "Surgery" },
        { Name: "Glaucoma", Type: "Surgery" },
        { Name: "Squint", Type: "Surgery" },
        { Name: "Phaco", Type: "Surgery" },
        { Name: "Cornea", Type: "Surgery" },
        { Name: "Cataract", Type: "Surgery" },
        { Name: "Lasik Surgery", Type: "Surgery" },
        { Name: "Diabetic Retinopathy", Type: "Surgery" },
        { Name: "Retinal Detachment", Type: "Surgery" },
        { Name: "Retinopathy Prematurity", Type: "Surgery" },
        { Name: "Macular Edema", Type: "Surgery" },
        { Name: "Traumatic Cataract", Type: "Surgery" },
        { Name: "Macular Hole", Type: "Surgery" },
        { Name: "Posterior Subcapsular Cataract", Type: "Surgery" },
        { Name: "Rosette Cataract", Type: "Surgery" },
        { Name: "Congenital Glaucoma", Type: "Surgery" },
      ],
    },
    {
      "Sr No": 12,
      Category: "Dental",
      Services: [
        { Name: "Dental Implant / Replacement Surgery", Type: "Surgery" },
        { Name: "Inner Flap Surgery", Type: "Surgery" },
        { Name: "Dentures", Type: "Surgery" },
        { Name: "Overdentures", Type: "Surgery" },
        { Name: "Teeth Braces Treatment", Type: "Treatment" },
        { Name: "Root Canal Treatment", Type: "Treatment" },
        { Name: "Teeth Cleaning", Type: "Treatment" },
        { Name: "Dental Check-up", Type: "Treatment" },
        { Name: "Teeth Scaling and Polishing", Type: "Treatment" },
        { Name: "Teeth Whitening and Bleaching", Type: "Treatment" },
        { Name: "Dental X-Ray", Type: "Treatment" },
        { Name: "Dental OPG", Type: "Treatment" },
        { Name: "Oral Health Guide", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 13,
      Category: "ENT",
      Services: [
        { Name: "Adenoidectomy", Type: "Surgery" },
        { Name: "Tonsillectomy / Tonsil Surgery", Type: "Surgery" },
        { Name: "Septoplasty", Type: "Surgery" },
        { Name: "Ear Surgery", Type: "Surgery" },
        { Name: "Nose Surgery", Type: "Surgery" },
        { Name: "Throat Surgery", Type: "Surgery" },
        { Name: "Sinus Surgery", Type: "Surgery" },
        { Name: "Ear Cleaning", Type: "Treatment" },
        { Name: "Tonsillectomy / Tonsil Treatment", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 14,
      Category: "Brain",
      Services: [
        { Name: "Vascular Surgery", Type: "Surgery" },
        { Name: "Brain Surgery", Type: "Surgery" },
        { Name: "Nerve Surgery", Type: "Surgery" },
        { Name: "Soft Tissue Brain Surgery", Type: "Surgery" },
        { Name: "FITS", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 15,
      Category: "Liver",
      Services: [
        { Name: "Liver Transplant", Type: "Surgery" },
        { Name: "Liver Resection", Type: "Surgery" },
        {
          Name: "Transjugular Intrahepatic Portosystemic Shunt (TIPS)",
          Type: "Surgery",
        },
        { Name: "Weight Loss", Type: "Treatment" },
        { Name: "Band Ligation", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 16,
      Category: "Heart",
      Services: [
        { Name: "Coronary Bypass Heart", Type: "Surgery" },
        { Name: "Angioplasty", Type: "Surgery" },
        { Name: "Open Heart", Type: "Surgery" },
        { Name: "Valve Replacement", Type: "Surgery" },
        { Name: "Pacemaker", Type: "Surgery" },
      ],
    },
    {
      "Sr No": 17,
      Category: "Lungs",
      Services: [
        { Name: "Lung Transplant Surgery", Type: "Surgery" },
        { Name: "Lobectomy", Type: "Surgery" },
        { Name: "Thoracoscopic Wedge Resection", Type: "Surgery" },
        { Name: "Lung Biopsy", Type: "Treatment" },
        { Name: "Bronchoscopy", Type: "Treatment" },
        { Name: "Valve Therapy", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 18,
      Category: "Cancer",
      Services: [
        { Name: "Bone Marrow Transplant", Type: "Surgery" },
        { Name: "Cancer Surgery", Type: "Surgery" },
        { Name: "Oral Cancer Surgery", Type: "Surgery" },
        { Name: "Lungs Cancer Surgery", Type: "Surgery" },
        { Name: "Tumor Cancer Surgery", Type: "Surgery" },
        { Name: "Breast Cancer Surgery", Type: "Surgery" },
        { Name: "Chemotherapy", Type: "Treatment" },
        { Name: "Radiation Therapy", Type: "Treatment" },
        { Name: "Immunotherapy", Type: "Treatment" },
        { Name: "Hormone therapy", Type: "Treatment" },
        { Name: "Targeted Drug Therapy", Type: "Treatment" },
        { Name: "Cryoablation", Type: "Treatment" },
        { Name: "Cancer Investigation - Biopsy", Type: "Treatment" },
        { Name: "Cancer Investigation - IHC Investigation", Type: "Treatment" },
      ],
    },
  ];

  const [form, setForm] = useState({
    selectedCategory: "",
    selectedService: "",
    serviceType: "",
    minPrice: "",
    maxPrice: "",
    isAvailable: true,
  });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setForm((prev) => ({
      ...prev,
      selectedCategory: category,
      selectedService: "",
      serviceType: "",
    }));
  };

  const handleServiceChange = (e) => {
    const serviceName = e.target.value;
    setForm((prev) => ({
      ...prev,
      selectedService: serviceName,
    }));

    const category = categories.find(
      (cat) => cat.Category === form.selectedCategory
    );
    if (category) {
      const service = category.Services.find((s) => s.Name === serviceName);
      if (service) {
        setForm((prev) => ({
          ...prev,
          serviceType: service.Type,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.selectedCategory || !form.selectedService) {
      toast({
        title: "Error",
        description: "Please select both category and service",
        variant: "destructive",
      });
      return;
    }

    if (!form.minPrice || !form.maxPrice) {
      toast({
        title: "Error",
        description: "Please enter both minimum and maximum prices",
        variant: "destructive",
      });
      return;
    }

    if (Number.parseFloat(form.minPrice) >= Number.parseFloat(form.maxPrice)) {
      toast({
        title: "Error",
        description: "Maximum price must be greater than minimum price",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/hospital/${hospitalid}/surgery-treatment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add service");
      }

      toast({
        title: "Success",
        description: "Service added successfully!",
      });

      setOpen(false);
      // Reset form
      setForm({
        selectedCategory: "",
        selectedService: "",
        serviceType: "",
        minPrice: "",
        maxPrice: "",
        isAvailable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.map((cat) => cat.Category);
  const filteredServices = form.selectedCategory
    ? categories.find((cat) => cat.Category === form.selectedCategory)
        ?.Services || []
    : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex justify-end">
        <DialogTrigger asChild>
          <Button className="bg-blue-500 text-white rounded-[10px] hover:bg-blue-500 hover:opacity-100 transition-none">
            <Plus className="w-5 h-5" />
            Add Surgery/Treatment Service
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="xs:max-w-[90%] md:max-w-lg max-h-[70vh] bg-gradient-to-br from-white to-blue-50 ">
        <DialogHeader >
          {/* <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div> */}
          <DialogDescription>
            <div className=" flex flex-col text-center items-center justify-center">
              <DialogTitle className="text-center text-xl font-bold text-[#243460]">Add Medical Service</DialogTitle>
              <DialogTitle className="text-center text-lg font-bold text-[#243460]">Add a new surgery or treatment service to your hospital</DialogTitle>
            </div>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4 overflow-y-auto">
            <div className="grid grid-cols-1  gap-3">
              {/* Category Selection */}
              <div>
                <Label
                  htmlFor="category"
                  className="text-[#243460] font-semibold ml-0"
                >
                  Medical Category*
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleCategoryChange({ target: { value } }) // wrap value like native select
                  }
                  value={form.selectedCategory}
                >
                  <SelectTrigger className="w-full h-10 px-4 py-3 !border-[1px] border-blue-950 rounded-xl shadow-sm  focus:ring-2 focus:ring-blue-500  transition-all duration-200 bg-white">
                    <SelectValue placeholder="Choose a medical category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category, index) => (
                      <SelectItem key={index} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Service Selection */}
              {form.selectedCategory && (
                <div>
                  <Label
                    htmlFor="service"
                    className="text-[#243460] font-semibold ml-0"
                  >
                    Service/Procedure*
                  </Label>
                  <Select
                    value={form.selectedService}
                    onValueChange={(value) =>
                      handleServiceChange({ target: { value } }) // wrap value into event-like object
                    }
                  >
                    <SelectTrigger className="w-full h-10 px-4 py-3 !border-[1px] border-blue-950 rounded-xl shadow-sm  focus:ring-2 focus:ring-blue-500  transition-all duration-200 bg-white">
                      <SelectValue placeholder="Select a service or procedure" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredServices.map((service, index) => (
                        <SelectItem key={index} value={service.Name}>
                          {service.Name} ({service.Type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {/* Service Type Display */}
              {form.selectedService && (
                <div className="grid gap-3">
                  <div className="">
                    <Label
                      htmlFor="serviceType"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Service Type
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        id="serviceType"
                        value={form.serviceType}
                        readOnly
                        className="pl-4"
                      />
                      <div
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded-full text-xs font-semibold ${
                          form.serviceType === "Surgery"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {form.serviceType}
                      </div>
                    </div>
                  </div>
                  <div>
                    {/* Price Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="minPrice"
                          className="text-[#243460] font-semibold ml-0"
                        >
                          Minimum Price (₹)*
                          
                        </Label>
                        <Input
                          type="number"
                          id="minPrice"
                          value={form.minPrice}
                          onChange={(e) =>
                            setForm({ ...form, minPrice: e.target.value })
                          }
                          className="pl-4"
                          placeholder="e.g. 5000"
                          min="0"
                          required
                        />
                      </div>
                      <div >
                        <Label
                          htmlFor="maxPrice"
                          className="text-[#243460] font-semibold ml-0"
                        >
                          Maximum Price (₹)*
                        </Label>
                        <Input
                          type="number"
                          id="maxPrice"
                          value={form.maxPrice}
                          onChange={(e) =>
                            setForm({ ...form, maxPrice: e.target.value })
                          }
                          className="pl-4"
                          placeholder="e.g. 15000"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  {/* Availability Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <div >
                      <Label
                        htmlFor="isAvailable"
                        className="text-[#243460] font-semibold ml-0"
                      >
                        Service Availability
                      </Label>
                      <p className="text-xs text-gray-500">
                        Toggle to set whether this service is currently available
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-medium transition-colors duration-200 ${
                          form.isAvailable ? "text-gray-400" : "text-gray-700"
                        }`}
                      >
                        Unavailable
                      </span>
                      <Switch
                        id="isAvailable"
                        checked={form.isAvailable}
                        onCheckedChange={(checked) =>
                          setForm({ ...form, isAvailable: checked })
                        }
                        className="data-[state=checked]:bg-green-500"
                      />
                      <span
                        className={`text-sm font-medium transition-colors duration-200 ${
                          form.isAvailable ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        Available
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="!mt-6 text-center">
                    <Button
                      type="submit"
                      disabled={!form.selectedService || loading}
                      className={`w-full lg:w-full bg-[#5271FF] hover:bg-[#5271FF] px-5 py-1 text-white  rounded-xl font-bold shadow-lg hover:shadow-xl transition ${
                        !form.selectedService || loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-400 text-white"
                      } text-white`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Plus className="w-5 h-5" />
                          Add Service to Hospital
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>


        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSurgeryClient;
