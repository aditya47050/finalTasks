import React from "react";
import Homeclient from "./components/homeclient";
import Testimonials from "./components/testimonials copy";
import ClientsTeleradiology from "./components/ourclients";
import Image from "next/image";

const TeleRadiologyPage = () => {
  return (
    <>
      <div className="md:container md:px-0 xs:px-4 xs:mx-auto md:mx-auto">
        <Homeclient />
        <div className="xl:container ">
          <Testimonials />
          <ClientsTeleradiology />
        </div>
        <div>
          {" "}
          <p className="text-xs font-bold text-center text-orange-500 block lg:hidden">&copy; COPYRIGHT 2023 AAROGYA AADHAR, ALL RIGHTS RESERVED</p>
          <div className="bg-[] block lg:hidden w-full h-auto pt-2 items-center justify-center text-center">
        <marquee className="font-bold text-[14px]  font-sans text-[#243561] text-center" scrollamount="12">
        Aarogya Aadhar Approved & Funded by Government of India | Aarogya
            Aadhar Certified by ISO:27001 Online Healthcare Platform | Your
            Health, Your Choice | Connect with us +91 79-7272-7498 | Mail ID:
            info@aarogyaaadhar.com
        </marquee>
      </div>
          <div className="w-full container hidden lg:flex flex-wrap md:space-y-0 space-y-4 md:flex-nowrap items-center justify-center mt-4">
            <div className="md:w-[62%] w-full">
              <Image
                src={
                  "https://res.cloudinary.com/dnckhli5u/image/upload/v1741760873/bmkpatveqyh0jgtw24kd.png"
                }
                width={1400}
                height={800}
                alt=""
                className="w-full md:h-[240px] min-[1200px]:h-[260px] py-1 h-auto "
              />
            </div>
            <div className="xl:w-[38%] md:w-[45%] w-full relative">
              <Image
                src={
                  "https://res.cloudinary.com/dnckhli5u/image/upload/v1741760891/tzkdvnfgycorj94efqc6.png"
                }
                width={1500}
                height={844}
                alt="Image"
                className="w-full md:h-[260px] min-[1200px]:h-[280px] border-2 border-[#243460] shadow-md h-auto rounded-[15px] md:ml-[-20px] lg:ml-0"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                {/* <span className="text-black  text-lg">(Photo)</span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeleRadiologyPage;
