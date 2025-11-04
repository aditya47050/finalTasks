"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InputField, SelectField, DateFilter, MultiSelectDropdown } from "@/app/components/input-selectui";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Bed,
  Users,
  Activity,
  Calendar,
  Clock,
  Upload,
} from "lucide-react";
import HeadingClientMain from "@/app/components/heading";
import { PiCurrencyInrBold } from "react-icons/pi";
import Link from "next/link";
import { UploadButton } from "@uploadthing/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const BedStatus = {
  AVAILABLE: "AVAILABLE",
  BOOKED: "BOOKED",
  RESERVED: "RESERVED",
  ADMITTED: "ADMITTED",
  DISCHARGED: "DISCHARGED",
};

const bedTypeOptions = [
  { label: "All", value: "All" }, // Added "All" option
  { label: "Male Ward", value: "MALE_WARD" },
  { label: "Female Ward", value: "FEMALE_WARD" },
  { label: "General Ward", value: "GENERAL_WARD" },
  {
    label: "Non AC Semi Private Sharing Room",
    value: "NON_AC_SEMI_PRIVATE_SHARING_ROOM",
  },
  { label: "Semi Private Sharing Room", value: "SEMI_PRIVATE_SHARING_ROOM" },
  {
    label: "Non AC Private Single Sharing Room",
    value: "NON_AC_PRIVATE_SINGLE_SHARING_ROOM",
  },
  {
    label: "Private Single Sharing Room",
    value: "PRIVATE_SINGLE_SHARING_ROOM",
  },
  { label: "Deluxe Room", value: "DELUXE_ROOM" },
  { label: "Suite Room", value: "SUITE_ROOM" },
  { label: "HDU", value: "HDU" },
  { label: "NICU", value: "NICU" },
  { label: "PICU", value: "PICU" },
  { label: "ICU", value: "ICU" },
  { label: "ICU Ventilator", value: "ICU_VENTILATOR" },
];

const statusOptions = [
  { label: "All", value: "All" }, // Added "All" option
  { label: "Available", value: BedStatus.AVAILABLE },
  { label: "Booked", value: BedStatus.BOOKED },
  { label: "Reserved", value: BedStatus.RESERVED },
  { label: "Admitted", value: BedStatus.ADMITTED },
  { label: "Discharged", value: BedStatus.DISCHARGED },
];

const governmentSchemes = [
  "Happy Insurance TPA Services Pvt. Ltd",
  "Aam Aadmi Bima Yojana",
  "Central Government Health Scheme",
  "Pradhan Mantri Suraksha Bima Yojana",
  "Chief Minister's Comprehensive Health Insurance Scheme",
  "Universal Health Insurance Scheme (UHIS)",
  "Bhamashah Swasthya Bima Yojana",
  "Mahatma Jyotiba Phule Jan Arogya Yojana (MJPJAY)",
  "Yeshasvini Health Insurance Scheme",
  "West Bengal Health Scheme",
  "Mukhyamantri Amrutum Yojana",
  "Ayushman Bharat Mahatma Gandhi Rajasthan Swasthya Bima Yojana",
  "Employment State Insurance Scheme (ESIC)",
  "Ayushman Bharat Yojana (PMJAY)",
  "Janshree Bima Yojana",
  "Karunya Health Scheme",
  "Telangana State Government Employees and Journalists Health Scheme",
  "Dr YSR Aarogyasri Health Care Trust",
  "CM Health Fund (All State)",
];

