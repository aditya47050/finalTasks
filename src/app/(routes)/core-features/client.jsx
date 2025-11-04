"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaFilePrescription,
  FaHospitalAlt,
} from "react-icons/fa";
import {
  FaBuildingShield,
  FaHouseMedicalCircleCheck,
  FaUserDoctor,
} from "react-icons/fa6";
import { GiRadioactive, GiTestTubes } from "react-icons/gi";
import { PiHeartbeatFill } from "react-icons/pi";
import { RiHandHeartFill } from "react-icons/ri";
import { ArrowRightCircle } from "lucide-react";
import { IoCall, IoLogoApple, IoLogoGooglePlaystore } from "react-icons/io5";
import { Input } from "@/components/ui/input";
const CoreFeaturesClient = (data) => {
  console.log(data);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const pathname = usePathname();

 const images = [
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1731666351/Expert_Doctors_ajbmlx.png",
      text: [
        {
          id: 1,
          title: "Innovative Care Trusted Aarogya Aadhar Expertise",
          subtitle: "Aadhar Expertise",
        },
      ],
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1731666358/Hospitals_siexvj.png",
      text: [
        {
          id: 1,
          title: "Expert Aarogya Aadhar Hospital Care",
          subtitle: "Close to Home",
        },
      ],
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1731666367/Diagnostic_Center_mi3jgg.png",
      text: [
        {
          id: 1,
          title: "Unlocking the secrets of disease through the",
          subtitle: " lens of diagnosis",
        },
      ],
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1731667143/Surgery_svca4e.png",
      text: [
        {
          id: 1,
          title: "Compare, Decide, and Heal with ",
          subtitle: " Confidence",
        },
      ],
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1731667157/Home_Healthcare_opg6ih.png",
      text: [
        {
          id: 1,
          title: " Personalized Care ",
          subtitle: "Where You Live",
        },
      ],
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1731667211/Pathology_h5wmn4.png",
      text: [
        {
          id: 1,
          title: "       Expert Analysis ",
          subtitle: "Trusted Answers",
        },
      ],
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1731667184/Health_Insurance_2_uxwt7l.png",
      text: [
        {
          id: 1,
          title: "  Your Health Partner ",
          subtitle: "Every Step of the Way",
        },
      ],
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1731667196/Corporate_Healthcare_xrtfck.png",
      text: [
        {
          id: 1,
          title: " Empower your team health culture with ",
          subtitle: "Aarogya Aadhar wellness.",
        },
      ],
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1731667242/Pharmacy_yd7a0w.png",
      text: [
        {
          id: 1,
          title: "Your Neighborhood Aarogya Aadhar Pharmacy",
          subtitle: " Any Time, Any Where",
        },
      ],
    },
  ];

  const logos = [
    {
      title: "Upcoming Schedules",
      link: "#",
      logo: <FaCalendarAlt className="h-10 w-10 p-0" />,
    },
    {
      title: "Expert Doctors",
      link: "/mobilenav/0",
      logo: <FaUserDoctor className="h-10 w-10 p-0" />,
    },
    {
      title: "Nearest Hospitals",
      link: "/mobilenav/1",
      logo: <FaHospitalAlt className="h-10 w-10 p-0" />,
    },
    {
      title: "Nearest Pathology",
      link: "/mobilenav/5",
      logo: <GiTestTubes className="h-10 w-10 p-0" />,
    },
    {
      title: "Home Healthcare",
      link: "/mobilenav/4",
      logo: <FaHouseMedicalCircleCheck className="h-10 w-10 p-0" />,
    },
    {
      title: "Diagnostic Centers",
      link: "/mobilenav/2",
      logo: <GiRadioactive className="h-10 w-10 p-0" />,
    },
    {
      title: "Surgery Packages",
      link: "/mobilenav/3",
      logo: <PiHeartbeatFill className="h-10 w-10 p-0" />,
    },
    {
      title: "Nearest Pharmacy",
      link: "/mobilenav/8",
      logo: <FaFilePrescription className="h-10 w-10 p-0" />,
    },
    {
      title: "Health Insurance",
      link: "/mobilenav/6",
      logo: <RiHandHeartFill className="h-10 w-10 p-0" />,
    },
    {
      title: "Corporate Health",
      link: "/mobilenav/7",
      logo: <FaBuildingShield className="h-10 w-10 p-0" />,
    },
  ];

  return (
    <>
      <div className="block font-poppins my-2  lg:hidden  ">
        {" "}
        <div className="justify-center text-center pt-1">
          <h1 className="text-[20px] text-[#5271FF] font-extrabold">
          Core Features
          </h1>
          <p className="text-[#5271FF] text-[15px]">Features For Patient’s</p>
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
                  {logo.title.split(" ").map((word, index) => (
                    <span key={index} className="block">
                      {word}
                    </span>
                  ))}
                </h3>
              </div>
            ))}
          </div>
        </div>
        <div
          className={`w-full ${
            pathname === "/" && ""
          }  pl-3 justify-center text-center items-center  `}
        >
          <div className="w-full ">
            <Carousel
              plugins={[plugin.current]}
              className="w-full max-w-full  px-2 "
              onMouseEnter={() => plugin.current.stop()}
              onMouseLeave={() => plugin.current.reset()}
            >
              <CarouselContent className="w-full">
                {images.map((image, index) => (
                  <CarouselItem key={index} className="w-full">
                    <Image
                      src={image.src}
                      height={1094}
                      width={3000}
                      quality={100}
                      className="w-auto h-full rounded-[15px]"
                      onClick={() =>
                        (window.location.href = `/mobilenav/${index}`)
                      }
                      alt={`Slide ${index + 1}`}
                    />{" "}
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
        { data?.data?.email  ? (
          <></>
        ) : (
          <>
            <div className="mb-1 mt-4 md:w-[24rem] xl:w-[25rem] container mx-auto ">
              <div className="relative w-full max-w-md flex items-center">
                  {/* Icon */}
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <IoCall
                      className="h-6 w-6 bg-white rounded-full p-1 md:h-7 md:w-7"
                      color="#243451"
                    />
                  </span>
        
                  {/* Input Field */}
                  <Input
                    placeholder="Enter Number/Email ID"
                    className="rounded-full  bg-[#243451] font-poppins placeholder:text-[12px] text-white placeholder-blue-950 placeholder:font-semibold pl-10 md:pl-12 w-full"
                  />
        
                  {/* Button */}
                  <button
                    type="button"
                    className="absolute right-0 mr-[6px] -mt-1"
                  >
                    <span className="text-[#243451] p-2 text-[10px]  font-bold bg-white px-4 rounded-full">
                      Subscribe
                    </span>
                  </button>
                </div>
            </div>
            <div className="flex space-x-1 text-center mt-4 font-poppins text-[#002e6e] text-[20px] font-bold justify-center items-center">
              <span>Get the Link to Download App </span>{" "}
            </div>
            <div className=" flex items-center justify-center space-x-4 p-4">
              {/* App Store Button */}
              <div className="flex items-center rounded-xl bg-[#243460] text-white px-4 py-2  hover:bg-[#333333] cursor-pointer">
                <IoLogoApple className="h-6 w-6 mr-2" />
                <div className="flex flex-col">
                  <span className="text-xs">Download on the</span>
                  <span className="font-bold">App Store</span>
                </div>
              </div>

              {/* Google Play Button */}
              <div className="flex items-center rounded-xl bg-[#243460] text-white px-4 py-2  hover:bg-[#333333] cursor-pointer">
                <IoLogoGooglePlaystore className="h-6 w-6 mr-2" />
                <div className="flex flex-col">
                  <span className="text-xs">Get it on</span>
                  <span className="font-bold">Google Play</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CoreFeaturesClient;
