"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, Briefcase, Filter, GraduationCap, Loader2 } from "lucide-react";
import Link from "next/link";

const HomeHealthcare = ({ doctordetails, specilitytype }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState(doctordetails);
  const [showFilters, setShowFilters] = useState(false);
  const [homeHealthcareServices, setHomeHealthcareServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch home healthcare service types from API
  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/home-healthcare/service-types");
        const result = await response.json();

        if (result.success) {
          setHomeHealthcareServices(result.data || []);
        } else {
          setError("Failed to load service types");
        }
      } catch (err) {
        console.error("Error fetching service types:", err);
        setError("Failed to load service types");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceTypes();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter function to filter doctors based on search query
  const handleFilter = () => {
    const filtered = doctordetails.filter((item) => {
      return item.firstName.toLowerCase().includes(searchQuery.toLowerCase()); // Filter based on hospital name
    });
    setFilteredDoctors(filtered); // Update filtered doctors
  };
  return (
    <>
      <h1 className="md:text-[25px] text-[20px] text-center text-[#5271FF] font-extrabold mt-4">
        {specilitytype.title}
      </h1>
      <div className="mx-auto  md:flex md:flex-col items-center  container font-poppins pt-1  mb-5">
        <div className="w-full  gap-4 mt-2  md:flex">
          {/* Left Side: Filters */}
          <div className="hidden md:block w-full md:w-2/5 lg:w-1/4">
            {/* Filter Inputs */}
            <div className="p-4 bg-[#D9D9D9] rounded-xl ml-0">
              <div className="flex justify-center gap-2  mb-4 relative">
                <p className="border-[#5271FF] rounded-xl border">
                  {" "}
                  <span className="px-4 py-1 text-[#243460] font-semibold text-[12px]   flex items-center">
                    All Filters
                  </span>
                </p>
              </div>

              <div className=" grid grid-cols-1 md:grid-cols-1 gap-2">
                {/* Individual Filter Input Fields with consistent gap and margin */}
                <div className="mb-1 md:mb-2">
                  <input
                    type="text"
                    className="w-full md:h-10 h-9 p-2 border placeholder:md:text-[14px]  placeholder:text-[12px]  placeholder:text-white text-white bg-[#5271FF] rounded-full"
                    placeholder="Enter Doctor Name"
                    required
                    value={searchQuery}
                    onChange={handleSearch} // Updates search query on user input
                    onKeyUp={handleFilter}
                  />
                </div>

                <div className="mb-1 md:mb-2">
                  <input
                    type="text"
                    className="w-full md:h-10 h-9 p-2 border  placeholder:text-[12px] placeholder:md:text-[14px]  placeholder:text-white text-white bg-[#5271FF] rounded-full"
                    placeholder="Enter Hospital Name"
                    required
                  />
                </div>

                {/* Individual Filter Select Fields with consistent gap and margin */}
                <div className="mb-1 md:mb-2 relative">
                  <select
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                    required
                    name="category"
                  >
                    <option value="Select"> Hospital Type</option>
                    <option value=""></option>
                    <option value=""></option>
                    <option value=""></option>
                  </select>
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ArrowDown
                      className="md:h-6 md:w-6 h-4 w-4 bg-white rounded-full"
                      color="#243460"
                    />
                  </span>
                </div>

                <div className="mb-1 md:mb-2 relative">
                  <select
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                    required
                    name="category"
                  >
                    <option value="Select"> Doctor Experience</option>
                    <option value=""></option>
                    <option value=""></option>
                    <option value=""></option>
                  </select>
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ArrowDown
                      className="md:h-6 md:w-6 h-4 w-4 bg-white rounded-full"
                      color="#243460"
                    />
                  </span>
                </div>

                <div className="mb-1 md:mb-2 relative">
                  <select
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                    required
                    name="category"
                  >
                    <option value="Select"> Doctor Fee Range</option>
                    <option value=""></option>
                    <option value=""></option>
                    <option value=""></option>
                  </select>
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ArrowDown
                      className="md:h-6 md:w-6 h-4 w-4 bg-white rounded-full"
                      color="#243460"
                    />
                  </span>
                </div>

                <div className="mb-1 md:mb-2 relative">
                  <select
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                    required
                    name="category"
                  >
                    <option value="Select">Distance Range</option>
                    <option value=""></option>
                    <option value=""></option>
                    <option value=""></option>
                  </select>
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ArrowDown
                      className="md:h-6 md:w-6 h-4 w-4 bg-white rounded-full"
                      color="#243460"
                    />
                  </span>
                </div>

                <div className="mb-1 md:mb-2 relative">
                  <select
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                    required
                    name="category"
                  >
                    <option value="Select">Select State Name</option>
                    <option value=""></option>
                    <option value=""></option>
                    <option value=""></option>
                  </select>
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ArrowDown
                      className="md:h-6 md:w-6 h-4 w-4 bg-white rounded-full"
                      color="#243460"
                    />
                  </span>
                </div>

                <div className="mb-1 md:mb-2">
                  <input
                    type="text"
                    className="w-full md:h-10 h-9 p-2 border placeholder:md:text-[14px] placeholder:text-[12px]  placeholder:text-white text-white bg-[#5271FF] rounded-full"
                    placeholder="Enter City Name"
                    required
                  />
                </div>

                <div className="mb-1 md:mb-2">
                  <input
                    type="text"
                    className="w-full md:h-10 h-9 p-2 border placeholder:md:text-[14px] placeholder:text-[12px]  placeholder:text-white text-white bg-[#5271FF] rounded-full"
                    placeholder="Enter Pincode"
                    required
                  />
                </div>

                <div className="flex text-center justify-center mt-2">
                  <span className="bg-[#FF5E00] shadow-lg rounded-full text-white placeholder:md:text-[14px] text-[12px] font-medium border-1 px-4 p-2">
                    Search
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mb-2 md:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-[#5271FF] text-white px-4 py-2 rounded-full shadow"
            >
              <span className="text-sm">All Filters</span>
            </button>
          </div>
          {showFilters && (
            <div className="bg-[#D9D9D9] mx-auto left-[20%] p-4 rounded-2xl absolute z-10 grid grid-cols-1 md:grid-cols-1 gap-2 md:hidden">
              {/* Doctor Name */}
              <div className="mb-1 md:mb-2">
                <input
                  type="text"
                  className="w-full h-9 p-2 border placeholder:text-[12px] placeholder:text-white text-white bg-[#5271FF] rounded-full"
                  placeholder="Enter Doctor Name"
                  value={searchQuery}
                  onChange={handleSearch}
                  onKeyUp={handleFilter}
                />
              </div>

              {/* Hospital Name */}
              <div className="mb-1 md:mb-2">
                <input
                  type="text"
                  className="w-full h-9 p-2 border placeholder:text-[12px] placeholder:text-white text-white bg-[#5271FF] rounded-full"
                  placeholder="Enter Hospital Name"
                />
              </div>

              {/* Hospital Type */}
              <div className="mb-1 md:mb-2 relative">
                <select className="w-full h-9 p-2 pr-10 text-[12px] rounded-full text-white bg-[#5271FF] border-[#453565] appearance-none">
                  <option value="">Hospital Type</option>
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ArrowDown className="h-4 w-4 bg-white rounded-full" color="#243460" />
                </span>
              </div>

              {/* Doctor Experience */}
              <div className="mb-1 md:mb-2 relative">
                <select className="w-full h-9 p-2 pr-10 text-[12px] rounded-full text-white bg-[#5271FF] border-[#453565] appearance-none">
                  <option value="">Doctor Experience</option>
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ArrowDown className="h-4 w-4 bg-white rounded-full" color="#243460" />
                </span>
              </div>

              {/* Doctor Fee Range */}
              <div className="mb-1 md:mb-2 relative">
                <select className="w-full h-9 p-2 pr-10 text-[12px] rounded-full text-white bg-[#5271FF] border-[#453565] appearance-none">
                  <option value="">Doctor Fee Range</option>
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ArrowDown className="h-4 w-4 bg-white rounded-full" color="#243460" />
                </span>
              </div>

              {/* Distance Range */}
              <div className="mb-1 md:mb-2 relative">
                <select className="w-full h-9 p-2 pr-10 text-[12px] rounded-full text-white bg-[#5271FF] border-[#453565] appearance-none">
                  <option value="">Distance Range</option>
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ArrowDown className="h-4 w-4 bg-white rounded-full" color="#243460" />
                </span>
              </div>

              {/* State Name */}
              <div className="mb-1 md:mb-2 relative">
                <select className="w-full h-9 p-2 pr-10 text-[12px] rounded-full text-white bg-[#5271FF] border-[#453565] appearance-none">
                  <option value="">Select State Name</option>
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ArrowDown className="h-4 w-4 bg-white rounded-full" color="#243460" />
                </span>
              </div>

              {/* City Name */}
              <div className="mb-1 md:mb-2">
                <input
                  type="text"
                  className="w-full h-9 p-2 border placeholder:text-[12px] placeholder:text-white text-white bg-[#5271FF] rounded-full"
                  placeholder="Enter City Name"
                />
              </div>

              {/* Pincode */}
              <div className="mb-1 md:mb-2">
                <input
                  type="text"
                  className="w-full h-9 p-2 border placeholder:text-[12px] placeholder:text-white text-white bg-[#5271FF] rounded-full"
                  placeholder="Enter Pincode"
                />
              </div>

              {/* Search Button */}
              <div className="flex text-center justify-center mt-2">
                <span className="bg-[#FF5E00] shadow-lg rounded-full text-white text-[12px] font-medium px-4 p-2">
                  Search
                </span>
              </div>
            </div>
          )}
          {/* Right Side: Cards */}
          <div className="w-full md:w-3/5 overflow-auto lg:w-4/5">
            {/* Grid Layout for Cards */}

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 text-[#5271FF] animate-spin" />
              </div>
            ) : error ? (
              <div className="flex justify-center rounded-xl">
                <p className="text-red-600 p-4 border-red-600 border rounded-xl font-bold text-center text-lg">
                  {error}
                </p>
              </div>
            ) : homeHealthcareServices.length === 0 ? (
              <div className="flex justify-center rounded-xl">
                <p className="text-[hsl(229,100%,66%)] p-4 border-[#243460] border rounded-xl font-bold text-center text-lg">
                  No Home Healthcare Services found for this selected category
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-5 md:mt-0">
                {homeHealthcareServices.map((item, index) => (
                  <Link
                    key={index}
                    href={{
                      pathname: `/home-healthcare/${encodeURIComponent(item.name)}`
                    }}
                    className="w-full"
                  >
                    <Card className="border-none">
                      <CardContent className="w-full p-6 h-32 flex flex-col justify-center items-center bg-[#D9D9D9] rounded-[15px] shadow-md hover:shadow-lg text-center">
                        <p className="font-semibold text-[14px] lg:text-[16px] text-blue-500">
                          {item.name}
                        </p>
                        <p className="font-semibold text-[14px] lg:text-[16px] text-blue-950">
                          {item.type}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeHealthcare;
