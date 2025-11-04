import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

const Hospitalmainclient = () => {
  return (
    <>
      <div className="mx-auto flex flex-col items-center  container font-poppins min-h-screen pt-1  mb-5">
        <div className="justify-center text-center pt-1">
          <h1 className="md:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
            Hospital Categories
          </h1>
        </div>
        <div className="w-full gap-2 mt-2  flex">
          {/* Left Side: Filters */}
          <div className="w-full md:w-2/5 lg:w-1/5 hidden md:block bg-[#D9D9D9] rounded-xl">
            {/* Filter Inputs */}
            <div className="p-2">
              <div className="flex justify-center gap-2  mb-4 relative">
                <p className="border-[#5271FF] rounded-xl border">
                  {" "}
                  <span className="px-4 py-1 text-[#243460] font-semibold text-[12px]   flex items-center">
                    All Filters
                  </span>
                  {/* <span className="" >
      <ArrowDown className="md:h-4 md:w-4 h-2 w-2 bg-[#243460] rounded-full" color="#fff" />
    </span> */}
                </p>
              </div>

              {/* Individual Filter Input Fields with consistent gap and margin */}
              <div className="mb-2">
                <input
                  type="text"
                  className="w-full md:h-10 h-9 p-2 border placeholder:md:text-[14px]  placeholder:text-[12px]  placeholder:text-white text-white bg-[#5271FF] rounded-full"
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
                  <option value="Select"> Surgery Category </option>
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

              <div className="mb-2 relative">
                <select
                  className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                  required
                  name="category"
                >
                  <option value="Select">Treatment Category </option>
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

              <div className="mb-2 relative">
                <select
                  className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                  required
                  name="category"
                >
                  <option value="Select">Hospital Facilities</option>
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

              <div className="mb-2 relative">
                <select
                  className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                  required
                  name="category"
                >
                  <option value="Select">Bed Category </option>
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
                  <ArrowDown
                    className="md:h-6 md:w-6 h-4 w-4 bg-white rounded-full"
                    color="#243460"
                  />
                </span>
              </div>

              <div className="mb-2 relative">
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
                  className="w-full md:h-10 h-9 p-2 border  placeholder:text-[12px] placeholder:md:text-[14px]  placeholder:text-white text-white bg-[#5271FF] rounded-full"
                  placeholder="Enter Pin Code "
                  required
                />
              </div>

              <div className="flex text-center justify-center mt-2">
                <span className="bg-[#FF5E00] shadow-lg rounded-2xl text-white placeholder:md:text-[14px] text-[12px] font-medium  border-2 px-4 p-2">
                  Search
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Cards */}
          <div className="w-full md:w-3/5 lg:w-4/5">
            {/* Grid Layout for Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
              {healthPackages.map((item, index) => (
                <div key={index} className="">
                  <Card className="relative h-auto mb-0 border-none">
                    <CardContent className="flex flex-col p-4 bg-[#D9D9D9] rounded-[15px] h-[240px]">
                      {/* Image */}
                      <div className="relative w-full mx-auto bg-white rounded-[15px]">
                        {item.src ? (
                          <Image
                            src={item.src}
                            width={600}
                            height={400}
                            alt={item.alt}
                            className="object-cover bg-[#5271FF] rounded-[15px] h-28"
                          />
                        ) : (
                          <div className="relative w-full bg-white border-[#ffce38] h-28 rounded-[15px]"></div>
                        )}
                      </div>

                      {/* Star Ratings */}
                      <div className="mt-[-50px] z-30 flex flex-col items-center justify-center gap-2">
                        {/* Star Rating */}
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-5 w-5 fill-current ${
                                i < item.rating
                                  ? "text-[#ffce38]"
                                  : "text-gray-300"
                              }`}
                              viewBox="0 0 20 20"
                              stroke="#ffce38"
                              strokeWidth="1"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.144c.969 0 1.371 1.24.588 1.81l-3.358 2.443a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.539 1.118l-3.358-2.443a1 1 0 00-1.175 0l-3.358 2.443c-.784.57-1.838-.197-1.539-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.482 9.375c-.783-.57-.38-1.81.588-1.81h4.144a1 1 0 00.95-.69l1.286-3.948z" />
                            </svg>
                          ))}
                        </div>

                        {/* Review Count */}
                        <div>
                          <p className="text-[11px]">{item.rcount} Reviews</p>
                        </div>
                      </div>

                      <div className="mt-4 text-center h-10">
                        <p className="text-[#ff5e00] text-[14px] font-bold">
                          {item.text}
                        </p>
                      </div>
                      <div className="text-left ">
                        <p className="text-[#243460] text-[14px] font-semibold ">
                          Address :{" "}
                        </p>
                        <p className="text-[#243460] text-[14px] font-semibold ">
                          Contact No :{" "}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const healthPackages = [
  {
    src: "",
    alt: "Basic Pre-Employment",
    text: "Basic Pre-Employment",
    rcount: "258",
    rating: 4,
  },
  {
    src: "",
    alt: "Pre-Employment",
    text: "Pre-Employment",
    rcount: "258",
    rating: 3,
  },
  {
    src: "",
    alt: "Employee Annual Health Check-Up",
    text: "Employee Annual Health Check-Up",
    rcount: "580",
    rating: 5,
  },
  {
    src: "",
    alt: "Executive Health Check-Up(Male)",
    text: "Executive Health Check-Up(Male)",
    rcount: "351",
    rating: 4,
  },
  {
    src: "",
    alt: "Executive Health Check-Up(Female)",
    text: "Executive Health Check-Up(Female)",
    rcount: "183",
    rating: 2,
  },
];

export default Hospitalmainclient;
