"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter, MapPin, Star, ChevronRight, X, Briefcase } from "lucide-react";
import { FaArrowDown } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import { FaArrowCircleDown } from "react-icons/fa";

const DiagnosticMainClient = ({
  hospitaldetails,
  hspcategoryname,
  stateList, districtList, subdistrictList,
  hospitalCategories,
  patientCity
}) => {
  const [searchQuery, setSearchQuery] = useState("");
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
    city: patientCity || "",
    pinCode: "",
    centerName: "",
    hospitalName: "",
    hospitalType: "",
    centerExperience: "",
    feeRange: "",
  });

  const [errors, setErrors] = React.useState({});
  const [filters, setFilters] = useState({
    sortOrder: "default",
  });

  // Patient city state
  const [userCity, setUserCity] = useState(patientCity || "");
  const [showCityInput, setShowCityInput] = useState(!patientCity);
  const [activeCity, setActiveCity] = useState(patientCity || "");

  // Row expansion state
  const [expandedRows, setExpandedRows] = useState({
    row1: false,
    row2: false,
    row3: false,
    row4: false
  });

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

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Add useEffect hooks for state/district/taluka dependencies
  useEffect(() => {
    if (member.state) {
      const selectedState = states.find(s => s.stateName.toLowerCase() === member.state.toLowerCase());
      const stateId = selectedState ? selectedState.id : null;
  
      if (stateId) {
        const districtsForState = dist.filter(d => d.stateId === stateId);
        setFilteredDistricts(districtsForState);
      } else {
        setFilteredDistricts([]);
      }
    } else {
      setFilteredDistricts([]);
    }
  }, [member.state, dist, states]);
  
  useEffect(() => {
    if (member.district) {
      const selectedDistrict = filteredDistricts.find(d => d.district.toLowerCase() === member.district.toLowerCase());
      const districtId = selectedDistrict ? selectedDistrict.id : null;
  
      if (districtId) {
        const subDistrictsForDistrict = subdist.filter(sd => sd.districtId === districtId);
        setFilteredSubDistricts(subDistrictsForDistrict);
      } else {
        setFilteredSubDistricts([]);
      }
    } else {
      setFilteredSubDistricts([]);
    }
  }, [member.district, subdist, filteredDistricts]);

  const keyword =
    hspcategoryname?.title?.toLowerCase().replace("centers", "").trim() || "";

  // Filter services by city
  const filterServicesByCity = (services, city) => {
    if (!city) return services;
    return services.filter((service) => {
      const serviceCity = service.hospital?.hspcontact?.city || "";
      return serviceCity.toLowerCase().includes(city.toLowerCase());
    });
  };

  // Process services with counts and additional data
  const processedServices = useMemo(() => {
    return hospitaldetails.flatMap((hospital) =>
      (hospital.diagnosticServices || []).map((service) => ({
        ...service,
        hospital,
        // Add counts for sorting
        bookingCount: service._count?.BookDiagnosticService,
        reviewsCount: hospital._count?.reviews,
        experience: hospital.hspInfo?.experience ,
      }))
    ).filter((service) => {
      const serviceFields = [
        service.facility,
        service.category,
        service.subCategory,
      ].map((f) => f?.toLowerCase());
      return serviceFields.some((field) => field?.includes(keyword));
    });
  }, [hospitaldetails, keyword]);

  // Apply filters and get services for display
  const applyFiltersAndSort = useMemo(() => {
    let currentServices = [...processedServices];

    // Filter by patient city first
    currentServices = filterServicesByCity(currentServices, member.city);

    if (searchQuery) {
      currentServices = currentServices.filter((service) =>
        [service.facility, service.category, service.subCategory].some(
          (field) => field?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (member.centerName) {
      currentServices = currentServices.filter((service) =>
        service.hospital.hspInfo?.regname
          ?.toLowerCase()
          .includes(member.centerName.toLowerCase())
      );
    }
    if (member.hospitalName) {
      currentServices = currentServices.filter((service) =>
        service.hospital.hspInfo?.regname
          ?.toLowerCase()
          .includes(member.hospitalName.toLowerCase())
      );
    }
    if (member.hospitalType) {
      currentServices = currentServices.filter((service) => {
        const hospitalCategoryIds = service.hospital.hspInfo?.hspcategory?.map(
          (cat) => cat.hspcategoryId
        );
        const selectedCategory = hospitalCategories.find(
          (cat) => cat.title === member.hospitalType
        );

        return hospitalCategoryIds?.includes(selectedCategory?.id);
      });
    }

    if (member.centerExperience) {
      currentServices = currentServices.filter((service) => {
        const experience = Number.parseInt(
          service.hospital.hspInfo?.experience
        );
        if (isNaN(experience)) return false;
        if (
          member.centerExperience === "0-5" &&
          experience >= 0 &&
          experience <= 5
        )
          return true;
        if (
          member.centerExperience === "5-10" &&
          experience > 5 &&
          experience <= 10
        )
          return true;
        if (member.centerExperience === "10+" && experience > 10) return true;
        return false;
      });
    }
    if (member.feeRange) {
      const [minStr, maxStr] = member.feeRange.split("-");
      const minFee = Number.parseFloat(minStr);
      const maxFee =
        maxStr === "Infinity"
          ? Number.POSITIVE_INFINITY
          : Number.parseFloat(maxStr);

      currentServices = currentServices.filter((service) => {
        const serviceMinPrice = Number.parseFloat(service.minPrice || "0");
        const serviceMaxPrice = Number.parseFloat(service.maxPrice || "0");
        return serviceMinPrice <= maxFee && serviceMaxPrice >= minFee;
      });
    }

    if (member.state) {
      currentServices = currentServices.filter(
        (service) =>
          service.hospital.hspcontact?.state?.toLowerCase() ===
          member.state.toLowerCase() ||
          service.hospital.hspbranches?.some(
            (branch) =>
              branch.state?.toLowerCase() === member.state.toLowerCase()
          )
      );
    }
    if (member.city) {
      currentServices = currentServices.filter(
        (service) =>
          service.hospital.hspcontact?.city
            ?.toLowerCase()
            .includes(member.city.toLowerCase()) ||
          service.hospital.hspbranches?.some((branch) =>
            branch.branchcity
              ?.toLowerCase()
              .includes(member.city.toLowerCase())
          )
      );
    }
    if (member.pinCode) {
      currentServices = currentServices.filter(
        (service) =>
          service.hospital.hspcontact?.pincode?.includes(member.pinCode) ||
          service.hospital.hspbranches?.some((branch) =>
            branch.branchpincode?.includes(member.pinCode)
          )
      );
    }

    currentServices.sort((a, b) => {
      const priceA = Number.parseFloat(a.minPrice || a.maxPrice || "0");
      const priceB = Number.parseFloat(b.minPrice || b.maxPrice || "0");
      switch (filters.sortOrder) {
        case "price-low-to-high":
          return priceA - priceB;
        case "price-high-to-low":
          return priceB - priceA;
        default:
          return 0;
      }
    });

    return currentServices;
  }, [processedServices, member, searchQuery, filters, hospitalCategories]);

  // Different rows based on sorting criteria
  const row1Services = useMemo(() => {
    // Most booked diagnostic centers
    return [...applyFiltersAndSort].sort(
      (a, b) => (b.bookingCount || 0) - (a.bookingCount || 0)
    );
  }, [applyFiltersAndSort]);

  const row2Services = useMemo(() => {
    // Based on experience
    return [...applyFiltersAndSort].sort(
      (a, b) => (b.experience || 0) - (a.experience || 0)
    );
  }, [applyFiltersAndSort]);

  const row3Services = useMemo(() => {
    // Based on price (low to high)
    return [...applyFiltersAndSort].sort((a, b) => {
      const priceA = Number.parseFloat(a.minPrice || a.maxPrice || "0");
      const priceB = Number.parseFloat(b.minPrice || b.maxPrice || "0");
      return priceA - priceB;
    });
  }, [applyFiltersAndSort]);

  const row4Services = useMemo(() => {
    // Based on reviews
    return [...applyFiltersAndSort].sort(
      (a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0)
    );
  }, [applyFiltersAndSort]);


  const handleSearchClick = () => {
    setShowFilters(false);
  };

  const toggleRowExpansion = (row) => {
    setExpandedRows(prev => ({
      ...prev,
      [row]: !prev[row]
    }));
  };

  // Service Card Component
  const ServiceCard = ({ service }) => (
    <Link href={`/diagnosticcenter/${hspcategoryname.id}/${service.hospital?.id}?serviceId=${service.id}`}>
      <Card className="h-full min-h-[320px] flex flex-col overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl hover:translate-y-[-4px] group">
        <CardContent className="p-0 flex flex-col flex-grow justify-between">
          {/* Header with Status Badge */}
          <div className="relative">
            
            {/* Diagnostic Center Image and Basic Info */}
            <div className="bg-gradient-to-br from-[#E68B67]/10 to-[#C47C52]/10 p-6 rounded-t-2xl">
              <div className="flex items-center gap-4">
                {service.hospital?.hspdetails?.hsplogo ? (
                  <div className="relative">
                    <Image
                      src={service.hospital.hspdetails.hsplogo}
                      width={80}
                      height={80}
                      alt={service.hospital?.hspInfo?.regname || "Diagnostic Center"}
                      className="rounded-full h-20 w-20 object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-[#E68B67]/20 to-[#C47C52]/30 border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg">
                    <Briefcase className="w-8 h-8" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">
                    {service.subCategory || service.category || service.facility || "Diagnostic Service"}
                  </h3>
                  <p className="text-[#C47C52] text-base font-semibold mb-2">
                    {service.hospital?.hspInfo?.regname || "Diagnostic Center"}
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
                    <span className="text-xs text-gray-600">({service.reviewsCount || 129} Reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Briefcase className="h-4 w-4 text-[#C47C52]" />
                <span>Bookings: {service.bookingCount || 0}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Star className="h-4 w-4 text-[#C47C52]" />
                <span className="truncate">Exp: {service.experience || "N/A"} years</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4 text-[#C47C52] flex-shrink-0" />
              <span className="text-sm line-clamp-2">
                {service.hospital?.hspcontact?.city ? 
                  `${service.hospital.hspcontact.city}${service.hospital?.hspcontact?.state ? `, ${service.hospital.hspcontact.state}` : ''}` : 
                  "Location not available"}
              </span>
            </div>

            {/* Fee Range */}
            {(service.minPrice || service.maxPrice) && (
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-sm font-semibold text-[#C47C52]">
                  ₹{service.minPrice || "?"} - ₹{service.maxPrice || "?"}
                </span>
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
                <Briefcase className="h-3 w-3" />
                View More
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  // RowSection component (Reusable for all rows)
  const RowSection = ({ title, services, rowKey, icon: Icon, description }) => {
    const displayServices = expandedRows[rowKey] ? services : services.slice(0, 3);
      
    return (
      <div className="mb-12">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-br from-[#E68B67] to-[#C47C52] rounded-xl">
              {Icon && <Icon className="h-5 w-5 text-white" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              {description && <p className="text-gray-600 mt-1">{description}</p>}
            </div>
          </div>
          {services.length > 3 && (
            <button
              onClick={() => toggleRowExpansion(rowKey)}
              className="flex items-center gap-2 text-[#C47C52] font-semibold hover:text-[#E68B67] transition-colors px-4 py-2 rounded-lg hover:bg-[#C47C52]/5"
            >
              {expandedRows[rowKey] ? "Show Less" : `View All (${services.length})`}
              <ChevronRight className={`h-4 w-4 transition-transform ${expandedRows[rowKey] ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>

        {services.length === 0 ? (
          <div className="flex justify-center items-center rounded-2xl bg-gradient-to-br from-[#E68B67]/5 to-[#C47C52]/5 border border-[#C47C52]/20 p-8">
            <div className="text-center">
              <Briefcase className="h-12 w-12 text-[#C47C52] mx-auto mb-3" />
              <p className="text-[#E68B67] font-medium text-lg">
                No diagnostic centers found in {activeCity || "your area"}
              </p>
              <p className="text-gray-600 mt-1">Please try changing your location or filters</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen px-0 md:px-8 bg-gradient-to-br from-[#E68B67]/5 via-white to-[#C47C52]/5">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-[#E68B67] to-[#C47C52] text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold">
                  {hspcategoryname?.title || "Diagnostic Services"}
                </h1>
              </div>
              <p className="text-white/90 text-lg">Find trusted diagnostic centers in your area</p>
              
              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-6 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-white/80 text-sm">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-white/80 text-sm">Verified</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{applyFiltersAndSort.length}</div>
                  <div className="text-white/80 text-sm">Centers Found</div>
                </div>
              </div>
            </div>

            {/* Filter Button - Desktop */}
            <div className="flex justify-center lg:justify-end">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-3 bg-white text-[#E68B67] hover:bg-white/90 font-semibold px-6 py-3 rounded-xl shadow-lg transition-all"
              >
                <Filter size={20} />
                {showFilters ? "Hide Filters" : "Show Filters"}
                <Badge className="bg-[#C47C52] text-white ml-1 min-w-[24px] h-6 flex items-center justify-center">
                  {Object.values(member).filter(val => val !== "" && val !== patientCity).length}
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side: Filters */}
          <div className={`lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Mobile Filter Header */}
            {showFilters && (
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            )}
            
            {/* Filter Panel */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-8 max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Filter Centers</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setMember({
                        state: "",
                        district: "",
                        taluka: "",
                        city: patientCity || "",
                        pinCode: "",
                        centerName: "",
                        hospitalName: "",
                        hospitalType: "",
                        centerExperience: "",
                        feeRange: "",
                      });
                      setFilteredDistricts([]);
                      setFilteredSubDistricts([]);
                    }}
                    className="text-red-600 hover:text-red-700 p-0 h-6 font-medium text-sm"
                  >
                    Clear All
                  </Button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 text-gray-500 hover:text-gray-700 lg:hidden"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Search Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Center</label>
                    <input
                      type="text"
                      name="centerName"
                      value={member.centerName}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C47C52] focus:border-transparent transition-all"
                      placeholder="Enter center name..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name</label>
                    <input
                      type="text"
                      name="hospitalName"
                      value={member.hospitalName}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C47C52] focus:border-transparent transition-all"
                      placeholder="Enter hospital name..."
                    />
                  </div>
                </div>

                {/* Hospital Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Type</label>
                  <select
                    name="hospitalType"
                    value={member.hospitalType}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C47C52] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="" className="bg-gray-50 text-[#453565]">Hospital Type</option>
                    {hospitalCategories.map((category) => (
                      <option
                        key={category.id}
                        value={category.title}
                        className="bg-gray-50 text-[#453565]"
                      >
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Center Experience Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Center Experience</label>
                  <select
                    name="centerExperience"
                    value={member.centerExperience}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C47C52] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="" className="bg-gray-50 text-[#453565]">Center Experience</option>
                    <option value="any" className="bg-gray-50 text-[#453565]">Any Experience</option>
                    <option value="0-5" className="bg-gray-50 text-[#453565]">0-5 Years</option>
                    <option value="5-10" className="bg-gray-50 text-[#453565]">5-10 Years</option>
                    <option value="10+" className="bg-gray-50 text-[#453565]">10+ Years</option>
                  </select>
                </div>

                {/* Fee Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fee Range</label>
                  <select
                    name="feeRange"
                    value={member.feeRange}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C47C52] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="" className="bg-gray-50 text-[#453565]">Fee Range</option>
                    <option value="any" className="bg-gray-50 text-[#453565]">Any Fee</option>
                    <option value="0-500" className="bg-gray-50 text-[#453565]">₹0 - ₹500</option>
                    <option value="501-1000" className="bg-gray-50 text-[#453565]">₹501 - ₹1000</option>
                    <option value="1001-Infinity" className="bg-gray-50 text-[#453565]">₹1001+</option>
                  </select>
                </div>

                {/* State Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <select
                    name="state"
                    value={member.state}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C47C52] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="" className="bg-gray-50 text-[#453565]">Select State</option>
                    {stateList.map((s) => (
                      <option key={s.id} value={s.stateName} className="bg-gray-50 text-[#453565]">
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
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C47C52] focus:border-transparent appearance-none bg-white disabled:opacity-50"
                  >
                    <option value="" className="bg-gray-50 text-[#453565]">Select District</option>
                    {filteredDistricts.map((d) => (
                      <option key={d.id} value={d.district} className="bg-gray-50 text-[#453565]">
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
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C47C52] focus:border-transparent appearance-none bg-white disabled:opacity-50"
                  >
                    <option value="" className="bg-gray-50 text-[#453565]">Select Taluka</option>
                    {filteredSubDistricts.map((sd) => (
                      <option key={sd.id} value={sd.subDistrict} className="bg-gray-50 text-[#453565]">
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
                    name="city"
                    value={member.city}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C47C52] focus:border-transparent transition-all"
                    placeholder="Enter City Name"
                  />
                </div>

                {/* Pin Code Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code</label>
                  <input
                    type="text"
                    name="pinCode"
                    value={member.pinCode}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C47C52] focus:border-transparent transition-all"
                    placeholder="Enter Pin Code"
                  />
                </div>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearchClick}
                className="w-full bg-gradient-to-r from-[#E68B67] to-[#C47C52] hover:from-[#C47C52] hover:to-[#E68B67] text-white font-semibold py-3 rounded-xl shadow-lg transition-all transform hover:scale-105 mt-6"
              >
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Right Side: Diagnostic Centers */}
          <div className="flex-1 min-w-0">
            {row1Services.length === 0 && row2Services.length === 0 && row3Services.length === 0 && row4Services.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#E68B67]/10 to-[#C47C52]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-8 w-8 text-[#C47C52]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No diagnostic centers found</h3>
                  <p className="text-gray-600 mb-4">
                    No diagnostic centers found in {activeCity || "your area"}. Please try changing your filters or location.
                  </p>
                  <Button
                    onClick={() => {
                      setMember({
                        state: "",
                        district: "",
                        taluka: "",
                        city: patientCity || "",
                        pinCode: "",
                        centerName: "",
                        hospitalName: "",
                        hospitalType: "",
                        centerExperience: "",
                        feeRange: "",
                      });
                      setFilteredDistricts([]);
                      setFilteredSubDistricts([]);
                    }}
                    className="bg-gradient-to-r from-[#E68B67] to-[#C47C52] hover:from-[#C47C52] hover:to-[#E68B67] text-white"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                {row1Services.length > 0 && (
                  <RowSection 
                    title="Most Booked Diagnostic Centers" 
                    services={row1Services} 
                    rowKey="row1"
                    icon={Star}
                    description="Based on booking count and patient reviews"
                  />
                )}
                {row2Services.length > 0 && (
                  <RowSection 
                    title="Most Experienced Diagnostic Centers" 
                    services={row2Services} 
                    rowKey="row2"
                    icon={Briefcase}
                    description="Leading centers with extensive experience"
                  />
                )}
                {row3Services.length > 0 && (
                  <RowSection 
                    title="Affordable Diagnostic Services" 
                    services={row3Services} 
                    rowKey="row3"
                    icon={MapPin}
                    description="Best value diagnostic services"
                  />
                )}
                {row4Services.length > 0 && (
                  <RowSection 
                    title="Top Rated Diagnostic Centers" 
                    services={row4Services} 
                    rowKey="row4"
                    icon={Star}
                    description="Highest rated centers by patients"
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

export default DiagnosticMainClient; 