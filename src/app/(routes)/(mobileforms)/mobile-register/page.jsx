"use client";
import React from "react";

import Link from "next/link";
import { FaAmbulance, FaFilePrescription, FaFileSignature, FaHandshake, FaHandsHelping, FaHospitalAlt, FaSyringe, FaUserAltSlash } from "react-icons/fa";
import { FaBedPulse, FaBuildingShield, FaUserDoctor } from "react-icons/fa6";
import { ShoppingCart } from "lucide-react";
import { TbBriefcaseFilled } from "react-icons/tb";
import { GiRadioactive, GiTestTubes } from "react-icons/gi";
import { RiRegisteredFill } from "react-icons/ri";
import CommonMBanner from "../../components/commonmobilebanner";


const MobileRegister = () => {




  const logos = [
    { title: "Patient", link: "/patient/register", logo:<FaBedPulse className="h-8 w-8" />},
    { title: "Doctor", link: "/doctor/register", logo:<FaUserDoctor className="h-8 w-8" /> },
    { title: "Hospital/Clinic", link: "/hospital/register", logo: <FaHospitalAlt className="h-8 w-8" /> },
    { title: "Pathology", link: "#" ,  logo: <GiTestTubes className="h-8 w-8 p-0" /> },
    { title: "Diagnostic Center", link: "#", logo:<GiRadioactive className="h-8 w-8 p-0" /> },
    { title: "Ambulance", link: "/ambulance/register" , logo:<FaAmbulance className="h-8 w-8 p-1" /> },
    { title: "Health Professional", link: "#", logo:<FaUserAltSlash className="h-8 w-8 p-1"/> },
    { title: "Corporate Company", link: "/corporate/register" , logo:<FaBuildingShield className="h-8 w-8 p-0" /> },
    { title: "Equipment Dealers", link: "#" ,logo: <FaSyringe className="h-8 w-8 p-0" />  },
    { title: "Pharmacy", link: "#", logo: <FaFilePrescription className="h-8 w-8 p-0" /> },
    { title: "Service Provider", link: "#" , logo:<FaHandsHelping className="h-8 w-8 p-0" /> },
    { title: "Aarogya Mitra", link: "#" , logo: <FaHandshake className="h-8 w-8 p-1" />},   
    { title: "Registration Enquiry", link: "/registrationenquiryform" , logo: <RiRegisteredFill className="h-8 w-8 p-1" /> },

  ];

  return (
    <>
      <div className="block font-poppins  lg:hidden  ">
        {" "}
        <div className="justify-center text-center pt-1">
          <h1 className="text-[20px] text-[#5271FF] font-extrabold">
          Aarogya Aadhar
          </h1>
          <p className="text-[#5271FF] text-[12px]">Register</p>
        </div>
        <div className="mx-auto container px-4 mb-2">
          <div className="flex justify-end items-center text-left">
        
          </div>

          <div className="grid grid-cols-3 gap-4 px-4 pt-2 pb-2">
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
   <CommonMBanner/>
  
      </div>
    </>
  );
};

export default MobileRegister;