export default function BedManagement({ userdata, beddata }) {
  const [bedCategories, setBedCategories] = useState(beddata);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const [formData, setFormData] = useState({
  id: "",
  name: "",
  chargeType: "",
  minPrice: "",
  maxPrice: "",
  finalPrice: "",
  discount: "",
  bedCount: "",
  hasgovernmentschema: false,
  schema: [],
  schemabedcounts: {},
});


  const [filters, setFilters] = useState({});

  useEffect(() => {
  if (beddata) {
    setFormData({
      id: beddata.id,
      name: beddata.name || "",
      chargeType: beddata.chargeType || "",
      minPrice: beddata.minPrice || "",
      maxPrice: beddata.maxPrice || "",
      finalPrice: beddata.finalPrice || "",
      discount: beddata.discount || "",
      bedCount: beddata.bedCount?.toString() || "",
      hasgovernmentschema: beddata.hasgovernmentschema || false,
      schema: Array.isArray(beddata.schema)
        ? beddata.schema
        : beddata.schema
        ? [beddata.schema]
        : [],
      schemabedcounts: beddata.schemabedcounts || {},
    });
  }
}, [beddata]);


  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredBedCategories = useMemo(() => {
    return bedCategories.filter((category) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        if (key === "status") {
          return category.beds.some((bed) => bed.status === value);
        }
        return String(category[key] || "").toLowerCase().includes(value.toLowerCase());
      })
    );
  }, [bedCategories, filters]);

  const getBedStatusColor = (status, facility) => {
    if (status === BedStatus.AVAILABLE) {
      return facility === "Government"
        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
        : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
    }

    if (status === BedStatus.BOOKED) {
      return facility === "Government"
        ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
        : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100";
    }

    const commonColors = {
      [BedStatus.RESERVED]:
        "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
      [BedStatus.CONFIRMED]:
        "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
      [BedStatus.AVAILABLE_SOON]:
        "bg-lime-50 text-lime-700 border-lime-200 hover:bg-lime-100",
      [BedStatus.AVAILABLE]:
        "bg-lime-50 text-lime-700 border-lime-200 hover:bg-lime-100",

      [BedStatus.ADMITTED]:
        "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
      [BedStatus.DISCHARGED]:
        "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100",
    };

    return (
      commonColors[status] ??
      "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
    );
  };

  const getBedStatusIcon = (status) => {
    switch (status) {
      default:
        return <Bed className="w-4 h-4" />;
    }
  };

  const getBedsForCategory = (categoryId) => {
    const category = bedCategories.find((cat) => cat.id === categoryId);
    return category ? category.beds : [];
  };

  const getBedStats = (categoryId) => {
    const categoryBeds = getBedsForCategory(categoryId);
    const available = categoryBeds.filter(
      (bed) => bed.status === BedStatus.AVAILABLE
    ).length;
    const booked = categoryBeds.filter(
      (bed) => bed.status === BedStatus.BOOKED
    ).length;
    const reserved = categoryBeds.filter(
      (bed) => bed.status === BedStatus.RESERVED
    ).length;

    const outOfService = categoryBeds.filter(
      (bed) => bed.status === BedStatus.OUT_OF_SERVICE
    ).length;
    const total = categoryBeds.length;

    return { available, booked, reserved, outOfService, total };
  };

  const getOccupancyRate = (categoryId) => {
    const stats = getBedStats(categoryId);
    if (stats.total === 0) return 0;
    return Math.round((stats.booked / stats.total) * 100);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const nameValid = !!formData.name && formData.name !== "All"; // Optional: skip "All"
  const bedCountValid = Number(formData.bedCount) > 0;
    console.log(nameValid,bedCountValid);
  if (!nameValid || !bedCountValid) {
    alert("Please fill all required fields: Name, Bed Type, Bed Count");
    return;
  }

    const payload = {
  name: formData.name,
  chargeType: formData.chargeType || null,
  minPrice: formData.minPrice ?? null,   // use ?? not ||
  maxPrice: formData.maxPrice ?? null,
  finalPrice: formData.finalPrice ?? null,
  discount: formData.discount ?? null,
  bedCount: Number.parseInt(formData.bedCount),
  hasgovernmentschema: formData.hasgovernmentschema,
  schema: formData.schema,
  schemabedcounts: formData.schemabedcounts || {},
  images: Object.values(images),
  hospitalId: userdata?.id,
};

console.log(formData);


    try {
      let res;
      if (formData.id) {
        res = await fetch(
          `/api/hospital/${userdata.id}/beds/bed-category/${formData.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        res = await fetch(`/api/hospital/${userdata.id}/beds/bed-category`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Failed to save bed category");

      const savedCategory = await res.json();

      if (!savedCategory || typeof savedCategory.id === "undefined") {
        throw new Error("Invalid API response: Missing savedCategory.id");
      }

      if (formData.id) {
        setBedCategories((prev) =>
          prev.map((cat) => (cat.id === savedCategory.id ? savedCategory : cat))
        );
      } else {
        setBedCategories((prev) => [...prev, savedCategory]);
      }

      setFormData({
        name: "",
        chargeType: "",
        minPrice: "",
        maxPrice: "",
        finalPrice: "",
        discount: "",
        bedCount: "",
        hasgovernmentschema: false,
        schema: [],
        schemabedcounts: {},
      });
    } catch (error) {
      alert(error.message);
    }
  }

  const totalBeds = bedCategories.reduce((sum, category) => {
    const stats = getBedStats(category.id);
    return sum + stats.total;
  }, 0);

  const totalAvailable = bedCategories.reduce((sum, category) => {
    const stats = getBedStats(category.id);
    return sum + stats.available;
  }, 0);

  const totalOccupied = bedCategories.reduce((sum, category) => {
    const stats = getBedStats(category.id);
    return sum + stats.booked;
  }, 0);

  // Prepare data for Recharts
  const chartData = filteredBedCategories.map((category) => {
    const stats = getBedStats(category.id);
    return {
      name: category.name,
      available: stats.available,
      booked: stats.booked,
      reserved: stats.reserved,
      outOfService: stats.outOfService,
    };
  });

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex justify-center items-center">
          <HeadingClientMain
            main={"Hospital Beds"}
            sub={"Manage details"}
          />
        </div>
        <div className="">

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <div className="flex justify-end">
    <DialogTrigger asChild>
      <Button
        size="lg"
        className="bg-blue-500 text-white rounded-[10px] hover:bg-blue-500 hover:opacity-100 transition-none"
      >
        <Plus className="w-4 h-4 mr-2" />
        {formData.id ? "Edit Category" : "Add Bed Category"}
      </Button>
    </DialogTrigger>
  </div>
  <DialogContent className="xs:max-w-1/4 md:max-w-lg max-h-[70vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50">
    <DialogHeader>
      <div className="flex flex-col text-center items-center justify-center">
        <DialogTitle className="text-center text-xl font-bold text-[#243460]">
          {formData.id ? "Edit Bed Category" : "Create New Bed Category"}
        </DialogTitle>
        <DialogTitle className="text-center text-lg font-bold text-[#243460]">
          {formData.id
            ? "Update the details of this bed category."
            : "Add a new bed category. Individual beds will be automatically created."}
        </DialogTitle>
      </div>
    </DialogHeader>
    <form onSubmit={handleSubmit}>
      <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {/* Bed Type */}
          <div>
            <Label htmlFor="bedType" className="text-sm font-medium">
              Bed Type *
            </Label>
            <Select
  name="name"
  value={formData.name || ""}
  onValueChange={(value) =>
    setFormData((prev) => ({ ...prev, name: value }))
  }
>
  <SelectTrigger className="pl-4 border-[1px] border-[#243460]">
    <SelectValue placeholder="Select Bed Type" />
  </SelectTrigger>
  <SelectContent className="bg-white text-base text-gray-700">
    {bedTypeOptions.map((option) => (
      <SelectItem
        key={option.value}
        value={option.value}
        className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm"
      >
        {option.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

          </div>

          {/* Charge Type */}
          <div>
            <Label htmlFor="chargeType" className="text-sm font-medium">
              Charge Type
            </Label>
            <Select
              name="chargeType"
              value={formData.chargeType || undefined}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, chargeType: value }))
              }
            >
              <SelectTrigger className="pl-4 border border-[#243460]">
                <SelectValue placeholder="Select Charge Type" />
              </SelectTrigger>
              <SelectContent className="bg-white text-base text-gray-700">
                <SelectItem
                  value="Hourly"
                  className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm"
                >
                  Hourly
                </SelectItem>
                <SelectItem
                  value="Daily"
                  className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm"
                >
                  Daily
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Inputs */}
          <div className="grid grid-cols-2 gap-4">
  <div>
    <Label htmlFor="minPrice" className="text-sm font-medium">
      Min Price
    </Label>
    <Input
      id="minPrice"
      placeholder="0"
      value={formData.minPrice}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, minPrice: e.target.value }))
      }
    />
  </div>

  <div>
    <Label htmlFor="maxPrice" className="text-sm font-medium">
      Max Price
    </Label>
    <Input
      id="maxPrice"
      placeholder="0"
      value={formData.maxPrice}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, maxPrice: e.target.value }))
      }
    />
  </div>

  <div>
    <Label htmlFor="finalPrice" className="text-sm font-medium">
      Final Price
    </Label>
    <Input
      id="finalPrice"
      placeholder="0"
      value={formData.finalPrice}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, finalPrice: e.target.value }))
      }
    />
  </div>

  <div>
    <Label htmlFor="discount" className="text-sm font-medium">
      Discount (%)
    </Label>
    <Input
      id="discount"
      placeholder="0"
      value={formData.discount}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, discount: e.target.value }))
      }
    />
  </div>
</div>



          {/* Bed Count */}
          <div>
            <Label htmlFor="bedCount" className="text-sm font-medium">
              Number of Beds*
            </Label>
            <Input
  id="bedCount"
  type="number"
  placeholder="10"
  value={formData.bedCount || ""}
  onChange={(e) =>
    setFormData((prev) => ({ ...prev, bedCount: e.target.value }))
  }
/>
          </div>

          {/* Upload Images */}
          <div>
            {[1, 2, 3, 4].map((num) => (
              <div key={num}>
                <span className="text-sm font-medium">Upload Image {num}</span>
                <UploadButton
                  endpoint="fileUploader"
                  content={{
                    button({ ready }) {
                      return (
                        <div className="flex items-center gap-2">
                          {ready && (
                            <>
                              <Upload className="w-4 h-4" />
                              <span>Upload Image {num}</span>
                            </>
                          )}
                        </div>
                      );
                    },
                    allowedContent({ ready, fileTypes, isUploading }) {
                      if (!ready) return "Checking allowed files...";
                      if (isUploading) return "Uploading your files...";
                      return `Allowed file types: ${fileTypes.join(", ")}`;
                    },
                  }}
                  appearance={{
                    button:
                      "w-full h-10 bg-blue-600 hover:bg-blue-700 border-2 border-blue-700 text-white font-medium rounded-xl flex items-center justify-center cursor-pointer transition-colors",
                    container: "w-full",
                    allowedContent: "text-xs text-slate-500 mt-1",
                  }}
                  onClientUploadComplete={(res) => {
                    if (res.length > 0) {
                      setImages((prev) => ({
                        ...prev,
                        [`image${num}`]: res[0].url,
                      }));
                      console.log(`Image ${num} Upload Completed`);
                    }
                  }}
                  onUploadError={(error) => {
                    console.error(`ERROR! ${error.message}`);
                  }}
                />
              </div>
            ))}
          </div>

          {/* Government Scheme */}
          <div>
            <Label htmlFor="hasgovernmentschema" className="text-sm font-medium">
              Government Scheme
            </Label>
            <input
              type="checkbox"
              id="hasgovernmentschema"
              checked={formData.hasgovernmentschema}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  hasgovernmentschema: e.target.checked,
                }))
              }
              className="h-4 w-4 p-2 mx-4 mt-4"
            />
          </div>

          {formData.hasgovernmentschema && (
            <>
              <div>
                <Label htmlFor="schemes" className="text-sm font-medium">
                  Select Schemes
                </Label>
                <MultiSelectDropdown
                  className="pl-4 bg-white text-base text-black"
                  options={governmentSchemes.map((scheme) => ({
                    label: scheme,
                    value: scheme,
                  }))}
                  selectedValues={Array.isArray(formData.schema) ? formData.schema : []}
                  onChange={(selectedValues) =>
                    setFormData((prev) => ({ ...prev, schema: selectedValues }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="schemabedcounts" className="text-sm font-medium">
                  Scheme Bed Counts
                </Label>

                <Input
                  id="schemabedcounts"
                  type="number"
                  placeholder="Enter Bed Counts"
                  value={formData.schemabedcounts || ""}
                  onChange={(id, value) =>
                    setFormData((prev) => ({ ...prev, schemabedcounts: value }))
                  }
                />
              </div>
            </>
          )}

          <div className="!mt-6 text-center">
            <Button
              type="submit"
              className="w-full lg:w-full bg-[#5271FF] hover:bg-[#5271FF] px-5 py-1 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition"
            >
              {formData.id ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  </DialogContent>
</Dialog>

        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4">
          <SelectField
            label="Bed Type"
            id="name"
            value={filters.name || ""}
            onChange={handleFilterChange}
            options={bedTypeOptions}
          />
          <SelectField
            label="Status"
            id="status"
            value={filters.status || ""}
            onChange={handleFilterChange}
            options={statusOptions}
          />
          <InputField
            label="Min Price"
            id="minPrice"
            value={filters.minPrice || ""}
            onChange={handleFilterChange}
            placeholder="Enter Min Price"
          />
          <InputField
            label="Max Price"
            id="maxPrice"
            value={filters.maxPrice || ""}
            onChange={handleFilterChange}
            placeholder="Enter Max Price"
          />
          <DateFilter
            label="Created At"
            id="createdAt"
            selected={filters.createdAt || null}
            onChange={handleFilterChange}
          />
          {/* Add more filters as needed */}
        </div>

        {/* Recharts Visualization */}
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-center mb-4">
            Bed Status Overview
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="available" fill="#82ca9d" />
              <Bar dataKey="booked" fill="#8884d8" />
              <Bar dataKey="reserved" fill="#ffc658" />
              <Bar dataKey="outOfService" fill="#d0ed57" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Overview Stats */}
        {bedCategories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Total Beds
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {totalBeds}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Bed className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Available
                    </p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {totalAvailable}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-full">
                    <Activity className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Occupied
                    </p>
                    <p className="text-3xl font-bold text-rose-600">
                      {totalOccupied}
                    </p>
                  </div>
                  <div className="p-3 bg-rose-100 rounded-full">
                    <Users className="w-6 h-6 text-rose-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bed Categories */}
        {filteredBedCategories.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-slate-100 rounded-full mb-6">
                <Bed className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No bed categories yet
              </h3>
              <p className="text-slate-600 text-center mb-8 max-w-md">
                Create your first bed category to start managing hospital beds
                and track availability
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700   text-white rounded-xl shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Bed Category
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredBedCategories.map((category) => {
    const stats = getBedStats(category.id);
    const occupancyRate = getOccupancyRate(category.id);

    return (
      <Card
        key={category.id}
        className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-white to-slate-50"
      >
        <CardHeader className="bg-white/80 backdrop-blur-sm border-b border-slate-100/50 pb-6 space-y-6">
          <div className="flex flex-col gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Bed className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <Link
                    href={`/hospital/dashboard/beds/${category.id}`}
                    className="group"
                  >
                    <CardTitle className="text-xl text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                      {category.name.length > 24
                        ? category.name.slice(0, 24) + "..."
                        : category.name}
                    </CardTitle>
                  </Link>

                  <CardDescription className="flex items-center gap-4 mt-2 text-slate-600 flex-wrap">
                    {/* Charge Type */}
                    {category.chargeType && (
                      <span className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-full text-xs font-medium">
                        {category.chargeType === "Hourly" ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <Calendar className="w-3 h-3" />
                        )}
                        {category.chargeType}
                      </span>
                    )}

                    {/* Price Display */}
                    {category.minPrice && category.maxPrice && (
                      <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-100 rounded-full text-xs font-medium text-emerald-700">
                        <PiCurrencyInrBold className="w-3 h-3" />
                        {category.finalPrice ? (
                          <>
                            <span className="line-through text-gray-500">
                              ₹{category.minPrice} - ₹{category.maxPrice}
                            </span>
                            <span className="ml-1 text-green-700 font-semibold">
                              ₹{category.finalPrice}
                              {category.discount && ` (-${category.discount}%)`}
                            </span>
                          </>
                        ) : (
                          <>
                            ₹{category.minPrice} - ₹{category.maxPrice}
                          </>
                        )}
                      </span>
                    )}
                  </CardDescription>

                  {/* Government Schemes Display */}
                  {category.hasgovernmentschema &&
                    Array.isArray(category.schema) &&
                    category.schema.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs font-medium text-amber-700 mb-1">
                          Government Schemes Available:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {category.schema.map((scheme, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200"
                            >
                              {scheme.length > 25
                                ? `${scheme.slice(0, 25)}...`
                                : scheme}
                            </span>
                          ))}
                        </div>
                        {category.schemabedcounts && (
                          <div className="text-xs text-amber-600">
                            Scheme Beds: {category.schemabedcounts}
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="text-2xl font-bold text-emerald-600">
                  {stats.available}
                </div>
                <div className="text-xs text-emerald-700 font-medium">
                  Available
                </div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-2xl font-bold text-slate-700">
                  {stats.total}
                </div>
                <div className="text-xs text-slate-600 font-medium">Total</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                <div className="text-2xl font-bold text-blue-600">
                  {occupancyRate}%
                </div>
                <div className="text-xs text-blue-700 font-medium">Occupied</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="relative">
              <Progress
                value={occupancyRate}
                className="h-3 bg-slate-200 rounded-full overflow-hidden"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-500 to-rose-500 rounded-full opacity-20"></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>0% Occupancy</span>
              <span>100% Occupancy</span>
            </div>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-xl">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full shadow-sm"></div>
              <span className="text-emerald-700 font-medium">
                {stats.available} Available
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-rose-50 rounded-xl">
              <div className="w-3 h-3 bg-gradient-to-r from-rose-400 to-rose-500 rounded-full shadow-sm"></div>
              <span className="text-rose-700 font-medium">
                {stats.booked} Booked
              </span>
            </div>
            {stats.reserved > 0 && (
              <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-xl">
                <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-sm"></div>
                <span className="text-amber-700 font-medium">
                  {stats.reserved} Reserved
                </span>
              </div>
            )}
            {stats.outOfService > 0 && (
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl">
                <div className="w-3 h-3 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full shadow-sm"></div>
                <span className="text-slate-700 font-medium">
                  {stats.outOfService} Out of Service
                </span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>
    );
  })}
</div>

        )}
      </div>
    </div>
  );
}