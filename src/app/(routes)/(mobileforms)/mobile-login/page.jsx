"use client";
import React from "react";

import Link from "next/link";
import { FaAmbulance, FaFilePrescription, FaFileSignature, FaHandshake, FaHandsHelping, FaHospitalAlt, FaSyringe, FaUserAltSlash } from "react-icons/fa";
import { FaBedPulse, FaBuildingShield, FaUserDoctor } from "react-icons/fa6";
import { ShoppingCart } from "lucide-react";
import { TbBriefcaseFilled } from "react-icons/tb";
import { GiRadioactive, GiTestTubes } from "react-icons/gi";


const MobileLogin = () => {




  const logos = [
    { title: "Patient", link: "/patient/login", logo:<FaBedPulse className="h-8 w-8" />},
    { title: "Doctor", link: "/doctor/login", logo:<FaUserDoctor className="h-8 w-8" /> },
    { title: "Hospital/Clinic", link: "/hospital/login", logo: <FaHospitalAlt className="h-8 w-8" /> },
    { title: "Pathology", link: "#" ,  logo: <GiTestTubes className="h-8 w-8 p-0" /> },
    { title: "Diagnostic Center", link: "#", logo:<GiRadioactive className="h-8 w-8 p-0" /> },
    { title: "Ambulance", link: "/ambulance/login" , logo:<FaAmbulance className="h-8 w-8 p-1" /> },
    { title: "Health Professional", link: "#", logo:<FaUserAltSlash className="h-8 w-8 p-1"/> },
    { title: "Corporate Company", link: "/corporate/login" , logo:<FaBuildingShield className="h-8 w-8 p-0" /> },
    { title: "Equipment Dealers", link: "#" ,logo: <FaSyringe className="h-8 w-8 p-0" />  },
    { title: "Pharmacy", link: "#", logo: <FaFilePrescription className="h-8 w-8 p-0" /> },
    { title: "Service Provider", link: "#" , logo:<FaHandsHelping className="h-8 w-8 p-0" /> },
    { title: "Aarogya Mitra", link: "#" , logo: <FaHandshake className="h-8 w-8 p-1" />},    
  ];

  return (
    <>
      <div className="block font-poppins my-4  lg:hidden  ">
        {" "}
        <div className="justify-center text-center pt-1">
          <h1 className="text-[20px] text-[#5271FF] font-extrabold">
          Aarogya Aadhar
          </h1>
          <p className="text-[#5271FF] text-[12px]">Login</p>
        </div>
        <div className="mx-auto container px-4 mb-2">
          <div className="flex justify-end items-center text-left">
        
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 mt-2">
            {logos.map((logo) => (
              <div
                key={logo.title}
                className="flex flex-col justify-center items-center bg-[#dbdbdb] rounded-xl p-2 text-center"
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
    </>
  );
};

export default MobileLogin;
