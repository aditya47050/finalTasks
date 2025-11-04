"use client";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Phone, PhoneCall, PhoneCallIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

const AppDownload = () => {
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

  return (
    <>
      <div className="container hidden md:block mx-auto mb-5  min-[110px]:pl-[60px] min-[1100px]pr-5 xl:pl-[80px] xl:pr-[40px] xlg:container">
        <div className="w-full flex gap-2 flex-col  md:flex-row items-center justify-center">
          <div className="w-full md:w-3/4 relative flex">
            <Image
              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1731678249/4_hibx5g.png"
              alt=""
              className="rounded-[15px] w-full h-[300px]"
              width={1000}
              height={300}
            />
            <div className="absolute top-[110px] xl:pr-6  left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center w-full md:w-[20rem] xl:w-[24rem]">
              <div className="container mx-auto p-2">
                <div className="relative pt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center mt-2 pl-2">
                    <Image
                      src="https://res.cloudinary.com/dnckhli5u/image/upload/v1727153233/Icons/bj7t343tqfylrq6jiddl.png"
                      width={1200}
                      height={400}
                      alt="Aarogya Aadhar"
                      className="h-8 w-8 rounded-full"
                    />
                  </span>

                  <Input
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    placeholder="Enter Phone Number"
                    className="rounded-full px-3 py-1 p-6 bg-white placeholder:text-[#2b73ec] font-poppins pl-12"
                  />
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 mt-[4.5px]"
                  >
                    <span className="bg-[#243451] font-sans py-2 font-bold text-white px-3 rounded-full">
                      Send Link
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/4 ">
            <div className="relative w-full">
              <Image
                src="https://res.cloudinary.com/dnckhli5u/image/upload/v1724500616/Icons/ccciu0kujmkwizcapnya.png"
                alt=""
                className="w-full h-[300px] rounded-[15px]"
                width={1000}
                height={300}
              />
            </div>
          </div>
        </div>
        {/* <div className="w-full mt-2 mb-2 px-2">
    <Image
      src="https://res.cloudinary.com/dnckhli5u/image/upload/v1726914480/aarogya%20aadhar/mup2zpziqyom2nzts4zq.png"
      alt="Aarogya Aadhar"
      className="w-full h-[300px] rounded-[15px]"
      width={1000}
      height={300}
    />
  </div> */}
      </div>

      {/* m */}
      <div className="container  md:hidden block mx-auto px-4">
        <div className="w-full flex flex-col md:flex-row items-center justify-center">
          <div className="w-full  relative flex">
            <Image
              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1724498801/aarogya%20aadhar/ioujeuzmfyokajmatyie.png"
              alt=""
              className="rounded-3xl w-full h-full"
              width={1000}
              height={300}
            />{" "}
            <div
              className="absolute right-0 top-36 transform -translate-y-1/2 w-full mr-8 md:w-auto"
              style={{ width: "490px" }}
            >
              <div className="mb-5  container mx-auto p-2">
                <div className="relative pt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center mt-2 pl-3">
                    <Phone className="h-2 w-2 bg-blue-950 rounded-full text-white p-2 md:h-8 md:w-8" />
                  </span>

                  <Input
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    placeholder="Enter Phone Number"
                    className="rounded-full px-4 py-2 p-6 bg-white placeholder-blue-950 placeholder:font-semibold pl-16"
                  />
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-4 mt-1"
                  >
                    <span className="bg-[#243451] p-2 font-bold text-white px-4 rounded-full">
                      Send Link
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/4 space-y-2 md:mt-10">
            <div className="relative w-full p-1 ">
              <Image
                src="https://res.cloudinary.com/dnckhli5u/image/upload/v1724500616/Icons/ccciu0kujmkwizcapnya.png"
                alt=""
                className="w-full h-[240px] rounded-2xl"
                width={1000}
                height={300}
              />
            </div>
          </div>
        </div>
        <div className=" mt-2 w-full">
          <Image
            src={
              "https://res.cloudinary.com/dnckhli5u/image/upload/v1723915497/aarogya%20aadhar/qunlt9fgmomtu8tmccf1.webp"
            }
            width={1200}
            height={1200}
            alt=""
            className="w-full h-[300px] rounded-3xl"
          />
        </div>
      </div>
    </>
  );
};

export default AppDownload;
