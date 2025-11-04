"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ArrowDown, Briefcase, Filter, ChevronRight, Star, MapPin, ChevronDown, X, Users, Award, Clock, Heart, Shield, Calendar } from "lucide-react";
import { FaArrowDown } from "react-icons/fa6";
import Link from "next/link";
import { FaArrowCircleDown } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Hospitalmainclient = ({ 
  hospitaldetails, 
  hspcategoryname, 
  stateList, 
  districtList, 
  subdistrictList,
  patientCity 
}) => {
  const [states] = React.useState(stateList);
  const [dist] = React.useState(districtList);
  const [subdist] = React.useState(subdistrictList);

  const [userCity, setUserCity] = useState(patientCity || "");
  const [showCityInput, setShowCityInput] = useState(!patientCity);
  const [activeCity, setActiveCity] = useState(patientCity || "");

  const [filteredDistricts, setFilteredDistricts] = React.useState([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = React.useState([]);

  const [member, setMember] = React.useState({
    state: "",
    district: "",
    taluka: "",
    surgeryCategory: "",
    treatmentCategory: "",
    hospitalFacilities: "",
    bedCategory: "",
    city: patientCity || "",
    pinCode: "",
    hospitalName: "", 
  });

  const [errors, setErrors] = React.useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHospitals, setFilteredHospitals] = useState(hospitaldetails);
  const [visibleHospitals, setVisibleHospitals] = useState(9);
  const [showFilters, setShowFilters] = useState(false);
  const [expertHospitals, setExpertHospitals] = useState(false);
  
  // State for row expansion
  const [expandedRows, setExpandedRows] = useState({
    row1: false,
    row2: false,
    row3: false,
    row4: false,
    row5: false
  });

  // Filter hospitals by city
  const filterHospitalsByCity = (hospitals, city) => {
    if (!city) return hospitals;
    return hospitals.filter((hospital) => {
      const hospitalCity = hospital.hspcontact?.city || "";
      return hospitalCity.toLowerCase().includes(city.toLowerCase());
    });
  };

  // Calculate counts for each hospital
  const hospitalsWithCounts = React.useMemo(() => {
    return hospitaldetails.map(hospital => {
      // Surgery bookings count
      const surgeryBookingsCount = hospital.Surgeytreatment?.reduce((total, surgery) => {
        return total + (surgery.BookSurgeryTreatment?.length || 0);
      }, 0) || 0;

      // Treatment bookings count (non-surgery)
      const treatmentBookingsCount = hospital._count?.BookTreatment || 0;

      // Bed bookings count
      const bedBookingsCount = hospital._count?.BedBooking || 0;

      // Ambulance bookings count
      const ambulanceBookingsCount = hospital._count?.BookAmbulance || 0;

      // Reviews count
      const reviewsCount = hospital._count?.reviews || 0;

      return {
        ...hospital,
        surgeryBookingsCount,
        treatmentBookingsCount,
        bedBookingsCount,
        ambulanceBookingsCount,
        reviewsCount
      };
    });
  }, [hospitaldetails]);

  // Row 1: Hospitals ordered by highest number of surgery bookings
  const row1Hospitals = React.useMemo(() => {
    return [...filteredHospitals].sort(
      (a, b) => (b.surgeryBookingsCount || 0) - (a.surgeryBookingsCount || 0)
    );
  }, [filteredHospitals]);

  // Row 2: Hospitals ordered by highest number of treatment bookings
  const row2Hospitals = React.useMemo(() => {
    return [...filteredHospitals].sort(
      (a, b) => (b.treatmentBookingsCount || 0) - (a.treatmentBookingsCount || 0)
    );
  }, [filteredHospitals]);

  // Row 3: Hospitals ordered by highest number of bed bookings
  const row3Hospitals = React.useMemo(() => {
    return [...filteredHospitals].sort(
      (a, b) => (b.bedBookingsCount || 0) - (a.bedBookingsCount || 0)
    );
  }, [filteredHospitals]);

  // Row 4: Hospitals ordered by highest number of ambulance bookings
  const row4Hospitals = React.useMemo(() => {
    return [...filteredHospitals].sort(
      (a, b) => (b.ambulanceBookingsCount || 0) - (a.ambulanceBookingsCount || 0)
    );
  }, [filteredHospitals]);

  // Row 5: Hospitals ordered by highest number of reviews
  const row5Hospitals = React.useMemo(() => {
    return [...filteredHospitals].sort(
      (a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0)
    );
  }, [filteredHospitals]);


  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleViewMore = () => {
    setVisibleHospitals(visibleHospitals + 8);
  };

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
  
  useEffect(() => {
    handleFilter();
  }, [member, searchQuery]);

  const handleFilter = () => {
    const filtered = hospitaldetails.filter((item) => {
      const regname = item.hspInfo?.regname || "";

      const matchesSearchQuery = regname.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesHospitalName = member.hospitalName
        ? regname.toLowerCase().includes(member.hospitalName.toLowerCase())
        : true;

    // Surgery category filter - make it more flexible
    const matchesSurgeryCategory = member.surgeryCategory
      ? item.Surgeytreatment?.some(st => 
          st.serviceName?.toLowerCase().includes(member.surgeryCategory.toLowerCase()) ||
          st.category?.toLowerCase().includes(member.surgeryCategory.toLowerCase())
        )
      : true;

    // Treatment category filter - check multiple possible locations
    const matchesTreatmentCategory = member.treatmentCategory
      ? // Check treatmentCategories first
        (item.treatmentCategories?.some(tc => 
          tc.serviceName?.toLowerCase().includes(member.treatmentCategory.toLowerCase())
        ) ||
        // Check Surgeytreatment as well (some treatments might be there)
        item.Surgeytreatment?.some(st => 
          st.serviceName?.toLowerCase().includes(member.treatmentCategory.toLowerCase()) &&
          st.category?.toLowerCase() !== 'surgery' // Exclude actual surgeries
        ) ||
        // Check other potential locations
        
        item.LabTest?.some(lt => 
          lt.serviceName?.toLowerCase().includes(member.treatmentCategory.toLowerCase())
        ))
      : true;

      const matchesHospitalFacilities = member.hospitalFacilities
        ? item.hospitalFacilities?.includes(member.hospitalFacilities)
        : true;

      const matchesBedCategory = member.bedCategory
        ? item.bedCategories?.includes(member.bedCategory)
        : true;

      const matchesState = member.state
        ? item.hspcontact?.state === member.state
        : true;

      const matchesDistrict = member.district
        ? item.hspcontact?.district === member.district
        : true;

      const matchesTaluka = member.taluka
        ? item.hspcontact?.taluka === member.taluka
        : true;

      const matchesCity = member.city
        ? item.hspcontact?.city === member.city
        : true;

      const matchesPinCode = member.pinCode
        ? item.hspcontact?.pincode === member.pinCode
        : true;

      return (
        matchesSearchQuery &&
        matchesHospitalName &&
        matchesSurgeryCategory &&
        matchesTreatmentCategory &&
        matchesHospitalFacilities &&
        matchesBedCategory &&
        matchesState &&
        matchesDistrict &&
        matchesTaluka &&
        matchesCity &&
        matchesPinCode
      );
    });

    setFilteredHospitals(filtered);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setMember(prev => {
      const updatedMember = { ...prev, [name]: value };
  
      // Reset dependent fields
      if (name === "state") {
        updatedMember.district = "";
        updatedMember.taluka = "";
      }
  
      if (name === "district") {
        updatedMember.taluka = "";
      }
  
      return updatedMember;
    });
  };

  const toggleRowExpansion = (row) => {
    setExpandedRows(prev => ({
      ...prev,
      [row]: !prev[row]
    }));
  };

  // Handle search click to hide filters
  const handleSearchClick = () => {
    setShowFilters(false);
  };

  const HospitalCard = ({ item }) => (
    <Link href={`/hospital/${hspcategoryname.id}/${item.id}`}>
      <Card className="h-full min-h-[320px] flex flex-col overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl hover:translate-y-[-4px] group">
        <CardContent className="p-0 flex flex-col flex-grow justify-between">
          {/* Header with Status Badge */}
          <div className="relative">
            
            {/* Hospital Image and Basic Info */}
            <div className="bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 p-6 rounded-t-2xl">
              <div className="flex items-center gap-4">
                {item.hspdetails?.hsplogo ? (
                  <div className="relative">
                    <Image
                      src={item.hspdetails.hsplogo}
                      width={80}
                      height={80}
                      alt={item.hspInfo?.regname || "Hospital image"}
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
                    {item.hspInfo?.regname || "Hospital Name"}
                  </h3>
                  <p className="text-[#1E3B90] text-base font-semibold mb-2">
                    {hspcategoryname?.title || "Hospital"}
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
                    <span className="text-xs text-gray-600">({item.reviewsCount || 129} Reviews)</span>
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
                <span>{item.hspInfo?.totaldoctor || "Not available"} doctors</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Star className="h-4 w-4 text-[#1E3B90]" />
                <span className="truncate">{item.hspInfo?.totalnoofbed || "Not available"} beds</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4 text-[#1E3B90] flex-shrink-0" />
              <span className="text-sm line-clamp-2">
                {item.hspcontact?.city ? `${item.hspcontact.city}${item.hspcontact?.state ? `, ${item.hspcontact.state}` : ''}` : 
                 item.hspcontact?.address || "Address not available"}
              </span>
            </div>

            {item.hspInfo?.hspcategory && (
              <div className="flex items-center gap-2 text-gray-700">
                <Shield className="h-4 w-4 text-[#1E3B90] flex-shrink-0" />
                <span className="text-sm truncate">{item.hspInfo.hspcategory}</span>
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

  // RowSection component
  const RowSection = ({ title, hospitals, rowKey, icon: Icon, description }) => {
    const displayHospitals = expandedRows[rowKey] ? hospitals : hospitals.slice(0, 3);
    
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
          {hospitals.length > 3 && (
            <button
              onClick={() => toggleRowExpansion(rowKey)}
              className="flex items-center gap-2 text-[#3D85EF] font-semibold hover:text-[#1E3B90] transition-colors px-4 py-2 rounded-lg hover:bg-[#3D85EF]/5"
            >
              {expandedRows[rowKey] ? "Show Less" : `View All (${hospitals.length})`}
              <ChevronRight className={`h-4 w-4 transition-transform ${expandedRows[rowKey] ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>

        {hospitals.length === 0 ? (
          <div className="flex justify-center items-center rounded-2xl bg-gradient-to-br from-[#1E3B90]/5 to-[#3D85EF]/5 border border-[#3D85EF]/20 p-8">
            <div className="text-center">
              <Briefcase className="h-12 w-12 text-[#1E3B90] mx-auto mb-3" />
              <p className="text-[#1E3B90] font-medium text-lg">
                No hospitals found in {activeCity || "your area"}
              </p>
              <p className="text-gray-600 mt-1">Please try changing your location or filters</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayHospitals.map((item, index) => (
              <HospitalCard key={index} item={item} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const submenu = [
    { title: "Goverment Hospitals", link: "#" },
    { title: "Private Hospitals", link: "#" },
    { title: "NABH Hospitals", link: "#" },
    { title: "MJPJAY Hospitals", link: "#" },
    { title: "ESIC Hospitals", link: "#" },
    { title: "CGHS Hospitals", link: "#" },
    { title: "Truma Care Hospitals", link: "#" },
    { title: "Cardiac Care Hospitals", link: "#" },
    { title: "Mother & Child Hospitals", link: "#" },
    { title: "Speciality Hospitals", link: "#" },
    { title: "Multispeciality Hospitals", link: "#" },
    { title: "Super-Speciality Hospitals", link: "#" },
    { title: "Cancer Hospitals", link: "#" },
    { title: "Eye Hospitals", link: "#" },
    { title: "IVF Centers", link: "#" },
    { title: "Dialysis Centers", link: "#" },
    { title: "Dental Clinics", link: "#" },
    { title: "Small Clinics", link: "#" },
  ];

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
                  {hspcategoryname?.title || "Hospitals"}
                </h1>
              </div>
              <p className="text-white/90 text-lg">Find trusted hospitals in your area</p>
              
              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-6 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-white/80 text-sm">Emergency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-white/80 text-sm">Verified</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{filteredHospitals.length}</div>
                  <div className="text-white/80 text-sm">Hospitals Found</div>
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
                <h3 className="text-xl font-bold text-gray-800">Filter Hospitals</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setMember({
                        state: "",
                        district: "",
                        taluka: "",
                        surgeryCategory: "",
                        treatmentCategory: "",
                        hospitalFacilities: "",
                        bedCategory: "",
                        city: patientCity || "",
                        pinCode: "",
                        hospitalName: "",
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Hospital</label>
                    <input
                      type="text"
                      name="hospitalName"
                      value={member.hospitalName}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent transition-all"
                      placeholder="Enter hospital name..."
                    />
                  </div>
                </div>

                {/* Surgery Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Surgery Category</label>
                  <select
                    name="surgeryCategory"
                    value={member.surgeryCategory}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white"
                  >
                      <option value="" className="bg-gray-50 text-[#453565]">Surgery Category</option>
                      <option value="Bone / Orthopedics" className="bg-gray-50 text-[#453565]">
                        Bone / Orthopedics
                      </option>
                      <option value="Gynecology" className="bg-gray-50 text-[#453565]">Gynecology</option>
                      <option value="Mother & Child Care" className="bg-gray-50 text-[#453565]">
                        Mother & Child Care
                      </option>
                      <option value="IVF" className="bg-gray-50 text-[#453565]">IVF</option>
                      <option value="Proctology / Lower Body / General" className="bg-gray-50 text-[#453565]">
                        Proctology / Lower Body / General
                      </option>
                      <option value="Abdomen" className="bg-gray-50 text-[#453565]">Abdomen</option>
                      <option value="Laparoscopy / Lower Body / General" className="bg-gray-50 text-[#453565]">
                        Laparoscopy / Lower Body / General
                      </option>
                      <option value="Urology / Kidney" className="bg-gray-50 text-[#453565]">Urology / Kidney</option>
                      <option value="Vascular / General" className="bg-gray-50 text-[#453565]">
                        Vascular / General
                      </option>
                      <option value="Aesthetic / Skin" className="bg-gray-50 text-[#453565]">Aesthetic / Skin</option>
                      <option value="Ophthalmology / Eye" className="bg-gray-50 text-[#453565]">
                        Ophthalmology / Eye
                      </option>
                      <option value="Dental" className="bg-gray-50 text-[#453565]">Dental</option>
                      <option value="ENT" className="bg-gray-50 text-[#453565]">ENT</option>
                      <option value="Brain" className="bg-gray-50 text-[#453565]">Brain</option>
                      <option value="Liver" className="bg-gray-50 text-[#453565]">Liver</option>
                      <option value="Heart" className="bg-gray-50 text-[#453565]">Heart</option>
                      <option value="Lungs" className="bg-gray-50 text-[#453565]">Lungs</option>
                      <option value="Cancer" className="bg-gray-50 text-[#453565]">Cancer</option>
                    </select>
                  </div>

                  {/* Treatment Category Filter */}
                  <div className="mb-2 relative">
                    <select
                      name="treatmentCategory"
                      value={member.treatmentCategory}
                      onChange={handleChange}
                      className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-xl placeholder:pl-2 placeholder:text-gray-500 text-gray-700 bg-white border border-gray-300 appearance-none"
                      required
                    >
                      <option value="" className="bg-gray-50 text-[#453565]">Treatment Category</option>
                      <option value="Physical Therapy" className="bg-gray-50 text-[#453565]">Physical Therapy</option>
                      <option value="Shoulder Dislocation" className="bg-gray-50 text-[#453565]">
                        Shoulder Dislocation
                      </option>
                      <option value="Tendonitis" className="bg-gray-50 text-[#453565]">Tendonitis</option>
                      <option value="Ligament Tear" className="bg-gray-50 text-[#453565]">Ligament Tear</option>
                      <option value="Sprains and Strains" className="bg-gray-50 text-[#453565]">
                        Sprains and Strains
                      </option>
                      <option value="Frozen Shoulder" className="bg-gray-50 text-[#453565]">Frozen Shoulder</option>
                      <option value="Tennis Elbow" className="bg-gray-50 text-[#453565]">Tennis Elbow</option>
                      <option value="Vaginal Wart Removal" className="bg-gray-50 text-[#453565]">
                        Vaginal Wart Removal
                      </option>
                      <option value="Bartholin Cyst" className="bg-gray-50 text-[#453565]">Bartholin Cyst</option>
                      <option value="PCOD / PCOS Treatment" className="bg-gray-50 text-[#453565]">
                        PCOD / PCOS Treatment
                      </option>
                      <option value="Loose Vagina Treatment" className="bg-gray-50 text-[#453565]">
                        Loose Vagina Treatment
                      </option>
                      <option value="Pregnancy Care" className="bg-gray-50 text-[#453565]">Pregnancy Care</option>
                      <option value="Miscarriage" className="bg-gray-50 text-[#453565]">Miscarriage</option>
                      <option value="Piles Treatment" className="bg-gray-50 text-[#453565]">Fistula Treatment</option>
                      <option value="Fistula Treatment" className="bg-gray-50 text-[#453565]">Fistula Treatment</option>
                      <option value="Appendicitis Treatment" className="bg-gray-50 text-[#453565]">
                        Appendicitis Treatment
                      </option>
                      <option value="Cystoscopy" className="bg-gray-50 text-[#453565]">Cystoscopy</option>
                      <option value="Prostate Biopsy" className="bg-gray-50 text-[#453565]">Prostate Biopsy</option>
                      <option value="Dialysis" className="bg-gray-50 text-[#453565]">Dialysis</option>
                      <option value="Central Line" className="bg-gray-50 text-[#453565]">Central Line</option>
                      <option value="Obesity / Diet / Fibromuscular Dysplasia" className="bg-gray-50 text-[#453565]">
                        Obesity / Diet / Fibromuscular Dysplasia
                      </option>
                      <option value="Blood Pressure / Thinners / Blood Clot" className="bg-gray-50 text-[#453565]">
                        Blood Pressure / Thinners / Blood Clot
                      </option>
                      <option value="Hydrafacial" className="bg-gray-50 text-[#453565]">Hydrafacial</option>
                      <option value="Laser Toning" className="bg-gray-50 text-[#453565]">Laser Toning</option>
                      <option value="Carbon Laser Peel" className="bg-gray-50 text-[#453565]">Carbon Laser Peel</option>
                      <option value="Injectable Skin Boosters" className="bg-gray-50 text-[#453565]">
                        Injectable Skin Boosters
                      </option>
                      <option value="Chemical Peel" className="bg-gray-50 text-[#453565]">Chemical Peel</option>
                      <option value="Dermal Fillers" className="bg-gray-50 text-[#453565]">Dermal Fillers</option>
                      <option value="Botox" className="bg-gray-50 text-[#453565]">Botox</option>
                      <option value="Teeth Braces Treatment" className="bg-gray-50 text-[#453565]">
                        Teeth Braces Treatment
                      </option>
                      <option value="Root Canal Treatment" className="bg-gray-50 text-[#453565]">
                        Root Canal Treatment
                      </option>
                      <option value="Teeth Cleaning" className="bg-gray-50 text-[#453565]">Teeth Cleaning</option>
                      <option value="Dental Check-up" className="bg-gray-50 text-[#453565]">Dental Check-up</option>
                      <option value="Teeth Scaling and Polishing" className="bg-gray-50 text-[#453565]">
                        Teeth Scaling and Polishing
                      </option>
                      <option value="Teeth Whitening and Bleaching" className="bg-gray-50 text-[#453565]">
                        Teeth Whitening and Bleaching
                      </option>
                      <option value="Dental X-Ray" className="bg-gray-50 text-[#453565]">Dental X-Ray</option>
                      <option value="Dental OPG" className="bg-gray-50 text-[#453565]">Dental OPG</option>
                      <option value="Oral Health Guide" className="bg-gray-50 text-[#453565]">Oral Health Guide</option>
                      <option value="Ear Cleaning" className="bg-gray-50 text-[#453565]">Ear Cleaning</option>
                      <option value="Tonsillectomy / Tonsil Treatment" className="bg-gray-50 text-[#453565]">
                        Tonsillectomy / Tonsil Treatment
                      </option>
                      <option value="FITS" className="bg-gray-50 text-[#453565]">FITS</option>
                      <option value="Weight Loss" className="bg-gray-50 text-[#453565]">Weight Loss</option>
                      <option value="Band Ligation" className="bg-gray-50 text-[#453565]">Band Ligation</option>
                      <option value="Lung Biopsy" className="bg-gray-50 text-[#453565]">Lung Biopsy</option>
                      <option value="Bronchoscopy" className="bg-gray-50 text-[#453565]">Bronchoscopy</option>
                      <option value="Valve Therapy" className="bg-gray-50 text-[#453565]">Valve Therapy</option>
                      <option value="Chemotherapy" className="bg-gray-50 text-[#453565]">Chemotherapy</option>
                      <option value="Radiation Therapy" className="bg-gray-50 text-[#453565]">Radiation Therapy</option>
                      <option value="Immunotherapy" className="bg-gray-50 text-[#453565]">Immunotherapy</option>
                      <option value="Hormone therapy" className="bg-gray-50 text-[#453565]">Hormone therapy</option>
                      <option value="Targeted Drug Therapy" className="bg-gray-50 text-[#453565]">
                        Targeted Drug Therapy
                      </option>
                      <option value="Cryoablation" className="bg-gray-50 text-[#453565]">Cryoablation</option>
                      <option value="Cancer Investigation - Biopsy" className="bg-gray-50 text-[#453565]">
                        Cancer Investigation - Biopsy
                      </option>
                      <option value="Cancer Investigation - IHC Investigation" className="bg-gray-50 text-[#453565]">
                        Cancer Investigation - IHC Investigation
                      </option>
                    </select>
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ChevronDown
                        className="md:h-5 md:w-5 h-4 w-4 text-gray-500"
                      />
                    </span>
                  </div>

                  {/* Hospital Facilities Filter */}
                  <div className="mb-2 relative">
                    <select
                      name="hospitalFacilities"
                      value={member.hospitalFacilities}
                      onChange={handleChange}
                      className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-xl placeholder:pl-2 placeholder:text-gray-500 text-gray-700 bg-white border border-gray-300 appearance-none"
                      required
                    >
                      <option value="" className="bg-gray-50 text-[#453565]">Hospital Facilities</option>
                      <option value="Doctors" className="bg-gray-50 text-[#453565]">Doctors</option>
                      <option value="Dialysis" className="bg-gray-50 text-[#453565]">Dialysis</option>
                      <option value="Diagnostics" className="bg-gray-50 text-[#453565]">Diagnostics</option>
                      <option value="Radiology" className="bg-gray-50 text-[#453565]">Radiology</option>
                      <option value="Pathology" className="bg-gray-50 text-[#453565]">Pathology</option>
                      <option value="Wellness" className="bg-gray-50 text-[#453565]">Wellness</option>
                      <option value="Cashless" className="bg-gray-50 text-[#453565]">Cashless</option>
                      <option value="Ambulance" className="bg-gray-50 text-[#453565]">Ambulance</option>
                      <option value="Home Healthcare" className="bg-gray-50 text-[#453565]">Home Healthcare</option>
                      <option value="Corporate Healthcare" className="bg-gray-50 text-[#453565]">
                        Corporate Healthcare
                      </option>
                      <option value="Other Branches" className="bg-gray-50 text-[#453565]">Other Branches</option>
                    </select>
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ChevronDown
                        className="md:h-5 md:w-5 h-4 w-4 text-gray-500"
                      />
                    </span>
                  </div>

                  {/* Bed Category Filter */}
                  <div className="mb-2 relative">
                    <select
                      name="bedCategory"
                      value={member.bedCategory}
                      onChange={handleChange}
                      className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-xl placeholder:pl-2 placeholder:text-gray-500 text-gray-700 bg-white border border-gray-300 appearance-none"
                      required
                    >
                      <option value="" className="bg-gray-50 text-[#453565]">Bed Category</option>
                      {[
                        "ICU Ventilator Bed",
                        "ICU Bed",
                        "CCU",
                        "NICU",
                        "PICU Ventilator Bed",
                        "PICU Bed",
                        "HDU",
                        "Suite Room Bed",
                        "Deluxe Room Bed",
                        "Private Single Sharing Bed",
                        "Non AC Private Single Sharing Bed",
                        "Semi Private Sharing Bed",
                        "Non AC Semi Private Sharing Bed",
                        "Male Ward Bed",
                        "Female Ward Bed",
                        "General Ward",
                        "Day Care",
                      ].map((type, index) => (
                        <option key={index} className="bg-gray-50 text-[#453565]" value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ChevronDown
                        className="md:h-5 md:w-5 h-4 w-4 text-gray-500"
                      />
                    </span>
                  </div>

                  {/* State Filter */}
                  <div className="mb-2 relative">
                    <select
                      name="state"
                      value={member.state}
                      onChange={handleChange}
                      className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-xl placeholder:pl-2 placeholder:text-gray-500 text-gray-700 bg-white border border-gray-300 appearance-none"
                      required
                    >
                      <option value="" className="bg-gray-50 text-[#453565]">Select State</option>
                      {stateList.map((s) => (
                        <option key={s.id} value={s.stateName} className="bg-gray-50 text-[#453565]">
                          {s.stateName}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="md:h-5 md:w-5 h-4 w-4 text-gray-500" />
                    </span>
                  </div>

                  {/* District Filter */}
                  <div className="mb-2 relative">
                    <select
                      name="district"
                      value={member.district}
                      onChange={handleChange}
                      disabled={!filteredDistricts.length}
                      className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-xl placeholder:pl-2 placeholder:text-gray-500 text-gray-700 bg-white border border-gray-300 appearance-none disabled:opacity-50"
                      required
                    >
                      <option value="" className="bg-gray-50 text-[#453565]">Select District</option>
                      {filteredDistricts.map((d) => (
                        <option key={d.id} value={d.district} className="bg-gray-50 text-[#453565]">
                          {d.district}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="md:h-5 md:w-5 h-4 w-4 text-gray-500" />
                    </span>
                  </div>

                  {/* Taluka Filter */}
                  <div className="mb-2 relative">
                    <select
                      name="taluka"
                      value={member.taluka}
                      onChange={handleChange}
                      disabled={!filteredSubDistricts.length}
                      className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-xl placeholder:pl-2 placeholder:text-gray-500 text-gray-700 bg-white border border-gray-300 appearance-none disabled:opacity-50"
                      required
                    >
                      <option value="" className="bg-gray-50 text-[#453565]">Select Taluka</option>
                      {filteredSubDistricts.map((sd) => (
                        <option key={sd.id} value={sd.subDistrict} className="bg-gray-50 text-[#453565]">
                          {sd.subDistrict}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="md:h-5 md:w-5 h-4 w-4 text-gray-500" />
                    </span>
                  </div>

                  {/* City Filter */}
                  <div className="mb-2 relative">
                    <input
                      type="text"
                      name="city"
                      value={member.city}
                      onChange={handleChange}
                      className="w-full h-10 p-2 text-gray-700 bg-white border border-gray-300 rounded-xl placeholder:text-gray-500 placeholder:text-[14px]"
                      placeholder="Enter City Name"
                      required
                    />
                  </div>

                  {/* Pin Code Filter */}
                  <div className="mb-2 relative">
                    <input
                      type="text"
                      name="pinCode"
                      value={member.pinCode}
                      onChange={handleChange}
                      className="w-full h-10 p-2 text-gray-700 bg-white border border-gray-300 rounded-xl placeholder:text-gray-500 placeholder:text-[14px]"
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

            {/* Expert Hospitals Panel */}
            {expertHospitals && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mt-4">
                <h4 className="font-bold text-gray-800 mb-4 text-center">Hospital Types</h4>
                <div className="max-h-64 overflow-y-auto">
                  <ul className="space-y-2">
                    {submenu.map((item, index) => (
                      <li key={index}>
                        <a
                          href={item.link}
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-[#1E3EA0]/5 hover:text-[#1E3EA0] rounded-lg transition-colors"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Hospital Cards */}
          <div className="flex-1 min-w-0">
  {row1Hospitals.length === 0 && row2Hospitals.length === 0 && row3Hospitals.length === 0 && row4Hospitals.length === 0 && row5Hospitals.length === 0 ? (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
      <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-8 w-8 text-[#1E3B90]" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No hospitals found</h3>
        <p className="text-gray-600 mb-4">
          No hospitals found in {activeCity || "your area"}. Please try changing your filters or location.
        </p>
        <Button
          onClick={() => {
            setMember({
              state: "",
              district: "",
              taluka: "",
              surgeryCategory: "",
              treatmentCategory: "",
              hospitalFacilities: "",
              bedCategory: "",
              city: patientCity || "",
              pinCode: "",
              hospitalName: "",
            });
            setFilteredDistricts([]);
            setFilteredSubDistricts([]);
          }}
                    className="bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] hover:from-[#3D85EF] hover:to-[#1E3B90] text-white"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  ) : (
    <div className="space-y-12">
      {row1Hospitals.length > 0 && (
        <RowSection 
          title="Top Surgery Hospitals" 
          hospitals={row1Hospitals} 
          rowKey="row1"
          icon={Heart}
          description="Based on surgery bookings and patient reviews"
        />
      )}
      {row2Hospitals.length > 0 && (
        <RowSection 
          title="Top Treatment Hospitals" 
          hospitals={row2Hospitals} 
          rowKey="row2"
          icon={Award}
          description="Leading hospitals for medical treatments"
        />
      )}
      {row3Hospitals.length > 0 && (
        <RowSection 
          title="Top Bed Booking Hospitals" 
          hospitals={row3Hospitals} 
          rowKey="row3"
          icon={Users}
          description="Hospitals with highest bed availability"
        />
      )}
      {row4Hospitals.length > 0 && (
        <RowSection 
          title="Top Ambulance Service Hospitals" 
          hospitals={row4Hospitals} 
          rowKey="row4"
          icon={Clock}
          description="Emergency services and ambulance availability"
        />
      )}
      {row5Hospitals.length > 0 && (
        <RowSection 
          title="Top Rated Hospitals" 
          hospitals={row5Hospitals} 
          rowKey="row5"
          icon={Star}
          description="Highest rated hospitals by patients"
        />
      )}
    </div>
  )}

  {/* View More Button for all hospitals */}
  {filteredHospitals.length > visibleHospitals && (
    <div className="flex justify-center mt-8">
      <button
        onClick={handleViewMore}
        className="bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] hover:from-[#3D85EF] hover:to-[#1E3B90] text-white py-3 px-8 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105"
      >
        View More Hospitals
      </button>
    </div>
  )}
</div>
        </div>
      </div>
    </div>
  );
};

export default Hospitalmainclient;
