"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, X, Star, ChevronRight, MapPin, Building2, Briefcase, Heart, Award, Users, Clock, Droplets } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowCircleDown } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const BloodBankMainClient = ({
  bloodBanks,
  stateList,
  districtList,
  subdistrictList,
  patientId,
  patientCity,
  hospitalCategories,
}) => {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(true);

  const [filteredDistricts, setFilteredDistricts] = React.useState([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = React.useState([]);

  const [member, setMember] = React.useState({
    state: "",
    district: "",
    taluka: "",
  });

  const [filters, setFilters] = useState({
    bloodBankName: "",
    hospitalName: "",
    hospitalType: "",
    centerExperience: "",
    stateName: "",
    cityName: patientCity || "",
    pinCode: "",
    sortOrder: "default",
    available: "any",
  });

  // Patient city state
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
    if (key === "cityName" && value === "") {
      setActiveCity(""); // Reset activeCity when cityName is cleared
    }
  };

  // Filter blood banks by city - only if city is specified
  const filterBloodBanksByCity = (bloodBanks, city) => {
    if (!city) return bloodBanks; // Return all blood banks if no city specified
    return bloodBanks.filter((bank) => {
      const bankCity = bank.Hospital?.hspcontact?.city || "";
      return bankCity.toLowerCase().includes(city.toLowerCase());
    });
  };


  // Apply filters and get blood banks for display
  const applyFiltersAndSort = useMemo(() => {
    let currentBloodBanks = [...bloodBanks];
    // Filter by patient city first
    currentBloodBanks = filterBloodBanksByCity(currentBloodBanks, activeCity);

    // Filter by blood bank name
    if (filters.bloodBankName) {
      currentBloodBanks = currentBloodBanks.filter((bank) =>
        bank.bloodname?.toLowerCase().includes(filters.bloodBankName.toLowerCase())
      );
    }

    // Filter by hospital name
    if (filters.hospitalName) {
      currentBloodBanks = currentBloodBanks.filter((bank) =>
        bank.Hospital?.hspInfo?.regname
          ?.toLowerCase()
          .includes(filters.hospitalName.toLowerCase())
      );
    }

    // Filter by hospital type
    if (filters.hospitalType) {
      currentBloodBanks = currentBloodBanks.filter(
        (bank) =>
          bank.Hospital?.role?.toLowerCase() ===
          filters.hospitalType.toLowerCase()
      );
    }

    // Filter by center experience
    if (filters.centerExperience) {
      currentBloodBanks = currentBloodBanks.filter((bank) => {
        const experience = Number.parseInt(bank.Hospital?.hspInfo?.experience);
        if (isNaN(experience)) return false;
        if (filters.centerExperience === "0-5" && experience <= 5) return true;
        if (filters.centerExperience === "5-10" && experience > 5 && experience <= 10) return true;
        if (filters.centerExperience === "10+" && experience > 10) return true;
        if (filters.centerExperience === "any") return true;
        return false;
      });
    }

    // Filter by state
    if (filters.stateName) {
      currentBloodBanks = currentBloodBanks.filter(
        (bank) =>
          bank.Hospital?.hspcontact?.state?.toLowerCase() ===
          filters.stateName.toLowerCase()
      );
    }

    // Filter by city (from filter, not patient city)
    if (filters.cityName) {
      currentBloodBanks = currentBloodBanks.filter(
        (bank) =>
          bank.Hospital?.hspcontact?.city
            ?.toLowerCase()
            .includes(filters.cityName.toLowerCase())
      );
    }

    // Filter by pin code
    if (filters.pinCode) {
      currentBloodBanks = currentBloodBanks.filter(
        (bank) =>
          bank.Hospital?.hspcontact?.pincode?.includes(filters.pinCode)
      );
    }

    // Filter by availability
    if (filters.available !== "any") {
      const availableFilter = filters.available === "available";
      currentBloodBanks = currentBloodBanks.filter((bank) => bank.available === availableFilter);
    }

    // Sorting
    currentBloodBanks = [...currentBloodBanks].sort((a, b) => {
      switch (filters.sortOrder) {
        case "name-a-z":
          return (a.bloodname || "").localeCompare(b.bloodname || "");
        case "name-z-a":
          return (b.bloodname || "").localeCompare(a.bloodname || "");
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

    return currentBloodBanks;
  }, [bloodBanks, activeCity, filters]);

  // Different rows based on sorting criteria
  const row1BloodBanks = useMemo(() => {
    // Most booked blood banks
    return [...applyFiltersAndSort].sort(
      (a, b) => (b.bookingCount || 0) - (a.bookingCount || 0)
    );
  }, [applyFiltersAndSort]);

  const row2BloodBanks = useMemo(() => {
    // Based on experience
    return [...applyFiltersAndSort].sort(
      (a, b) => (b.experience || 0) - (a.experience || 0)
    );
  }, [applyFiltersAndSort]);

  const row3BloodBanks = useMemo(() => {
    // Based on reviews
    return [...applyFiltersAndSort].sort(
      (a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0)
    );
  }, [applyFiltersAndSort]);

  const row4BloodBanks = useMemo(() => {
    // Alphabetical order
    return [...applyFiltersAndSort].sort((a, b) =>
      (a.bloodname || "").localeCompare(b.bloodname || "")
    );
  }, [applyFiltersAndSort]);

  const row5BloodBanks = useMemo(() => {
    // Based on price (low to high)
    return [...applyFiltersAndSort].sort((a, b) => {
      const priceA = Number.parseFloat(a.finalprice || a.price || "0");
      const priceB = Number.parseFloat(b.finalprice || b.price || "0");
      return priceA - priceB;
    });
  }, [applyFiltersAndSort]);

  const handleSearchClick = () => {
    // Don't close filters automatically - let user manually close them
    // setShowFilters(false);
  };

  const handleResetFilters = () => {
    setFilters({
      bloodBankName: "",
      hospitalName: "",
      hospitalType: "",
      centerExperience: "",
      stateName: "",
      cityName: patientCity || "",
      pinCode: "",
      sortOrder: "default",
      available: "any",
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

  // Blood Bank Card Component - Redesigned with hospital page style
  const BloodBankCard = ({ bank }) => (
    <Link href={`/pathology/hospital/${bank.hospitalId}/service/${bank.id}`}>
      <Card className="h-full min-h-[320px] flex flex-col overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl hover:translate-y-[-4px] group">
        <CardContent className="p-0 flex flex-col flex-grow justify-between">
          {/* Header with Status Badge */}
          <div className="relative">
            
            {/* Blood Bank Image and Basic Info */}
            <div className="bg-gradient-to-br from-[#1e40af]/10 to-[#10b981]/10 p-6 rounded-t-2xl">
              <div className="flex items-center gap-4">
                {bank.Hospital?.hspdetails?.hsplogo ? (
                  <div className="relative">
                    <Image
                      src={bank.Hospital.hspdetails.hsplogo}
                      width={80}
                      height={80}
                      alt={bank.bloodname || "Blood Bank image"}
                      className="rounded-full h-20 w-20 object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-[#1e40af]/20 to-[#10b981]/30 border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg">
                    <Droplets className="w-8 h-8" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">
                    {bank.bloodname || "Blood Bank"}
                  </h3>
                  <p className="text-[#1e40af] text-base font-semibold mb-2">
                    Blood Bank
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
                    <span className="text-xs text-gray-600">({bank.reviewsCount || 0} Reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Droplets className="h-4 w-4 text-[#1e40af]" />
                <span>{bank.experience || "Not available"} years exp</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Star className="h-4 w-4 text-[#1e40af]" />
                <span className="truncate">{bank.bookingCount || 0} bookings</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4 text-[#1e40af] flex-shrink-0" />
              <span className="text-sm line-clamp-2">
                {bank.Hospital?.hspcontact?.city ? 
                  `${bank.Hospital.hspcontact.city}${bank.Hospital.hspcontact?.state ? `, ${bank.Hospital.hspcontact.state}` : ''}` : 
                  bank.Hospital?.hspcontact?.address || "Address not available"}
              </span>
            </div>

            {bank.Hospital?.hspInfo?.regname && (
              <div className="flex items-center gap-2 text-gray-700">
                <Building2 className="h-4 w-4 text-[#1e40af] flex-shrink-0" />
                <span className="text-sm truncate">{bank.Hospital.hspInfo.regname}</span>
              </div>
            )}

            {/* Price Section */}
            {(bank.price || bank.finalprice) && (
              <div className="flex items-center gap-2 text-gray-700">
                <Briefcase className="h-4 w-4 text-[#1e40af] flex-shrink-0" />
                <div className="flex flex-col">
                  {bank.finalprice && bank.finalprice !== bank.price && (
                    <span className="text-xs text-gray-500 line-through">₹{bank.price}</span>
                  )}
                  <span className="text-sm font-semibold text-green-600">
                    ₹{bank.finalprice || bank.price}
                  </span>
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
                <Droplets className="h-3 w-3" />
                View More
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );


  // RowSection component - Redesigned with hospital page style
  const RowSection = ({ title, bloodBanks, rowKey, icon: Icon, description }) => {
    const displayBloodBanks = expandedRows[rowKey] ? bloodBanks : bloodBanks.slice(0, 3);
    
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
          {bloodBanks.length > 3 && (
            <button
              onClick={() => toggleRowExpansion(rowKey)}
              className="flex items-center gap-2 text-[#1e40af] font-semibold hover:text-[#10b981] transition-colors px-4 py-2 rounded-lg hover:bg-[#1e40af]/5"
            >
              {expandedRows[rowKey] ? "Show Less" : `View All (${bloodBanks.length})`}
              <ChevronRight className={`h-4 w-4 transition-transform ${expandedRows[rowKey] ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>

        {bloodBanks.length === 0 ? (
          <div className="flex justify-center items-center rounded-2xl bg-gradient-to-br from-[#1e40af]/5 to-[#10b981]/5 border border-[#1e40af]/20 p-8">
            <div className="text-center">
              <Droplets className="h-12 w-12 text-[#1e40af] mx-auto mb-3" />
              <p className="text-[#1e40af] font-medium text-lg">
                No blood banks found in {activeCity || "your area"}
              </p>
              <p className="text-gray-600 mt-1">Please try changing your location or filters</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayBloodBanks.map((bank, index) => (
              <BloodBankCard key={index} bank={bank} />
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
                  <Droplets className="h-6 w-6" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold">
                  Blood Banks
                </h1>
              </div>
              <p className="text-white/90 text-lg">Find trusted blood banks and blood donation centers</p>
              
              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-6 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-white/80 text-sm">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-white/80 text-sm">Safe</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{applyFiltersAndSort.length}</div>
                  <div className="text-white/80 text-sm">Banks Found</div>
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
                <h3 className="text-xl font-bold text-gray-800">Filter Blood Banks</h3>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Blood Banks</label>
                    <input
                      type="text"
                      className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all"
                      placeholder="Search blood banks/hospitals..."
                      value={filters.bloodBankName}
                      onChange={(e) => handleFilterChange("bloodBankName", e.target.value)}
                    />
                  </div>
                </div>

                {/* Blood Bank Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blood Bank Name</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all"
                    placeholder="Enter blood bank name..."
                    value={filters.bloodBankName}
                    onChange={(e) => handleFilterChange("bloodBankName", e.target.value)}
                  />
                </div>

                {/* Hospital Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all"
                    placeholder="Enter hospital name..."
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

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <select
                    name="centerExperience"
                    value={filters.centerExperience}
                    onChange={(e) => handleFilterChange("centerExperience", e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Experience</option>
                    <option value="any">Any Experience</option>
                    <option value="0-5">0-5 Years</option>
                    <option value="5-10">5-10 Years</option>
                    <option value="10+">10+ Years</option>
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select
                    name="available"
                    value={filters.available}
                    onChange={(e) => handleFilterChange("available", e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="any">Availability: Any</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
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
                    <option value="name-a-z">Name: A to Z</option>
                    <option value="name-z-a">Name: Z to A</option>
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

          {/* Right Side: Blood Bank Cards */}
          <div className="flex-1 min-w-0">
            {/* Results Summary */}
            {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {applyFiltersAndSort.length} Blood Banks Found
                  </h3>
                  {(filters.cityName || Object.values(filters).some(val => val !== "" && val !== patientCity)) && activeCity && (
                    <p className="text-gray-600 text-sm mt-1">
                      in {activeCity}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(filters).map(([key, value]) => 
                    value && key !== 'cityName' && (
                      <Badge key={key} variant="secondary" className="bg-[#1E3EA0]/10 text-[#1E3EA0]">
                        {value}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            </div> */}

            {/* Blood Bank Lists */}
            {row1BloodBanks.length === 0 && row2BloodBanks.length === 0 && row3BloodBanks.length === 0 && row4BloodBanks.length === 0 && row5BloodBanks.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1e40af]/10 to-[#10b981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Droplets className="h-8 w-8 text-[#1e40af]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No blood banks found</h3>
                  <p className="text-gray-600 mb-4">
                    No blood banks found in {activeCity || "your area"}. Please try changing your filters or location.
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
                {row1BloodBanks.length > 0 && (
                  <RowSection 
                    title="Most Booked Blood Banks" 
                    bloodBanks={row1BloodBanks} 
                    rowKey="row1"
                    icon={Heart}
                    description="Based on bookings and patient satisfaction"
                  />
                )}
                {row5BloodBanks.length > 0 && (
                  <RowSection 
                    title="Premium Blood Banks" 
                    bloodBanks={row5BloodBanks} 
                    rowKey="row5"
                    icon={Award}
                    description="Premium blood banks with advanced facilities"
                  />
                )}
                {row2BloodBanks.length > 0 && (
                  <RowSection 
                    title="Experienced Blood Banks" 
                    bloodBanks={row2BloodBanks} 
                    rowKey="row2"
                    icon={Users}
                    description="Blood banks with extensive experience"
                  />
                )}
                {row3BloodBanks.length > 0 && (
                  <RowSection 
                    title="Top Rated Blood Banks" 
                    bloodBanks={row3BloodBanks} 
                    rowKey="row3"
                    icon={Star}
                    description="Highest rated blood banks by patients"
                  />
                )}
                {row4BloodBanks.length > 0 && (
                  <RowSection 
                    title="Blood Banks A-Z" 
                    bloodBanks={row4BloodBanks} 
                    rowKey="row4"
                    icon={Droplets}
                    description="All blood banks in alphabetical order"
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

export default BloodBankMainClient;