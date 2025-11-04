"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDown, SearchIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { FaArrowCircleDown } from 'react-icons/fa';

const Jobportalclient = () => {
  const [text, setText] = useState();

  return (
    <>
      <div className="container hidden lg:block mx-auto mt-6  lg:pl-[40px] lg:pr-[50px] xl:pl-[50px] xl:pr-[80px] xl:mx-auto xlg:container">
        <div className="justify-center font-poppins  text-center ">
          <h1 className="text-[25px] text-[#5271FF] font-extrabold">
            Job Portal
          </h1>
          <p className="text-[#5271FF]  text-[15px]">
            Only for Healthcare Professionals
          </p>
        </div>
        <div className="w-full  rounded-3xl relative md:mb-[-20px] lg:mb-[-30px] mt-4 mb-4 overflow-visible">
          <div className="relative">
            {/* Image */}
            <Image
              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1731736007/28_e1nhc8.png"
              width={1280}
              height={720}
              className="w-full h-[270px] rounded-[15px]"
              alt=""
            />

            {/* Buttons Positioned on Right */}
            <div className="absolute top-1/2 right-7 transform -translate-y-1/2 flex flex-col space-y-3">
              <Button className=" text-white rounded-[10px] bg-blue-600 py-3">
                Registration
              </Button>
              <Button className="text-white rounded-[10px] bg-blue-600 py-3">
                Login
              </Button>
              <Button className="text-white rounded-[10px] bg-blue-600 py-3">
                Employer
              </Button>
            </div>
          </div>

          <div className="flex  justify-center text-center items-center md:mt-[-30px] lg:mt-[-60px] ">
            {" "}
            <span>
              <div className="mb-5 mt-4 container mx-auto p-2">
                <div className="relative pt-0 lg:ml-8 xl:ml-12">
                  <span className="absolute inset-y-0 left-1 top-[45%] transform -translate-y-1/2 pl-1 z-10">
                    {" "}
                    {/* Standardized padding */}
                    <div
                      className={
                        "h-8 w-8 rounded-full text-white p-2 transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-900"
                      }
                    >
                      <SearchIcon className="h-2 w-2  md:h-8 md:w-8" /> {/* Standardized icon size */}
                    </div>
                  </span>

                  <input
                    value={text}
                    placeholder="Enter the Skills / Designations" // Use the passed placeholder prop here
                    className="rounded-full px-4 py-2 p-6 xl:w-[23rem] md:w-[20rem]  placeholder:text-[13px]  h-12 bg-gradient-to-r from-blue-100 to-indigo-100 placeholder-blue-800 font-poppins pl-12"
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-[45%] transform -translate-y-1/2 mr-2 mt-1"
                  >
                    <span className="bg-white p-2 font-bold text-blue-600 px-4 rounded-full">
                      Search
                    </span>
                  </button>
                </div>
              </div>
            </span>
            <span>
              <div className="mb-5 mt-4 container mx-auto p-2">
                <div className="w-full relative">
                  <div className="relative pr-1 mt-0">
                    {/* Select Dropdown */}
                    <span className="absolute inset-y-0 left-1 top-[45%] transform -translate-y-1/2 pl-1 z-10">
                    {" "}
                    {/* Standardized padding */}
                    <div
                      className={
                        "h-8 w-8 rounded-full text-white p-2 transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-900"
                      }
                    >
                      <SearchIcon className="h-2 w-2  md:h-8 md:w-8" /> {/* Standardized icon size */}
                    </div>
                  </span>
                    <select
                      className="rounded-full px-4 py-2 p-6 pr-5 xl:w-[16rem] md:w-[14rem]  placeholder:text-[13px] text-[13px]  h-12 bg-gradient-to-r from-blue-100 to-indigo-100 placeholder-blue-800 font-poppins pl-12 appearance-none"
                      required
                    >
                      <option
                        value=""
                        className="text-[#201f1f] bg-white pl-4 font-poppins font-semibold text-[13px]"
                      >
                        Select HSP Type
                      </option>
                      {[
                        "Clinic",
                        "Hospitals",
                        "Diagnostic Center",
                        "Pathology",
                        "Pharmacy",
                        "Dialysis Center",
                        "Ambulance",
                        "Home Care",
                        "OHC Corporate",
                        "Healthcare IT Company",
                        "Health Insurance Company",
                      ].map((category, index) => (
                        <option
                          key={index}
                          className="text-[#201f1f] bg-white font-poppins pl-4 font-semibold text-[13px]"
                          value={category}
                        >
                          {category}
                        </option>
                      ))}
                    </select>

                    {/* Custom Arrow (Just a Decorative Icon) */}
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <Image
                        className="h-[34px] w-[34px]"
                        src="https://res.cloudinary.com/dnckhli5u/image/upload/v1726035881/Icons/yupkmri6egefipsa4bcb.png"
                        width={24}
                        height={24}
                        alt="Dropdown Icon"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </span>
            <span>
              <div className="mb-5 mt-4 container mx-auto p-2">
                <div className="relative pt-0">
                  <span className="absolute inset-y-0 left-1 top-[45%] transform -translate-y-1/2 pl-1 z-10">
                    {" "}
                    {/* Standardized padding */}
                    <div
                      className={
                        "h-8 w-8 rounded-full text-white p-2 transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-900"
                      }
                    >
                      <SearchIcon className="h-2 w-2  md:h-8 md:w-8" /> {/* Standardized icon size */}
                    </div>
                  </span>

                  <input
                    value={text}
                    placeholder="Enter Location" // Use the passed placeholder prop here
                    className="rounded-full px-4 py-2 p-6 xl:w-[20rem] md:w-[16rem] h-12 bg-gradient-to-r from-blue-100 to-indigo-100 placeholder-blue-800 font-poppins  placeholder:text-[13px] pl-12"
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-[45%] transform -translate-y-1/2 mr-2 mt-1"
                  >
                    <span className="bg-white p-2 font-bold text-blue-600 px-4 rounded-full">
                      Search
                    </span>
                  </button>
                </div>
              </div>
            </span>
          </div>
        </div>{" "}
        <div>
          <div className=" lg:mx-36 grid grid-cols-2 md:grid-cols-5 pt-4 space-y-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5  justify-center  sm:mt-2 px-4">
            {jobportal.map((icon, index) => (
              <div
                className="flex flex-col text-center items-center justify-center"
                key={index}
              >
                <span className="h-16 w-16 lg:h-28 lg:w-28   rounded-full ">
                  <Image
                    src={icon.src}
                    width={200}
                    height={200}
                    alt={icon.text}
                  />
                </span>
                <p className="text-[#5271FF] mt-2 text-[12px] font-bold">
                  {icon.text}
                </p>
              </div>
            ))}
          </div>

          <div> </div>
        </div>
      </div>

      {/* m */}
      <div className="lg:hidden mt-6   font-poppins block">
        {" "}
        <div className="justify-center text-center ">
          <h1 className="text-[20px] text-[#5271FF] font-extrabold">
            Job Portal
          </h1>
          <p className="text-[#5271FF] text-[14px]">
            Only for Healthcare Professionals
          </p>
        </div>
        <div className="px-4 w-full  rounded-3xl relative mt-1 mb-4 overflow-visible">
              <Image
                src="https://res.cloudinary.com/dnckhli5u/image/upload/v1731736007/28_e1nhc8.png"
                width={1600}
                height={420}
                className="w-full h-full rounded-[4px]"
                alt=""
              />
              {/* Centered Buttons at Bottom */}
              <div className="absolute  -bottom-4 left-1/2 -translate-x-1/2 flex flex-row space-x-2">
                <Button className="text-white rounded-[10px] bg-blue-600 text-[10px] h-6 ">
                  Registration
                </Button>
                <Button className="text-white rounded-[10px] bg-blue-600 text-[10px] h-6 ">
                  Login
                </Button>
                <Button className="text-white rounded-[10px] bg-blue-600 text-[10px] h-6">
                  Employer
                </Button>
              </div>
          </div>
          <div className="flex flex-col pt-2 items-center md:container text-center space-y-4 md:space-y-6 md:mt-0">
            <div className="w-full flex items-center justify-center">
              <div className="relative w-[64%]">
                <input
                  value={text}
                  placeholder="Enter the Skills/Designation"
                  className="rounded-full w-full h-8 text-[10px]  placeholder:text-[10px]  placeholder:text-[#243460] border border-[#243460] placeholder:font-semibold pl-2"
                />
                <button
                  type="button"
                  className="absolute right-1 top-1/2 transform  -translate-y-1/2 mr-1 py-1 text-[9px]"
                >
                  <span className="bg-[#243460] px-2 py-1  text-[10px] font-bold text-white rounded-full">
                    Search
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex mt-2 items-center md:container text-center px-2 space-x-2">
            <div className="w-full">
              <div className="relative">
                {/* Wrapping in label allows clicking on the arrow to open dropdown */}
                <label className="w-full">
                  <select
                    value={text}
                    className="rounded-full px-4 text-[10px] py-1 w-full bg-gradient-to-r from-[#ffde59] to-[#ff914d] h-8 placeholder:text-[10px] border border-[#243460] placeholder-blue-950 placeholder:font-semibold pl-2 appearance-none"
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
                </label>

                {/* Dropdown Arrow */}
                <span className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FaArrowCircleDown className="h-7 w-7  p-1 rounded-full text-blue-950" />
                </span>
              </div>
            </div>

            {/* Location Input Field */}
            <div className="w-full max-w-md">
              <div className="relative">
                <input
                  value={text}
                  placeholder="Enter Location"
                  className="rounded-full text-[10px] px-4 py-2 w-full bg-gradient-to-br from-[#b6ff83] via-[#53e418] to-[#79b50c] h-8 placeholder:text-[10px] border border-[#243460] placeholder-blue-950 placeholder:font-semibold pl-2"
                />
                <button
                  type="button"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 mr-1 py-1 text-[9px]"
                >
                  <span className="bg-[#243460] px-2 py-1 text-[10px]  text-white rounded-full">
                    Search
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className=" lg:mx-36 grid grid-cols-3 mt-4 md:gap-4  lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5  justify-center  sm:mt-2 px-4">
            {jobportal.map((icon, index) => (
              <div
                className="flex flex-col text-center items-center justify-center"
                key={index}
              >
                <span className="h-16 w-16 lg:h-28 lg:w-28   rounded-full ">
                  <Image
                    src={icon.src}
                    width={200}
                    height={200}
                    alt={icon.text}
                  />
                </span>
                <p className="text-[#5271FF] lg:text-[12px] text-[10px] font-bold">
                  {icon.text}
                </p>
              </div>
            ))}
          </div>
          </div>
        </>
  );
};

export default Jobportalclient;
const jobportal = [
  {
    src: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1743860738/WhatsApp_Image_2025-04-05_at_7.09.04_PM_uv9udd.jpg",
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
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227490/Pharmacy_aydpzl.png",
    text: "Pharmacy",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227150/Ambulance_ydhqvw.png",
    text: "Ambulance",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227300/Home_Care_nqvgzp.png",
    text: "Home Care",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227446/OHC_Corporate_brwggv.png",
    text: "OHC Corporate",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227358/IT_Company_cgibei.png",
    text: "IT Company",
  },
];
