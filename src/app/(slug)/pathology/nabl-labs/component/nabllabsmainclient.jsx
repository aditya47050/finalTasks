"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Star, ChevronRight, MapPin, Building2, Briefcase } from "lucide-react";
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

const NablLabsMainClient = ({
  nablLabs,
  stateList,
  districtList,
  subdistrictList,
  patientId,
  patientCity,
  hospitalCategories,
}) => {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);

  const [filteredDistricts, setFilteredDistricts] = React.useState([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = React.useState([]);

  const [member, setMember] = React.useState({
    state: "",
    district: "",
    taluka: "",
  });

  const [filters, setFilters] = useState({
    testName: "",
    hospitalName: "",
    hospitalType: "",
    centerExperience: "",
    feeRange: "",
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

  // Filter NABL labs by city - only if city is specified
  const filterNablLabsByCity = (labs, city) => {
    if (!city) return labs; // Return all labs if no city specified
    return labs.filter((lab) => {
      const labCity = lab.Hospital?.hspcontact?.city || "";
      return labCity.toLowerCase().includes(city.toLowerCase());
    });
  };

  // Apply filters and get NABL labs for display
  const applyFiltersAndSort = useMemo(() => {
    let currentLabs = [...nablLabs];
    // Filter by patient city first
    currentLabs = filterNablLabsByCity(currentLabs, activeCity);

    // Filter by test name
    if (filters.testName) {
      currentLabs = currentLabs.filter((lab) =>
        lab.testname?.toLowerCase().includes(filters.testName.toLowerCase())
      );
    }

    // Filter by hospital name
    if (filters.hospitalName) {
      currentLabs = currentLabs.filter((lab) =>
        lab.Hospital?.hspInfo?.regname
          ?.toLowerCase()
          .includes(filters.hospitalName.toLowerCase())
      );
    }

    // Filter by hospital type
    if (filters.hospitalType) {
      currentLabs = currentLabs.filter(
        (lab) =>
          lab.Hospital?.role?.toLowerCase() ===
          filters.hospitalType.toLowerCase()
      );
    }

    // Filter by center experience
    if (filters.centerExperience) {
      currentLabs = currentLabs.filter((lab) => {
        const experience = Number.parseInt(lab.Hospital?.hspInfo?.experience);
        if (isNaN(experience)) return false;
        if (filters.centerExperience === "0-5" && experience <= 5) return true;
        if (filters.centerExperience === "5-10" && experience > 5 && experience <= 10) return true;
        if (filters.centerExperience === "10+" && experience > 10) return true;
        if (filters.centerExperience === "any") return true;
        return false;
      });
    }

    // Filter by fee range
    if (filters.feeRange) {
      const [minStr, maxStr] = filters.feeRange.split("-");
      const minFee = Number.parseFloat(minStr);
      const maxFee = maxStr === "Infinity" ? Number.POSITIVE_INFINITY : Number.parseFloat(maxStr);

      currentLabs = currentLabs.filter((lab) => {
        const price = Number.parseFloat(lab.finalprice || lab.price || "0");
        return price >= minFee && price <= maxFee;
      });
    }

    // Filter by state
    if (filters.stateName) {
      currentLabs = currentLabs.filter(
        (lab) =>
          lab.Hospital?.hspcontact?.state?.toLowerCase() ===
          filters.stateName.toLowerCase()
      );
    }

    // Filter by city (from filter, not patient city)
    if (filters.cityName) {
      currentLabs = currentLabs.filter(
        (lab) =>
          lab.Hospital?.hspcontact?.city
            ?.toLowerCase()
            .includes(filters.cityName.toLowerCase())
      );
    }

    // Filter by pin code
    if (filters.pinCode) {
      currentLabs = currentLabs.filter(
        (lab) =>
          lab.Hospital?.hspcontact?.pincode?.includes(filters.pinCode)
      );
    }

    // Filter by availability
    if (filters.available !== "any") {
      const availableFilter = filters.available === "available";
      currentLabs = currentLabs.filter((lab) => lab.available === availableFilter);
    }

    // Sorting
    currentLabs = [...currentLabs].sort((a, b) => {
      const priceA = Number.parseFloat(a.finalprice || a.price || "0");
      const priceB = Number.parseFloat(b.finalprice || b.price || "0");

      switch (filters.sortOrder) {
        case "price-low-to-high":
          return priceA - priceB;
        case "price-high-to-low":
          return priceB - priceA;
        case "name-a-z":
          return (a.testname || "").localeCompare(b.testname || "");
        case "name-z-a":
          return (b.testname || "").localeCompare(a.testname || "");
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

    return currentLabs;
  }, [nablLabs, activeCity, filters]);

  // Different rows based on sorting criteria
  const row1Labs = useMemo(() => {
    // Most booked NABL labs
    return [...applyFiltersAndSort].sort(
      (a, b) => (b.bookingCount || 0) - (a.bookingCount || 0)
    );
  }, [applyFiltersAndSort]);

  const row2Labs = useMemo(() => {
    // Based on price (low to high)
    return [...applyFiltersAndSort].sort((a, b) => {
      const priceA = Number.parseFloat(a.finalprice || a.price || "0");
      const priceB = Number.parseFloat(b.finalprice || b.price || "0");
      return priceA - priceB;
    });
  }, [applyFiltersAndSort]);

  const row3Labs = useMemo(() => {
    // Based on experience
    return [...applyFiltersAndSort].sort(
      (a, b) => (b.experience || 0) - (a.experience || 0)
    );
  }, [applyFiltersAndSort]);

  const row4Labs = useMemo(() => {
    // Based on reviews
    return [...applyFiltersAndSort].sort(
      (a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0)
    );
  }, [applyFiltersAndSort]);

  const handleSearchClick = () => {
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setFilters({
      testName: "",
      hospitalName: "",
      hospitalType: "",
      centerExperience: "",
      feeRange: "",
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

  // NABL Lab Card Component
  const NablLabCard = ({ lab }) => (
    <Card className="h-full min-h-[280px] flex flex-col overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white rounded-3xl">
      {/* Header Section with Gradient Background */}
      <div className="relative w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#5271FF] to-[#8b5cf6] rounded-t-3xl py-4">
        {lab.Hospital?.hspdetails?.hsplogo ? (
          <Image
            src={lab.Hospital.hspdetails.hsplogo}
            width={120}
            height={120}
            alt={lab.Hospital?.hspInfo?.regname || "Hospital"}
            className="rounded-full h-20 w-20 object-cover border-2 border-[#ff5e00]"
          />
        ) : (
          <div className="w-20 h-20 bg-white border-4 border-[#ffce38] rounded-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
  
        {/* Availability Badge */}
        <div className="absolute top-2 right-2">
          <Badge
            className={`${
              lab.available ? "bg-green-500" : "bg-red-500"
            } text-white px-2 py-1 rounded-full font-semibold text-xs`}
          >
            {lab.available ? "Available" : "Unavailable"}
          </Badge>
        </div>
  
        {/* NABL Badge */}
        {lab.nabl && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
              NABL
            </Badge>
          </div>
        )}
  
        {/* Ratings */}
        <div className="flex flex-col items-center justify-center gap-2 mt-3">
          <div className="flex shadow-lg rounded-xl items-center gap-1 p-1 bg-white">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < (lab.rating || 4) ? "text-[#ffce38]" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-[12px] font-medium text-white">
            ({lab.reviewsCount || 0} Reviews)
          </p>
        </div>
      </div>
  
      {/* Content Section */}
      <CardContent className="flex flex-col items-center text-center xs:px-1 md:px-4 pt-2 pb-4">
        {/* Test Name */}
        <p className="text-[#ff5e00] text-[16px] font-bold">{lab.testname}</p>
        <p className="text-gray-500 text-xs">{lab.type}</p>
  
        {/* Price */}
        {(lab.price || lab.finalprice) && (
          <div className="mt-2 text-[#243460] text-[12px] font-semibold flex flex-col items-center">
            <span className="font-semibold">Test Price</span>
            <div className="flex items-center gap-2">
              {lab.finalprice && lab.finalprice !== lab.price ? (
                <>
                  <span className="text-green-600">₹{lab.finalprice}</span>
                  <span className="text-gray-400 line-through">₹{lab.price}</span>
                  {lab.discount && (
                    <span className="text-red-500 text-xs">
                      ({lab.discount} off)
                    </span>
                  )}
                </>
              ) : (
                <span>₹{lab.price || "?"}</span>
              )}
            </div>
          </div>
        )}
  
        {/* Hospital Info */}
        <div className="mt-2 flex flex-col items-center space-y-1">
          {lab.Hospital?.hspInfo?.regname && (
            <p className="text-[#243460] text-[12px] font-semibold flex items-center gap-1">
              <Building2 className="h-4 w-4 text-[#243460]" />
              {lab.Hospital.hspInfo.regname}
            </p>
          )}
  
          {lab.experience !== undefined && (
            <p className="text-[#243460] text-[12px] font-semibold flex items-center gap-1">
              <Briefcase className="h-4 w-4 text-[#243460]" />
              {lab.experience} years exp
            </p>
          )}
  
          {lab.Hospital?.hspcontact && (
            <p className="text-[#243460] text-[12px] font-semibold flex items-center gap-1 max-w-full xs:text-start md:text-center">
              <MapPin className="h-4 w-4 text-[#243460] shrink-0" />
              <span className="line-clamp-1">
                {[
                  lab.Hospital.hspcontact.city,
                  lab.Hospital.hspcontact.taluka,
                  lab.Hospital.hspcontact.dist,
                  lab.Hospital.hspcontact.state,
                ]
                  .filter(Boolean)
                  .join(", ") || "Address not available"}
              </span>
            </p>
          )}
        </div>
  
        {/* Stats */}
        <div className="mt-2 flex flex-col items-center space-y-1">
          <p className="text-[#243460] text-[12px] font-semibold">
            Bookings: {lab.bookingCount || 0}
          </p>
        </div>
  
        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-4 w-full">
          <Button className="bg-[#FF3131] hover:bg-red-600 text-white xs:text-[10px] md:text-xs py-1.5 xs:px-3 md:px-5 rounded-full shadow-md transition-all">
            Call Us
          </Button>
          <Link
            href={`/pathology/hospital/${lab.hospitalId}/service/${lab.id}`}
          >
            <Button className="bg-[#5271FF] hover:bg-blue-700 text-white xs:text-[10px] md:text-xs py-1.5 xs:px-3 md:px-5 rounded-full shadow-md transition-all">
              View More
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  // RowSection component (Reusable for all rows)
  const RowSection = ({ title, labs, rowKey }) => {
    const displayLabs = expandedRows[rowKey] ? labs : labs.slice(0, 3);

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#5271FF]">{title}</h2>
          {labs.length > 3 && (
            <button
              onClick={() => toggleRowExpansion(rowKey)}
              className="flex items-center text-[#5271FF] font-medium"
            >
              {expandedRows[rowKey] ? "Show Less" : "View All"} <ChevronRight className="ml-1" />
            </button>
          )}
        </div>

        {labs.length === 0 ? (
          <div className="flex justify-center rounded-xl">
            <p className="text-[#5271FF] p-4 border-[#243460] border rounded-xl font-bold text-center text-lg">
              {activeCity ? `No NABL labs found in ${activeCity}` : "No NABL labs found"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayLabs.map((lab, index) => (
              <NablLabCard key={index} lab={lab} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto relative pl-2 lg:px-[32px] font-poppins min-h-screen pt-1 mb-5">
      {/* City Selection - Only show if no patient city from session */}
      <div className="flex justify-end items-center text-center pt-1 w-full">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className="hidden md:flex items-center gap-2 border rounded-full border-blue-600 text-blue-600"
        >
          <Filter size={16} />
          All Filters
          <Badge className="bg-blue-600 !text-white ml-1">12</Badge>
        </Button>
      </div>

      <div className="w-full gap-4 mt-2 lg:flex">
        {showFilters && (
          <div className={`xs:w-[70%] md:w-full xs:absolute xs:z-10 md:z-0 xs:top-20 xs:left-[15%] md:top-0 md:left-0 md:sticky lg:w-1/4 lg:block`}>
            <div className="p-4 bg-[#D9D9D9] rounded-xl mb-2">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-[#243460]">All Filters</span>
                <Button
                  variant="ghost"
                  className="text-red-600 p-0 h-6"
                  onClick={handleResetFilters}
                >
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div className="mb-2 relative">
                  <Input
                    type="text"
                    className="w-full h-10 p-2 border-none text-white bg-[#5271FF] rounded-full placeholder:text-white placeholder:text-[14px]"
                    placeholder="Search Test Name"
                    value={filters.testName}
                    onChange={(e) => handleFilterChange("testName", e.target.value)}
                  />
                </div>

                <div className="mb-2 relative">
                  <Input
                    type="text"
                    className="w-full h-10 p-2 border-none text-white bg-[#5271FF] rounded-full placeholder:text-white placeholder:text-[14px]"
                    placeholder="Enter Hospital Name"
                    value={filters.hospitalName}
                    onChange={(e) => handleFilterChange("hospitalName", e.target.value)}
                  />
                </div>

                <div className="mb-2 relative">
  <select
    name="hospitalType"
    value={filters.hospitalType}
    onChange={(e) => handleFilterChange("hospitalType", e.target.value)}
    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
  >
    <option value="" className="bg-gray-50 text-[#453565]">Hospital Type</option>
    {hospitalCategories.map((category) => (
      <option key={category.id} value={category.title} className="bg-gray-50 text-[#453565]">
        {category.title}
      </option>
    ))}
  </select>
  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
    <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
  </span>
</div>

                <div className="mb-2 relative">
                  <select
                    name="centerExperience"
                    value={filters.centerExperience}
                    onChange={(e) => handleFilterChange("centerExperience", e.target.value)}
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                  >
                    <option value="" className="bg-gray-50 text-[#453565]">Center Experience</option>
                    <option value="any" className="bg-gray-50 text-[#453565]">Any Experience</option>
                    <option value="0-5" className="bg-gray-50 text-[#453565]">0-5 Years</option>
                    <option value="5-10" className="bg-gray-50 text-[#453565]">5-10 Years</option>
                    <option value="10+" className="bg-gray-50 text-[#453565]">10+ Years</option>
                  </select>
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                  </span>
                </div>

                <div className="mb-2 relative">
                  <select
                    name="feeRange"
                    value={filters.feeRange}
                    onChange={(e) => handleFilterChange("feeRange", e.target.value)}
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                  >
                    <option value="" className="bg-gray-50 text-[#453565]">Fee Range</option>
                    <option value="any" className="bg-gray-50 text-[#453565]">Any Fee</option>
                    <option value="0-500" className="bg-gray-50 text-[#453565]">₹0 - ₹500</option>
                    <option value="501-1000" className="bg-gray-50 text-[#453565]">₹501 - ₹1000</option>
                    <option value="1001-2000" className="bg-gray-50 text-[#453565]">₹1001 - ₹2000</option>
                    <option value="2001-Infinity" className="bg-gray-50 text-[#453565]">₹2001+</option>
                  </select>
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                  </span>
                </div>

                <div className="mb-2 relative">
                  <select
                    name="available"
                    value={filters.available}
                    onChange={(e) => handleFilterChange("available", e.target.value)}
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                  >
                    <option value="any" className="bg-gray-50 text-[#453565]">Availability: Any</option>
                    <option value="available" className="bg-gray-50 text-[#453565]">Available</option>
                    <option value="unavailable" className="bg-gray-50 text-[#453565]">Unavailable</option>
                  </select>
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                  </span>
                </div>

                <div className="mb-2 relative">
                  <select
                    name="state"
                    value={member.state}
                    onChange={handleChange}
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                  >
                    <option value="" className="bg-gray-50 text-[#453565]">Select State</option>
                    {stateList.map((s) => (
                      <option key={s.id} value={s.stateName} className="bg-gray-50 text-[#453565]">
                        {s.stateName}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                  </span>
                </div>

                <div className="mb-2 relative">
                  <select
                    name="district"
                    value={member.district}
                    onChange={handleChange}
                    disabled={!filteredDistricts.length}
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none disabled:opacity-50"
                  >
                    <option value="" className="bg-gray-50 text-[#453565]">Select District</option>
                    {filteredDistricts.map((d) => (
                      <option key={d.id} value={d.district} className="bg-gray-50 text-[#453565]">
                        {d.district}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                  </span>
                </div>

                <div className="mb-2 relative">
                  <select
                    name="taluka"
                    value={member.taluka}
                    onChange={handleChange}
                    disabled={!filteredSubDistricts.length}
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none disabled:opacity-50"
                  >
                    <option value="" className="bg-gray-50 text-[#453565]">Select Taluka</option>
                    {filteredSubDistricts.map((sd) => (
                      <option key={sd.id} value={sd.subDistrict} className="bg-gray-50 text-[#453565]">
                        {sd.subDistrict}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                  </span>
                </div>

                <div className="mb-2 relative">
                  <Input
                    type="text"
                    className="w-full h-10 p-2 border-none text-white bg-[#5271FF] rounded-full placeholder:text-white placeholder:text-[14px]"
                    placeholder="Enter City Name"
                    value={filters.cityName}
                    onChange={(e) => handleFilterChange("cityName", e.target.value)}
                  />
                </div>

                <div className="mb-2 relative">
                  <Input
                    type="text"
                    className="w-full h-10 p-2 border-none text-white bg-[#5271FF] rounded-full placeholder:text-white placeholder:text-[14px]"
                    placeholder="Enter Pin Code"
                    value={filters.pinCode}
                    onChange={(e) => handleFilterChange("pinCode", e.target.value)}
                  />
                </div>

                <div className="mb-2 relative">
                  <select
                    name="sortOrder"
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 text-white bg-[#5271FF] border-[#453565] appearance-none hover:bg-[#4260e0]"
                  >
                    <option value="default" className="bg-gray-50 text-[#453565]">Default Sorting</option>
                    <option value="price-low-to-high" className="bg-gray-50 text-[#453565]">Price: Low to High</option>
                    <option value="price-high-to-low" className="bg-gray-50 text-[#453565]">Price: High to Low</option>
                    <option value="name-a-z" className="bg-gray-50 text-[#453565]">Name: A to Z</option>
                    <option value="name-z-a" className="bg-gray-50 text-[#453565]">Name: Z to A</option>
                    <option value="popularity" className="bg-gray-50 text-[#453565]">Most Popular</option>
                    <option value="experience" className="bg-gray-50 text-[#453565]">Most Experienced</option>
                    <option value="rating" className="bg-gray-50 text-[#453565]">Highest Rated</option>
                  </select>
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                  </span>
                </div>
              </div>

              <div className="flex text-center justify-center mt-2">
                <Button
                  onClick={handleSearchClick}
                  className="bg-[#FF5E00] shadow-lg rounded-2xl text-white text-[12px] font-medium border-2 px-4 p-2 hover:bg-[#e64d00]"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        )}

<div className="w-full overflow-auto">

  {/* Check if all lab rows are empty and display a message */}
  {row1Labs.length === 0 && row2Labs.length === 0 && row3Labs.length === 0 && row4Labs.length === 0 ? (
    <div className="flex justify-center rounded-xl">
      <p className="text-[#5271FF] p-4 border-[#243460] border rounded-xl font-bold text-center text-lg">
        No NABL labs found in {activeCity || "your area"}. Please Change The City From The Filter Feature.
      </p>
    </div>
  ) : (
    <>
      {/* Four rows of NABL labs with different sorting criteria */}
      <RowSection title="Most to Least Booked NABL Labs" labs={row1Labs} rowKey="row1" />
      <RowSection title="Highest to Lowest Pricing NABL Tests" labs={row2Labs} rowKey="row2" />
      <RowSection title="Most to Least Experienced NABL Labs" labs={row3Labs} rowKey="row3" />
      <RowSection title="Most to Least Rated NABL Labs" labs={row4Labs} rowKey="row4" />
    </>
  )}
</div>
      </div>
    </div>
  );
};

export default NablLabsMainClient;