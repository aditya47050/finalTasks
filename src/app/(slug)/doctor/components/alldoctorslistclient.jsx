"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ArrowDown, Briefcase, GraduationCap, Filter, ChevronRight, Star, MapPin, ChevronDown, X, Users, Award, Clock, Stethoscope, Heart, Shield, Calendar } from "lucide-react";
import { FaArrowDown, FaClinicMedical, FaUserMd } from "react-icons/fa";
import { Center } from "@mantine/core";
import Link from "next/link";
import { FaArrowCircleDown } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Doctorslistmainclient = ({ 
  doctordetails, 
  specilitytype, 
  stateList, 
  districtList, 
  subdistrictList,
  patientCity 
}) => {
  const [states] = React.useState(stateList);
  const [dist] = React.useState(districtList);
  const [subdist] = React.useState(subdistrictList);

  const [userCity, setUserCity] = useState("");
  const [showCityInput, setShowCityInput] = useState(!patientCity);
  const [activeCity, setActiveCity] = useState(patientCity || "");

  const [filteredDistricts, setFilteredDistricts] = React.useState([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = React.useState([]);

  const [member, setMember] = React.useState({
    state: "",
    district: "",
    taluka: "",
  });

  const [filters, setFilters] = useState({
    doctorName: "",
    hospitalName: "",
    hospitalType: "",
    experience: "",
    doctorFee: "",
    state: "",
    district: "",
    taluka: "",
    cityName: activeCity,
    pincode: "",
  });

  const [errors, setErrors] = React.useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState(doctordetails);
  const [visibledoctors, setVisibledoctors] = useState(9);
  
  // Set showFilters to true by default
  const [showFilters, setShowFilters] = useState(true);
  const [expertDoctor, setExpertDoctor] = useState(false);
  
  // State for row expansion
  const [expandedRows, setExpandedRows] = useState({
    row1: false,
    row2: false,
    row3: false
  });

  // Handle window resize to manage filter visibility
  useEffect(() => {
    const handleResize = () => {
      // Keep filters open on desktop, close on mobile by default
      if (window.innerWidth >= 1280) {
        setShowFilters(true);
      } else {
        setShowFilters(false);
      }
    };

    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Medical color scheme
  const colors = {
    primary: "#1E3B90", // Teal - medical professional
    primaryDark: "#1E3B90",
    primaryLight: "#14B8A6",
    secondary: "#3D85EF", // Blue - trust
    accent: "#DC2626", // Red - emergency
    background: "#F0FDFA",
    card: "#FFFFFF",
    text: "#1F2937",
    textLight: "#6B7280"
  };

  // Filter doctors by city
  const filterDoctorsByCity = (doctors, city) => {
    if (!city) return doctors;
    return doctors.filter((doctor) => {
      const doctorCity = doctor.doctorinfo?.city || "";
      return doctorCity.toLowerCase().includes(city.toLowerCase());
    });
  };

  // Row 1: Doctors ordered by highest number of BookFreeAppointment
  const row1Doctors = React.useMemo(() => {
    return [...filteredDoctors].sort(
      (a, b) => (b.BookFreeAppointment?.length || 0) - (a.BookFreeAppointment?.length || 0)
    );
  }, [filteredDoctors]);

  // Row 2: Doctors ordered by consultation fee (highest to lowest)
  const row2Doctors = React.useMemo(() => {
    return [...filteredDoctors].sort(
      (a, b) => (parseInt(b.doctorinfo?.consultationfee) || 0) - (parseInt(a.doctorinfo?.consultationfee) || 0)
    );
  }, [filteredDoctors]);

  // Row 3: Doctors ordered by total experience (highest to lowest)
  const row3Doctors = React.useMemo(() => {
    return [...filteredDoctors].sort(
      (a, b) => (parseInt(b.totalexperience) || 0) - (parseInt(a.totalexperience) || 0)
    );
  }, [filteredDoctors]);

  useEffect(() => {
    console.log("Filters state:", filters);
    applyFilters();
  }, [doctordetails, filters, activeCity]);

  const handleCitySubmit = () => {
    if (userCity.trim()) {
      setActiveCity(userCity.trim());
      setShowCityInput(false);
      setFilters(prev => ({ ...prev, cityName: userCity.trim() }));
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setFilters(prev => ({ ...prev, doctorName: e.target.value }));
  };

  const handleFilterChange = (name, value) => {
    console.log(`Filter changed: ${name} = ${value}`);
    setFilters(prev => ({ ...prev, [name]: value }));
  };

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
      setFilters(prev => ({ ...prev, state: selectedState?.stateName || "", district: "", taluka: "" }));
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
      setFilters(prev => ({ ...prev, district: selectedDistrict?.district || "", taluka: "" }));
    } else if (name === "taluka") {
      setMember((prev) => ({
        ...prev,
        taluka: value
      }));
      setFilters(prev => ({ ...prev, taluka: value }));
    } else {
      setMember((prev) => ({
        ...prev,
        [name]: value
      }));
      setFilters(prev => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleViewMore = () => {
    const remainingDoctors = filteredDoctors.length - visibledoctors;
    const increment = Math.min(8, remainingDoctors);
    setVisibledoctors(visibledoctors + increment);
    console.log(`View More clicked. Visible doctors: ${visibledoctors + increment}`);
  };

  const toggleRowExpansion = (row) => {
    setExpandedRows(prev => ({
      ...prev,
      [row]: !prev[row]
    }));
  };

  const clearFilters = () => {
    setFilters({
      doctorName: "",
      hospitalName: "",
      hospitalType: "",
      experience: "",
      doctorFee: "",
      state: "",
      district: "",
      taluka: "",
      cityName: activeCity,
      pincode: "",
    });
    setMember({
      state: "",
      district: "",
      taluka: "",
    });
    setFilteredDistricts([]);
    setFilteredSubDistricts([]);
  };

  // Safe helpers
  const safeString = (val) => (val ? String(val).toLowerCase() : "");
  const safeNumber = (val) => {
    const n = parseInt(val, 10);
    return isNaN(n) ? 0 : n;
  };

  const applyFilters = () => {
    console.log("Applying filters with current state:", filters);
    const list = Array.isArray(doctordetails) ? doctordetails : [];
    const f = filters;

    const filtered = list.filter((doctor) => {
      // doctorName
      if (f.doctorName) {
        const fullName = `${doctor.firstName || ""} ${doctor.middleName || ""} ${doctor.lastName || ""}`.trim().toLowerCase();
        if (!fullName.includes(f.doctorName.toLowerCase())) return false;
      }

      // hospitalName
      if (f.hospitalName) {
        const hospitals = Array.isArray(doctor.HospitalDoctor) ? doctor.HospitalDoctor : [];
        const match = hospitals.some(hd =>
          safeString(hd.hospital?.hspInfo?.regname).includes(f.hospitalName.toLowerCase())
        );
        if (!match) return false;
      }

      // hospitalType
      if (f.hospitalType) {
        const hospitals = Array.isArray(doctor.HospitalDoctor) ? doctor.HospitalDoctor : [];
        const match = hospitals.some(hd => {
          const cats = Array.isArray(hd.hospital?.hspInfo?.hspcategory) ? hd.hospital.hspInfo.hspcategory : [];
          return cats.some(cat =>
            safeString(cat.hspcategory?.title || cat.title).includes(f.hospitalType.toLowerCase())
          );
        });
        if (!match) return false;
      }

      // experience
      if (f.experience) {
        const docExp = safeNumber(doctor.totalexperience);
        const [minExp = 0, maxExp = Number.MAX_SAFE_INTEGER] = f.experience.split("-").map(n => parseInt(n, 10));
        if (docExp < minExp || docExp > maxExp) return false;
      }

      // doctorFee
      if (f.doctorFee) {
        const fee = safeNumber(doctor.doctorinfo?.consultationfee);
        const [minFee = 0, maxFee = Number.MAX_SAFE_INTEGER] = f.doctorFee.split("-").map(n => parseInt(n.replace(/[^\d]/g, ""), 10));
        if (fee < minFee || fee > maxFee) return false;
      }

      // state/district/taluka/pincode
      if (f.state && !safeString(doctor.doctorinfo?.state).includes(f.state.toLowerCase())) return false;
      if (f.district && !safeString(doctor.doctorinfo?.district).includes(f.district.toLowerCase())) return false;
      if (f.taluka && !safeString(doctor.doctorinfo?.taluka).includes(f.taluka.toLowerCase())) return false;
      if (f.cityName && !safeString(doctor.doctorinfo?.city).includes(f.cityName.toLowerCase())) return false;
      if (f.pincode && !String(doctor.doctorinfo?.pincode ?? "").includes(String(f.pincode))) return false;

      return true;
    });

    console.log("Filtered doctors:", filtered);
    setFilteredDoctors(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [doctordetails, filters]);

  // Enhanced Doctor Card Component
  const DoctorCard = ({ item }) => (
    <Link href={`/doctor/${specilitytype.id}/${item.id}`}>
      <Card className="h-full min-h-[320px] flex flex-col overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl hover:translate-y-[-4px] group">
        <CardContent className="p-0 flex flex-col flex-grow justify-between">
          {/* Header with Status Badge */}
          <div className="relative">
            
            {/* Doctor Image and Basic Info */}
            <div className="bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 p-6 rounded-t-2xl">
              <div className="flex items-center gap-4">
                {item.doctorinfo?.passportphoto ? (
                  <div className="relative">
                    <Image
                      src={item.doctorinfo.passportphoto}
                      width={80}
                      height={80}
                      alt={item.firstName || "Doctor image"}
                      className="rounded-full h-20 w-20 object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-[#1E3B90]/20 to-[#3D85EF]/30 border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg">
                    <FaUserMd className="w-8 h-8" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">
                    {`Dr. ${item.firstName || ''} ${item.middleName || ''} ${item.lastName || ''}`.trim() || "Doctor Name"}
                  </h3>
                  <p className="text-[#1E3B90] text-base font-semibold mb-2">
                    {specilitytype.title || "Specialist"}
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
                    <span className="text-xs text-gray-600">(129 Reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Briefcase className="h-4 w-4 text-[#1E3B90]" />
                <span>{item.totalexperience || "Not available"} years exp</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FaClinicMedical className="h-4 w-4 text-[#1E3B90]" />
                <span className="truncate">₹{item.doctorinfo?.consultationfee || "NA"}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4 text-[#1E3B90] flex-shrink-0" />
              <span className="text-sm line-clamp-2">{item.doctorinfo?.presentaddress || "Address not available"}</span>
            </div>

            {item.education && (
              <div className="flex items-center gap-2 text-gray-700">
                <GraduationCap className="h-4 w-4 text-[#1E3B90] flex-shrink-0" />
                <span className="text-sm truncate">{item.education}</span>
              </div>
            )}
          </div>

          {/* Footer with Actions - Fixed size */}
          <div className="px-6 pb-6 pt-2">
            <div className="flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-[#1E3B90] to-[#1E3B90] hover:from-[#1E3B90] hover:to-[#1E3B90] text-white font-medium py-2.5 px-3 rounded-xl shadow-md transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-sm">
                <Calendar className="h-3 w-3" />
                Book Now
              </button>
              <button className="flex-1 bg-gradient-to-r from-[#3D85EF] to-[#3D85EF] hover:from-[#3D85EF] hover:to-[#3D85EF] text-white font-medium py-2.5 px-3 rounded-xl shadow-sm transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-sm">
                <Stethoscope className="h-3 w-3" />
                Profile
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  // RowSection component
  const RowSection = ({ title, doctors, rowKey, icon: Icon, description }) => {
    const displayDoctors = expandedRows[rowKey] ? doctors : doctors.slice(0, 3);
    
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
          {doctors.length > 3 && (
            <button
              onClick={() => toggleRowExpansion(rowKey)}
              className="flex items-center gap-2 text-[#1E3B90] font-semibold hover:text-[#1E3B90] transition-colors px-4 py-2 rounded-lg hover:bg-[#1E3B90]/5"
            >
              {expandedRows[rowKey] ? "Show Less" : `View All (${doctors.length})`}
              <ChevronRight className={`h-4 w-4 transition-transform ${expandedRows[rowKey] ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>

        {doctors.length === 0 ? (
          <div className="flex justify-center items-center rounded-2xl bg-gradient-to-br from-[#1E3B90]/5 to-[#3D85EF]/5 border border-[#1E3B90]/20 p-8">
            <div className="text-center">
              <Stethoscope className="h-12 w-12 text-[#1E3B90] mx-auto mb-3" />
              <p className="text-[#1E3B90] font-medium text-lg">
                No doctors found in {activeCity || "your area"}
              </p>
              <p className="text-gray-600 mt-1">Please try changing your location or filters</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayDoctors.map((item, index) => (
              <DoctorCard key={index} item={item} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleSearchClick = () => {
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen px-0 md:px-8 bg-gradient-to-br from-[#1E3B90]/5 via-white to-[#3D85EF]/5">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold">
                  {specilitytype.title || "Expert Doctors"}
                </h1>
              </div>
              <p className="text-white/90 text-lg">Find trusted doctors in your area</p>
              
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
                  <div className="text-2xl font-bold">{filteredDoctors.length}</div>
                  <div className="text-white/80 text-sm">Doctors Found</div>
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
                  {Object.values(filters).filter(val => val !== "" && val !== activeCity).length}
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Properly working sticky behavior */}
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
            
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-8 max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Filter Doctors</h3>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Doctor</label>
                    <input
                      type="text"
                      className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent transition-all"
                      placeholder="Enter doctor name..."
                      value={filters.doctorName}
                      onChange={(e) => handleFilterChange("doctorName", e.target.value)}
                    />
                  </div>

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
                </div>

                {/* Hospital Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Type</label>
                  <select
                    className="w-full h-12 px-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white"
                    value={filters.hospitalType}
                    onChange={(e) => handleFilterChange("hospitalType", e.target.value)}
                  >
                    <option value="">Select Hospital Type</option>
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="Charitable">Charitable</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Multi-specialty">Multi-specialty</option>
                    <option value="Super-specialty">Super-specialty</option>
                  </select>
                </div>

                {/* Quick Filters */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                    <select
                      className="w-full h-12 px-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white"
                      value={filters.experience}
                      onChange={(e) => handleFilterChange("experience", e.target.value)}
                    >
                      <option value="">Any Experience</option>
                      <option value="1-5">1-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10-15">10-15 years</option>
                      <option value="15-20">15-20 years</option>
                      <option value="20+">20+ years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fee Range</label>
                    <select
                      className="w-full h-12 px-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white"
                      value={filters.doctorFee}
                      onChange={(e) => handleFilterChange("doctorFee", e.target.value)}
                    >
                      <option value="">Any Fee</option>
                      <option value="100-500">₹100 - ₹500</option>
                      <option value="500-1000">₹500 - ₹1000</option>
                      <option value="1000-2000">₹1000 - ₹2000</option>
                      <option value="2000-5000">₹2000 - ₹5000</option>
                      <option value="5000+">₹5000+</option>
                    </select>
                  </div>
                </div>

                {/* Location Section */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#1E3B90]" />
                    Location
                  </h4>
                  <div className="space-y-3">
                    {/* State Dropdown */}
                    <div className="relative">
                      <select
                        name="state"
                        value={member.state}
                        onChange={handleChange}
                        className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white"
                      >
                        <option value="">Select State</option>
                        {stateList.map((s) => (
                          <option key={s.id} value={s.stateName}>
                            {s.stateName}
                          </option>
                        ))}
                      </select>
                      <FaArrowCircleDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* District Dropdown */}
                    <div className="relative">
                      <select
                        name="district"
                        value={member.district}
                        onChange={handleChange}
                        disabled={!filteredDistricts.length}
                        className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white disabled:opacity-50"
                      >
                        <option value="">Select District</option>
                        {filteredDistricts.map((d) => (
                          <option key={d.id} value={d.district}>
                            {d.district}
                          </option>
                        ))}
                      </select>
                      <FaArrowCircleDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Taluka Dropdown */}
                    <div className="relative">
                      <select
                        name="taluka"
                        value={member.taluka}
                        onChange={handleChange}
                        disabled={!filteredSubDistricts.length}
                        className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white disabled:opacity-50"
                      >
                        <option value="">Select Taluka</option>
                        {filteredSubDistricts.map((sd) => (
                          <option key={sd.id} value={sd.subDistrict}>
                            {sd.subDistrict}
                          </option>
                        ))}
                      </select>
                      <FaArrowCircleDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* City Input */}
                    <input
                      type="text"
                      name="cityName"
                      value={filters.cityName}
                      onChange={(e) => handleFilterChange("cityName", e.target.value)}
                      className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent"
                      placeholder="Enter city name"
                    />
                    
                    {/* Pin Code Input */}
                    <input
                      type="text"
                      name="pincode"
                      value={filters.pincode}
                      onChange={(e) => handleFilterChange("pincode", e.target.value)}
                      className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent"
                      placeholder="Enter pin code"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSearchClick}
                  className="w-full bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] hover:from-[#1E3B90] hover:to-[#3D85EF] text-white font-semibold py-3 rounded-xl shadow-lg transition-all transform hover:scale-105"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side: Doctor Cards */}
          <div className="flex-1 min-w-0">
            {/* Doctor Lists - Removed the duplicate results summary */}
            {row1Doctors.length === 0 && row2Doctors.length === 0 && row3Doctors.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="h-8 w-8 text-[#1E3B90]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No doctors found</h3>
                  <p className="text-gray-600 mb-4">
                    No doctors found in {activeCity || "your area"}. Please try changing your filters or location.
                  </p>
                  <Button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] hover:from-[#1E3B90] hover:to-[#3D85EF] text-white"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                {row1Doctors.length > 0 && (
                  <RowSection 
                    title="Most Booked Doctors" 
                    doctors={row1Doctors} 
                    rowKey="row1"
                    icon={Users}
                    description="Based on patient appointments and reviews"
                  />
                )}
                {row2Doctors.length > 0 && (
                  <RowSection 
                    title="Premium Doctors" 
                    doctors={row2Doctors} 
                    rowKey="row2"
                    icon={Award}
                    description="Higher consultation fees with premium services"
                  />
                )}
                {row3Doctors.length > 0 && (
                  <RowSection 
                    title="Experienced Doctors" 
                    doctors={row3Doctors} 
                    rowKey="row3"
                    icon={Clock}
                    description="Senior doctors with extensive practice"
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

export default Doctorslistmainclient;

