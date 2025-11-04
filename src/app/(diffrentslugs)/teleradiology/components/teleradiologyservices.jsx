"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Apple } from "lucide-react";
import { IoCall, IoLogoApple, IoLogoGooglePlaystore } from "react-icons/io5";

const Teleradiologyservices = () => {
  const serviceslist = [
    {
      src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGea2UAyg46QuFsS4ZJblTktDfXMYwCrv35yNWI",
      link: "#",
      text: "X-Ray",
      amount: "3,50,000",
      value: "800+ ",
    },
    {
      src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGeEYnCykcBnQrIUub9VaSsY4cxFd32RvZgXPfi",
      link: "#",
      text: "CT Scan",
      amount: "3,50,000",
      value: "450+",
    },
    {
      src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGepFJ7cKbNbgokJiM4Qq0SCORdFDGVEmhUyIeW",
      link: "#",
      text: "MRI Scan",
      amount: "3,50,000",
      value: "350+",
    },
    {
      src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGepE5tkcbNbgokJiM4Qq0SCORdFDGVEmhUyIeW",
      link: "#",
      text: "Pet Scan",
      amount: "3,50,000",
      value: "50+",
    },
    {
      src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGetvYfYzUGJ14vmWTzgj6ue3aMP5dOyl82frUp",
      link: "#",
      text: "Sonography",
      amount: "3,50,000",
      value: "100+",
    },
    {
      src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGeBZyxLxP16AvimkNPfacwJ0X7FSdnWTpqgyIl",
      link: "#",
      text: "Mammography",
      amount: "3,50,000",
      value: "50+",
    },
  ];
  const data = [
    {
      title: "Radiology Image Interpretation",
      description:
        "Analyzing images for medical diagnosis using advanced imaging technologies and expertise.",
    },
    {
      title: "Aarogya e-RAD’s",
      description:
        "Aarogya eRAD’s Meaningful Use-Certified RIS is a comprehensive solution designed from the ground up by a team of veteran imaging center operators, radiologists and programmers.",
    },
    {
      title: "Teleradiology Solution",
      description:
        "Aarogya e-RAD boutique radiology interpretation offering enables your diagnostic unit to cope with the growing dearth of on call radiologists. ",
    },
    {
      title: "Preliminary Radiology Reporting",
      description:
        "we provide expert radiology interpretations and generate accurate preliminary radiology reports. Count on us for accurate and timely results. ",
    },
    
    
    {
      title: "Advance Radiology Coverage",
      description:
        "Aarogya e-RAD specializes in providing advanced radiology coverage and imaging services. ",
    },
    {
      title: "Best Radiology Subspecialty",
      description:
        "Get the best radiology subspecialty interpretations from a trusted radiology reading service.",
    },
    {
      title: "Locum Tenens Radiologist",
      description:
        "Aarogya e-RAD is a trusted provider of radiology locum specialists, specializing in interventional radiology locum.",
    },
  ];
  return (
    <>
      <div >
        <div className="justify-center text-center mt-6 md:mt-4 lg:mt-0">
          <h1 className="py-1 md:text-[25px] text-[20px] text-[#5271FF] font-poppins font-extrabold">
            Our Services
          </h1>
        </div>
        <div className=" grid grid-cols-2 xs:grid-cols-3 md:grid-cols-3 gap-2 lg:hidden mb-4 md:mb-0">
        {serviceslist.map((item, index) => (
                <div
                  key={index}
                  className=""
                >
                  <div className="p-0 relative">
                    <div className="relative h-auto mb-4 border-none">
                      <div className="flex flex-col items-center p-1 relative bg-[#D9D9D9] rounded-[15px]">
                        {/* Image */}
                        <div className="relative w-full  bg-white rounded-[15px]">
                          {item.src ? (
                            <Image
                              src={item.src}
                              width={600}
                              height={300}
                              alt={item.alt}
                              className="object-cover bg-[#5271FF] rounded-[15px] h-20 md:h-44"
                            />
                          ) : (
                            <div className="relative w-full bg-white rounded-[20px] h-20 md:h-44"></div>
                          )}
                          {/* Button Half on Image and Half Outside */}
                          <button className="absolute xl:bottom-[-15px] bottom-[-10px] left-1/2 transform -translate-x-1/2 xs:text-[7px] md:text-[11px] xl:text-[13px] bg-blue-500 text-white py-1 px-2 font-bold font-poppins rounded-full shadow-md">
                            {item.text}
                          </button>
                        </div>

                        {/* Name */}

                        <p className=" font-bold font-sans text-[#243460] text-[7px] md:text-[11px] xl:text-[13px] mt-3 md:mt-4 justify-center text-center ">
                          {item.value}
                        </p>
                          <span className=" font-sans !mt-0 text-[#243460] text-[7px] md:text-[11px] xl:text-[13px] text-center">
                            Reporting per day
                          </span>

                        {/* Two Buttons Below */}
                        <div className="flex xs:mt-1 lg::mt-4 gap-8 justify-center w-full relative">
                          <div className=" flex gap-2 md:gap-6">
                            <button className="bg-[#FF3131] font-poppins text-[6px] md:text-[11px] xl:text-[13px] text-white xs:py-1 xs:px-2 lg:py-2 lg:px-3 rounded-full shadow-md">
                              Rates
                            </button>
                            <button className="bg-[#5271FF] font-poppins text-[6px] md:text-[11px] xl:text-[13px] text-white xs:py-1 xs:px-2 lg:py-2 lg:px-3 rounded-full shadow-md">
                              Sample
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
        <div className="mx-auto hidden lg:block container mt-1">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {serviceslist.map((item, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 basis-1/3 lg:basis-1/3 xl:basis-1/5"
                >
                  <div className="p-0 relative">
                    <div className="relative h-auto mb-4 border-none">
                      <div className="flex flex-col items-center p-1 relative bg-[#D9D9D9] rounded-[15px]">
                        {/* Image */}
                        <div className="relative w-full  bg-white rounded-[15px]">
                          {item.src ? (
                            <Image
                              src={item.src}
                              width={600}
                              height={300}
                              alt={item.alt}
                              className="object-cover bg-[#5271FF] rounded-[15px] h-20 md:h-44"
                            />
                          ) : (
                            <div className="relative w-full bg-white rounded-[20px] h-20 md:h-44"></div>
                          )}
                          {/* Button Half on Image and Half Outside */}
                          <button className="absolute xl:bottom-[-15px] bottom-[-10px] left-1/2 transform -translate-x-1/2 text-[7px] md:text-[11px] xl:text-[13px] bg-blue-500 text-white py-1 px-3 font-bold font-poppins rounded-full shadow-md">
                            {item.text}
                          </button>
                        </div>

                        {/* Name */}

                        <p className=" font-bold font-sans text-[#243460] text-[7px] md:text-[11px] xl:text-[13px] mt-4  md:mt-4 justify-center text-center ">
                          {item.value}
                        </p>

                        <div className="text-center w-full ">
                          <span className=" font-sans text-[#243460] text-[7px] md:text-[11px] xl:text-[13px] text-center">
                            Reporting per day
                          </span>
                        </div>

                        {/* Two Buttons Below */}
                        <div className="flex mt-4 gap-8 justify-center w-full relative">
                          <div className="absolute bottom-[-20px] flex gap-2 md:gap-6">
                            <button className="bg-[#FF3131] font-poppins text-[7px] md:text-[11px] xl:text-[13px] text-white py-2 px-4 rounded-full shadow-md">
                              Rates
                            </button>
                            <button className="bg-[#5271FF] font-poppins text-[7px] md:text-[11px] xl:text-[13px] text-white py-2 px-4 rounded-full shadow-md">
                              Sample
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="grid md:py-10   font-poppins grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4 ">
          {data.map((item, index) => (
            <div
              key={index}
              className="relative border border-[#5271ff] rounded-[15px] p-4 lg:p-2 xs:h-32 md:h-44 xl:h-40"
            >
              {/* First Button */}
              <button className="absolute text-[10px] whitespace-nowrap md:text-[12px]   lg:text-[14px] rounded-[15px] top-[-12px] left-1/2 transform -translate-x-1/2 bg-[#5271ff] text-white px-3 py-2 w-48 md:w-56 lg:w-60 items-center">
                {item.title}
              </button>

              {/* Content */}
              <p className="md:mt-8 mt-4 text-[14px] text-[#243460]  md:text-[12px]   lg:text-[14px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* image with text */}
        <div className="w-full container mx-auto px-4 py-6 lg:py-12 flex flex-col lg:flex-row items-center justify-between rounded-[20px] bg-[#F5F8FF] shadow-md gap-8 relative">
  {/* TEXT SECTION */}
  <div className="lg:w-1/2 text-[#243460] space-y-6 font-poppins">
    <div className="space-y-3">
      <h3 className="text-xl lg:text-2xl font-bold">
        Aarogya e-RAD 24/7 (365 days)
      </h3>
      <p className="text-sm lg:text-base font-medium">
        Providing Emergency Radiology Services with industry-best turnaround time:
      </p>
      <ul className="list-disc pl-5 text-sm lg:text-base space-y-1">
        <li>30-minute turnaround for brain and spine studies</li>
        <li>40-minute turnaround for abdominal and neck studies</li>
        <li>50-minute turnaround for all other studies</li>
      </ul>
    </div>

    <div className="space-y-3 pt-4">
      <h3 className="text-xl lg:text-2xl font-bold">Second Opinion Service</h3>
      <p className="text-sm lg:text-base font-medium">
        Empower patients with expert consultations:
      </p>
      <ul className="list-disc pl-5 text-sm lg:text-base space-y-1">
        <li>
          Access to second opinions from International & USA Board-Certified Radiologists
        </li>
        <li>
          HIPAA-regulated platform ensures secure and seamless consultations
        </li>
        <li>
          Same-day expert consultations via Phone, Video & Web
        </li>
      </ul>
    </div>
  </div>

  {/* IMAGE SECTION */}
  <div className="lg:w-1/2 flex justify-center relative">
    <div className="relative">
      <Image
        src="https://res.cloudinary.com/dnckhli5u/image/upload/v1732189988/Teleradiology_Doctor_W300_H400-removebg-preview_aaegob.png"
        alt="Teleradiology Doctor"
        width={400}
        height={500}
        className="hidden lg:block z-10 max-w-full h-[400px]"
      />
      <div className="absolute -top-5 -right-5 w-40 h-40 bg-[#5271FF]/20 rounded-full blur-3xl z-0"></div>
    </div>
  </div>
</div>

        <div className="block lg:hidden mt-4" >
            <img src="https://res.cloudinary.com/dnckhli5u/image/upload/v1732172303/29_xtamf2.png" alt="" className=" rounded-[8px]"/>
          </div>
        <div className="hidden lg:block mb-1 md:mt-5 mt-0 md:w-[24rem] xl:w-[25rem] container mx-auto ">
          <div className="relative pt-2">
            <span className="absolute inset-y-0 left-0 flex items-center mt-2 pl-2">
              <Image
                src="https://res.cloudinary.com/dnckhli5u/image/upload/v1726897752/Icons/vdqj2nm0h9aekbupaxcp.png"
                width={1200}
                height={400}
                alt="Aarogya Aadhar"
                className="md:h-8 md:w-8 h- w-5 rounded-full"
              />
            </span>

            <Input
              placeholder="Enter Number/Email ID" // Use the passed placeholder prop here
              className="rounded-full h-[30px] md:h-[45px] px-3 py-2 pr-24 text-[13px] bg-[#243451] font-poppins placeholder:text-[9px] md:placeholder:text-[13px] text-white pl-8  md:pl-12"
            />
            <button
              type="button"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-[4px] md:mr-[6px] mt-[1px] md:mt-[3px] lg:mt-[3.5px]"
            >
              <span className="text-[#243451]  font-bold font-sans md:text-[12px] text-[8px] bg-white px-4 py-[5px] lg:py-2 rounded-full">
                Send Link
              </span>
            </button>
          </div>
        </div>
        <div className="my-2 w-full xs:flex lg:hidden mx-auto container items-center justify-center">
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
                      Send Link
                    </span>
                  </button>
                </div>
              </div>
        {/* <div className="flex space-x-1 text-center mt-4 font-poppins text-[#002e6e] text-[16px] md:text-[20px] font-bold justify-center items-center lg:mb-2">
          <span>Get the Link to Download Online Reporting App </span>{" "}
        </div> */}

        <div className="bg-[] block lg:hidden w-full h-auto pt-2 items-center justify-center text-center">
        <marquee className="font-bold text-[14px]  font-sans text-[#243561] text-center" scrollamount="12">
        Aarogya Aadhar Approved & Funded by Government of India | Aarogya
            Aadhar Certified by ISO:27001 Online Healthcare Platform | Your
            Health, Your Choice | Connect with us +91 79-7272-7498 | Mail ID:
            info@aarogyaaadhar.com
        </marquee>
      </div>

        {/* <div className="hidden lg:flex items-center justify-center space-x-4 px-4 py-4 lg:py-0 ">
      
          <div className="flex items-center rounded-xl bg-[#243460] text-white px-4 py-2  hover:bg-[#333333] cursor-pointer">
            <IoLogoApple className="h-6 w-6 mr-2" />
            <div className="flex flex-col">
              <span className="md:text-xs text-[8px]">Download on the</span>
              <span className="font-bold md:text-xs text-[8px]">App Store</span>
            </div>
          </div>

       
          <div className="flex items-center rounded-xl bg-[#243460] text-white px-4 py-2  hover:bg-[#333333] cursor-pointer">
            <IoLogoGooglePlaystore className="h-6 w-6 mr-2" />
            <div className="flex flex-col">
              <span className="md:text-xs text-[8px]">Get it on</span>
              <span className="font-bold md:text-xs text-[8px]">
                Google Play
              </span>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Teleradiologyservices;
