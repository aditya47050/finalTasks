"use client";
import { ArrowDown, SearchIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const Jobclient = () => {
  const [text, setText] = useState();
  return (
    <>
      <div className="container font-poppins mt-8 mb-5 hidden lg:block">
        <div className="justify-center text-center ">
          <h1 className="md:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
            Job Portal
          </h1>
          <p className="text-[#5271FF] text-[12px] md:text-[15px]">
            Only for Healthcare Professionals
          </p>
        </div>
        <div className="w-full  rounded-3xl relative md:mb-[-20px] mt-4 mb-4 lg:mb-[-30px]  overflow-visible">
       
          <Image
            src="https://res.cloudinary.com/dnckhli5u/image/upload/v1731736007/28_e1nhc8.png"
            width={4000} // Adjusted width
            height={844} // Adjusted height
            className="w-full h-[270px] rounded-[15px]"
            alt=""
          />

          <div className="flex  justify-center text-center items-center md:mt-[-30px] lg:mt-[-60px] ">
            {" "}
            <span>
              <div className="mb-5 mt-4 container mx-auto p-2">
                <div className="relative pt-2 lg:ml-12">
                  <span className="absolute inset-y-0 left-0 flex items-center mt-2 pl-2">
                    <SearchIcon className="h-2 w-2 bg-blue-950 rounded-full text-blue-200 p-2 md:h-8 md:w-8" />
                  </span>

                  <input
                    value={text}
                    placeholder="Enter the Skills / Designations" // Use the passed placeholder prop here
                    className="rounded-full px-4 py-2 p-6 xl:w-[30rem] md:w-[22rem]  placeholder:text-[13px]  h-12 bg-[#B1C9EB] placeholder:text-[#201f1f] font-poppins pl-12"
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 mt-1"
                  >
                    <span className="bg-white p-1 font-bold text-blue-600 px-4 rounded-full">
                      Search
                    </span>
                  </button>
                </div>
              </div>
            </span>
            <span>
              <div className="mb-5 mt-4 container mx-auto p-2">
                <div className="relative pt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center mt-2 pl-2">
                    <SearchIcon className="h-2 w-2 bg-blue-950 rounded-full text-blue-200 p-2 md:h-8 md:w-8" />
                  </span>
                  <input
                    value={text}
                    placeholder="Select HSP Type" // Use the passed placeholder prop here
                    className="rounded-full px-4 py-2 p-6 h-12 xl:w-[18rem] md:w-[14rem]  text-[13px]  bg-[#B1C9EB] placeholder:text-[#201f1f] font-poppins pl-12"
                  />

                  <button
                    type="submit"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 mt-1"
                  >
                    <span className=" p-2 font-bold px-4 rounded-full">
                      {" "}
                      <ArrowDown className="h-8 w-8 bg-blue-950 p-1 rounded-full text-white" />
                    </span>
                  </button>
                </div>
              </div>
            </span>
            <span>
              <div className="mb-5 mt-4 container mx-auto p-2">
                <div className="relative pt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center mt-2 pl-2">
                    <SearchIcon className="h-2 w-2 bg-blue-950 rounded-full text-blue-200 p-2 md:h-8 md:w-8" />
                  </span>

                  <input
                    value={text}
                    placeholder="Enter Location" // Use the passed placeholder prop here
                    className="rounded-full px-4 py-2 p-6 xl:w-[22rem] md:w-[18rem] h-12 bg-[#B1C9EB] placeholder:text-[#201f1f] font-poppins  placeholder:text-[13px] pl-12"
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 mt-1"
                  >
                    <span className="bg-white p-1 font-bold text-blue-600 px-4 rounded-full">
                      Search
                    </span>
                  </button>
                </div>
              </div>
            </span>
          </div>
        </div>{" "}
        <div>
          <div className=" lg:mx-36 grid grid-cols-3 pt-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5  justify-center  sm:mt-2 px-4">
            {jobportal.slice(0, 5).map((icon, index) => (
              <div
                className="flex flex-col text-center items-center justify-center"
                key={index}
              >
                <span className="h-16 w-16 lg:h-28 lg:w-28    rounded-full ">
                  <Image
                    src={icon.src}
                    width={200}
                    height={200}
                    alt={icon.text}
                  />
                </span>
                <p className="text-[#5271FF] text-[12px] font-bold">
                  {icon.text}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center mx-auto pt-8">
          <button
            className="bg-[#243460] font-sans shadow-lg rounded-2xl text-white text-[14px] font-medium border-white border px-4 py-2"
            onClick={() => (window.location.href = "/job-portal")}
          >
            View More
          </button>
        </div>
      </div>
      {/* Mobile Screen */}
      <div className="lg:hidden font-poppins  block">
        {" "}
        <div className="justify-center text-center ">
          <h1 className="text-[20px] text-[#5271FF] font-extrabold">
            Job Portal
          </h1>
          <p className="text-[#5271FF] text-[11px]  hidden">
            {/*  */}
          </p>
        </div>
        <div className="mx-2 -mt-4">
          {" "}
          
          <Image
            src="https://res.cloudinary.com/dnckhli5u/image/upload/v1731736007/28_e1nhc8.png"
            width={1600} // Adjusted width
            height={420} // Adjusted height
            className="w-full h-full rounded-[4px] "
            alt=""
          />
        </div>
        <div className="flex flex-col mt-2 items-center md:container text-center space-y-4 md:space-y-6 md:mt-0">
          <div className="w-full flex items-center justify-center">
            <div className="relative w-[64%]">
              <input
                value={text}
                placeholder="Enter the Skills/Designation"
                className="rounded-full w-full h-8 text-[10px]  placeholder:text-[10px]  placeholder:text-[#243460] border border-[#243460] placeholder:font-semibold pl-2"
              />
              <button
                type="button"
                className="absolute right-0 top-1/2 transform  -translate-y-1/2 mr-1 py-1 text-[9px]"
              >
                <span className="bg-[#243460] px-2 py-1  text-[10px] font-bold text-white rounded-full">
                  Search
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex  mt-2 items-center md:container text-center px-2  space-x-2">
          <div className="w-full">
            <div className="relative">
              <select
                value={text}
                className="rounded-full px-4 text-[10px] py-1 w-full bg-gradient-to-r from-[#ffde59] to-[#ff914d] h-8 placeholder:text-[10px] border border-[#243460] placeholder-blue-950 placeholder:font-semibold pl-4"
                placeholder="Select HSP Type"
              >
                <option value="">Select HSP Type</option>
                <option value="Clinic">Clinic</option>
                <option value="Hospitals">Hospitals</option>
                <option value="Diagnostic Center">Diagnostic Center</option>
                <option value="Pathology">Pathology</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Dialysis Center">Dialysis Center</option>
                <option value="Ambulance">Ambulance</option>
                <option value="Home Care">Home Care</option>
                <option value="OHC Corporate">OHC Corporate</option>
                <option value="Healthcare IT Company">
                  Healthcare IT Company
                </option>
                <option value="Health Insurance Company">
                  Health Insurance Company
                </option>
              </select>
              <button
                type="submit"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-1 py-1 text-sm"
              >
                <span className="p-1 font-bold text-blue-600 rounded-full">
                  <ArrowDown className="h-5 w-5 bg-blue-950 p-1 rounded-full text-white" />
                </span>
              </button>
            </div>
          </div>

          <div className="w-full max-w-md">
            <div className="relative">
              <input
                value={text}
                placeholder="Enter Location"
                className="rounded-full text-[10px] px-4 py-2 w-full bg-gradient-to-br from-[#b6ff83] via-[#53e418] to-[#79b50c] h-8 placeholder:text-[10px] border border-[#243460] placeholder-blue-950 placeholder:font-semibold pl-2"
              />
              <button
                type="button"
                className="absolute right-0 top-1/2 transform  -translate-y-1/2 mr-1 py-1 text-[9px]"
              >
                <span className="bg-[#243460] px-2 py-1  text-[10px] font-bold text-white rounded-full">
                  Search
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center mx-auto pt-3">
          <button
            className="bg-[#243460] p-2 px-3 text-white text-[10px] rounded-full font-bold"
            onClick={() => (window.location.href = "/job-portal")}
          >
            View More
          </button>
        </div>
      </div>
    </>
  );
};

export default Jobclient;
const jobportal = [
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729164012/Clinics_fzccnw.png",
    text: "Clinics",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729164039/Hospitals_gdx6yc.png",
    text: "Hospitals",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729164019/Diagnostic_Center_nssncu.png",
    text: "Diagnostic Center",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729164049/Pathology_Lab_la2kxs.png",
    text: "Pathology Lab",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729164023/Dialysis_Center_mj7ep0.png",
    text: "Dialysis Center",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1724494857/Icons/zpqoopeo4opdqd4qpi1t.png",
    text: "Pharmacy",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227150/Ambulance_ydhqvw.png",
    text: "Ambulance",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1724494857/Icons/zpqoopeo4opdqd4qpi1t.png",
    text: "Home Care",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1724494857/Icons/zpqoopeo4opdqd4qpi1t.png",
    text: "OHC Corporate",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1724494857/Icons/zpqoopeo4opdqd4qpi1t.png",
    text: "IT Company",
  },
];
