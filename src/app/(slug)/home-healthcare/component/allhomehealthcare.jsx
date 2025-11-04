"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, ChevronRight, Filter, MapPin, Building2, Tag, Briefcase, GraduationCap, X, Heart, Award, Users, Clock, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowCircleDown } from "react-icons/fa";

const HomeHealthcareMainClient = ({
  homeHealthcareServices,
  serviceName,
  stateList, districtList, subdistrictList,
  hospitalCategories,
  patientCity,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [states] = useState(stateList);
  const [dist] = useState(districtList);
  const [subdist] = useState(subdistrictList);
  const [expandedRows, setExpandedRows] = useState({
    row1: false,
    row2: false,
    row3: false,
    row4: false
  });

  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = useState([]);

  const [member, setMember] = useState({
    state: "",
    district: "",
    taluka: "",
    city: patientCity || "",
    pinCode: "",
    centerName: "",
    hospitalName: "",
    hospitalType: "",
    centerExperience: "",
    priceRange: "",
  });

  const [errors, setErrors] = useState({});
  const [filters, setFilters] = useState({
    sortOrder: "default",
  });

  const [activeCity, setActiveCity] = useState(patientCity || "");

  // Define visibleServices with initial value
  const [visibleServices, setVisibleServices] = useState(10);

  // Function to handle "View More" button click
  const handleViewMore = () => {
    setVisibleServices(prev => prev + 10);
  };

  // Process services with proper counts and data
  const processedServices = useMemo(() => {
    return homeHealthcareServices.map(service => ({
      ...service,
      bookingsCount: service._count?.BookHomeHealthcare || 0,
      reviewsCount: service.hospital?._count?.reviews || 0,
      hospitalExperience: Number.parseInt(service.hospital?.hspInfo?.experience || "0"),
      price: Number.parseFloat(service.minPrice || service.startingPrice || service.maxPrice || "999999"),
    }));
  }, [homeHealthcareServices]);

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

  // Filter services by city
  const filterServicesByCity = (services, city) => {
    if (!city) return services;
    return services.filter((service) => {
      const serviceCity = service.hospital?.hspcontact?.city || "";
      return serviceCity.toLowerCase().includes(city.toLowerCase());
    });
  };

  // Apply filters to all services
  const applyFilters = useMemo(() => {
    let currentServices = [...processedServices];

    currentServices = filterServicesByCity(currentServices, member.city);

    if (searchQuery) {
      currentServices = currentServices.filter((service) =>
        service.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.hospital?.hspInfo?.regname?.toLowerCase().includes(searchQuery.toLowerCase())
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
      currentServices = currentServices.filter(
        (service) =>
          service.hospital.role?.toLowerCase() ===
          member.hospitalType.toLowerCase()
      );
    }

    if (member.centerExperience) {
      currentServices = currentServices.filter((service) => {
        const experience = service.hospitalExperience;
        if (member.centerExperience === "any") return true;
        if (member.centerExperience === "0-5" && experience >= 0 && experience <= 5) return true;
        if (member.centerExperience === "5-10" && experience > 5 && experience <= 10) return true;
        if (member.centerExperience === "10+" && experience > 10) return true;
        return false;
      });
    }

    if (member.priceRange) {
      const [minStr, maxStr] = member.priceRange.split("-");
      const minPrice = Number.parseFloat(minStr);
      const maxPrice = maxStr === "Infinity" ? Number.POSITIVE_INFINITY : Number.parseFloat(maxStr);

      currentServices = currentServices.filter((service) => {
        const servicePrice = service.price;
        return servicePrice >= minPrice && servicePrice <= maxPrice;
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

    return currentServices;
  }, [processedServices, searchQuery, member]);

  // Define filteredServices using applyFilters
  const filteredServices = applyFilters;

  // Different rows based on sorting criteria
  const row1Services = useMemo(() => {
    return [...applyFilters].sort((a, b) => b.bookingsCount - a.bookingsCount);
  }, [applyFilters]);

  const row2Services = useMemo(() => {
    return [...applyFilters].sort((a, b) => a.price - b.price);
  }, [applyFilters]);

  const row3Services = useMemo(() => {
    return [...applyFilters].sort((a, b) => b.reviewsCount - a.reviewsCount);
  }, [applyFilters]);

  const row4Services = useMemo(() => {
    return [...applyFilters].sort((a, b) => b.hospitalExperience - a.hospitalExperience);
  }, [applyFilters]);

  const toggleRowExpansion = (row) => {
    setExpandedRows(prev => ({
      ...prev,
      [row]: !prev[row]
    }));
  };

  const handleSearchClick = () => {
    setShowFilters(false);
  };

  const clearFilters = () => {
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
      priceRange: "",
    });
    setFilteredDistricts([]);
    setFilteredSubDistricts([]);
  };

  // Enhanced Service Card Component - Redesigned with hospital page style
  const ServiceCard = ({ service }) => (
    <Link href={`/home-healthcare/${encodeURIComponent(service.serviceName)}/${service.hospital?.id}`}>
      <Card className="h-full min-h-[320px] flex flex-col overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl hover:translate-y-[-4px] group">
        <CardContent className="p-0 flex flex-col flex-grow justify-between">
          {/* Header with Status Badge */}
          <div className="relative">
            
            {/* Service Image and Basic Info */}
            <div className="bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 p-6 rounded-t-2xl">
              <div className="flex items-center gap-4">
                {service.hospital?.hspdetails?.hsplogo ? (
                  <div className="relative">
                    <Image
                      src={service.hospital.hspdetails.hsplogo}
                      width={80}
                      height={80}
                      alt={service.serviceName || "Service image"}
                      className="rounded-full h-20 w-20 object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-[#1E3B90]/20 to-[#3D85EF]/30 border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg">
                    <Briefcase className="w-8 h-8" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">
                    {service.serviceName || "Home Healthcare Service"}
                  </h3>
                  <p className="text-[#3D85EF] text-base font-semibold mb-2">
                    Home Healthcare
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
                <Briefcase className="h-4 w-4 text-[#3D85EF]" />
                <span>{service.hospitalExperience || "Not available"} years exp</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Star className="h-4 w-4 text-[#3D85EF]" />
                <span className="truncate">{service.bookingsCount || 0} bookings</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4 text-[#3D85EF] flex-shrink-0" />
              <span className="text-sm line-clamp-2">
                {service.hospital?.hspcontact?.city ? 
                  `${service.hospital.hspcontact.city}${service.hospital.hspcontact?.state ? `, ${service.hospital.hspcontact.state}` : ''}` : 
                  service.hospital?.hspcontact?.address || "Address not available"}
              </span>
            </div>

            {service.hospital?.hspInfo?.regname && (
              <div className="flex items-center gap-2 text-gray-700">
                <Building2 className="h-4 w-4 text-[#3D85EF] flex-shrink-0" />
                <span className="text-sm truncate">{service.hospital.hspInfo.regname}</span>
              </div>
            )}

            {/* Price Range */}
            {(service.minPrice || service.maxPrice || service.startingPrice) && (
              <div className="flex items-center gap-2 text-gray-700">
                <Tag className="h-4 w-4 text-[#3D85EF] flex-shrink-0" />
                <span className="text-sm font-semibold text-green-600">
                  ₹{service.minPrice || service.startingPrice} - ₹{service.maxPrice || service.startingPrice}
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

  // RowSection component - Redesigned with hospital page style
  const RowSection = ({ title, services, rowKey, icon: Icon, description }) => {
    const displayServices = expandedRows[rowKey] ? services : services.slice(0, 3);
    
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
          {services.length > 3 && (
            <button
              onClick={() => toggleRowExpansion(rowKey)}
              className="flex items-center gap-2 text-[#3D85EF] font-semibold hover:text-[#1E3B90] transition-colors px-4 py-2 rounded-lg hover:bg-[#3D85EF]/5"
            >
              {expandedRows[rowKey] ? "Show Less" : `View All (${services.length})`}
              <ChevronRight className={`h-4 w-4 transition-transform ${expandedRows[rowKey] ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>

        {services.length === 0 ? (
          <div className="flex justify-center items-center rounded-2xl bg-gradient-to-br from-[#1E3B90]/5 to-[#3D85EF]/5 border border-[#3D85EF]/20 p-8">
            <div className="text-center">
              <Briefcase className="h-12 w-12 text-[#3D85EF] mx-auto mb-3" />
              <p className="text-[#3D85EF] font-medium text-lg">
                No services found in {activeCity || "your area"}
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
    <div className="min-h-screen md:px-8 bg-gradient-to-br from-[#1E3B90]/5 via-white to-[#3D85EF]/5">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold">
                  {serviceName || "Home Healthcare Services"}
                </h1>
              </div>
              <p className="text-white/90 text-lg">Find trusted home healthcare services in your area</p>
              
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
                  <div className="text-2xl font-bold">{filteredServices.length}</div>
                  <div className="text-white/80 text-sm">Services Found</div>
                </div>
              </div>
            </div>

            {/* Filter Button - Desktop */}
            <div className="flex justify-center lg:justify-end">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-3 bg-white text-[#1E3B90] hover:bg-white/90 font-semibold px-6 py-3 rounded-xl shadow-lg transition-all"
              >
                <Filter size={20} />
                {showFilters ? "Hide Filters" : "Show Filters"}
                <Badge className="bg-[#3D85EF] text-white ml-1 min-w-[24px] h-6 flex items-center justify-center">
                  {Object.values(member).filter(val => val !== "" && val !== patientCity).length}
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
                <h3 className="text-xl font-bold text-gray-800">Filter Services</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Services</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent transition-all"
                      placeholder="Search services/providers..."
                    />
                  </div>
                </div>

                {/* Provider Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provider Name</label>
                  <input
                    type="text"
                    name="centerName"
                    value={member.centerName}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent transition-all"
                    placeholder="Enter provider name..."
                  />
                </div>

                {/* Hospital Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name</label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={member.hospitalName}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent transition-all"
                    placeholder="Enter hospital name..."
                  />
                </div>

                {/* Hospital Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Type</label>
                  <select
                    name="hospitalType"
                    value={member.hospitalType}
                    onChange={handleChange}
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

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <select
                    name="centerExperience"
                    value={member.centerExperience}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Experience</option>
                    <option value="any">Any Experience</option>
                    <option value="0-5">0-5 Years</option>
                    <option value="5-10">5-10 Years</option>
                    <option value="10+">10+ Years</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    name="priceRange"
                    value={member.priceRange}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Price Range</option>
                    <option value="any">Any Price</option>
                    <option value="0-500">₹0 - ₹500</option>
                    <option value="501-1000">₹501 - ₹1000</option>
                    <option value="1001-2000">₹1001 - ₹2000</option>
                    <option value="2001-Infinity">₹2001+</option>
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
                    name="city"
                    value={member.city}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent transition-all"
                    placeholder="Enter City Name"
                    required
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
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent transition-all"
                    placeholder="Enter Pin Code"
                  />
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

          {/* Right Side: Service Cards */}
          <div className="flex-1 min-w-0">
            {row1Services.length === 0 && row2Services.length === 0 && row3Services.length === 0 && row4Services.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-8 w-8 text-[#3D85EF]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No services found</h3>
                  <p className="text-gray-600 mb-4">
                    No services found in {activeCity || "your area"}. Please try changing your filters or location.
                  </p>
                  <Button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] hover:from-[#3D85EF] hover:to-[#1E3B90] text-white"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                {row1Services.length > 0 && (
                  <RowSection 
                    title="Most Booked Services" 
                    services={row1Services} 
                    rowKey="row1"
                    icon={Heart}
                    description="Based on bookings and patient satisfaction"
                  />
                )}
                {row2Services.length > 0 && (
                  <RowSection 
                    title="Budget-Friendly Services" 
                    services={row2Services} 
                    rowKey="row2"
                    icon={Award}
                    description="Affordable home healthcare options"
                  />
                )}
                {row3Services.length > 0 && (
                  <RowSection 
                    title="Top Rated Services" 
                    services={row3Services} 
                    rowKey="row3"
                    icon={Star}
                    description="Highest rated by patients"
                  />
                )}
                {row4Services.length > 0 && (
                  <RowSection 
                    title="Experienced Providers" 
                    services={row4Services} 
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

export default HomeHealthcareMainClient;
