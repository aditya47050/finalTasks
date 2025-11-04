"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Phone,
  List,
  MapIcon,
  Filter,
  MapPin,
  Star,

} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FaArrowDown, FaRupeeSign } from "react-icons/fa6";
import { FaAmbulance, FaHospitalAlt ,FaArrowCircleDown} from "react-icons/fa";
import BookAmbulance from "@/app/components/ambulance";
import { PiCurrencyInr } from "react-icons/pi";


const AmbulanceMap = dynamic(() => import("./ambulance-map"), {
  ssr: false,
});

const AmbulanceMainClient = ({ ambulances, hospitalCategories ,stateList, districtList, subdistrictList }) => {
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAmbulances, setFilteredAmbulances] = useState(ambulances);
  const [visibleAmbulances, setVisibleAmbulances] = useState(20);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  
  
  // Filter States
  const [ambulanceType, setAmbulanceType] = useState("");
  const [maxCharges, setMaxCharges] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [pincode, setPincode] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [status, setStatus] = useState("");
  const [driverGender, setDriverGender] = useState("");
  const [firstAidTrained, setFirstAidTrained] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState("");
  const [hospitalCategory, setHospitalCategory] = useState("");
  const [ambulanceCategory, setAmbulanceCategory] = useState("");
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

  const [errors, setErrors] = React.useState({});
  const ambulanceTypeslists = [
    "Patient Transport Ambulance",
    "Basic Life Support Ambulance",
    "Advanced Life Support Ambulance",
    "Neo-natal & Pediatric Ambulance",
    "Air Ambulance",
    "Boat Ambulance",
    "Bike Ambulance",
    "Mobile Medical Unit",
  ];
  const ambulanceCategorylists = [
    "102 Ambulance",
    "108 Ambulance",
    "Private Ambulance",
    "Hospital Ambulance",
    "RED Health Ambulance",
    "Medulance Ambulance",
    "AmbiPalm Ambulance",
    "MedCap Ambulance",
    "Ziqitza Ambulance",
  ];
  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleViewMore = () => {
    setVisibleAmbulances(visibleAmbulances + 20);
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
  }

  else if (name === "district") {
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
  }

  else if (name === "taluka") {
    setMember((prev) => ({
      ...prev,
      taluka: value
    }));
  }

  else {
    setMember((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  // Remove undefined validateField, just clear error for now
  setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));
};

  const clearFilters = () => {
    setSearchQuery("");
    setAmbulanceType("");
    setMaxCharges("");
    setHospitalName("");
    setState("");
    setCity("");
    setDistrict("");
    setPincode("");
    setIsOnline(false);
    setStatus("");
    setDriverGender("");
    setFirstAidTrained(false);
    setSelectedFacility("");
    setHospitalCategory("");
    setAmbulanceCategory("");
  };

  const handleFilter = () => {
    const filtered = ambulances.filter((item) => {
      const modelMatch = item.ambulancemodel
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      const typeMatch =
        ambulanceType && ambulanceType !== "all"
          ? item.ambulancetype === ambulanceType
          : true;

      const categoryMatch =
        ambulanceCategory && ambulanceCategory !== "all"
          ? item.ambulancecategory === ambulanceCategory
          : true;

      const chargesMatch = maxCharges
        ? Number.parseFloat(item.ambulancecharges) <=
          Number.parseFloat(maxCharges)
        : true;

      const hospitalNameMatch = hospitalName
        ? item.ambulance?.AmbulanceHsp?.hspregname
            ?.toLowerCase()
            .includes(hospitalName.toLowerCase())
        : true;

      const cityMatch = city
        ? item.ambulance?.AmbulanceHsp?.city
            ?.toLowerCase()
            .includes(city.toLowerCase())
        : true;

      const pincodeMatch = pincode
        ? item.ambulance?.AmbulanceHsp?.pincode === pincode ||
          item.ambulanceareapincode === pincode
        : true;

      // This assumes `item.ambulance?.AmbulanceHsp?.categories` has populated `hspcategory.title`
      const hospitalCategoryMatch = hospitalCategory
        ? item.ambulance?.AmbulanceHsp?.categories?.some(
            (cat) =>
              cat.hspcategory?.title?.toLowerCase() ===
              hospitalCategory.toLowerCase()
          )
        : true;

      return (
        modelMatch &&
        typeMatch &&
        categoryMatch &&
        chargesMatch &&
        hospitalNameMatch &&
        cityMatch &&
        pincodeMatch &&
        hospitalCategoryMatch
      );
    });

    setFilteredAmbulances(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [
    searchQuery,
    ambulanceType,
    maxCharges,
    hospitalName,
    state,
    city,
    district,
    pincode,
    isOnline,
    status,
    driverGender,
    firstAidTrained,
    selectedFacility,
  ]);

  const AmbulanceCard = ({ item }) => (
    <>
      {" "}
      <div className="">
        <div>
            {" "}
          <Link href={`/ambulance/${item.id}`}>
            <Card className="h-full xs:min-h-[250px] md:min-h-[350px] flex flex-col overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 bg-white rounded-3xl">
              <CardContent className="p-0 flex flex-col flex-grow">

                {/* Image Container */}
                <div className="relative overflow-hidden rounded-t-3xl">
                  {item.ambulanceimagefront ? (
                    <Image
                      src={item.ambulanceimagefront}
                      width={600}
                      height={400}
                      alt={item.ambulancetype || "Ambulance"}
                      className="w-full md:h-48 xs:h-28 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full md:h-48 xs:h-28 bg-gradient-to-br from-[#5271FF] to-[#8b5cf6] flex items-center justify-center">
                      <FaHospitalAlt className="w-12 h-12 text-white/50" />
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="flex flex-col gap-2 justify-end flex-grow xs:p-2 xs:pt-4 md:p-6 md:py-4 text-center">
                  
                  {/* Text Section */}
                  <div>
                    <h3 className="font-bold xs:text-[14px] md:text-lg text-gray-900 xs:mb-0 md:mb-2 truncate group-hover:text-[#5271FF] transition-colors">
                      {item.ambulancetype || "Ambulance"}
                    </h3>


                    {/* Price */}
                    <div className="xs:mb-0 md:mb-2 flex items-center justify-center gap-2">
                    {/* Original Charges with strikethrough */}
                    <span className={`xs:text-xs md:text-sm text-gray-400 ${item.ambulancediscount ? "line-through" :"" }`}>
                      {item.ambulancecharges || "N/A"}
                    </span>

                    {/* Discount Percentage */}
                    {item.ambulancediscount ? (
                      <span className="xs:text-xs md:text-sm text-red-500 font-medium">
                        ({item.ambulancediscount}% OFF)
                      </span>
                    ) : null}

                    {/* Final Price */}
                    {item.ambulancefinalcharge ? (
                      <span className="xs:text-xs md:text-sm text-[#5271FF] font-semibold">
                        ₹
                        {item.ambulancefinalcharge
                          ? item.ambulancefinalcharge
                          : "N/A"}
                      </span>
                      ) : null}
                  </div>
                    {/* Hospital Info */}
                    <div className="flex items-center justify-center gap-1 text-[#243460] xs:text-xs md:text-sm font-semibold ">
                      <FaHospitalAlt className="h-4 w-4 text-[#243460]" />
                      <span className="break-words text-center">
                        {item.ambulance?.AmbulanceHsp?.hspregname || "Hospital Info Missing"}
                      </span>
                    </div>
                  </div>

                  {/* Button */}
                  <div className="mt-1">
                    <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-6 text-white xs:text-xs md:text-sm">
                      Book Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </>
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <div className="min-h-screen md:container">
      <div className="bg-white  border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="space-y-6">
            {/* Heading Section */}
            <div className="text-center">
              <h1 className="text-[20px] md:text-[25px] text-[#5271FF] font-bold">
                Ambulance
              </h1>
              <p className="text-[14px] md:text-[15px] text-blue-500">
                24/7 Emergency Healthcare Services
              </p>
            </div>

            {/* Controls Section */}
            <div className="flex flex-wrap justify-center lg:justify-end items-center gap-4">
              {/* View Toggle */}
              <div className="flex border-blue-600 border text-blue-600 rounded-full">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex items-center gap-2"
                >
                  <List size={16} />
                  List
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className="flex items-center gap-2"
                >
                  <MapIcon size={16} />
                  Map
                </Button>
              </div>

              {/* Filter Button */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 border rounded-full border-blue-600 text-blue-600"
              >
                <Filter size={16} />
                All Filters
                <Badge className="bg-blue-600 !text-white ml-1">8</Badge>
              </Button>

              <BookAmbulance design={"flex p-2 px-2 items-center gap-2 border rounded-full border-blue-600 text-blue-600"} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 ">
        <div className="flex flex-col lg:flex-row  gap-6">
          {/* Filter Sidebar */}
          {showFilters && (
            <div className="absolute xs:top-[15rem] min-[500px]:top-[16rem] left-[20%] z-10 xs:w-[70%] p-4 bg-[#D9D9D9] min-[900px]:static min-[900px]:z-0  min-[900px]:w-72 min-[1000px]:h-full rounded-xl mb-2">
              <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-[#243460]">All Filters</span>
              <Button
                onClick={clearFilters}
                variant="ghost"
                className="text-red-600 p-0 h-6"
              >
                Clear
              </Button>
            </div>

              <div className="space-y-4">
                <div className="mb-2 relative">
                  <Input
                    type="text"
                    placeholder="Enter Ambulance Name"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full bg-blue-600 !text-white placeholder-blue-200 border-0 rounded-full"
                  />
                </div>
                <div className="mb-2 relative">
                  <Input
                    type="text"
                    placeholder="Enter Hospital Name"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full bg-blue-600 !text-white placeholder-blue-200 border-0 rounded-full"
                  />
                </div>
                <div className="mb-2 relative">
                  <select
                    name="hospitalCategory"
                    value={hospitalCategory}
                    onChange={(e) => setHospitalCategory(e.target.value)}
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full text-white bg-blue-600 border-0 appearance-none"
                  >
                    <option value="" className="bg-gray-50 text-[#453565]">Hospital Category</option>
                    {hospitalCategories.map((cat) => (
                      <option
                        key={cat.id}
                        value={cat.title}
                        className="bg-gray-50 text-[#453565]"
                      >
                        {cat.title}
                      </option>
                    ))}
                  </select>

                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                  </span>
                </div>
                <div className="mb-2 relative">
                  <select
                    name="ambulanceType"
                    value={ambulanceType}
                    onChange={(e) => setAmbulanceType(e.target.value)}
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full text-white bg-blue-600 border-0 appearance-none"
                  >
                    <option value="" className="bg-gray-50 text-[#453565]">Type of Ambulance</option>
                    <option value="all" className="bg-gray-50 text-[#453565]">All Types</option>
                    {ambulanceTypeslists.map((type, index) => (
                      <option key={index} value={type} className="bg-gray-50 text-[#453565]">
                        {type}
                      </option>
                    ))}
                  </select>

                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                  </span>
                </div>
                <div className="mb-2 relative">
                  <select
                    name="ambulanceCategory"
                    value={ambulanceCategory}
                    onChange={(e) => setAmbulanceCategory(e.target.value)}
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full text-white bg-blue-600 border-0 appearance-none"
                  >
                    <option value="" className="bg-gray-50 text-[#453565]">Ambulance Category</option>
                    <option value="all" className="bg-gray-50 text-[#453565]">All Categories</option>
                    {ambulanceCategorylists.map((cat, index) => (
                      <option key={index} value={cat} className="bg-gray-50 text-[#453565]">
                        {cat}
                      </option>
                    ))}
                  </select>

                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                  </span>
                </div>
                <div className="mb-2 relative">
                  <select
                    name="chargeRange"
                    onChange={(e) => handleFilterChange("chargeRange", e.target.value)}
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 text-white bg-blue-600 border-0 appearance-none"
                  >
                    <option value="" className="bg-gray-50 text-[#453565]">Charge Range</option>
                    <option value="0-500" className="bg-gray-50 text-[#453565]">₹0 - ₹500</option>
                    <option value="500-1000" className="bg-gray-50 text-[#453565]">₹500 - ₹1000</option>
                    <option value="1000+" className="bg-gray-50 text-[#453565]">₹1000+</option>
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
                    <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                  </span>
                </div>
                <div className="mb-2 relative">
                  <Input
                    type="text"
                    placeholder="Enter City Name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-blue-600 !text-white placeholder-blue-200 border-0 rounded-full"
                  />
                </div>
                <div className="mb-2 relative">
                  <Input
                    type="text"
                    placeholder="Enter Pin Code"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-blue-600 !text-white placeholder-blue-200 border-0 rounded-full"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleFilter}
                    className="w-full bg-orange-600 hover:bg-orange-700 !text-white rounded-full"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 order-2">
            {viewMode === "list" ? (
              <div >
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 min-[1100px]:grid-cols-3 xl:grid-cols-4 md:mb-4 mb-2 gap-4">
                  {filteredAmbulances
                    .slice(0, visibleAmbulances)
                    .map((item) => (
                      <AmbulanceCard key={item.id} item={item} />
                    ))}
                </div>

                {filteredAmbulances.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      No ambulances found matching your criteria.
                    </p>
                  </div>
                )}

                {filteredAmbulances.length > visibleAmbulances && (
                  <div className="text-center mb-8">
                    <Button
                      onClick={handleViewMore}
                      className="bg-orange-600 hover:bg-orange-700 !text-white px-8 py-3 rounded-full text-lg"
                    >
                      View More
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <AmbulanceMap
                ambulances={filteredAmbulances}
                userLocation={userLocation}
                onAmbulanceSelect={setSelectedAmbulance}
              />
            )}
          </div>
        </div>
      </div>

      {/* Ambulance Details Modal */}
      <Dialog
        open={!!selectedAmbulance}
        onOpenChange={() => setSelectedAmbulance(null)}
      >
        <DialogContent className="max-w-2xl bg-white p-1 md:p-2 max-h-[90vh] overflow-y-auto">
          {selectedAmbulance && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-blue-600">
                  {selectedAmbulance.ambulancemodel}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div className="rounded-xl overflow-hidden">
                  <Image
                    src={
                      selectedAmbulance.ambulanceimagefront ||
                      "/placeholder.svg?height=200&width=300"
                    }
                    alt="Ambulance Front"
                    width={300}
                    height={200}
                    className="w-full h-48 rounded-xl object-cover"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-800">
                      Vehicle Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Type:</span>{" "}
                        {selectedAmbulance.ambulancetype}
                      </p>
                      <p>
                        <span className="font-medium">Charges:</span> ₹
                        {selectedAmbulance.ambulancecharges}
                      </p>
                      <p>
                        <span className="font-medium">Area Pincode:</span>{" "}
                        {selectedAmbulance.ambulanceareapincode}
                      </p>
                      <p>
                        <span className="font-medium">Facilities:</span>{" "}
                        {selectedAmbulance.facilities}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-800">
                      Driver Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {selectedAmbulance.driver?.firstname}{" "}
                        {selectedAmbulance.driver?.lastname}
                      </p>
                      <p>
                        <span className="font-medium">Gender:</span>{" "}
                        {selectedAmbulance.driver?.gender}
                      </p>
                      <p>
                        <span className="font-medium">Blood Group:</span>{" "}
                        {selectedAmbulance.driver?.bloodgroup}
                      </p>
                      <p>
                        <span className="font-medium">First Aid:</span>{" "}
                        {selectedAmbulance.driver?.firstaidtraining
                          ? "Yes"
                          : "No"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-800">
                    Hospital Details
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-xl text-sm">
                    <p>
                      <span className="font-medium">Hospital:</span>{" "}
                      {selectedAmbulance.ambulance?.AmbulanceHsp?.hspregname}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span>{" "}
                      {selectedAmbulance.ambulance?.AmbulanceHsp?.city},{" "}
                      {selectedAmbulance.ambulance?.AmbulanceHsp?.district},{" "}
                      {selectedAmbulance.ambulance?.AmbulanceHsp?.state}
                    </p>
                    <p>
                      <span className="font-medium">Pincode:</span>{" "}
                      {selectedAmbulance.ambulance?.AmbulanceHsp?.pincode}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link
                    href={`/ambulance/${selectedAmbulance.id}`}
                    className="w-full sm:w-1/2"
                  >
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 !text-white">
                      View Ambulance
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AmbulanceMainClient;
