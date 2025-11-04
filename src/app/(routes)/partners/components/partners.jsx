"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const PartnersClient = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);

  return (
    <div className="md:mx-auto w-full font-poppins px-2 md:px-0 md:container min-[1000px]:pl-[60px] min-[1000px]:pr-5 min-[1100px]:pl-[60px] min-[1100px]:pr-5 xl:ml-[10px] xl:pr-[30px]">
      <div className="text-center">
        <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
          Our Support Partners
        </h1>
        <div className="flex justify-center text-[11px] lg:text-[15px] flex-wrap space-x-1 mt-2">
          {partners.map((category, index) => (
            <span
              key={index}
              className={`text-[#5271FF] rounded ${
                selectedCategory === index ? "font-bold" : ""
              } cursor-pointer`}
              onClick={() => setSelectedCategory(index)}
            >
              {category.title}
              {index === partners.length - 1 ? null : " |"}
            </span>
          ))}
        </div>
      </div>

      <div className="hidden lg:block my-8 overflow-hidden relative">
        <div className="flex animate-scroll space-x-4">
          {partners[selectedCategory].items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-40 lg:w-48"
            >
              <div className="p-2 relative w-full lg:w-[85%]  bg-opacity-50 lg:h-40 flex rounded-[15px] items-center justify-center">
                <Card className="relative h-full border-none bg-transparent rounded-[10px] md:rounded-xl overflow-hidden flex items-center justify-center">
                  <CardContent className="flex items-center justify-center p-1 h-full">
                    <Image
                      src={item.src}
                      width={200}
                      height={200}
                      alt={item.alt || "partner logo"}
                      className="object-contain w-full md:h-full rounded-[10px] md:rounded-xl"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
           {/* <Image
              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1723968402/aarogya%20aadhar/nb1t6tfkwzkuvvjjfdfy.webp"
              alt="Description of the image"
              layout="responsive"
              width={1200}
              height={475}
              className="w-full mt-[-120px] object-cover lg:h-64 hidden md:block"
            /> */}
        </div>
      </div>
      <div className="block lg:hidden my-2 overflow-hidden relative">
        <div className="flex items-center animate-scroll space-x-4">
          {partners[selectedCategory].items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-40 lg:w-48"
            >
              <div className="p-2 relative w-full lg:w-[85%]  bg-opacity-50 lg:h-40 flex rounded-[15px] items-center justify-center">
                <Card className="relative w-[150px] h-[150px] !border-none bg-transparent rounded-[10px] md:rounded-xl overflow-hidden flex items-center justify-center">
                  <CardContent className="flex  items-center justify-center p-1 h-full">
                    <Image
                      src={item.src}
                      width={200}
                      height={200}
                      alt={item.alt || "partner logo"}
                      className="object-contain w-full md:h-full rounded-[10px] md:rounded-xl"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
           {/* <Image
              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1723968402/aarogya%20aadhar/nb1t6tfkwzkuvvjjfdfy.webp"
              alt="Description of the image"
              layout="responsive"
              width={1200}
              height={475}
              className="w-full mt-[-120px] object-cover lg:h-64 hidden md:block"
            /> */}
        </div>
      </div>
    </div>
  );
};

export default PartnersClient;


const partners = [
  {
    title: "",
    items: [
      {
        src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGeQNBEiCZLXP5fCJVxKBos3cSpykDtA2uO8n4W",
      },

      {
        src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGetQNmiHUGJ14vmWTzgj6ue3aMP5dOyl82frUp",
      },
      {
        src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGeX172pv9M6qC3SI9DPb2Rfi1sOa7zdGvNVjKQ",
      },
      {
        src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGeX2sf8wM6qC3SI9DPb2Rfi1sOa7zdGvNVjKQm",
      },
      {
        src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGeluS0HqDqheD048ZozrGsO37kNn2Kifuwv1XE",
      },
      {
        src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGeaIqsh946QuFsS4ZJblTktDfXMYwCrv35yNWI",
      },
      {
        src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGe42ORwZsnMlV7INyQAqR4xcig0pkWGYDEbrsS",
      },
      {
        src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGeQjUtzVZLXP5fCJVxKBos3cSpykDtA2uO8n4W",
      },
      {
        src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGeivdX6Ze3UBE8CKxgyQhn1ItSckPoVR65ZuWF",
      },
      {
        src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGeDbOqU8rYPCnEGi91o3sKuVdbOILAhv6paH5X",
      },
      {
        src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGejqqC2vo29plKudUQcx5A1aCMrR4hWetIvyLq",
      },
      {
        src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGe09Bi97H9jqaSn84IxB7kehFZAc3ROlGPLg0m",
      },
      {
        src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGerXluzV0KCPGU8eJg4w7kSRZsxdEBLWmbVopM",
      },

      {
        src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGeMgzGxOq8w2fAERU7hkPnjtSo3czseIpYm0x9",
      },
      {
        src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGeeAgVoQlI7BIWzHaJ8Qt1Pp0GwFxk9shbiRSj",
      },
     
     
    ],
  },

];
  


