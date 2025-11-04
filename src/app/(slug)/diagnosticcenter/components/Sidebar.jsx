"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, Briefcase, GraduationCap } from "lucide-react";
import Link from "next/link";

const Sidebar = ({ doctordetails, specilitytype }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState(doctordetails);

  const diagnosticCenters = [
    { name: "ECG", type: "Centers" },
    { name: "X-Ray", type: "Centers" },
    { name: "CT Scan", type: "Centers" },
    { name: "MRI Scan", type: "Centers" },
    { name: "PET Scan", type: "Centers" },
    { name: "LINAC", type: "Centers" },
    { name: "Mammography", type: "Centers" },
    { name: "Sonography", type: "Centers" },
    { name: "Dental X-Ray", type: "Centers" },
    { name: "Dental Therapy", type: "Centers" },
    { name: "Nuclear Study", type: "Centers" },
    { name: "Internal Radiology", type: "Centers" },
    { name: "Fluoroscopy", type: "Centers" },
    { name: "Doppler", type: "Centers" },
    { name: "2D Echo", type: "Centers" },
  ];

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
     <h1 className="md:text-[25px] text-[20px] text-center text-[#5271FF] font-extrabold">
        {specilitytype.title}
      </h1>
      <div className="mx-auto  md:flex md:flex-col items-center  container font-poppins pt-1  mb-5">
      
        <div className="w-full  gap-4 mt-2  md:flex">
          {/* Left Side: Filters */}
          <div className="w-full md:w-2/5 lg:w-1/5">
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

              <div className=" grid grid-cols-2 md:grid-cols-1 gap-2">
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

          {/* Right Side: Cards */}
          <div className="w-full md:w-3/5 overflow-auto lg:w-4/5">
            {/* Grid Layout for Cards */}
            {/* <div className="justify-center text-center mb-2 -mt-1.5">
              <h1 className="md:text-[25px] text-[20px] text-[#5271FF] font-extrabold hidden md:hidden">
                {specilitytype.title}
              </h1>
            </div> */}
            {/* If no doctors are found */}
            {diagnosticCenters.length === 0 ? (
              <div className="flex justify-center  rounded-xl">
                <p className="text-[#5271FF] p-4 border-[#243460] border rounded-xl font-bold text-center text-lg">
                  No Disgnostic Center found for this selected category
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-0">
                {diagnosticCenters.map((item, index) => (
                  <Link
                    key={index}
                    href={`/doctor/${specilitytype?.id}/${item.id}`}
                    className="w-full"
                  >
                    <Card className="border-none">
                      <CardContent className="w-full h-32 p-6 flex flex-col justify-center items-center bg-[#D9D9D9] rounded-[15px] shadow-md hover:shadow-lg text-center">
                        {/* Two-color text effect */}
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

export default Sidebar;
