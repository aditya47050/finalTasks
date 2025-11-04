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

const Fundraiserclient = ({ data }) => {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <div className="mx-auto w-full hidden md:block container mb-5 ">
        <div className="justify-center text-center">
          <h1 className="text-[25px] text-[#5271FF] font-poppins font-extrabold">
            Our Top Fundraisers
          </h1>
          <p className="text-[#5271FF] font-poppins text-[15px]">
            To Save Countless Lives
          </p>
        </div>
        <div className="mx-auto container mt-1">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {data.map((item, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/5"
                >
                  <div className="p-1 relative">
                    <Card className="relative h-auto mb-4">
                      <CardContent className="flex flex-col items-center p-1 relative bg-[#D9D9D9] rounded-[15px]">
                        {/* Image */}
                        <div className="relative w-full  bg-white rounded-[15px]">
                          {item.frontimage ? (
                            <Image
                              src={item.frontimage}
                              width={600}
                              height={300}
                              alt={item.fundraisertitle}
                              className="object-cover bg-[#5271FF] rounded-[15px] h-44"
                            />
                          ) : (
                            <div className="relative w-full bg-white rounded-[20px] h-44"></div>
                          )}
                          {/* Button Half on Image and Half Outside */}
                          <button className="absolute xl:bottom-[-15px] truncate md:bottom-[-20px] left-1/2 transform -translate-x-1/2 md:text-[11px] xl:text-[13px] bg-blue-500 text-white py-2 px-4 font-bold font-poppins rounded-full shadow-md">
                            Donate Fund
                          </button>
                        </div>

                        {/* Name */}
                        {item.fundraisertitle ? (
                          <p className="text-black  font-sans text-[15px]  mt-4 justify-center text-center ">
                            {/* {item.text.split(" ")[0]} */}
                            {/* {item.text.split(" ").slice(1).join(" ")} */}
                            {item.fundraisertitle}
                            <p>{item.healthissue}</p>
                          </p>
                        ) : (
                          <div className="text-black font-sans   mt-4 justify-center text-center">
                            <p className="text-[9px]">
                              Help My Son raise fund for
                            </p>
                            <p>(treatment name)</p>
                          </div>
                        )}
                        <div className="text-left w-full mt-2">
                          <span className="font-bold font-sans text-[#243460] text-start">
                            INR {item.goalamount} Raised
                          </span>
                          <div className="text-left mt-0 w-full">
                            <div className="flex items-center mt-2">
                              <Progress
                                value={item.value}
                                className="h-2 bg-[#5271FF] rounded-full flex-grow"
                              />
                              <span className="text-[#243460] font-bold ml-2">
                                {item.value}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Two Buttons Below */}
                        <div className="flex mt-6 gap-8 justify-center w-full relative">
                          <div className="absolute bottom-[-20px] flex gap-6">
                            <button className="bg-[#FF3131] font-poppins text-white py-2 px-4 rounded-full shadow-md">
                              Urgent
                            </button>
                            <button className="bg-[#5271FF] font-poppins text-white py-2 px-4 rounded-full shadow-md">
                              Share
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        {/* <div className="flex items-center justify-center mx-auto pt-8">

        <button className="bg-[#243460] p-4 text-white rounded-full font-bold" onClick={() => window.location.href = "/downloadapp"}>View More Details About AarogyaDhan</button>
      </div> */}
      </div>
      {/* m */}
      <div className="mx-auto font-poppins mt-4 w-full md:hidden block container  ">
        <div className="justify-center text-center">
          <h1 className="text-[20px] text-[#5271FF] font-extrabold">
            Our Top Fundraisers
          </h1>
          <p className="text-[#5271FF] text-[11px]">To Save Countless Lives</p>
        </div>
        <div className="px-2 mt-1">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {data.map((item, index) => (
                <CarouselItem key={index} className="basis-1/2 lg:basis-1/4">
                  <div className="relative">
                    <Card className="relative h-auto mb-4 border-none">
                      <CardContent className="flex flex-col items-center p-1 relative bg-[#D9D9D9] rounded-[10px]">
                        {/* Image */}
                        <div className="relative w-full  bg-white rounded-[10px]">
                          {item.frontimage ? (
                            <Image
                              src={item.frontimage}
                              width={600}
                              height={300}
                              alt={item.fundraisertitle}
                              className="object-cover bg-[#5271FF] rounded-[15px] h-20"
                            />
                          ) : (
                            <div className="relative w-full bg-white rounded-[15px] h-20"></div>
                          )}
                          {/* Button Half on Image and Half Outside */}
                          <button className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2  text-[7px] bg-blue-500 text-white p-1 font-extrabold rounded-full shadow-md">
                            Donate Fund
                          </button>
                        </div>

                        {/* Name */}
                        {item.fundraisertitle ? (
                          <p className="text-black  text-[10px] mt-3 justify-center text-center ">
                            {/* {item.text.split(" ")[0]} <br /> */}
                            {item.fundraisertitle}
                            {/* {item.text.split(" ").slice(1).join(" ")} */}
                            <p className=" text-[10px]">
                              {" "}
                              <p>{item.healthissue}</p>
                            </p>
                          </p>
                        ) : (
                          <div className="text-black  text-[9px] mt-2 justify-center text-center">
                            <p>{item.text}</p>
                            <p>(treatment name)</p>
                          </div>
                        )}
                        <div className="text-left w-full ">
                          <span className="font-bold text-[9px] text-[#243460] text-start">
                            INR {item.goalamount} Raised
                          </span>
                          <div className="text-left w-full">
                            <div className="flex items-center">
                              <Progress
                                value={item.value}
                                className="h-1 bg-[#5271FF]  rounded-full flex-grow"
                              />
                              <span className="text-[#243460] text-[9px] font-bold ml-2">
                                {item.value}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Two Buttons Below */}
                        <div className="flex mt-2 gap-2 justify-center w-full relative">
                          <div className="absolute bottom-[-20px] flex gap-2">
                            <button className="bg-[#FF3131] text-white text-[7px] py-2 px-3 rounded-full shadow-md">
                              Urgent
                            </button>
                            <button className="bg-[#5271FF] text-white py-2 px-3 text-[7px] rounded-full shadow-md">
                              Share
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        {/* <div className="flex items-center justify-center mx-auto pt-8">

        <button className="bg-[#243460] p-4 text-white rounded-full font-bold" onClick={() => window.location.href = "/downloadapp"}>View More Details About AarogyaDhan</button>
      </div> */}
      </div>
    </>
  );
};

export default Fundraiserclient;
