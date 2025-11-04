"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Star, ChevronRight, MapPin, Building2, Briefcase, X, TestTube, Shield, Heart, Award, Users, Clock } from "lucide-react";
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

const Testclient = ({
  tests,
  stateList,
  districtList,
  subdistrictList,
  hospitalCategories,
  patientId,
  patientCity,
  letter
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
    hospitalCategory: "",
    centerExperience: "",
    feeRange: "",
    stateName: "",
    cityName: patientCity || "", // Prefill with patient city if available
    pinCode: "",
    sortOrder: "default",
    nablStatus: "any",
    available: "any",
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

  // Generate A-Z navigation links
  const navlinks = Array.from({ length: 26 }, (_, i) => {
    const letter = String.fromCharCode(65 + i); // A–Z
    return { title: `Index ${letter}`, link: `/pathology/category?letter=${letter}` };
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

  // Filter tests by city - only if city is specified
  const filterTestsByCity = (tests, city) => {
    if (!city) return tests; // Return all tests if no city specified
    return tests.filter((test) => {
      const testCity = test.Hospital?.hspcontact?.city || "";
      return testCity.toLowerCase().includes(city.toLowerCase());
    });
  };

  // Apply filters and get tests for display
  const applyFiltersAndSort = useMemo(() => {
    let currentTests = [...tests];
    // Filter by patient city first
    currentTests = filterTestsByCity(currentTests, activeCity);


    // If a letter is selected, filter tests by that letter

    if (letter) {
      currentTests = currentTests.filter((test) =>
        test.testname?.toUpperCase().startsWith(letter.toUpperCase())
      );
    }

    // Filter by test name
    if (filters.testName) {
      currentTests = currentTests.filter((test) =>
        test.testname?.toLowerCase().includes(filters.testName.toLowerCase())
      );
    }

    // Filter by hospital name
    if (filters.hospitalName) {
      currentTests = currentTests.filter((test) =>
        test.Hospital?.hspInfo?.regname
          ?.toLowerCase()
          .includes(filters.hospitalName.toLowerCase())
      );
    }

    // Filter by hospital type
    if (filters.hospitalType) {
      currentTests = currentTests.filter(
        (test) =>
          test.Hospital?.role?.toLowerCase() ===
          filters.hospitalType.toLowerCase()
      );
    }

    // Filter by hospital category
    if (filters.hospitalCategory) {
      currentTests = currentTests.filter((test) => {
        return test.Hospital?.hspInfo?.hspcategory?.some(
          (cat) => cat.hspcategory?.title === filters.hospitalCategory
        );
      });
    }

    // Filter by center experience
    if (filters.centerExperience) {
      currentTests = currentTests.filter((test) => {
        const experience = Number.parseInt(test.Hospital?.hspInfo?.experience);
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

      currentTests = currentTests.filter((test) => {
        const price = Number.parseFloat(test.finalprice || test.price || "0");
        return price >= minFee && price <= maxFee;
      });
    }

    // Filter by state
    if (filters.stateName) {
      currentTests = currentTests.filter(
        (test) =>
          test.Hospital?.hspcontact?.state?.toLowerCase() ===
          filters.stateName.toLowerCase() ||
          test.Hospital?.hspbranches?.some(
            (branch) =>
              branch.state?.toLowerCase() === filters.stateName.toLowerCase()
          )
      );
    }

    // Filter by city (from filter, not patient city)
    if (filters.cityName) {
      currentTests = currentTests.filter(
        (test) =>
          test.Hospital?.hspcontact?.city
            ?.toLowerCase()
            .includes(filters.cityName.toLowerCase()) ||
          test.Hospital?.hspbranches?.some((branch) =>
            branch.branchcity?.toLowerCase().includes(filters.cityName.toLowerCase())
          )
      );
    }

    // Filter by pin code
    if (filters.pinCode) {
      currentTests = currentTests.filter(
        (test) =>
          test.Hospital?.hspcontact?.pincode?.includes(filters.pinCode) ||
          test.Hospital?.hspbranches?.some((branch) =>
            branch.branchpincode?.includes(filters.pinCode)
          )
      );
    }

    // Filter by NABL status
    if (filters.nablStatus !== "any") {
      const nablFilter = filters.nablStatus === "nabl";
      currentTests = currentTests.filter((test) => test.nabl === nablFilter);
    }

    // Filter by availability
    if (filters.available !== "any") {
      const availableFilter = filters.available === "available";
      currentTests = currentTests.filter((test) => test.available === availableFilter);
    }

    // Sorting
    currentTests = [...currentTests].sort((a, b) => {
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

    return currentTests;
  }, [tests, activeCity, filters, letter]);

  // Different rows based on sorting criteria
  const row1Tests = useMemo(() => {
    // Most booked lab tests
    return [...applyFiltersAndSort].sort(
      (a, b) => (b.bookingCount || 0) - (a.bookingCount || 0)
    );
  }, [applyFiltersAndSort]);

  const row2Tests = useMemo(() => {
    // Based on price (low to high)
    return [...applyFiltersAndSort].sort((a, b) => {
      const priceA = Number.parseFloat(a.finalprice || a.price || "0");
      const priceB = Number.parseFloat(b.finalprice || b.price || "0");
      return priceA - priceB;
    });
  }, [applyFiltersAndSort]);

  const row3Tests = useMemo(() => {
    // Based on experience
    return [...applyFiltersAndSort].sort(
      (a, b) => (b.experience || 0) - (a.experience || 0)
    );
  }, [applyFiltersAndSort]);

  const row4Tests = useMemo(() => {
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
      hospitalCategory: "",
      centerExperience: "",
      feeRange: "",
      stateName: "",
      cityName: patientCity || "",
      pinCode: "",
      sortOrder: "default",
      nablStatus: "any",
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

  // Handle letter selection from A-Z dropdown
  const handleLetterSelect = (selectedLetter) => {
    router.push(`/pathology/category?letter=${selectedLetter}`);
  };

  // Test Card Component - Redesigned with hospital page style
  const TestCard = ({ test }) => (
    <Link href={`/pathology/hospital/${test.hospitalId}/service/${test.id}`}>
      <Card className="h-full min-h-[320px] flex flex-col overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl hover:translate-y-[-4px] group">
        <CardContent className="p-0 flex flex-col flex-grow justify-between">
          {/* Header with Status Badge */}
          <div className="relative">
            
            {/* Test Image and Basic Info */}
            <div className="bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 p-6 rounded-t-2xl">
              <div className="flex items-center gap-4">
                {test.Hospital?.hspdetails?.hsplogo ? (
                  <div className="relative">
                    <Image
                      src={test.Hospital.hspdetails.hsplogo}
                      width={80}
                      height={80}
                      alt={test.testname || "Test image"}
                      className="rounded-full h-20 w-20 object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-[#1E3B90]/20 to-[#3D85EF]/30 border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg">
                    <TestTube className="w-8 h-8" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">
                    {test.testname || "Pathology Test"}
                  </h3>
                  <p className="text-[#3D85EF] text-base font-semibold mb-2">
                    Pathology Test
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
                      <span className="text-xs font-medium text-gray-700 ml-1">4.2</span>
                    </div>
                    <span className="text-xs text-gray-600">({test.reviewsCount || 89} Reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <TestTube className="h-4 w-4 text-[#3D85EF]" />
                <span>{test.experience || "Not available"} years exp</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Star className="h-4 w-4 text-[#3D85EF]" />
                <span className="truncate">{test.bookingCount || 0} bookings</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4 text-[#3D85EF] flex-shrink-0" />
              <span className="text-sm line-clamp-2">
                {test.Hospital?.hspcontact?.city ? 
                  `${test.Hospital.hspcontact.city}${test.Hospital.hspcontact?.state ? `, ${test.Hospital.hspcontact.state}` : ''}` : 
                  test.Hospital?.hspcontact?.address || "Address not available"}
              </span>
            </div>

            {test.Hospital?.hspInfo?.regname && (
              <div className="flex items-center gap-2 text-gray-700">
                <Building2 className="h-4 w-4 text-[#3D85EF] flex-shrink-0" />
                <span className="text-sm truncate">{test.Hospital.hspInfo.regname}</span>
              </div>
            )}

            {/* Price Section */}
            <div className="flex items-center gap-2 text-gray-700">
              <Shield className="h-4 w-4 text-[#3D85EF] flex-shrink-0" />
              <div className="flex flex-col">
                {test.finalprice && test.finalprice !== test.price && (
                  <span className="text-xs text-gray-500 line-through">₹{test.price}</span>
                )}
                <span className="text-sm font-semibold text-green-600">
                  ₹{test.finalprice || test.price}
                </span>
                {test.discount && (
                  <span className="text-xs text-green-600 font-medium">
                    {test.discount}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Footer with Actions - Fixed size */}
          <div className="px-6 pb-6 pt-2">
            <div className="flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] hover:from-[#3b82f6] hover:to-[#1e40af] text-white font-medium py-2.5 px-3 rounded-xl shadow-md transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-sm">
                <Star className="h-3 w-3" />
                Book Now
              </button>
              <button className="flex-1 bg-gradient-to-r from-[#059669] to-[#10b981] hover:from-[#10b981] hover:to-[#059669] text-white font-medium py-2.5 px-3 rounded-xl shadow-sm transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-sm">
                <TestTube className="h-3 w-3" />
                View More
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  // RowSection component - Redesigned with hospital page style
  const RowSection = ({ title, tests, rowKey, icon: Icon, description }) => {
    const displayTests = expandedRows[rowKey] ? tests : tests.slice(0, 3);
    
    return (
      <div className="mb-12">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-br from-[#1E3B90] to-[#3D85EF] rounded-xl">
              {Icon && <Icon className="h-5 w-5 text-white" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              {description && <p className="text-gray-600 mt-1">{description}</p>}
            </div>
          </div>
          {tests.length > 3 && (
            <button
              onClick={() => toggleRowExpansion(rowKey)}
              className="flex items-center gap-2 text-[#3D85EF] font-semibold hover:text-[#1E3B90] transition-colors px-4 py-2 rounded-lg hover:bg-[#3D85EF]/5"
            >
              {expandedRows[rowKey] ? "Show Less" : `View All (${tests.length})`}
              <ChevronRight className={`h-4 w-4 transition-transform ${expandedRows[rowKey] ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>

        {tests.length === 0 ? (
          <div className="flex justify-center items-center rounded-2xl bg-gradient-to-br from-[#1E3B90]/5 to-[#3D85EF]/5 border border-[#3D85EF]/20 p-8">
            <div className="text-center">
              <TestTube className="h-12 w-12 text-[#3D85EF] mx-auto mb-3" />
              <p className="text-[#3D85EF] font-medium text-lg">
                No tests found in {activeCity || "your area"}
              </p>
              <p className="text-gray-600 mt-1">Please try changing your location or filters</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTests.map((test, index) => (
              <TestCard key={index} test={test} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen px-6 bg-gradient-to-br from-[#1E3B90]/5 via-white to-[#3D85EF]/5">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <TestTube className="h-6 w-6" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold">
                  Pathology Services
                </h1>
              </div>
              <p className="text-white/90 text-lg">Find trusted pathology labs and diagnostic centers</p>
              
              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-6 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-white/80 text-sm">Testing</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-white/80 text-sm">Accurate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{applyFiltersAndSort.length}</div>
                  <div className="text-white/80 text-sm">Tests Found</div>
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center lg:justify-end items-center gap-4">
              {/* A to Z Test Filter Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="flex items-center gap-2 bg-white text-[#1E3B90] border border-white hover:bg-white/90 px-4 py-2 rounded-full shadow-sm transition-all"
                  >
                    <Filter size={16} />
                    {letter ? (
                      <>
                        <span>Tests for </span>
                        <Badge className="bg-[#3D85EF] text-white ml-1 rounded-full">{letter}</Badge>
                      </>
                    ) : (
                      <Badge className="bg-[#3D85EF] text-white ml-1 rounded-full">Select Test Letter</Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="md:absolute -right-3 mt-2 w-full bg-white overflow-auto grid grid-cols-3 gap-8 p-4 shadow-lg rounded-lg z-50"
                  style={{ minWidth: "350px", top: "100%" }}
                >
                  <div className="col-start-1">
                    {navlinks.slice(0, 9).map((nav) => (
                      <DropdownMenuItem key={nav.link}>
                        <button
                          onClick={() => handleLetterSelect(nav.title.split(" ")[1])}
                          className="text-gray-800 font-semibold hover:text-[#1E3B90] w-full text-left transition-colors"
                        >
                          {nav.title}
                        </button>
                      </DropdownMenuItem>
                    ))}
                  </div>

                  {navlinks.length > 9 && (
                    <div className="col-start-2">
                      {navlinks.slice(9, 18).map((nav) => (
                        <DropdownMenuItem key={nav.link}>
                          <button
                            onClick={() => handleLetterSelect(nav.title.split(" ")[1])}
                            className="text-gray-800 font-semibold hover:text-[#1E3B90] w-full text-left transition-colors"
                          >
                            {nav.title}
                          </button>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  )}

                  {navlinks.length > 18 && (
                    <div className="col-start-3">
                      {navlinks.slice(18).map((nav) => (
                        <DropdownMenuItem key={nav.link}>
                          <button
                            onClick={() => handleLetterSelect(nav.title.split(" ")[1])}
                            className="text-gray-800 font-semibold hover:text-[#1E3B90] w-full text-left transition-colors"
                          >
                            {nav.title}
                          </button>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* All Filters Button */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-3 bg-white text-[#1E3B90] hover:bg-white/90 font-semibold px-6 py-3 rounded-xl shadow-lg transition-all"
              >
                <Filter size={20} />
                {showFilters ? "Hide Filters" : "Show Filters"}
                <Badge className="bg-[#3D85EF] text-white ml-1 min-w-[24px] h-6 flex items-center justify-center">
                  {Object.values(filters).filter(val => val !== "" && val !== patientCity && val !== "default" && val !== "any").length}
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="flex justify-center md:hidden py-4">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className="px-6 py-3 bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white rounded-full font-semibold text-sm hover:from-[#3D85EF] hover:to-[#1E3B90] shadow-lg transition-all transform hover:scale-105"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Filters Sidebar - Properly working sticky behavior */}
          <div className={`xl:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden xl:block'}`}>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-8 max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Filter Tests</h3>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Tests</label>
                    <input
                      type="text"
                      className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent transition-all"
                      placeholder="Search tests/labs..."
                      value={filters.testName}
                      onChange={(e) => handleFilterChange("testName", e.target.value)}
                    />
                  </div>
                </div>

                {/* Test Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent transition-all"
                    placeholder="Enter test name..."
                    value={filters.testName}
                    onChange={(e) => handleFilterChange("testName", e.target.value)}
                  />
                </div>

                {/* Hospital Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent transition-all"
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
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Hospital Type</option>
                    {hospitalCategories.map((category) => (
                      <option key={category.id} value={category.title}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hospital Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Category</label>
                  <select
                    name="hospitalCategory"
                    value={filters.hospitalCategory}
                    onChange={(e) => handleFilterChange("hospitalCategory", e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Hospital Category</option>
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
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white"
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
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Fee Range</option>
                    <option value="any">Any Fee</option>
                    <option value="0-500">₹0 - ₹500</option>
                    <option value="501-1000">₹501 - ₹1000</option>
                    <option value="1001-2000">₹1001 - ₹2000</option>
                    <option value="2001-Infinity">₹2001+</option>
                  </select>
                </div>

                {/* NABL Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">NABL Status</label>
                  <select
                    name="nablStatus"
                    value={filters.nablStatus}
                    onChange={(e) => handleFilterChange("nablStatus", e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="any">NABL Status: Any</option>
                    <option value="nabl">NABL Accredited</option>
                    <option value="non-nabl">Non-NABL</option>
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select
                    name="available"
                    value={filters.available}
                    onChange={(e) => handleFilterChange("available", e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white"
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
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white"
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
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white disabled:opacity-50"
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
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white disabled:opacity-50"
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
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent transition-all"
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
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent transition-all"
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
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="default">Default Sorting</option>
                    <option value="price-low-to-high">Price: Low to High</option>
                    <option value="price-high-to-low">Price: High to Low</option>
                    <option value="name-a-z">Name: A to Z</option>
                    <option value="name-z-a">Name: Z to A</option>
                    <option value="popularity">Most Popular</option>
                    <option value="experience">Most Experienced</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                <Button
                  onClick={handleSearchClick}
                  className="w-full bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] hover:from-[#3D85EF] hover:to-[#1E3B90] text-white font-semibold py-3 rounded-xl shadow-lg transition-all transform hover:scale-105"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side: Test Cards */}
          <div className="flex-1 min-w-0">
            {row1Tests.length === 0 && row2Tests.length === 0 && row3Tests.length === 0 && row4Tests.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TestTube className="h-8 w-8 text-[#3D85EF]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No pathology tests found</h3>
                  <p className="text-gray-600 mb-4">
                    No tests found in {activeCity || "your area"}. Please try changing your filters or location.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>• Try selecting a different city</p>
                    <p>• Adjust your price range</p>
                    <p>• Change the hospital type filter</p>
                    <p>• Clear all filters to see all available tests</p>
                  </div>
                  <Button
                    onClick={handleResetFilters}
                    className="mt-6 bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] hover:from-[#3D85EF] hover:to-[#1E3B90] text-white"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                {row1Tests.length > 0 && (
                  <RowSection 
                    title="Most Booked Tests" 
                    tests={row1Tests} 
                    rowKey="row1"
                    icon={Heart}
                    description="Based on bookings and patient satisfaction"
                  />
                )}
                {row2Tests.length > 0 && (
                  <RowSection 
                    title="Budget-Friendly Tests" 
                    tests={row2Tests} 
                    rowKey="row2"
                    icon={Award}
                    description="Affordable pathology testing options"
                  />
                )}
                {row3Tests.length > 0 && (
                  <RowSection 
                    title="Top Rated Labs" 
                    tests={row3Tests} 
                    rowKey="row3"
                    icon={Star}
                    description="Highest rated labs by patients"
                  />
                )}
                {row4Tests.length > 0 && (
                  <RowSection 
                    title="Experienced Providers" 
                    tests={row4Tests} 
                    rowKey="row4"
                    icon={Users}
                    description="Providers with extensive experience"
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

export default Testclient;