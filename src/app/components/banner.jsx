"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaHospitalAlt } from "react-icons/fa";
import { FaBedPulse } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";
import { FaUserDoctor } from "react-icons/fa6";
import { BsMicrosoftTeams } from "react-icons/bs";
import Link from "next/link";
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

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 4 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const getReverseIndex = (index) => {
    return (index + 1) % images.length;
  };

  const getSecondReverseIndex = (index) => {
    return (index + 2) % images.length;
  };

  const handleViewMore = () => {
    // Redirect using window.location.href
    {
      currentIndex === 0
        ? (window.location.href = "/")
        : (window.location.href = `/mobilenav/${currentIndex - 1}`);
    }
  };

  return (
    <div className="mx-auto  md:container min-[100px]:pl-[60px] min-[100px]:pr-5 min-[1100px]:pl-[60px]  min-[1100px]:pr-5  xl:pl-[80px] xl:pr-[40px] xlg:container  w-full min-[1000px]:mt-[120px] xl:mt-[120px] min-[1100px]:mt-[120px] mt-20 hidden md:block max-[1100px]:pr-[10px]">
      <div className="mx-auto md:container w-full shadow-md bg-gradient-to-br from-[#97faff] to-[#004aad] pt-4 mt-2 rounded-[15px]">
        <div className="pb-2 pt-2  flex gap-4 w-full">
          {/* Main Banner */}
          <div className="w-8/12 relative">
            <Link href={`/mobilenav/${currentIndex}`}>
              <Image
                src={images[currentIndex].src}
                height={1094}
                width={3000}
                quality={100}
                alt="Main Banner"
                className="max-[1200px]:h-[250px] min-[1200px]:h-[350px] rounded-[15px] shadow-md w-full"
              />
            </Link>
          </div>

          {/* Dynamic smaller blocks with reverse image rotation */}
          {/* old css :- w-4/12 space-y-2 relative */}
          <div className="w-4/12 flex flex-col justify-between">
            {/* First small block - reverse order */}
            <div
              className=" relative"
              // style={{
              //   backgroundImage: `url(${
              //     images[getReverseIndex(currentIndex)].src
              //   })`,
              //   height: "170px",
              //   backgroundSize: "cover",
              //   backgroundPosition: "right",
              //   backgroundRepeat: "no-repeat",
              //   filter: "brightness(90%)", // Optional styling for visibility
              // }}
            >
              {" "}
              <Image
                src={images[getReverseIndex(currentIndex)].src}
                height={1094}
                width={3000}
                quality={100}
                alt="Main Banner"
                className="max-[1200px]:h-[120px] min-[1200px]:h-[170px]  border-white border rounded-[15px] shadow-md w-full"
              />
            </div>

            {/* Second small block - reverse order */}
            <div
              className=" relative "
              // style={{
              //   backgroundImage: `url(${
              //     images[getSecondReverseIndex(currentIndex)].src
              //   })`,
              //   height: "170px",
              //   backgroundSize: "cover",
              //   backgroundPosition: "right",
              //   backgroundRepeat: "no-repeat",
              //   filter: "brightness(90%)", // Optional styling for visibility
              // }}
            >
              <Image
                src={images[getSecondReverseIndex(currentIndex)].src}
                height={1094}
                width={3000}
                quality={100}
                alt="Main Banner"
                className="max-[1200px]:h-[120px] min-[1200px]:h-[170px]  border-white border rounded-[15px] shadow-md w-full"
              />
            </div>
          </div>
        </div>
        {/* Marquee Section */}
        <div>
        <marquee className="text-white font-sans font-semibold text-[16px]">
    🚨 <strong>Important:</strong> Registration for Aarogya Aadhar Healthcare Services 
    will open on <strong>15 August</strong>. Register promptly to ensure faster access 
    to your benefits after approval.
</marquee>

        </div>
        {/* Stats Section */}
        <div className="flex px-8 w-full mx-auto items-center justify-center container pb-4">
          {[
            {
              label: "HSP & Hospital’s",
              value: "6800+",
              iconSrc: <FaHospitalAlt className="h-8 w-8" />,
            },
            {
              label: "Patient’s",
              value: "1,50,000+",
              iconSrc: <FaBedPulse className="h-8 w-8" />,
            },
            {
              label: "Covered Cities",
              value: "25+",
              iconSrc: <IoLocation className="h-8 w-8" />,
            },
            {
              label: "Doctors",
              value: "4,50,000+",
              iconSrc: <FaUserDoctor className="h-8 w-8" />,
            },
            {
              label: "Team Member’s",
              value: "50+",
              iconSrc: <BsMicrosoftTeams className="h-8 w-8" />,
            },
          ].map((stat, index) => (
            <div key={index} className="w-1/5">
              <div className="flex justify-center text-white space-x-2">
                <span className="h-8 w-8">{stat.iconSrc}</span>
                <span className="font-semibold font-sans text-2xl">
                  {stat.value}
                </span>
              </div>
              <div className="flex justify-center text-white space-x-2 font-poppins font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
