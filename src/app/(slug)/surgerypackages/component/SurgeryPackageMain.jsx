"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, MapPin, Building2, Filter, Star, ChevronRight, Heart, Award, Users, Clock, X, Shield } from "lucide-react";
import { DollarSign } from "lucide-react";
import { FaArrowCircleDown, FaHospitalAlt } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SurgeryPackageMain = ({ surgeryTreatmentData, specilitytype, stateList, districtList, subdistrictList, patientCity }) => {
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
  });

  const [errors, setErrors] = React.useState({});
  const [selectedType, setSelectedType] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [selectedHospitalCategory, setSelectedHospitalCategory] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTaluka, setSelectedTaluka] = useState("");
  const [selectedCity, setSelectedCity] = useState(patientCity || "");
  const [showFilter, setShowFilters] = useState(false);
  const [showDFilters, setShowDFilters] = useState(false);

  // Patient city state
  const [userCity, setUserCity] = useState(patientCity || "");
  const [showCityInput, setShowCityInput] = useState(!patientCity);
  const [activeCity, setActiveCity] = useState(patientCity || "");

  // Row expansion state
  const [expandedRows, setExpandedRows] = useState({
    row1: false,
    row2: false,
    row3: false,
    row4: false,
    row5: false
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

  const getUniqueCategories = () => {
    if (!selectedType) return [];
    return [
      ...new Set(
        surgeryTreatmentData
          .filter((item) => item.type === selectedType)
          .map((item) => item.category)
      ),
    ];
  };

  const getUniqueServices = () => {
    if (!selectedType || !selectedCategory) return [];
    return [
      ...new Set(
        surgeryTreatmentData
          .filter(
            (item) =>
              item.type === selectedType && item.category === selectedCategory
          )
          .map((item) => item.serviceName)
      ),
    ];
  };

  const getUniqueHospitalCategories = () => {
    const categories = [];
    surgeryTreatmentData.forEach((item) => {
      if (item.hospital?.hspInfo?.hspcategory) {
        item.hospital.hspInfo.hspcategory.forEach((cat) => {
          if (cat.hspcategory?.title) {
            categories.push(cat.hspcategory.title);
          }
        });
      }
    });
    return [...new Set(categories)];
  };


  // Filter packages by city
  const filterPackagesByCity = (packages, city) => {
    if (!city) return packages;
    return packages.filter((item) => {
      const packageCity = item.hospital?.hspcontact?.city || "";
      return packageCity.toLowerCase().includes(city.toLowerCase());
    });
  };


  const getUniqueStates = () => {
    return [
      ...new Set(
        surgeryTreatmentData
          .map((item) => item.hospital?.hspcontact?.state)
          .filter(Boolean)
      ),
    ];
  };

  const getUniqueDistricts = () => {
    let filtered = surgeryTreatmentData;
    if (selectedState) {
      filtered = filtered.filter(
        (item) => item.hospital?.hspcontact?.state === selectedState
      );
    }
    return [
      ...new Set(
        filtered.map((item) => item.hospital?.hspcontact?.dist).filter(Boolean)
      ),
    ];
  };

  const getUniqueTalukas = () => {
    let filtered = surgeryTreatmentData;
    if (selectedState) {
      filtered = filtered.filter(
        (item) => item.hospital?.hspcontact?.state === selectedState
      );
    }
    if (selectedDistrict) {
      filtered = filtered.filter(
        (item) => item.hospital?.hspcontact?.dist === selectedDistrict
      );
    }
    return [
      ...new Set(
        filtered
          .map((item) => item.hospital?.hspcontact?.taluka)
          .filter(Boolean)
      ),
    ];
  };

  const getUniqueCities = () => {
    let filtered = surgeryTreatmentData;
    if (selectedState) {
      filtered = filtered.filter(
        (item) => item.hospital?.hspcontact?.state === selectedState
      );
    }
    if (selectedDistrict) {
      filtered = filtered.filter(
        (item) => item.hospital?.hspcontact?.dist === selectedDistrict
      );
    }
    if (selectedTaluka) {
      filtered = filtered.filter(
        (item) => item.hospital?.hspcontact?.taluka === selectedTaluka
      );
    }
    return [
      ...new Set(
        filtered.map((item) => item.hospital?.hspcontact?.city).filter(Boolean)
      ),
    ];
  };

  // Process packages with proper counts
  const processedPackages = useMemo(() => {
    return surgeryTreatmentData.map(item => ({
      ...item,
      // Get surgery bookings count for this specific service
      surgeryBookingsCount: item._count?.BookSurgeryTreatment || 0,
      // Get treatment bookings count for this specific service
      treatmentBookingsCount: item.type === "Treatment" ? item._count?.BookSurgeryTreatment || 0 : 0,
      // Total services count for the hospital
      totalServicesCount: item.hospital?._count?.Surgeytreatment || 0,
      // Reviews count for the hospital
      reviewsCount: item.hospital?._count?.reviews || 0,
      // Hospital surgery bookings count
      hospitalSurgeryBookingsCount: item.hospital?._count?.BookSurgeryTreatment || 0,
      // Hospital treatment bookings count
      hospitalTreatmentBookingsCount: item.hospital?._count?.BookSurgeryTreatmentTreatment || 0,
    }));
  }, [surgeryTreatmentData]);


  const applyFiltersAndSort = useMemo(() => {
    let currentPackages = [...processedPackages];

    // Filter by patient city first
    currentPackages = filterPackagesByCity(currentPackages, activeCity);

    // ... (rest of your existing filter logic remains the same)
    if (selectedType) {
      currentPackages = currentPackages.filter((item) => item.type === selectedType);
    }

    if (selectedCategory) {
      currentPackages = currentPackages.filter((item) => item.category === selectedCategory);
    }

    if (selectedService) {
      currentPackages = currentPackages.filter((item) => item.serviceName === selectedService);
    }

    if (selectedHospitalCategory) {
      currentPackages = currentPackages.filter((item) => {
        return item.hospital?.hspInfo?.hspcategory?.some(
          (cat) => cat.hspcategory?.title === selectedHospitalCategory
        );
      });
    }

    if (selectedState) {
      currentPackages = currentPackages.filter(
        (item) => item.hospital?.hspcontact?.state === selectedState
      );
    }

    if (selectedDistrict) {
      currentPackages = currentPackages.filter(
        (item) => item.hospital?.hspcontact?.dist === selectedDistrict
      );
    }

    if (selectedTaluka) {
      currentPackages = currentPackages.filter(
        (item) => item.hospital?.hspcontact?.taluka === selectedTaluka
      );
    }

    if (selectedCity) {
      currentPackages = currentPackages.filter(
        (item) => (item.hospital?.hspcontact?.city || "").toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    if (searchQuery) {
      currentPackages = currentPackages.filter(
        (item) =>
          item.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.hospital?.hspInfo?.regname
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    if (priceRange) {
      currentPackages = currentPackages.filter((item) => {
        const minPrice = Number.parseInt(item.minPrice) || 0;
        const maxPrice = Number.parseInt(item.maxPrice) || 0;

        switch (priceRange) {
          case "0-100":
            return maxPrice <= 100;
          case "100-500":
            return minPrice >= 100 && maxPrice <= 500;
          case "500-1000":
            return minPrice >= 500 && maxPrice <= 1000;
          case "1000+":
            return minPrice >= 1000;
          default:
            return true;
        }
      });
    }

    return currentPackages;
  }, [processedPackages, activeCity, selectedType, selectedCategory, selectedService,
    selectedHospitalCategory, selectedState, selectedDistrict, selectedTaluka,
    selectedCity, searchQuery, priceRange]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleViewMore = () => {
    setVisiblePackages(visiblePackages + 8);
  };

  

  const handleReset = () => {
    setSelectedType("");
    setSelectedCategory("");
    setSelectedService("");
    setSelectedHospitalCategory("");
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedTaluka("");
    setSelectedCity("");
    setSearchQuery("");
    setPriceRange("");
    setFilteredPackages(surgeryTreatmentData);
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedDistrict("");
    setSelectedTaluka("");
    setSelectedCity("");
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    setSelectedTaluka("");
    setSelectedCity("");
  };

  const handleTalukaChange = (taluka) => {
    setSelectedTaluka(taluka);
    setSelectedCity("");
  };



  const row1Packages = useMemo(() => {
    // Most booked surgery services
    return [...applyFiltersAndSort]
      .filter(item => item.type === "Surgery")
      .sort((a, b) => (b.surgeryBookingsCount || 0) - (a.surgeryBookingsCount || 0));
  }, [applyFiltersAndSort]);

  const row2Packages = useMemo(() => {
    // Most booked treatment services
    return [...applyFiltersAndSort]
      .filter(item => item.type === "Treatment")
      .sort((a, b) => (b.treatmentBookingsCount || 0) - (a.treatmentBookingsCount || 0));
  }, [applyFiltersAndSort]);

  const row3Packages = useMemo(() => {
    // Hospitals with most services (group by hospital and count services)
    const hospitalServiceCounts = {};

    applyFiltersAndSort.forEach(item => {
      const hospitalId = item.hospital?.id;
      if (hospitalId) {
        if (!hospitalServiceCounts[hospitalId]) {
          hospitalServiceCounts[hospitalId] = {
            hospital: item.hospital,
            serviceCount: 0,
            items: []
          };
        }
        hospitalServiceCounts[hospitalId].serviceCount++;
        hospitalServiceCounts[hospitalId].items.push(item);
      }
    });

    // Sort hospitals by service count and get top items
    const sortedHospitals = Object.values(hospitalServiceCounts)
      .sort((a, b) => b.serviceCount - a.serviceCount)
      .flatMap(hospitalData => hospitalData.items);

    return sortedHospitals;
  }, [applyFiltersAndSort]);

  const row4Packages = useMemo(() => {
    // Based on price (low to high)
    return [...applyFiltersAndSort].sort((a, b) => {
      const priceA = Number.parseFloat(a.minPrice || a.maxPrice || "999999");
      const priceB = Number.parseFloat(b.minPrice || b.maxPrice || "999999");
      return priceA - priceB;
    });
  }, [applyFiltersAndSort]);

  const row5Packages = useMemo(() => {
    // Based on reviews (hospital reviews)
    return [...applyFiltersAndSort].sort(
      (a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0)
    );
  }, [applyFiltersAndSort]);

  const toggleRowExpansion = (row) => {
    setExpandedRows(prev => ({
      ...prev,
      [row]: !prev[row]
    }));
  };

  // Package Card Component - Redesigned with hospital page style
  const PackageCard = ({ packageItem }) => (
    <Link href={`/surgerypackages/${packageItem.hospital.id}?serviceId=${packageItem.id}`}>
      <Card className="h-full min-h-[320px] flex flex-col overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl hover:translate-y-[-4px] group">
        <CardContent className="p-0 flex flex-col flex-grow justify-between">
          {/* Header with Status Badge */}
          <div className="relative">
            
            {/* Service Image and Basic Info */}
            <div className="bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 p-6 rounded-t-2xl">
              <div className="flex items-center gap-4">
                {packageItem.hospital?.hspInfo?.image ? (
                  <div className="relative">
                    <Image
                      src={packageItem.hospital.hspInfo.image}
                      width={80}
                      height={80}
                      alt={packageItem.serviceName || "Service image"}
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
                    {packageItem.serviceName || "Service Name"}
                  </h3>
                  <p className="text-[#3D85EF] text-base font-semibold mb-2">
                    {packageItem.category || "Category"}
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
                    <span className="text-xs text-gray-600">({packageItem.reviewsCount || 129} Reviews)</span>
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
                <span>{packageItem.type} Service</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Star className="h-4 w-4 text-[#3D85EF]" />
                <span className="truncate">{packageItem.type === "Surgery" ?
                  packageItem.surgeryBookingsCount || 0 :
                  packageItem.treatmentBookingsCount || 0} bookings</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4 text-[#3D85EF] flex-shrink-0" />
              <span className="text-sm line-clamp-2">
                {packageItem.hospital?.hspcontact?.city ? 
                  `${packageItem.hospital.hspcontact.city}${packageItem.hospital.hspcontact?.state ? `, ${packageItem.hospital.hspcontact.state}` : ''}` : 
                  packageItem.hospital?.hspcontact?.address || "Address not available"}
              </span>
            </div>

            {packageItem.hospital?.hspInfo?.regname && (
              <div className="flex items-center gap-2 text-gray-700">
                <Building2 className="h-4 w-4 text-[#3D85EF] flex-shrink-0" />
                <span className="text-sm truncate">{packageItem.hospital.hspInfo.regname}</span>
              </div>
            )}

            {/* Price Range */}
            <div className="flex items-center gap-2 text-gray-700">
              <DollarSign className="h-4 w-4 text-[#3D85EF] flex-shrink-0" />
              <span className="text-sm font-semibold text-green-600">
                ₹{packageItem.minPrice} - ₹{packageItem.maxPrice}
              </span>
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
  const RowSection = ({ title, packages, rowKey, icon: Icon, description }) => {
    const displayPackages = expandedRows[rowKey] ? packages : packages.slice(0, 3);
    
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
          {packages.length > 3 && (
            <button
              onClick={() => toggleRowExpansion(rowKey)}
              className="flex items-center gap-2 text-[#3D85EF] font-semibold hover:text-[#1E3B90] transition-colors px-4 py-2 rounded-lg hover:bg-[#3D85EF]/5"
            >
              {expandedRows[rowKey] ? "Show Less" : `View All (${packages.length})`}
              <ChevronRight className={`h-4 w-4 transition-transform ${expandedRows[rowKey] ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>

        {packages.length === 0 ? (
          <div className="flex justify-center items-center rounded-2xl bg-gradient-to-br from-[#1E3B90]/5 to-[#3D85EF]/5 border border-[#3D85EF]/20 p-8">
            <div className="text-center">
              <Briefcase className="h-12 w-12 text-[#3D85EF] mx-auto mb-3" />
              <p className="text-[#3D85EF] font-medium text-lg">
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
                  {selectedType ? selectedType : specilitytype?.title || "Surgery & Treatment Packages"}
                </h1>
              </div>
              <p className="text-white/90 text-lg">Find trusted medical services and treatments</p>
              
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
                  <div className="text-2xl font-bold">{applyFiltersAndSort.length}</div>
                  <div className="text-white/80 text-sm">Packages Found</div>
                </div>
              </div>
            </div>

            {/* Filter Button - Desktop */}
            <div className="flex justify-center lg:justify-end">
              <Button
                onClick={() => setShowDFilters(!showDFilters)}
                className="flex items-center gap-3 bg-white text-[#1E3B90] hover:bg-white/90 font-semibold px-6 py-3 rounded-xl shadow-lg transition-all"
              >
                <Filter size={20} />
                {showDFilters ? "Hide Filters" : "Show Filters"}
                <Badge className="bg-[#3D85EF] text-white ml-1 min-w-[24px] h-6 flex items-center justify-center">
                  8
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
          <div className={`xl:w-80 flex-shrink-0 ${showDFilters ? 'block' : 'hidden xl:block'}`}>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-8 max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Filter Packages</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={handleReset}
                    className="text-red-600 hover:text-red-700 p-0 h-6 font-medium text-sm"
                  >
                    Clear All
                  </Button>
                  <button
                    onClick={() => setShowDFilters(false)}
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
                      className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent transition-all"
                      placeholder="Search services/hospitals..."
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>
                </div>

                {/* Type Selection - Surgery or Treatment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <select
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white"
                    value={selectedType}
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                      setSelectedCategory("");
                      setSelectedService("");
                    }}
                  >
                    <option value="">Select Type</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Treatment">Treatment</option>
                  </select>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedService("");
                    }}
                    disabled={!selectedType}
                  >
                    <option value="">Select Category</option>
                    {getUniqueCategories().map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                  <select
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    disabled={!selectedType || !selectedCategory}
                  >
                    <option value="">Select Service</option>
                    {getUniqueServices().map((service, index) => (
                      <option key={index} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hospital Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Category</label>
                  <select
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white"
                    value={selectedHospitalCategory}
                    onChange={(e) =>
                      setSelectedHospitalCategory(e.target.value)
                    }
                  >
                    <option value="">Hospital Category</option>
                    {getUniqueHospitalCategories().map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
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
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent transition-all"
                    placeholder="Enter City Name"
                    required 
                  />
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3D85EF] focus:border-transparent appearance-none bg-white"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                  >
                    <option value="">Price Range</option>
                    <option value="0-100">₹0 - ₹100</option>
                    <option value="100-500">₹100 - ₹500</option>
                    <option value="500-1000">₹500 - ₹1000</option>
                    <option value="1000+">₹1000+</option>
                  </select>
                </div>

                <Button
                  onClick={() => setShowDFilters(false)}
                  className="w-full bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] hover:from-[#3D85EF] hover:to-[#1E3B90] text-white font-semibold py-3 rounded-xl shadow-lg transition-all transform hover:scale-105"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side: Package Cards */}
          <div className="flex-1 min-w-0">
            {row1Packages.length === 0 && row2Packages.length === 0 && row3Packages.length === 0 && row4Packages.length === 0 && row5Packages.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-8 w-8 text-[#3D85EF]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No packages found</h3>
                  <p className="text-gray-600 mb-4">
                    No packages found in {activeCity || "your area"}. Please try changing your filters or location.
                  </p>
                  <Button
                    onClick={handleReset}
                    className="bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] hover:from-[#3D85EF] hover:to-[#1E3B90] text-white"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                {row1Packages.length > 0 && (
                  <RowSection 
                    title="Most Booked Surgery Services" 
                    packages={row1Packages} 
                    rowKey="row1"
                    icon={Heart}
                    description="Based on surgery bookings and patient reviews"
                  />
                )}
                {row2Packages.length > 0 && (
                  <RowSection 
                    title="Most Booked Treatment Services" 
                    packages={row2Packages} 
                    rowKey="row2"
                    icon={Award}
                    description="Leading treatment services by bookings"
                  />
                )}
                {row3Packages.length > 0 && (
                  <RowSection 
                    title="Hospitals with Most Services" 
                    packages={row3Packages} 
                    rowKey="row3"
                    icon={Users}
                    description="Hospitals offering the widest range of services"
                  />
                )}
                {row4Packages.length > 0 && (
                  <RowSection 
                    title="Affordable Packages" 
                    packages={row4Packages} 
                    rowKey="row4"
                    icon={Clock}
                    description="Best value for money packages"
                  />
                )}
                {row5Packages.length > 0 && (
                  <RowSection 
                    title="Top Rated Packages" 
                    packages={row5Packages} 
                    rowKey="row5"
                    icon={Star}
                    description="Highest rated packages by patients"
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

export default SurgeryPackageMain;
