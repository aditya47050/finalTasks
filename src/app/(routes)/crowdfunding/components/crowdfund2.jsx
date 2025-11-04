"use client"
import { IndianRupee } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { usePathname } from "next/navigation";

const Crowdfund2 = () => {
  const pathname = usePathname();
  // Array of images and texts for both grid and carousel
  const [selectedCategory, setSelectedCategory] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const scrollAmount = 1; // Adjust the scroll speed
    let scrollInterval;

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer) {
          scrollContainer.scrollLeft += scrollAmount;
          // Reset scroll to the beginning if it reaches the end
          if (
            scrollContainer.scrollLeft >=
            scrollContainer.scrollWidth - scrollContainer.clientWidth
          ) {
            scrollContainer.scrollLeft = 0;
          }
        }
      }, 10); // Adjust the interval for speed (in milliseconds)
    };

    startAutoScroll();

    return () => clearInterval(scrollInterval); // Clean up the interval on unmount
  }, []);
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
      link:"#",
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
  const items = [
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/jzssgkffyzo3jt9gup5w.png",
      alt: "Transparency",
      text: "100% Transparency",
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725814030/aarogya%20aadhar/zc2xzwabagut83luy0fh.gif",
      alt: "Track Impact",
      text: "Track Your Impact",
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/vpgxhzpydivabu1irhpw.png",
      alt: "Tax Benefits",
      text: "Tax Benefits",
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/wdrqysx34drcnjpgztcl.png",
      alt: "Win Rewards",
      text: "Win Rewards",
    },
  ];

  return (
    <>
   <div className="mx-auto container font-poppins pt-1 hidden md:block mb-5">
  <div className="mx-auto container w-full flex  lg:flex-row space-y-5 lg:space-y-0 space-x-9">
    {/* Main Section with Background Image */}
    <div
      className="w-full lg:w-11/12 px-2  rounded-[15px] h-auto pb-4"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dnckhli5u/image/upload/v1723620961/mtfbf3czjsix5cnpyzv6.png')",
        backgroundSize: "cover",
        backgroundPosition: "right",
      }}
    >
      <div className="w-full flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2">
        {/* Left Image */}
        <div className="w-full md:w-1/3">
          <div className="w-full h-auto pb-4 pt-4">
            <Image
              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1729088920/donate_1_derxmq.png"
              width={800}
              height={800}
              alt="Description"
              className="w-full h-full object-cover rounded-3xl "
            />
          </div>
          <button className="relative w-full lg:ml-4 xl:ml-10 lg:w-auto bg-gradient-to-r from-[#FFDE59] to-[#FF914D] px-3 py-1 text-white rounded-full flex items-center justify-between lg:justify-start mt-4 lg:mt-0">
          
            <span className=" bg-[#5271FF] -ml-2 p-0 rounded-full mr-1">
              <Image
              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1725257022/aarogya%20aadhar/SiteImages/wlvx9w3k5losp57aswjv.png"
              width={1200}
              height={400}
              alt="Aarogya Aadhar"
              className="h-9 w-9"
            />
              </span>

            <span className=" text-[14px] font-bold font-poppins text-[#243460] relative">
              Donate Every Monthly
            </span>
          </button>
        </div>

        {/* Grid Section */}
        <div className="w-full md:w-2/3 md:px-10 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mx-auto">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <Image
                  src={item.src}
                  width={100}
                  height={100}
                  alt={item.alt}
                  className="object-cover bg-[#5271FF] rounded-[15px] xl:h-28 lg:h-20 lg:w-20 xl:w-28"
                />
                <p className="text-[#242460] xl:text-[14px] text-[13px] lg:text-[13px] font-poppins font-bold lg:font-extrabold mt-2">
                  {item.text.split(" ")[0]} <br />
                  {item.text.split(" ").slice(1).join(" ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Button Section */}
    <div className="w-full pl-4 px-2 md:w-1/12 text-center font-poppins flex lg:flex-col md:flex-col md:space-x-0 lg:space-x-0 md:space-y-5 lg:space-y-6 items-center md:justify-center lg:rounded-2xl md:p-4 lg:p-4">
      <button className="bg-[#5271FF] px-2 font-poppins lg:py-3 md:py-2 xl:py-4 text-[16px] text-white w-full md:w-[6rem] lg:w-[8rem] font-bold rounded-[10px] hover:bg-[#365c99]">
        Help
      </button>
      <button className="bg-[#5271FF] px-2 xl:py-4 lg:py-3 md:py-2 text-[16px] hover:bg-[#365c99] text-white rounded-[10px] w-full font-bold md:w-[6rem] lg:w-[8rem] border border-blue-500">
        Login
      </button>
      <button className="bg-[#5271FF] px-2 xl:py-4 lg:py-3 md:py-2 text-[16px] hover:bg-[#365c99] font-bold text-white rounded-[10px] w-full md:w-[6rem] lg:w-[8rem] border border-blue-500">
        INR
      </button>
    </div>
  </div>

  {/* Crowdfunding Categories */}
  <div className="justify-center text-center pt-4">
    <h1 className="text-[25px] text-[#5271FF] font-extrabold">Crowdfunding Categories</h1>
    <p className="text-[#5271FF] text-[15px]">Select the Speciality</p>
  </div>

  {/* Carousel Section */}
  <div className="mx-auto container">
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
      <div className="sm:mx-10 md:mx-auto lg:mx-auto container mt-4">
            <div
              // ref={scrollRef}   style={{
               
              //   scrollBehavior: "smooth", // Smooth scroll for better user experience
              
              // }}
              className="flex spac-x-0  min-[1200px]:space-x-4  " // Added scrollbar-hide class for custom scrollbar
            >
        {crowdfundingcategory.map((item, index) => (
          <CarouselItem key={index} className="md:basis-1/2 min-[400px]:basis-[10%] min-[800px]:basis-[15%] min-[1200px]:basis-[13%]">
            <div className="p-1">
              <Card className="border-none">
                <CardContent className="flex aspect-square items-center justify-center p-4">
                  <div className="flex flex-col items-center">
                    <Image
                      src={item.src}
                      width={100}
                      height={100}
                      alt={item.alt}
                      className="object-cover bg-[#5271FF] rounded-[15px] xl:h-28 lg:h-20 lg:w-20 xl:w-28"
                    />
                    <p className="text-[#242460] xl:text-[14px] text-center min-[800px]:text-[8px] min-[1100px]:text-[12px] min-[400px]:text-[10px] font-poppins font-extrabold mt-2">
                      {item.text.split(" ")[0]} <br />
                      {item.text.split(" ").slice(1).join(" ")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
        </div></div>
      </CarouselContent>
   
    </Carousel>

    {/* {pathname === "/" && (
<div className="flex items-center justify-center mx-auto pt-3">

              <button
              className="bg-[#243460] p-2 px-3 text-white text-[12px] rounded-full font-bold"
              onClick={() => (window.location.href = "/aarogya-dhan")}
            >
              View More
            </button> </div>
            )} */}
  </div>
</div>

      {/* Mobile screen */}
      <div className=" w-full md:hidden    mb-5">
        <div className="w-full flex flex-col mt-2 lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5">
          {/* Main Section with Background Image */}
          <div
            className="w-full  h-auto pb-4"
            style={{
             backgroundColor: "#dbdbdb"
            }}
          >
            <div className="w-full flex flex-col   items-center justify-center space-y-4 md:space-y-0 md:space-x-2">
              {/* Left Image */}
              <div className="w-full mt-2 flex flex-col items-center justify-center">
                
                  <span className="flex-grow font-bold text-[#243460] relative">
                  Funds Donation Benefits
             </span>
              </div>

              {/* Grid Section */}
              <div className="w-full px-2 ">
                <div className="grid grid-cols-4  gap-2 text-center mx-auto">
                  {items.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <Image
                        src={item.src}
                        width={100}
                        height={100}
                        alt={item.alt}
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
          </div>

     
       
 
        </div>


      </div>
    </>
  );
};

export default Crowdfund2;
