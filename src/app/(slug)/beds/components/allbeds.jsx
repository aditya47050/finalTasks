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
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { FaArrowDown } from "react-icons/fa6";
import { FaArrowCircleDown, FaHospitalAlt } from "react-icons/fa";
import { PiCurrencyInr } from "react-icons/pi";
import { Filter } from "lucide-react";

const AllBedsClient = ({ bedCategories, hospitalCategories,stateList, districtList, subdistrictList }) => {
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
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBeds, setFilteredBeds] = useState(bedCategories);
  const [visibleBeds, setVisibleBeds] = useState(20);
  const [showFilters, setShowFilters] = useState(false);
  const [hospitalName, setHospitalName] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [hospitalCategory, setHospitalCategory] = useState("");
  const [typeOfHospital, setTypeOfHospital] = useState("");
  const [bedType, setBedType] = useState("");
  const [bedChargesRange, setBedChargesRange] = useState("");
  const [stateName, setStateName] = useState("");
  const [governmentScheme, setGovernmentScheme] = useState("");

  const governmentSchemes = [
    "Happy Insurance TPA Services Pvt. Ltd",
    "Aam Aadmi Bima Yojana",
    "Central Government Health Scheme",
    "Pradhan Mantri Suraksha Bima Yojana",
    "Chief Minister's Comprehensive Health Insurance Scheme",
    "Universal Health Insurance Scheme (UHIS)",
    "Bhamashah Swasthya Bima Yojana",
    "Mahatma Jyotiba Phule Jan Arogya Yojana (MJPJAY)",
    "Yeshasvini Health Insurance Scheme",
    "West Bengal Health Scheme",
    "Mukhyamantri Amrutum Yojana",
    "Ayushman Bharat Mahatma Gandhi Rajasthan Swasthya Bima Yojana",
    "Employment State Insurance Scheme (ESIC)",
    "Ayushman Bharat Yojana (PMJAY)",
    "Janshree Bima Yojana",
    "Karunya Health Scheme",
    "Telangana State Government Employees and Journalists Health Scheme",
    "Dr YSR Aarogyasri Health Care Trust",
    "CM Health Fund (All State)",
  ];
  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleViewMore = () => {
    setVisibleBeds(visibleBeds + 20);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setHospitalName("");
    setCity("");
    setPincode("");
    setHospitalCategory("");
    setTypeOfHospital("");
    setBedType("");
    setBedChargesRange("");
    setGovtSchemeBed(false);
    setStateName("");
  };

  const handleFilter = () => {
    const filtered = bedCategories.filter((item) => {
      const nameMatch = item.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const hospitalMatch = hospitalName
        ? item.hospital?.hspInfo?.regname
            ?.toLowerCase()
            .includes(hospitalName.toLowerCase())
        : true;

      const cityMatch = city
        ? item.hospital?.hspcontact.city
            ?.toLowerCase()
            .includes(city.toLowerCase())
        : true;

      const pincodeMatch = pincode ? item.hospital?.pincode === pincode : true;

      const hospitalCategoryMatch = hospitalCategory
        ? item.hospital?.categories?.some(
            (cat) =>
              cat?.hspcategory?.title?.toLowerCase() ===
              hospitalCategory.toLowerCase()
          )
        : true;
      const governmentSchemeMatch = governmentScheme
        ? item.hospital?.hspInfo?.governmentschemes?.includes(governmentScheme)
        : true;

      const typeOfHospitalMatch = typeOfHospital
        ? item.hospitalType?.toLowerCase() === typeOfHospital.toLowerCase()
        : true;

      const bedTypeMatch = bedType
        ? item.name?.toLowerCase() === bedType.toLowerCase()
        : true;

      const bedChargesMatch = bedChargesRange
        ? item.minPrice <= bedChargesRange && item.maxPrice >= bedChargesRange
        : true;

      const stateMatch = stateName
        ? item.hospital?.hspcontact.state?.toLowerCase() ===
          stateName.toLowerCase()
        : true;

      return (
        nameMatch &&
        hospitalMatch &&
        cityMatch &&
        pincodeMatch &&
        hospitalCategoryMatch &&
        typeOfHospitalMatch &&
        bedTypeMatch &&
        bedChargesMatch &&
        governmentSchemeMatch &&
        stateMatch
      );
    });

    setFilteredBeds(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [
    searchQuery,
    hospitalName,
    city,
    pincode,
    hospitalCategory,
    typeOfHospital,
    bedType,
    bedChargesRange,
    governmentScheme,
    stateName,
  ]);
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

  const BedsCard = ({ item }) => (
    <Card className="h-full xs:min-h-[100px] md:min-h-[350px] flex flex-col  overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 bg-white rounded-3xl">
  <CardContent className="p-0 flex flex-col flex-grow justify-between">
    {/* Image Container */}
    <div className="relative overflow-hidden rounded-t-3xl">
      <Link href={`/beds/${item.id}`}>
        {item.image1 ? (
          <Image
            src={item.image1}
            width={400}
            height={240}
            alt={item.name || "Bed"}
            className="w-full md:h-48 xs:h-20 object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full md:h-48 xs:h-20 bg-gradient-to-br from-[#5271FF] to-[#8b5cf6] flex items-center justify-center">
            <FaHospitalAlt className="w-12 h-12 text-white/50" />
          </div>
        )}
      </Link>
    </div>
    
   

    {/* Content */}
    <div className="xs:p-1 md:p-6 md:py-4 text-center">
      <Link href={`/beds/${item.id}`}>
      <div className="xs:mb-0 md:mb-4 cursor-pointer ">
        <h3 className="font-bold xs:text-[12px] md:text-lg text-gray-900 xs:mb-0 md:mb-2 line-clamp-2 group-hover:text-[#5271FF] transition-colors">
          {item.name || "Bed"}
        </h3>
        <div className="xs:my-0 md:my-2">
          <div className="xs:text-[10px] md:text-sm text-gray-600 flex justify-center items-center gap-1">
            <span className="font-semibold text-[#5271FF]">
              ₹{item.minPrice} - ₹{item.maxPrice}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2  text-center justify-center px-2">
        <p className="flex-2 text-[#243460] xs:text-[10px] md:text-sm font-semibold truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
      {item.hospital?.hspInfo?.regname || "Hospital Info Missing"}
    </p>

      </div>
      </div>
    </Link>


      {/* Book Now Button */}
      <div className="mx-auto">
      <Link href={`/beds/${item.id}`}>
        <Button
          className="bg-blue-600 hover:bg-blue-700 rounded-full xs:px-2 md:px-6 text-white xs:text-[10px] md:text-sm max-[500px]:h-5 max-[500px]:pb-2"
        >
          Book Now
        </Button></Link>
      </div>
    </div>
  </CardContent>
</Card>

  );

  return (
    <div className="min-h-screen md:container ">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center space-y-0">
            <h1 className="text-[20px] md:text-[25px] text-[#5271FF] font-bold">
              Bed Booking
            </h1>
            <p className="text-[14px] md:text-[15px] text-blue-500">
              24/7 Emergency Healthcare Services
            </p>
          </div>

          <div className="flex xs:justify-center min-[900px]:justify-end  mt-1">
            <Button
          onClick={() => setShowFilters(!showFilters)}
          className=" flex items-center gap-2 border rounded-full border-blue-600 text-blue-600"
        >
          <Filter size={16} />
                All Filters
                <Badge className="bg-blue-600 !text-white ml-1">8</Badge>
        </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {showFilters && (
          <div className="absolute xs:top-[15rem] min-[500px]:top-[16rem] left-[20%] z-10 xs:w-[60%] p-4 bg-[#D9D9D9] min-[900px]:static min-[900px]:z-0  min-[900px]:w-72 min-[1000px]:h-full rounded-xl mb-2">
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
                  placeholder="Search Bed"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="bg-blue-600 text-white placeholder-blue-200 border-0 rounded-full"
                />
              </div>
              <div className="mb-2 relative">
                <Input
                  type="text"
                  placeholder="Hospital Name"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="bg-blue-600 text-white placeholder-blue-200 border-0 rounded-full"
                />
              </div>
              <div className="mb-2 relative">
                <Input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-blue-600 text-white placeholder-blue-200 border-0 rounded-full"
                />
              </div>
              <div className="mb-2 relative">
                <Input
                  type="text"
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="bg-blue-600 text-white placeholder-blue-200 border-0 rounded-full"
                />
              </div>
              {/* Hospital Category */}
              <div className="mb-2 relative">
                <select
                  name="hospitalCategory"
                  value={hospitalCategory}
                  onChange={(e) => setHospitalCategory(e.target.value)}
                  className="w-full md:h-10 h-9 pl-2 p-1 pr-10 md:text-[14px] text-base rounded-full text-white bg-blue-600 border-0 appearance-none"
                >
                  <option value="" className="bg-gray-50 text-[#453565]">
                    Hospital Category
                  </option>
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
                {/* Custom Arrow Icon */}
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                </span>
              </div>
              {/* Type of Hospital */}
              <div className="mb-2 relative">
                <select
                  name="typeOfHospital"
                  value={typeOfHospital}
                  onChange={(e) => setTypeOfHospital(e.target.value)}
                  className="w-full md:h-10 h-9 pl-2 p-1 pr-10 md:text-[14px] text-base rounded-full text-white bg-blue-600 border-0 appearance-none"
                >
                  <option value="">Type of Hospital</option>
                  <option value="private">Private</option>
                  <option value="government">Government</option>
                </select>

                {/* Custom Arrow Icon */}
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                </span>
              </div>
              {/* Type of Bed */}
              <div className="mb-2 relative">
                <select
                  name="bedType"
                  value={bedType}
                  onChange={(e) => setBedType(e.target.value)}
                  className="w-full md:h-10 h-9 pl-2 p-1 pr-10 md:text-[14px] text-base rounded-full text-white bg-blue-600 border-0 appearance-none"
                >
                  <option value="">Type of Bed</option>
                  {bedCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* Custom Arrow Icon */}
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                </span>
              </div>
              <div className="mb-2 relative">
                <Input
                  type="number"
                  placeholder="Bed Charges Range"
                  value={bedChargesRange}
                  onChange={(e) => setBedChargesRange(e.target.value)}
                  className="bg-blue-600 text-white placeholder-blue-200 border-0 rounded-full"
                />
              </div>
              {/* Government Scheme */}
              <div className="mb-2 relative">
                <select
                  name="governmentScheme"
                  value={governmentScheme}
                  onChange={(e) => setGovernmentScheme(e.target.value)}
                  className="w-full md:h-10 h-9 pl-2 p-1 pr-10 md:text-[14px] text-base rounded-full text-white bg-blue-600 border-0 appearance-none"
                >
                  <option value="">Government Scheme</option>
                  {governmentSchemes.map((scheme, index) => (
                    <option key={index} value={scheme}>
                      {scheme}
                    </option>
                  ))}
                </select>

                {/* Custom Arrow Icon */}
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                </span>
              </div>
              <div className="mb-2 relative">
                <select
                  name="state"
                  value={member.state}
                  onChange={handleChange}
                  className="w-full md:h-10 h-9 pl-2 p-1 pr-10 md:text-[14px] text-base rounded-full text-white bg-blue-600 border-0 appearance-none"
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
                  className="w-full md:h-10 h-9 pl-2 p-1 pr-10 md:text-[14px] text-base rounded-full text-white bg-blue-600 border-0 appearance-none"
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
                  className="w-full md:h-10 h-9 pl-2 p-1 pr-10 md:text-[14px] text-base rounded-full text-white bg-blue-600 border-0 appearance-none"
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

              <Button
                onClick={handleFilter}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-full mt-4"
              >
                Search
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1">
          <div className="grid xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-2 min-[1100px]:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBeds.slice(0, visibleBeds).map((item) => (
              <BedsCard key={item.id} item={item} />
            ))}
          </div>

          {filteredBeds.length === 0 && (
            <p className="text-center py-12 text-gray-500 text-lg">
              No beds found matching your criteria.
            </p>
          )}

          {filteredBeds.length > visibleBeds && (
            <div className="text-center mb-8 mt-4">
              <Button
                onClick={handleViewMore}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full"
              >
                View More
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBedsClient;
