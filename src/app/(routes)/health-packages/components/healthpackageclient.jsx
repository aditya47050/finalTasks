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

const HealthPackageClient = () => {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto font-poppins container w-full mb-5">
      <div className="justify-center text-center">
        <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
          Health Packages
        </h1>
        <p className="text-[#5271FF] text-[11px]  lg:text-[15px]">
          Employees Health Check-ups Packages
        </p>
      </div>
      <div className="mx-auto container mt-4 mb-5">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {healthpackages.map((item, index) => (
              <CarouselItem
                key={index}
                className=" md:basis-1/2 min-[800px]:basis-1/3 min-[1200px]:basis-1/4 xl:basis-1/5"
              >
                <div className="p-1 relative">
                  <Card className="relative h-auto mb-2 border-none">
                    <CardContent className="flex flex-col items-center p-1 relative bg-[#D9D9D9] h-[280px] md:h-[300px] rounded-[15px]">
                      {/* Image */}
                      <div className="relative w-full md:h-[200px] min-[1200px]:h-[250px] mx-auto bg-white rounded-[15px] py-2 px-2">
                        {item.src ? (
                          <Image
                            src={item.src}
                            width={600}
                            height={400}
                            alt={item.alt}
                            className="object-cover bg-[#5271FF] h-[140px] rounded-[15px] md:h-[140px]"
                          />
                        ) : (
                          <div className="relative w-full bg-white border-[#ffce38] h-[140px] rounded-[15px] md:h-[180px]"></div>
                        )}
                        {/* Button Half on Image and Half Outside */}
                      </div>
                      <div className="rating-container flex items-center mt-[-60px] mb-4 relative">
                        <div className="rating-stars flex items-center px-2 py-2 z-10 pt-[15px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 fill-current text-[#ffce38] mx-0.5"
                            viewBox="0 0 20 20"
                            stroke="#ffce38" // Add border color
                            strokeWidth="1" // Define the thickness of the border
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.144c.969 0 1.371 1.24.588 1.81l-3.358 2.443a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.539 1.118l-3.358-2.443a1 1 0 00-1.175 0l-3.358 2.443c-.784.57-1.838-.197-1.539-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.482 9.375c-.783-.57-.38-1.81.588-1.81h4.144a1 1 0 00.95-.69l1.286-3.948z" />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 fill-current text-[#ffce38] mx-0.5"
                            viewBox="0 0 20 20"
                            stroke="#ffce38"
                            strokeWidth="1"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.144c.969 0 1.371 1.24.588 1.81l-3.358 2.443a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.539 1.118l-3.358-2.443a1 1 0 00-1.175 0l-3.358 2.443c-.784.57-1.838-.197-1.539-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.482 9.375c-.783-.57-.38-1.81.588-1.81h4.144a1 1 0 00.95-.69l1.286-3.948z" />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 fill-current text-[#ffce38] mx-0.5"
                            viewBox="0 0 20 20"
                            stroke="#ffce38"
                            strokeWidth="1"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.144c.969 0 1.371 1.24.588 1.81l-3.358 2.443a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.539 1.118l-3.358-2.443a1 1 0 00-1.175 0l-3.358 2.443c-.784.57-1.838-.197-1.539-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.482 9.375c-.783-.57-.38-1.81.588-1.81h4.144a1 1 0 00.95-.69l1.286-3.948z" />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 fill-current text-white mx-0.5"
                            viewBox="0 0 20 20"
                            stroke="#ffce38"
                            strokeWidth="1"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.144c.969 0 1.371 1.24.588 1.81l-3.358 2.443a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.539 1.118l-3.358-2.443a1 1 0 00-1.175 0l-3.358 2.443c-.784.57-1.838-.197-1.539-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.482 9.375c-.783-.57-.38-1.81.588-1.81h4.144a1 1 0 00.95-.69l1.286-3.948z" />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 fill-current text-white mx-0.5"
                            viewBox="0 0 20 20"
                            stroke="#ffce38"
                            strokeWidth="1"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.144c.969 0 1.371 1.24.588 1.81l-3.358 2.443a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.539 1.118l-3.358-2.443a1 1 0 00-1.175 0l-3.358 2.443c-.784.57-1.838-.197-1.539-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.482 9.375c-.783-.57-.38-1.81.588-1.81h4.144a1 1 0 00.95-.69l1.286-3.948z" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-[-20px] relative font-poppins text-[11px] ">
                        {item.rcount} Reviews
                      </div>

                      {/* Name */}
                      {item.text ? (
                        item.text.split(" ").length > 1 ? (
                          <p className="lg:text-[15px]  text-[11px] font-bold text-[#ff5e00] lg:h-12 font-sans lg:mt-3 mt-6 justify-center text-center">
                            {item.text.split(" ").slice(0, -1).join(" ")} <br />
                            {item.text.split(" ").slice(-1)}
                          </p>
                        ) : (
                          <p className="lg:text-[15px] text-[11px] font-bold text-[#ff5e00] lg:h-12 font-sans lg:mt-3 mt-6 justify-center text-center">
                            {item.text}
                          </p>
                        )
                      ) : (
                        <div className="font-bold lg:text-[15px] text-[11px] text-[#ff5e00] font-sans mt-2 justify-center text-center">
                          <p>Health Package</p>
                        </div>
                      )}

                      <div className="mt-0 mb-5 text-left w-full ">
                        <span className="font-bold lg:text-[13px] text-[10px] text-[#243460] font-sans text-start">
                          Including Lab Test:
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex gap-8 justify-center w-full relative">
                  <div className=" flex gap-6">
                    <button className="bg-[#FF3131] lg:text-[14px] text-[10px] font-poppins text-white py-2 px-4 rounded-full shadow-md">
                      Call Us
                    </button>
                    <button className="bg-[#5271FF] lg:text-[14px] text-[10px] font-poppins text-white py-2 px-4 rounded-full shadow-md">
                      View More
                    </button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="xl:hidden block" />
          <CarouselNext className="xl:hidden block" />
        </Carousel>
      </div>
    </div>
  );
};

export default HealthPackageClient;

const healthpackages = [
  {
    src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGeopZvq43QetOPvsjyHQAc16TWLRhwJoqSm3pE",
    alt: "Basic Pre-Employment",
    text: "Basic Pre-Employment",
    rcount: "258",
  },

 

 
  {
    src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGeDy93w1rYPCnEGi91o3sKuVdbOILAhv6paH5X",
    alt: "Pre-Employment",
    text: "Pre-Employment",
    rcount: "258",
  },
  {
    src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGe0eZqfh1H9jqaSn84IxB7kehFZAc3ROlGPLg0",
    alt: "Employee Annual Health Check-Up",
    text: "Employee Annual Health Check-Up",
    rcount: "580",
  },
  {
    src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGejZTmnp1o29plKudUQcx5A1aCMrR4hWetIvyL",
    alt: "Executive Health Check-Up(Male)",
    text: "Executive Health Check-Up(Male)",
    rcount: "351",
  },
  {
    src: "https://oyiy4rgbc6.ufs.sh/f/neMpgzjJqiGePs9LrxFaOUTWRIlZXf56sAowCtL1D98h4Ky7",
    alt: "Executive Health Check-Up(Female)",
    text: "Executive Health Check-Up(Female)",
    rcount: "183",
  },
];
