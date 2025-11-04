"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, MapPin, Star, ChevronRight, Building2, Briefcase, Heart, Award, Users, Clock, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowCircleDown } from "react-icons/fa";

const WellnessPackageClient = ({
  packages,
  stateList,
  districtList,
  subdistrictList,
  patientCity,
  hospitalCategories,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [states] = React.useState(stateList);
  const [dist] = React.useState(districtList);
  const [subdist] = React.useState(subdistrictList);

  const [filteredDistricts, setFilteredDistricts] = React.useState([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = React.useState([]);

  const [member, setMember] = React.useState({
    state: "",
    district: "",
    taluka: "",
  });

  // Package name options
  const aaPackageOptions = [
    "Basic Diabetes Checkup",
    "Total Diabetes Checkup",
    "Basic Thyroid Checkup",
    "Basic Thyroid Checkup & Lipid Profile",
    "Infertility Comprehensive Panel - Women",
    "Complete Urine Analysis",
    "Basic Full Body Health Checkup",
    "Regular Full Body Health Checkup - Men",
    "Regular Full Body Health Checkup - Women",
    "Vital Organ Screening With Vitamin D",
    "Heart Risk Profile",
    "Basic Liver & Kidney Care",
  ];

  const [filters, setFilters] = useState({
    packageName: "",
    customPackageName: "",
    centerName: "",
    hospitalName: "",
    hospitalType: "",
    centerExperience: "",
    feeRange: "",
    stateName: "",
    cityName: patientCity || "", // Prefill with patient city
    pinCode: "",
    sortOrder: "default",
  });

  // Patient city state
  const [userCity, setUserCity] = useState("");
  const [showCityInput, setShowCityInput] = useState(!patientCity);
  const [activeCity, setActiveCity] = useState(patientCity || "");

  // Row expansion state
  const [expandedRows, setExpandedRows] = useState({
    row1: false,
    row2: false,
    row3: false,
    row4: false
  });

  useEffect(() => {
    // Prefill city filter with patient city
    if (patientCity) {
      setFilters(prev => ({ ...prev, cityName: patientCity }));
    }
  }, [patientCity]);

  const handleChange = (event) => {
    const { name, value } = event.target ?? event;

    if (name === "state") {
      const selectedState = stateList.find((s) => s.stateName === value);
      const filteredDistricts = districtList.filter(
        (d) => d.stateId === selectedState?.id
      );

      setFilteredDistricts(filteredDistricts);
      setFilteredSubDistricts([]);

      setMember((prev) => ({
        ...prev,
        state: selectedState?.stateName || "",
        district: "",
        taluka: "",
      }));
    } else if (name === "district") {
      const selectedDistrict = districtList.find((d) => d.district === value);
      const filteredSubdistricts = subdistrictList.filter(
        (sd) => sd.districtId === selectedDistrict?.id
      );

      setFilteredSubDistricts(filteredSubdistricts);

      setMember((prev) => ({
        ...prev,
        district: selectedDistrict?.district || "",
        taluka: "",
      }));
    } else if (name === "taluka") {
      setMember((prev) => ({
        ...prev,
        taluka: value
      }));
    } else {
      setMember((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Filter packages by city - only if city is specified
  const filterPackagesByCity = (packages, city) => {
    if (!city) return packages; // Return all packages if no city specified
    return packages.filter((pkg) => {
      const packageCity = pkg.Hospital?.hspcontact?.city || "";
      return packageCity.toLowerCase().includes(city.toLowerCase());
    });
  };

  // Apply filters and get packages for display
  const applyFiltersAndSort = useMemo(() => {
    let currentPackages = [...packages];
    
    console.log("Total packages:", packages.length);
    console.log("Current filters:", filters);

    // Apply individual filters only if they have values
    if (filters.packageName) {
      currentPackages = currentPackages.filter((pkg) =>
        pkg.aapackagename?.toLowerCase().includes(filters.packageName.toLowerCase())
      );
    }

    if (filters.customPackageName) {
      currentPackages = currentPackages.filter((pkg) =>
        pkg.aapackagename?.toLowerCase().includes(filters.customPackageName.toLowerCase())
      );
    }

    if (filters.centerName) {
      currentPackages = currentPackages.filter((pkg) =>
        pkg.Hospital?.hspInfo?.regname
          ?.toLowerCase()
          .includes(filters.centerName.toLowerCase())
      );
    }

    if (filters.hospitalName) {
      currentPackages = currentPackages.filter((pkg) =>
        pkg.Hospital?.hspInfo?.regname
          ?.toLowerCase()
          .includes(filters.hospitalName.toLowerCase())
      );
    }

    if (filters.hospitalType) {
      currentPackages = currentPackages.filter(
        (pkg) =>
          pkg.Hospital?.role?.toLowerCase() ===
          filters.hospitalType.toLowerCase()
      );
    }

    if (filters.centerExperience) {
      currentPackages = currentPackages.filter((pkg) => {
        const experience = Number.parseInt(pkg.Hospital?.hspInfo?.experience);
        if (isNaN(experience)) return false;
        if (filters.centerExperience === "0-5" && experience <= 5) return true;
        if (filters.centerExperience === "5-10" && experience > 5 && experience <= 10) return true;
        if (filters.centerExperience === "10+" && experience > 10) return true;
        if (filters.centerExperience === "any") return true;
        return false;
      });
    }

    if (filters.feeRange) {
      const [minStr, maxStr] = filters.feeRange.split("-");
      const minFee = Number.parseFloat(minStr);
      const maxFee = maxStr === "Infinity" ? Number.POSITIVE_INFINITY : Number.parseFloat(maxStr);

      currentPackages = currentPackages.filter((pkg) => {
        const price = Number.parseFloat(pkg.price || "0");
        return price >= minFee && price <= maxFee;
      });
    }

    if (filters.stateName) {
      currentPackages = currentPackages.filter(
        (pkg) =>
          pkg.Hospital?.hspcontact?.state?.toLowerCase() ===
          filters.stateName.toLowerCase()
      );
    }

    if (filters.cityName) {
      currentPackages = currentPackages.filter(
        (pkg) =>
          pkg.Hospital?.hspcontact?.city
            ?.toLowerCase()
            .includes(filters.cityName.toLowerCase())
      );
    }

    if (filters.pinCode) {
      currentPackages = currentPackages.filter(
        (pkg) =>
          pkg.Hospital?.hspcontact?.pincode?.includes(filters.pinCode)
      );
    }

    // Sorting
    currentPackages = [...currentPackages].sort((a, b) => {
      const priceA = Number.parseFloat(a.price || "0");
      const priceB = Number.parseFloat(b.price || "0");

      switch (filters.sortOrder) {
        case "price-low-to-high":
          return priceA - priceB;
        case "price-high-to-low":
          return priceB - priceA;
        case "popularity":
          return (b.bookingCount || 0) - (a.bookingCount || 0);
        case "experience":
          return (b.experience || 0) - (a.experience || 0);
        case "rating":
          return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        default:
          return 0;
      }
    });

    console.log("Final filtered packages:", currentPackages.length);
    return currentPackages;
  }, [packages, filters]);

  // Different rows based on sorting criteria
  const row1Packages = useMemo(() => {
    // Most booked wellness packages
    return [...applyFiltersAndSort].sort(
      (a, b) => (b.bookingCount || 0) - (a.bookingCount || 0)
    );
  }, [applyFiltersAndSort]);

  const row2Packages = useMemo(() => {
    // Based on price (low to high)
    return [...applyFiltersAndSort].sort((a, b) => {
      const priceA = Number.parseFloat(a.price || "0");
      const priceB = Number.parseFloat(b.price || "0");
      return priceA - priceB;
    });
  }, [applyFiltersAndSort]);

  const row3Packages = useMemo(() => {
    // Based on experience
    return [...applyFiltersAndSort].sort(
      (a, b) => (b.experience || 0) - (a.experience || 0)
    );
  }, [applyFiltersAndSort]);

  const row4Packages = useMemo(() => {
    // Based on reviews
    return [...applyFiltersAndSort].sort(
      (a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0)
    );
  }, [applyFiltersAndSort]);

  const handleSearchClick = () => {
    // Keep filters open after search
    // setShowFilters(false);
  };

  const handleResetFilters = () => {
    setFilters({
      packageName: "",
      customPackageName: "",
      centerName: "",
      hospitalName: "",
      hospitalType: "",
      centerExperience: "",
      feeRange: "",
      stateName: "",
      cityName: patientCity || "",
      pinCode: "",
      sortOrder: "default",
    });
    setMember({
      state: "",
      district: "",
      taluka: "",
    });
  };

  const toggleRowExpansion = (row) => {
    setExpandedRows(prev => ({
      ...prev,
      [row]: !prev[row]
    }));
  };

  // Package Card Component - Redesigned with hospital page style
  const PackageCard = ({ packageItem }) => (
    <Link href={`/pathology/hospital/${packageItem.hospitalId}/service/${packageItem.id}`}>
      <Card className="h-full min-h-[320px] flex flex-col overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl hover:translate-y-[-4px] group">
        <CardContent className="p-0 flex flex-col flex-grow justify-between">
          {/* Header with Status Badge */}
          <div className="relative">
            
            {/* Package Image and Basic Info */}
            <div className="bg-gradient-to-br from-[#1e40af]/10 to-[#10b981]/10 p-6 rounded-t-2xl">
              <div className="flex items-center gap-4">
                {packageItem.Hospital?.hspdetails?.hsplogo ? (
                  <div className="relative">
                    <Image
                      src={packageItem.Hospital.hspdetails.hsplogo}
                      width={80}
                      height={80}
                      alt={packageItem.aapackagename || "Package image"}
                      className="rounded-full h-20 w-20 object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-[#1e40af]/20 to-[#10b981]/30 border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg">
                    <Heart className="w-8 h-8" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">
                    {packageItem.aapackagename || "Healthcare Package"}
                  </h3>
                  <p className="text-[#1e40af] text-base font-semibold mb-2">
                    Wellness Package
                  </p>
                  
                  {/* Star Ratings */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="text-xs font-medium text-gray-700 ml-1">4.0</span>
                    </div>
                    <span className="text-xs text-gray-600">({packageItem.reviewsCount || 89} Reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Heart className="h-4 w-4 text-[#1e40af]" />
                <span>{packageItem.experience || "Not available"} years exp</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Star className="h-4 w-4 text-[#1e40af]" />
                <span className="truncate">{packageItem.hospitalBookingCount || 0} bookings</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4 text-[#1e40af] flex-shrink-0" />
              <span className="text-sm line-clamp-2">
                {packageItem.Hospital?.hspcontact?.city ? 
                  `${packageItem.Hospital.hspcontact.city}${packageItem.Hospital.hspcontact?.state ? `, ${packageItem.Hospital.hspcontact.state}` : ''}` : 
                  packageItem.Hospital?.hspcontact?.address || "Address not available"}
              </span>
            </div>

            {packageItem.Hospital?.hspInfo?.regname && (
              <div className="flex items-center gap-2 text-gray-700">
                <Building2 className="h-4 w-4 text-[#1e40af] flex-shrink-0" />
                <span className="text-sm truncate">{packageItem.Hospital.hspInfo.regname}</span>
              </div>
            )}

            {/* Price Section */}
            {(packageItem.price || packageItem.finalpackageprice) && (
              <div className="flex items-center gap-2 text-gray-700">
                <Briefcase className="h-4 w-4 text-[#1e40af] flex-shrink-0" />
                <div className="flex flex-col">
                  {packageItem.finalpackageprice && packageItem.finalpackageprice !== packageItem.price && (
                    <span className="text-xs text-gray-500 line-through">₹{packageItem.price}</span>
                  )}
                  <span className="text-sm font-semibold text-green-600">
                    ₹{packageItem.finalpackageprice || packageItem.price}
                  </span>
                  {packageItem.discount && (
                    <span className="text-xs text-green-600 font-medium">
                      {packageItem.discount}% OFF
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer with Actions - Fixed size */}
          <div className="px-6 pb-6 pt-2">
            <div className="flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] hover:from-[#3b82f6] hover:to-[#1e40af] text-white font-medium py-2.5 px-3 rounded-xl shadow-md transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-sm">
                <Star className="h-3 w-3" />
                Book Now
              </button>
              <button className="flex-1 bg-gradient-to-r from-[#059669] to-[#10b981] hover:from-[#10b981] hover:to-[#059669] text-white font-medium py-2.5 px-3 rounded-xl shadow-sm transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-sm">
                <Heart className="h-3 w-3" />
                View More
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
  

  // RowSection component - Redesigned with hospital page style
  const RowSection = ({ title, packages, rowKey, icon: Icon, description }) => {
    const displayPackages = expandedRows[rowKey] ? packages : packages.slice(0, 3);
    
    return (
      <div className="mb-12">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-br from-[#1e40af] to-[#10b981] rounded-xl">
              {Icon && <Icon className="h-5 w-5 text-white" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              {description && <p className="text-gray-600 mt-1">{description}</p>}
            </div>
          </div>
          {packages.length > 3 && (
            <button
              onClick={() => toggleRowExpansion(rowKey)}
              className="flex items-center gap-2 text-[#1e40af] font-semibold hover:text-[#10b981] transition-colors px-4 py-2 rounded-lg hover:bg-[#1e40af]/5"
            >
              {expandedRows[rowKey] ? "Show Less" : `View All (${packages.length})`}
              <ChevronRight className={`h-4 w-4 transition-transform ${expandedRows[rowKey] ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>

        {packages.length === 0 ? (
          <div className="flex justify-center items-center rounded-2xl bg-gradient-to-br from-[#1e40af]/5 to-[#10b981]/5 border border-[#1e40af]/20 p-8">
            <div className="text-center">
              <Heart className="h-12 w-12 text-[#1e40af] mx-auto mb-3" />
              <p className="text-[#1e40af] font-medium text-lg">
                No packages found in {activeCity || "your area"}
              </p>
              <p className="text-gray-600 mt-1">Please try changing your location or filters</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPackages.map((packageItem, index) => (
              <PackageCard key={index} packageItem={packageItem} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen px-8 bg-gradient-to-br from-[#1e40af]/5 via-white to-[#10b981]/5">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-[#1e40af] to-[#10b981] text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Heart className="h-6 w-6" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold">
                  Wellness Packages
                </h1>
              </div>
              <p className="text-white/90 text-lg">Find comprehensive wellness and health checkup packages</p>
              
              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-6 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-white/80 text-sm">Care</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-white/80 text-sm">Verified</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{applyFiltersAndSort.length}</div>
                  <div className="text-white/80 text-sm">Packages Found</div>
                </div>
              </div>
            </div>

            {/* Filter Button - Desktop */}
            <div className="flex justify-center lg:justify-end">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-3 bg-white text-[#1e40af] hover:bg-white/90 font-semibold px-6 py-3 rounded-xl shadow-lg transition-all"
              >
                <Filter size={20} />
                {showFilters ? "Hide Filters" : "Show Filters"}
                <Badge className="bg-[#10b981] text-white ml-1 min-w-[24px] h-6 flex items-center justify-center">
                  {Object.values(filters).filter(val => val !== "" && val !== patientCity).length}
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Filters Sidebar - Properly working sticky behavior */}
          <div className={`xl:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden xl:block'}`}>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-8 max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Filter Packages</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={handleResetFilters}
                    className="text-red-600 hover:text-red-700 p-0 h-6 font-medium text-sm"
                  >
                    Clear All
                  </Button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 text-gray-500 hover:text-gray-700 xl:hidden"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Search Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Packages</label>
                    <input
                      type="text"
                      className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all"
                      placeholder="Search packages/centers..."
                      value={filters.customPackageName}
                      onChange={(e) => handleFilterChange("customPackageName", e.target.value)}
                    />
                  </div>
                </div>

                {/* Package Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Package Name</label>
                  <select
                    name="packageName"
                    value={filters.packageName}
                    onChange={(e) => handleFilterChange("packageName", e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select Package</option>
                    {aaPackageOptions.map((pkg, index) => (
                      <option key={index} value={pkg}>
                        {pkg}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Center Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Center Name</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all"
                    placeholder="Enter Center Name"
                    value={filters.centerName}
                    onChange={(e) => handleFilterChange("centerName", e.target.value)}
                  />
                </div>

                {/* Hospital Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all"
                    placeholder="Enter Hospital Name"
                    value={filters.hospitalName}
                    onChange={(e) => handleFilterChange("hospitalName", e.target.value)}
                  />
                </div>

                {/* Hospital Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Type</label>
                  <select
                    name="hospitalType"
                    value={filters.hospitalType}
                    onChange={(e) => handleFilterChange("hospitalType", e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Hospital Type</option>
                    {hospitalCategories.map((category) => (
                      <option key={category.id} value={category.title}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Center Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Center Experience</label>
                  <select
                    name="centerExperience"
                    value={filters.centerExperience}
                    onChange={(e) => handleFilterChange("centerExperience", e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Center Experience</option>
                    <option value="any">Any Experience</option>
                    <option value="0-5">0-5 Years</option>
                    <option value="5-10">5-10 Years</option>
                    <option value="10+">10+ Years</option>
                  </select>
                </div>

                {/* Fee Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fee Range</label>
                  <select
                    name="feeRange"
                    value={filters.feeRange}
                    onChange={(e) => handleFilterChange("feeRange", e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Fee Range</option>
                    <option value="any">Any Fee</option>
                    <option value="0-1000">₹0 - ₹1000</option>
                    <option value="1001-3000">₹1001 - ₹3000</option>
                    <option value="3001-5000">₹3001 - ₹5000</option>
                    <option value="5001-Infinity">₹5001+</option>
                  </select>
                </div>

                {/* State Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <select
                    name="state"
                    value={member.state}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white"
                    required
                  >
                    <option value="">Select State</option>
                    {stateList.map((s) => (
                      <option key={s.id} value={s.stateName}>
                        {s.stateName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                  <select
                    name="district"
                    value={member.district}
                    onChange={handleChange}
                    disabled={!filteredDistricts.length}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white disabled:opacity-50"
                    required
                  >
                    <option value="">Select District</option>
                    {filteredDistricts.map((d) => (
                      <option key={d.id} value={d.district}>
                        {d.district}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Taluka Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Taluka</label>
                  <select
                    name="taluka"
                    value={member.taluka}
                    onChange={handleChange}
                    disabled={!filteredSubDistricts.length}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white disabled:opacity-50"
                    required
                  >
                    <option value="">Select Taluka</option>
                    {filteredSubDistricts.map((sd) => (
                      <option key={sd.id} value={sd.subDistrict}>
                        {sd.subDistrict}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all"
                    placeholder="Enter City Name"
                    value={filters.cityName}
                    onChange={(e) => handleFilterChange("cityName", e.target.value)}
                    required
                  />
                </div>

                {/* Pin Code Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all"
                    placeholder="Enter Pin Code"
                    value={filters.pinCode}
                    onChange={(e) => handleFilterChange("pinCode", e.target.value)}
                  />
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                  <select
                    name="sortOrder"
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="default">Default Sorting</option>
                    <option value="price-low-to-high">Price: Low to High</option>
                    <option value="price-high-to-low">Price: High to Low</option>
                    <option value="popularity">Most Popular</option>
                    <option value="experience">Most Experienced</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                <Button
                  onClick={handleSearchClick}
                  className="w-full bg-gradient-to-r from-[#1e40af] to-[#10b981] hover:from-[#10b981] hover:to-[#1e40af] text-white font-semibold py-3 rounded-xl shadow-lg transition-all transform hover:scale-105"
                >
                  Apply Filters
                </Button>
            </div>
          </div>
          </div>

          {/* Right Side: Package Cards */}
          <div className="flex-1 min-w-0">
            {row1Packages.length === 0 && row2Packages.length === 0 && row3Packages.length === 0 && row4Packages.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1e40af]/10 to-[#10b981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-[#1e40af]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No wellness packages found</h3>
                  <p className="text-gray-600 mb-4">
                    {Object.values(filters).some(val => val !== "" && val !== patientCity) 
                      ? "No wellness packages found matching your filters. Please adjust your search criteria."
                      : "No wellness packages available. Please try again later."
                    }
                  </p>
                  <Button
                    onClick={handleResetFilters}
                    className="bg-gradient-to-r from-[#1e40af] to-[#10b981] hover:from-[#10b981] hover:to-[#1e40af] text-white"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                {row1Packages.length > 0 && (
                  <RowSection 
                    title="Most Booked Wellness Packages" 
                    packages={row1Packages} 
                    rowKey="row1"
                    icon={Heart}
                    description="Based on bookings and patient satisfaction"
                  />
                )}
                {row2Packages.length > 0 && (
                  <RowSection 
                    title="Budget-Friendly Packages" 
                    packages={row2Packages} 
                    rowKey="row2"
                    icon={Award}
                    description="Affordable wellness and health checkup packages"
                  />
                )}
                {row3Packages.length > 0 && (
                  <RowSection 
                    title="Experienced Wellness Centers" 
                    packages={row3Packages} 
                    rowKey="row3"
                    icon={Users}
                    description="Centers with extensive experience in wellness care"
                  />
                )}
                {row4Packages.length > 0 && (
                  <RowSection 
                    title="Top Rated Wellness Centers" 
                    packages={row4Packages} 
                    rowKey="row4"
                    icon={Star}
                    description="Highest rated wellness centers by patients"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessPackageClient;