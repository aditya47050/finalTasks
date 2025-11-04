"use client";
import React, { useState } from "react";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { IoCall } from "react-icons/io5";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
const CommonMBanner = (data) => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const [text, setText] = useState();

  const handleSearch = () => {
    const url = new URL(window.location.href);

    if (!text) {
      url.searchParams.delete("query");
    } else {
      url.searchParams.set("query", text);
    }

    router.push(`${url}`);
  };
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
  return (
    <>
      <div className={`w-full pb-2 `}>
        <div className="w-full ">
          <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-full  "
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
                    className="w-auto ml-2  h-full rounded-[15px]"
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
      <div className="mb-1 w-full flex flex-col gap-2 mx-auto container items-center justify-center">
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
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder="Enter Number/Email ID"
            className="rounded-full  bg-[#243451] font-poppins placeholder:text-[12px] text-white placeholder-blue-950 placeholder:font-semibold pl-10 md:pl-12 w-full"
          />

          {/* Button */}
          <button
            type="button"
            onClick={handleSearch}
            className="absolute right-0 mr-[6px] -mt-1"
          >
            <span className="text-[#243451] p-2 text-[10px]  font-bold bg-white px-4 rounded-full">
              Send Link
            </span>
          </button>
        </div>
        <div className="flex text-center font-poppins  text-[#002e6e] text-[12px] font-bold justify-center items-center">
          Get the Link to Download App
        </div>
      </div>
      )}

    </>
  );
};

export default CommonMBanner;
