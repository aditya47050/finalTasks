"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, Briefcase, GraduationCap } from "lucide-react";
import { FaArrowCircleDown } from 'react-icons/fa';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PathologyMain = ({ doctordetails, specilitytype,stateList, districtList, subdistrictList }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState(doctordetails);
  const [visibledoctors, setVisibledoctors] = useState(9);
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
    const [states] = React.useState(stateList);
  const [dist] = React.useState(districtList);
  const [subdist] = React.useState(subdistrictList);

  const [filteredDistricts, setFilteredDistricts] = React.useState([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = React.useState([]);

  // Function to load more doctors when "View More" is clicked
  const handleViewMore = () => {
    setVisibledoctors(visibledoctors + 8); // Increase the number of visible doctors
  };

  // Filter function to filter doctors based on search query
  const handleFilter = () => {
    const filtered = doctordetails.filter((item) => {
      return item.firstName.toLowerCase().includes(searchQuery.toLowerCase()); // Filter based on hospital name
    });
    setFilteredDoctors(filtered); // Update filtered doctors
  };
  
const navlinks = Array.from({ length: 26 }, (_, i) => {
  const letter = String.fromCharCode(65 + i); // A–Z
  return { title: `Index ${letter}`, link: `/pathology/category?letter=${letter}` };
});




  const wellnesspackagedd = specilitytype.wellnessPackages;
   const router = useRouter();

  const handleChange = (e) => {
  const selectedValue = e.target.value; // contains "id|hospitalId"
  if (selectedValue) {
    const [ hospitalId] = selectedValue.split("|");
    router.push(`/pathology/${hospitalId}`);
  }
};
const handleChange1 = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      router.push(`/pathology/nabl/${selectedId}`);
    }
  };

  const labs = specilitytype.labTests;
  return (
    <>
      <div className="mx-auto py-4 flex flex-col items-center  container lg:pl-[40px] lg:pr-[50px] xl:px-[60px] xlg:container font-poppins   mb-5">
        <div className="justify-center text-center mb-2 -mt-1.5">
          <h1 className="md:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
            Pathology
          </h1>
        </div>
        <div className="w-full  gap-4 mt-2  md:flex">
          {/* Left Side: Filters */}
          <div className="w-full md:w-2/5 lg:w-1/4  ">
            {/* Filter Inputs */}
            <div className="p-4 bg-[#D9D9D9] rounded-xl ">
              <div className="flex justify-center gap-2  mb-4 relative">
                <p className="border-[#5271FF] rounded-xl border">
                  {" "}
                  <span className="px-4 py-1 text-[#243460] font-semibold text-[12px]   flex items-center">
                    All Filters
                  </span>
                </p>
              </div>

              {/* Individual Filter Input Fields with consistent gap and margin */}
              <div className=" grid grid-cols-2 md:grid-cols-1 gap-2">
                <div className="mb-2">
                  <input
                    type="text"
                    className="w-full md:h-10 h-9 p-2 border placeholder:md:text-[14px]  placeholder:text-[12px]  placeholder:text-white text-white bg-[#5271FF] rounded-full"
                    placeholder="Enter Center Name"
                    required
                    value={searchQuery}
                    onChange={handleSearch} // Updates search query on user input
                    onKeyUp={handleFilter}
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    className="w-full md:h-10 h-9 p-2 border  placeholder:text-[12px] placeholder:md:text-[14px]  placeholder:text-white text-white bg-[#5271FF] rounded-full"
                    placeholder="Enter Hospital Name"
                    required
                  />
                </div>

                {/* Individual Filter Select Fields with consistent gap and margin */}
                <div className="mb-2 relative">
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
                    <FaArrowCircleDown
                    className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full"
                    
                  />
                  </span>
                </div>

                <div className="mb-2 relative">
                  <select
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                    required
                    name="category"
                  >
                    <option value="Select"> Center Experience</option>
                    <option value=""></option>
                    <option value=""></option>
                    <option value=""></option>
                  </select>
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaArrowCircleDown
                    className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full"
                    
                  />
                  </span>
                </div>

                <div className="mb-2 relative">
                  <select
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                    required
                    name="category"
                  >
                    <option value="Select"> Fee Range</option>
                    <option value=""></option>
                    <option value=""></option>
                    <option value=""></option>
                  </select>
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaArrowCircleDown
                    className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full"
                    
                  />
                  </span>
                </div>

                <div className="mb-2 relative">
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
                    <FaArrowCircleDown
                    className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full"
                    
                  />
                  </span>
                </div>

                <div className="mb-2 relative">
                  <select
                    name="state"
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
                <div className="mb-2">
                  <input
                    type="text"
                    className="w-full md:h-10 h-9 p-2 border placeholder:md:text-[14px] placeholder:text-[12px]  placeholder:text-white text-white bg-[#5271FF] rounded-full"
                    placeholder="Enter City Name"
                    required
                  />
                </div>
                <div className="mb-2">
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
          <div className="w-full md:w-3/5 overflow-auto lg:px-28 lg:w-4/5">
            {/* Grid Layout for Cards */}
            <div className=" grid sm:grid-cols-2 lg:grid-cols-2 gap-5 mt-1">
              <div className="mb-2 relative">
  <p className="pl-4 text-blue-950 text-xs md:text-sm font-semibold">
    A to Z Lab Tests
  </p>
  <input
    className="w-full md:h-10 h-9 pl-4 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
    placeholder="Select Test Category"
    readOnly
  />

  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        className="absolute right-2 mt-2.5 top-1/2 transform -translate-y-1/2 flex items-center justify-center"
      >
        <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      className="md:absolute -right-3 mt-2 w-full bg-white overflow-auto grid grid-cols-3 gap-8 p-4 shadow-lg rounded-lg z-50"
      style={{ minWidth: "350px", top: "100%" }}
    >
      <div className="col-start-1">
        {navlinks.slice(0, 9).map((nav) => (
          <DropdownMenuItem key={nav.link}>
            <Link href={nav.link}>
              <span className="text-blue-950 font-extrabold hover:text-[#FF5E00]">
                {nav.title}
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
      </div>

      {navlinks.length > 9 && (
        <div className="col-start-2">
          {navlinks.slice(9, 18).map((nav) => (
            <DropdownMenuItem key={nav.link}>
              <Link href={nav.link}>
                <span className="text-blue-950 font-extrabold hover:text-[#FF5E00]">
                  {nav.title}
                </span>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      )}

      {navlinks.length > 18 && (
        <div className="col-start-3">
          {navlinks.slice(18).map((nav) => (
            <DropdownMenuItem key={nav.link}>
              <Link href={nav.link}>
                <span className="text-blue-950 font-extrabold hover:text-[#FF5E00]">
                  {nav.title}
                </span>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
</div>


              <div className="mb-2 relative">
                <p className=" pl-4 text-blue-950 text-xs md:text-sm font-semibold">
                  Wellness Care & Packages
                </p>
                <select
  className="w-full md:h-10 h-9 pl-4 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
  required
  name="category"
  onChange={handleChange}
>
  <option
    value=""
    className="text-xs bg-gray-50 text-black hover:bg-gray-50"
  >
    Select Packages
  </option>
  {specilitytype?.wellnessPackages?.map((pkg) => (
    <option
      key={pkg.id}
      value={`${pkg.id}|${pkg.hospitalId}`}   // ✅ send both
      className="text-xs bg-gray-50 text-black hover:bg-gray-50"
    >
      {pkg.aapackagename}
    </option>
  ))}
</select>


                <span className="absolute right-2 mt-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FaArrowCircleDown
                    className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full"
                    
                  />
                </span>
              </div>
              <div className="mb-2 relative">
      <p className="pl-4 text-blue-950 text-xs md:text-sm font-semibold">
        Blood Banks
      </p>
      <select
        className="w-full md:h-10 h-9 pl-4 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
        required
        name="bloodBank"
        onChange={handleChange}
      >
        <option
          value=""
          className="text-xs bg-gray-50 text-black hover:bg-gray-50"
        >
          Select Blood Category
        </option>

        {specilitytype.bloodBanks?.map((blood) => (
          <option
            key={blood.id}
            value={`${blood.id}|${blood.hospitalId}`}  // ✅ send both
            className="text-xs bg-gray-50 text-black hover:bg-gray-50"
          >
            {blood.bloodname}  {/* show name + price */}
          </option>
        ))}
      </select>

      <span className="absolute right-2 mt-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
      </span>
    </div>

              <div className="mb-2 relative">
      <p className="pl-4 text-blue-950 text-xs md:text-sm font-semibold">
        NABL Accredited Labs
      </p>

      <select
        className="w-full md:h-10 h-9 p-2 pl-4 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
        required
        name="lab"
        onChange={handleChange1}   // ✅ trigger navigation
      >
        <option
          value=""
          className="text-xs bg-gray-50 text-black hover:bg-gray-50"
        >
          Select Lab
        </option>

        {labs ?.filter((lab) => lab.nabl === true) // only NABL accredited 
        .slice(0, 5)
        .map((lab) => (
            <option
              key={lab.id}
              value={lab.id}
              className="text-xs bg-gray-50 text-black hover:bg-gray-50"
            >
              {lab.testname}
            </option>
          ))}
      </select>

      <span className="absolute right-2 mt-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
      </span>
    </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PathologyMain;
