"use client";
import React from "react";

import Link from "next/link";
import { FaFileSignature, FaHandshake, FaHospitalAlt } from "react-icons/fa";
import { FaBuildingShield } from "react-icons/fa6";
import { ShoppingCart } from "lucide-react";
import { TbBriefcaseFilled } from "react-icons/tb";


const AdditionalFeaturesClient = (data) => {




  const logos = [
    {
      title: " Aarogya Mitra",
      link: "/aarogya-mitra",
      logo: <FaHandshake className="h-10 w-10 p-0" />,
    },
    {
      title: "HSP Portal",
      link: "/hsp-portal",
      logo: <FaHospitalAlt className="h-10 w-10 p-0" />,
    },
    {
      title: "Corporate",
      link: "/corporate-health",
      logo: <FaBuildingShield className="h-10 w-10 p-0" />,
    },
 
    {
      title: "AarogyaMart",
      link: "#",
      logo: <ShoppingCart className="h-10 w-10 p-0" />,
    },
    {
      title: "Job Portal",
      link: "/job-portal",
      logo: <TbBriefcaseFilled className="h-10 w-10 p-0" />,
    },
    {
        title: "Teleradiology",
        link: "/teleradiology",
        logo: <FaFileSignature className="h-10 w-10 p-0" />,
      },
    
  ];

  return (
    <>
    {
            data?.data?.email !== null
            ?
            <></> 
            :
      <div className="block font-poppins  lg:hidden sm:px-[2rem] ">
        {" "}
        <div className="justify-center text-center pt-1">
          <h1 className="text-[20px] text-[#5271FF] font-extrabold">
          Additional Features
          </h1>
          <p className="text-[#5271FF] text-[12px]">Features For Patient’s</p>
        </div>
        <div className="mx-auto container  px-0 mb-2">
          <div className="flex justify-end items-center text-left">
        
          </div>

          <div className="grid grid-cols-3 md:mx-12 md:gap-[2rem]  gap-4 p-4 mt-2">
            {logos.map((logo) => (
              <div
                key={logo.title}
                className="flex flex-col justify-center items-center bg-[#dbdbdb] rounded-xl p-2 text-center md:py-4"
              >
                {/* Logo */}
                <Link
                  href={logo.link}
               
                  className="text-blue-500 hover:underline"
                >
                  <div className="text-[#243460] ">
                    {logo.logo}
                  </div>
                </Link>
                {/* Title */}
                <h3 className="text-[8px] text-[#243460] font-medium mt-1 text-center leading-tight">
                 
                    <span  className="block">
                      {logo.title}
                    </span>
                
                </h3>
              </div>
            ))}
          </div>
        </div>
   
  
      </div>
}
    </>
  );
};

export default AdditionalFeaturesClient;
