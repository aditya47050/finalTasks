"use client";
import { IndianRupee } from "lucide-react";
import Image from "next/image";
import React from "react";
import Fundraiserclient from "../(routes)/topfundraiser/components/fundraiserclient";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Card, CardContent } from "@/components/ui/card";
import { usePathname } from "next/navigation";
import Link from "next/link";

const CrowdFund1 = (data) => {
  const pathname = usePathname();
  return (
    <>
      <div className="mx-auto container  font-poppins hidden lg:block w-full  mb-4   p-4 min-[1000px]:pl-[60px] min-[1000px]:pr-5 min-[1100px]:pl-[60px] min-[1100px]:pr-5  xl:pl-[80px] xl:pr-[40px] xlg:container">
        <div className="w-full relative flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5">
          <div className="w-full  h-auto rounded-[15px] ">
            <Image
              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1731670874/4_mavjpg.png"
              width={4000}
              height={844}
              className="w-full  rounded-[15px]  h-[260px]"
              alt="Crowdfunding banner with medical treatment theme"
            />{" "}
          </div>

         <div className="w-full absolute inset-0 xl:px-2 text-end font-poppins flex flex-col items-end justify-center lg:pl-2 lg:pr-0 lg:rounded-2xl md:ml-0 ">
            <div className="mb-2 lg:mr-16">
              <Link href="/aarogyadhan/schemes/get-financial-support">
                <button className="bg-[#5271FF] w-[8rem] px-4 py-2 text-[16px] text-white font-bold rounded-[10px] hover:bg-[#365c99]">
                  Schemes
                </button>
              </Link>
            </div>

            {/* Login + INR Buttons (stacked vertically below Help) */}
            <div className="flex flex-col space-y-2 lg:mr-16">
              <Link href="/aarogyadhan/schemes/seek-ngos-support">
                <button className="bg-[#5271FF] px-4 py-2 text-[16px] text-white font-bold rounded-[10px] hover:bg-[#365c99] w-[8rem]">
                  NGOs
                </button>
              </Link>
              <button className="bg-[#5271FF] px-4 py-2 text-[16px] text-white font-bold rounded-[10px] hover:bg-[#365c99] w-[8rem]">
                CSR
              </button>
            </div>
          </div>

        </div>

        <div className="mx-auto w-full flex flex-col lg:flex-row items-center justify-center xl:justify-start space-y-4 lg:space-y-0 xl:space-x-2 mt-6 lg:mt-2">
          <div className="relative w-full lg:w-auto xl:pl-40 lg:pl-10">
            <button className="relative w-full lg:w-auto bg-gradient-to-r  from-[#FFDE59] to-[#FF914D] px-1 py-1 text-white rounded-full flex items-center justify-between lg:justify-start">
              <span className="flex-shrink-0 bg-[#5271FF] p-0 rounded-full mr-1">
                <Image
                  src="https://res.cloudinary.com/dnckhli5u/image/upload/v1725257022/aarogya%20aadhar/SiteImages/wlvx9w3k5losp57aswjv.png"
                  width={1200}
                  height={400}
                  alt="Aarogya Aadhar"
                  className="h-10 w-10"
                />
              </span>
              <span className="flex-grow font-poppins text-[16px] lg:text-xl pr-16 font-bold text-[#243460] relative shadow-2xl">
                Donate Monthly
                <Link href="/aarogyadhan/login">
                  <span className="absolute right-2 top-1/2 font-sans transform -translate-y-1/2 translate-x-1/2 shadow-2xl border-2 border-[#FF914D] text-sm bg-white text-[#243460] px-2 py-2 rounded-full">
                    View More
                  </span>
                </Link>
              </span>
            </button>
          </div>

          <div className="w-full lg:w-auto  flex flex-col lg:flex-row items-center font-poppins lg:gap-2 xl:space-x-4 lg:pl-[2.5rem] xl:pl-[3.5rem] xl:gap-4">
            
            <Link href="/aarogyadhan#how-it-works">
              <button className="bg-[#5271FF] w-full lg:w-auto px-4 py-2 lg:text-[14px] xl:text-[15px] font-semibold text-white rounded-full shadow-2xl hover:bg-[#365c99]">
                How it Works ?
              </button>
            </Link>

            <Link href={"/aarogyadhan/register"}>
              {" "}
              <button className="bg-[#5271FF] w-full lg:w-auto px-4 py-2 lg:text-[14px] xl:text-[15px] font-semibold  text-white rounded-full shadow-2xl border hover:bg-[#365c99] border-blue-500">
                Start a Free Fundraiser
              </button>
            </Link>
            <Link href={"/aarogyadhan/fundraisers"}>
              {" "}
              <button className="bg-[#5271FF] w-full lg:w-auto px-4 py-2 lg:text-[14px] font-semibold xl:text-[15px]  text-white rounded-full shadow-2xl border hover:bg-[#365c99] border-blue-500">
                Browse Fundraisers
              </button>
            </Link>
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row flex-wrap pt-10 lg:justify-center gap-0 space-x-4 space-y-6 lg:space-y-0 lg:max-w-[1150px] xl:max-w-[1320px] xlg:max-w-[1460px]">
          {/* Left Section */}
          <div className="w-full pl-10 lg:w-4/12">
            {/* <div className="text-[21px] xl:text-[30px] font-extrabold space-y-2">
              <h1 className="text-[#5271FF]">Need Funds For Your</h1>
              <h1 className="text-[#243460]">Medical Treatment?</h1>
              <h1 className="text-[#FF914D] font-amster">
                To Save Countless Lives
              </h1>
            </div> */}
            <Image
              src={
                "https://res.cloudinary.com/dnckhli5u/image/upload/v1726913368/aarogya%20aadhar/ovpb7nxpmz0ex0jvvkiv.png"
              }
              width={1265}
              height={700}
              alt="Medical treatment funding illustration"
              className="h-36 w-auto mt-2"
            />
          </div>

          {/* Middle Section */}
          <div className="flex w-full xl:pl-10 md:pl-2 lg:w-3/12">
            {/* <div className="text-6xl md:text-8xl lg:text-9xl font-sixcaps font-semibold text-[#243460]">
       <span>0</span>
     </div>
     <div className="pt-2 text-sm md:text-2xl font-bold text-[#243460] ml-4">
       <h1>% *</h1>
       <h1 className="text-[#5271FF]">PLATFORM</h1>
       <h1 className="text-black">FEE, YOU CAN RAISE</h1>
       <h1 className="text-black">FUNDS TOO!</h1>
     </div> */}
            <Image
              src={
                "https://res.cloudinary.com/dnckhli5u/image/upload/v1724434610/aarogya%20aadhar/rkxgmlsekzevvodkpyjz.png"
              }
              width={600}
              height={400}
              alt="Platform fee information graphic"
              className="h-36 w-64"
            />
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-4/12">
            <p className="text-sm  font-sans xl:text-[16px] text-justify text-[#5271FF] font-semibold">
              <span className="text-black">AarogyaDhan</span> is an online
              technology platform connecting donors and donees. We do not
              provide any financial return in any form whatsoever, including but
              not limited to financial securities (debt or equity), interest,
              dividend, profit share, rewards in cash, to individuals who make
              payments on the Platform.
            </p>
          </div>
        </div>
        {pathname === "/" && (
          <div>
            <div className="justify-center text-center hidden lg:block pt-6">
              <h1 className="text-[22px] text-[#5271FF] font-extrabold">
                Crowdfunding Categories
              </h1>
              <p className="text-[#5271FF] text-[15px]">
                Select the Speciality
              </p>
            </div>

            <div className="mx-auto overflow-auto container max-[1200px]:px-auto min-[1200px]:px-0 xl:pl-[32px] xl:pr-0">
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full"
              >
                <CarouselContent>
                  <div className="sm:mx-10 overflow-auto md:mx-auto lg:mx-auto container mt-4 min-[900px]:pl-0 xl:pr-0">
                    <div
                      // ref={scrollRef}   style={{

                      //   scrollBehavior: "smooth", // Smooth scroll for better user experience

                      // }}
                      className="flex md:space-x-2 xl:space-x-4 pb-4 " // Added scrollbar-hide class for custom scrollbar
                    >
                      {crowdfundingcategory.map((item, index) => (
                        <CarouselItem
                          key={index}
                          className="md:basis-1/2  lg:basis-[14%] xl:basis-[13%]"
                        >
                          <div className="p-1">
                            <Card className="border-none">
                              <CardContent className="flex aspect-square items-center justify-center p-4">
                                <div className="flex flex-col items-center">
                                  <Image
                                    src={item.src}
                                    width={100}
                                    height={100}
                                    alt={item.alt}
                                    className="object-cover bg-[#5271FF] rounded-[15px] max-[1200px]:h-12 max-[1200px]:w-12 min-[1200px]:h-28 min-[1200px]:w-28"
                                  />
                                  <p className="text-[#242460] xl:text-[14px] text-center min-[1200px]:text-[13px] max-[1200px]:text-[12px] font-poppins font-extrabold mt-2">
                                    {item.text.split(" ")[0]} <br />
                                    {item.text.split(" ").slice(1).join(" ")}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </div>
                  </div>
                </CarouselContent>
              </Carousel>

              <div className="flex  items-center justify-center mx-auto pt-3">
                <button
                  className="bg-[#243460] p-2 px-4 text-white text-[14px] rounded-full font-bold"
                  onClick={() => (window.location.href = "/aarogyadhan")}
                >
                  View More
                </button>{" "}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* // mobile */}
      <div className="mx-auto font-poppins md:container lg:hidden block w-full  lg:pt-2 lg:px-0 px-[2rem]">
        <div className="w-full flex flex-col mt-1 md:mt-5  space-y-5 ">
          <div
            // style={{
            //   backgroundImage: `url(${bannerImage})`,
            //   backgroundSize: "cover",
            //   backgroundPosition: "right",
            //   height: "280px",
            // }}
          >
            <Image
              src="https://res.cloudinary.com/dwsc0vedb/image/upload/v1743653972/37_nf0139.png"
              width={1400}
              height={560}
              className="w-full h-[] rounded-[10px]"
              alt="Mobile crowdfunding banner"
            />{" "}
          </div>
        </div>

        <div className="mx-auto w-full flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4 mt-1">
          <div className="w-full flex  lg:flex-nowrap md:space-y-0 space-y-2 items-center justify-center mt-3 space-x-8">
            <div className="relative flex-shrink-0">
              <button className="relative bg-gradient-to-r from-[#FFDE59] to-[#FF914D] px-1 py-1 text-white rounded-full flex items-center  lg:justify-start">
                <span className=" bg-[#5271FF] p-1 rounded-full mr-1">
                  <IndianRupee className="h-4 w-4" />
                </span>
                <span className="text-[10px] pr-11 font-bold text-[#243460]">
                  Donate Monthly
                  <Link href="/aarogyadhan/login">
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 translate-x-1/2 shadow-2xl border-2 border-[#FF914D] text-[9px] bg-white text-[#243460] px-2 py-1 rounded-full">
                    View More
                  </span>
                  </Link>
                </span>
              </button>
            </div>

            <div className="flex-shrink-0 ">
              <Link href="/aarogyadhan#how-it-works">
              <button className="bg-gradient-to-l from-white to-gray-400  px-4 py-2 text-[10px]  font-semibold text-[#243460] rounded-full shadow-2xl  ">
                How it Works ?
              </button>
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-auto flex  lg:flex-row items-center justify-center font-poppins gap-4 lg:pl-10 lg:gap-6">
            <Link href={"/aarogyadhan/register"}>
            <button className="bg-gradient-to-l from-white to-gray-400 w-full lg:w-auto px-2 py-2 text-[10px] font-semibold  text-[#243460] rounded-full shadow-2xl border ">
              Start a Free Fundraiser
            </button>
            </Link>
            <Link href={"/aarogyadhan/fundraisers"}>
            <button className="bg-gradient-to-l from-white to-gray-400 w-full lg:w-auto px-2 py-2 text-[10px] font-semibold  text-[#243460] rounded-full shadow-2xl border ">
              Browse Fundraisers
            </button>
            </Link>
          </div>
        </div>

        <div className="w-full flex md:flex-nowrap  pt-7 lg:pl-4 space-y-6 space-x-6 lg:space-y-0">
          {/* Left Section */}
          <div className="w-full lg:w-4/12">
            {/* <div className="text-[14px]  font-extrabold space-y-2">
              <h1 className="text-[#5271FF]">Need Funds For Your</h1>
              <h1 className="text-[#243460]">Medical Treatment?</h1>
              <h1 className="text-[#FF914D] font-amster">
                To Save Countless Lives
              </h1>
            </div> */}
            <Image
              src={
                "https://res.cloudinary.com/dnckhli5u/image/upload/v1726913368/aarogya%20aadhar/ovpb7nxpmz0ex0jvvkiv.png"
              }
              width={1265}
              height={700}
              alt="Medical treatment funding illustration mobile"
              className="h-full w-auto mt-[-2px]"
            />
          </div>

          {/* Middle Section */}
          <div className="flex w-full ">
            {/* <div className="text-6xl md:text-8xl lg:text-9xl font-sixcaps font-semibold text-[#243460]">
       <span>0</span>
     </div>
     <div className="pt-2 text-sm md:text-2xl font-bold text-[#243460] ml-4">
       <h1>% *</h1>
       <h1 className="text-[#5271FF]">PLATFORM</h1>
       <h1 className="text-black">FEE, YOU CAN RAISE</h1>
       <h1 className="text-black">FUNDS TOO!</h1>
     </div> */}
            <Image
              src={
                "https://res.cloudinary.com/dnckhli5u/image/upload/v1724434610/aarogya%20aadhar/rkxgmlsekzevvodkpyjz.png"
              }
              width={600}
              height={400}
              alt="Platform fee information graphic mobile"
              className="h-28 mt-[-40px] w-40"
            />
          </div>

          {/* Right Section */}
        </div>

        <div>
          <div className="w-full mx-auto container mt-10 pt-6 bg-gradient-to-l from-gray-400 to-white p-2 rounded-[15px] relative">
            <div className="absolute container -top-4 md:-top-8 lg:-top-4 left-1/2 transform -translate-x-1/2 w-full flex justify-center space-x-4 lg:space-x-0 lg:space-y-6 md:justify-center lg:rounded-2xl md:p-4 lg:p-4">
              <Link href="/aarogyadhan/schemes/get-financial-support">
                <button className="w-16 bg-gradient-to-r from-[#FFDE59] to-[#FF914D] px-2 md:px-5 lg:px-2 py-2 text-[10px] text-[#243460] md:w-auto lg:w-[8rem] font-semibold rounded-2xl hover:bg-[#365c99]">
                  Schemes
                </button>
              </Link>
              <Link href="/aarogyadhan/schemes/seek-ngos-support">
                <button className="w-16 bg-gradient-to-r from-[#FFDE59] to-[#FF914D] px-2 md:px-5 lg:px-2 py-2 text-[10px]  text-[#243460] rounded-2xl font-semibold md:w-auto lg:w-[8rem] ">
                  NGOs
                </button>
              </Link>
              <Link href="#">
                <button className="w-16 bg-gradient-to-r from-[#FFDE59] to-[#FF914D] px-2 md:px-5 lg:px-2 py-2 text-[10px]  font-semibold text-[#243460] rounded-2xl  md:w-auto lg:w-[8rem] ">
                  CSR
                </button>
              </Link>
            </div>

            <p className="text-[10px] font-sans text-center text-[#243460] font-semibold">
              <span className="text-[#FF5E00]">AarogyaDhan</span> is an online
              technology platform connecting donors and donees. We do not
              provide any financial return in any form whatsoever, including but
              not limited to financial securities (debt or equity), interest,
              dividend, profit share, rewards in cash, to individuals who make
              payments on the Platform.
            </p>
          </div>
          {
            data?.data?.email !== null
            ?
            <></> 
            :
            <div className="w-full flex   items-center justify-center mt-3 ">
              <div className="relative flex-shrink-0">
                <button className="relative bg-gradient-to-br from-[#b6ff83] via-[#53e418] to-[#79b50c] px-2 py-3 text-[#243460] rounded-full flex items-center  lg:justify-start">
                  <span className="text-[14px] pr-16 pl-1 font-bold text-[#243460]">
                    Download App Now
                    <span className="absolute right-4  text-[9px]  top-1/2 transform -translate-y-1/2 translate-x-1/2 shadow-2xl border-2 border-[#FF914D]  bg-white text-[#243460] px-2 py-1 rounded-full">
                      View More Details
                    </span>
                  </span>
                </button>
              </div>
            </div>
          }
        </div>

        {pathname === "/" ? (
          <div className="flex text-center justify-center mt-4 mb-4">
            <Link href={"/aarogyadhan"}>
              <span className="bg-[#243460] shadow-lg rounded-2xl text-white text-[10px] font-medium  border-2 px-4 p-2">
                View More
              </span>
            </Link>
          </div>
        ) : (
          ""
        )}
        {pathname === "/aarogyadhan" && (
          <div>
            <div className="justify-center text-center pt-4">
              <h1 className="text-[18px] text-[#5271FF] font-extrabold">
                Crowdfunding Categories
              </h1>
              <p className="text-[#5271FF] text-[11px]">
                Select the Speciality
              </p>
            </div>

            {/* Grid Section */}
            <div className="w-full mt-2 container mb-2 ">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7  gap-2 text-center mx-auto">
                {crowdfundingcategory.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <Image
                      src={item.src}
                      width={100}
                      height={100}
                      alt={item.alt || `Crowdfunding category: ${item.text}`}
                      className="object-cover bg-[#5271FF] rounded-2xl h-20 w-20"
                    />
                    <p className="text-[#242460] text-[10px] font-poppins font-extrabold mt-2">
                      {item.text.split(" ")[0]} <br />
                      {item.text.split(" ").slice(1).join(" ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {pathname === "/aarogya-dhan" && <Fundraiserclient />}
      </div>

      <style jsx>{`
        .scrolling-wrapper {
          overflow: hidden;
          position: relative;
        }
        .animate-auto-scroll {
          display: flex;
          flex-wrap: nowrap;
          animation: autoScroll 15s linear infinite; // Increase duration for smoother scrolling
        }
        @keyframes autoScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(
              -300%
            ); // Adjust this to scroll the full width
          }
        }
      `}</style>
    </>
  );
};

export default CrowdFund1;
const crowdfundingcategory = [
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/tuxittmxdtivblh2hbba.png",
    link: "#",
    text: "Help to NGO’s",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/ejzr8jxma88a3qgs7ecc.png",
    link: "#",
    text: "Child Health",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1728846799/aarogya_aadhar_ambulance_help_icon_lpx50v.png",
    link: "#",
    text: "Emergency Help",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/yststufrq8q0jiobj32p.png",
    link: "#",
    text: "Medical Help",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/eadfqhg8qvfzsumpwmdj.png",
    link: "#",
    text: "Cancer Care",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/poosxlvu7tfzurz3lqx9.png",
    link: "#",
    text: "Transplant Surgery",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/qmqk3gn6dyz07zcwj822.png",
    link: "#",
    text: "Personal Cause",
  },
];
