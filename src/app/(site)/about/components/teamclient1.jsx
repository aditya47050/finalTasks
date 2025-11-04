import { Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Teamclient1 = () => {
  return (
    <>
      <div className="mx-auto container hidden lg:block">
        {" "}
        <div className=" justify-center text-center mb-1">
          <h1 className="lg:text-[25px] text-[20px] text-[#4671b8] font-poppins font-extrabold ">
            <span className="shadow-inherit ">Founder’s</span>
          </h1>
        </div>
        <div className="flex items-center mt-8 flex-wrap justify-center gap-4 space-x-0 sm:space-x-0 sm:mt-2 md:mt-8 md:px-4">
          {founders.map((founder, index) => (
            <div
              className="relative w-full sm:w-52 h-auto flex flex-col items-center mb-4 md:mb-10 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm transition duration-300 hover:shadow-lg hover:-translate-y-1"
              key={index}
            >
              <div className="relative w-20 h-20 xs:w-24 xs:h-24 -mt-12 bg-white rounded-full flex justify-center items-center border">
                <Image
                  src={founder.img}
                  alt={`${founder.name} profile`}
                  width={96}
                  height={96}
                  className="w-full h-full object-contain rounded-full border-4 border-white shadow-md"
                />
              </div>
              <div className="relative z-10 mt-2">
                <p className="text-[#FF5e00] truncate text-center font-poppins text-[12px] lg:text-[16px] font-semibold">
                  <Link href={founder.in}>
                    {" "}
                    {founder.name
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ")}
                  </Link>
                </p>
              </div>
              <div className="relative z-10">
                <p className="text-[#243460] text-center text-[10px] lg:text-[14px]">
                  {founder.role}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className=" justify-center text-center mb-1 ">
          <h1 className="lg:text-[25px] text-[20px] mt-6 mb-3 md:mt-0 font-poppins text-[#4671b8] font-extrabold ">
            <span className="shadow-inherit ">Leadership</span>
          </h1>
        </div>
        <div className="flex items-center mt-8 flex-wrap justify-center gap-4 space-x-0 xs:space-x-2 sm:mt-2 md:mt-8 px-4">
          {leadership.map((founder, index) => (
            <div
              className="relative w-full xs:w-52 h-auto flex flex-col items-center mb-4 md:mb-10 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm transition duration-300 hover:shadow-lg hover:-translate-y-1"
              key={index}
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 -mt-12 bg-white rounded-full flex justify-center items-center border">
                <Image
                  src={founder.img}
                  alt={`${founder.name} profile`}
                  width={96}
                  height={96}
                  className="w-full h-full object-contain rounded-full border-4 border-white shadow-md"
                />
              </div>
              <div className="relative z-10 mt-2">
                <p className="text-[#FF5e00] truncate text-center font-poppins text-[12px] lg:text-[16px] font-semibold">
                  <Link href={founder.in}>
                    {" "}
                    {founder.name
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ")}
                  </Link>
                </p>
              </div>
              <div className="relative z-10">
                <p className="text-[#243460] text-center text-[10px] lg:text-[14px]">
                  {founder.role}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className=" justify-center text-center mb-1 ">
          <h1 className="lg:text-[25px] text-[20px] mt-6 md:mt-0  text-[#4671b8] font-poppins font-extrabold ">
            <span className=" ">Advisory Board</span>
          </h1>
        </div>
        <div className="flex items-center mt-8 flex-wrap justify-center gap-4 space-x-0 sm:space-x-4 sm:mt-2 md:mt-8 px-4">
          {advisoryboard.map((founder, index) => (
            <div
              className="relative w-full sm:w-52 h-auto flex flex-col items-center mb-4 md:mb-10 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm transition duration-300 hover:shadow-lg hover:-translate-y-1"
              key={index}
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 -mt-12 bg-white rounded-full flex justify-center items-center border">
                <Image
                  src={founder.img}
                  alt={`${founder.name} profile`}
                  width={96}
                  height={96}
                  className="w-full h-full object-contain rounded-full border-4 border-white shadow-md"
                />
              </div>
              <div className="relative z-10 mt-2">
                <p className="text-[#FF5e00] truncate text-center font-poppins text-[12px] lg:text-[16px] font-semibold">
                  <Link href={founder.in}>
                    {" "}
                    {founder.name
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ")}
                  </Link>
                </p>
              </div>
              <div className="relative z-10">
                <p className="text-[#243460] text-center text-[10px] lg:text-[14px]">
                  {founder.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* m */}
      <div className="lg:hidden block px-2">
        {" "}
        <div className=" justify-center text-center  mb-10 ">
          <h1 className="lg:text-[25px] text-[20px] text-[#4671b8] font-poppins font-extrabold ">
            <span className="shadow-inherit ">Founder’s</span>
          </h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4  mt-8 sm:mt-2 md:mt-8">
  {founders.map((founder, index) => (
    <div
      className="relative w-full h-auto flex flex-col items-center mb-4 md:mb-10 bg-white p-4 rounded-2xl border"
      key={index}
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 -mt-12 bg-white rounded-full flex justify-center items-center border">
        <Image
          src={founder.img}
          alt={`${founder.name} profile`}
          width={96}
          height={96}
          className="w-full h-full object-contain rounded-full border-4 border-white shadow-md"
        />
      </div>
      <div className="relative z-10 mt-2">
        <p className="text-[#FF5e00] truncate text-center font-poppins text-[14px] lg:text-[16px] font-semibold">
          <Link href={founder.in}>
            {" "}
            {founder.name
              .split(" ")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() +
                  word.slice(1).toLowerCase()
              )
              .join(" ")}
          </Link>
        </p>
      </div>
      <div className="relative z-10">
        <p className="text-[#243460] text-center text-[12px] lg:text-[14px]">
          {founder.role}
        </p>
      </div>
    </div>
  ))}
</div>

        <div className=" justify-center text-center  mb-10 ">
          <h1 className="lg:text-[25px] text-[20px] mt-3 mb-3 md:mt-0 font-poppins text-[#4671b8] font-extrabold ">
            <span className="shadow-inherit ">Leadership</span>
          </h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-y-6  mt-8 sm:mt-2 md:mt-8">
  {leadership.map((founder, index) => (
    <div
      className="relative w-full h-auto flex flex-col items-center mb-4 md:mb-10 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm transition duration-300 hover:shadow-lg hover:-translate-y-1"
      key={index}
    >
     <div className="relative w-20 h-20 sm:w-24 sm:h-24 -mt-12 bg-white rounded-full flex justify-center items-center border">
  <Image
    src={founder.img}
    alt={`${founder.name} profile`}
    width={96}
    height={96}
    className="w-full h-full object-contain rounded-full shadow-md"
  />
</div>

      <div className="relative z-10 mt-2">
        <p className="text-[#FF5e00] truncate text-center font-poppins text-[14px] lg:text-[16px] font-semibold">
          <Link href={founder.in}>
            {" "}
            {founder.name
              .split(" ")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() +
                  word.slice(1).toLowerCase()
              )
              .join(" ")}
          </Link>
        </p>
      </div>
      <div className="relative z-10">
        <p className="text-[#243460] text-center text-[12px] lg:text-[14px]">
          {founder.role}
        </p>
      </div>
    </div>
  ))}
</div>

        <div className=" justify-center text-center  mb-10 ">
          <h1 className="lg:text-[25px] text-[20px] my-3 md:mt-0 sm:pb-6 md:pb-0  text-[#4671b8] font-poppins font-extrabold ">
            <span className=" ">Advisory Board</span>
          </h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xs:gap-y-6 mt-8 sm:mt-2 md:mt-8">
  {advisoryboard.map((founder, index) => (
    <div
      className="relative w-full  h-auto flex flex-col items-center mb-4 md:mb-10 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm transition duration-300 hover:shadow-lg hover:-translate-y-1"

      key={index}
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 -mt-12 bg-white rounded-full flex justify-center items-center border">
        <Image
          src={founder.img}
          alt={`${founder.name} profile`}
          width={96}
          height={96}
          className="w-full h-full object-contain rounded-full border-4 border-white shadow-md"
        />
      </div>
      <div className="relative z-10 mt-2">
        <p className="text-[#FF5e00] truncate text-center font-poppins text-[14px] lg:text-[16px] font-semibold">
          <Link href={founder.in}>
            {" "}
            {founder.name
              .split(" ")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() +
                  word.slice(1).toLowerCase()
              )
              .join(" ")}
          </Link>
        </p>
      </div>
      <div className="relative z-10">
        <p className="text-[#243460] text-center text-[12px] lg:text-[14px]">
          {founder.role}
        </p>
      </div>
    </div>
  ))}
</div>

      </div>
    </>
  );
};

export default Teamclient1;

const founders = [
  {
    name: "DR SHUBHAM GADGE",
    img: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1744021292/WhatsApp_Image_2025-04-07_at_3.51.11_PM_k7ryoh.jpg",
    role: "Founder & MD",
    in: "www.linkedin.com/in/shubham-gadge",
  },
  {
    name: "DR SANJAY PANDHARE",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725183368/aarogya-team/hsb98sunfsd7fz6ztukn.webp",
    role: "Co-Founder & CAO",
    in: "https://www.linkedin.com/in/sanjay-pandhare-4aa9b820/",
  },
];

const leadership = [
  {
    name: "DR SEEMA MANDHARE",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725183899/aarogya-team/wsnbvgy7dp2v9ezbgzqc.webp",
    in: "https://www.linkedin.com/in/dr-seema-mandhare-511a7732/",
    role: "Director & CIO",
  },
  {
    name: "CHAITANYA SHINDE",
    img: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1744021926/WhatsApp_Image_2025-04-07_at_4.00.14_PM_cdiguo.jpg",
    in: "https://www.linkedin.com/in/chaitanya-shinde-b74041287/",
    role: "Head of Operation",
  },
  {
    name: "DR SANDESH PHALKE",
    img: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1744022055/WhatsApp_Image_2025-04-07_at_4.00.15_PM_nxwszk.jpg",
    in: "https://www.linkedin.com/in/sandesh-phalke-ph-d-63658b137/",
    role: "Technical Lead",
  },
];

const advisoryboard = [
  {
    name: "Vaishali Khadye",
    img: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1744025861/WhatsApp_Image_2025-04-07_at_4.53.53_PM_jhzxo4.jpg",
    in: "",
    role: "Relationship Director",
  },
  {
    name: "Rtn Shankar Bhagat",
    img: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1744026005/WhatsApp_Image_2025-04-07_at_4.53.54_PM_twdkeq.jpg",
    in: "https://www.linkedin.com/in/rtn-shankar-k-bhagat-92535869/",
    role: "Advisory Board",
  },
  {
    name: "Dr Rajendra Awate",
    img: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1744025627/WhatsApp_Image_2025-04-07_at_4.53.51_PM_1_f872f6.jpg",
    in: "https://www.linkedin.com/in/prof-dr-rajendra-awate-md-9b688918/",
    role: "Advisory Board",
  },
  {
    name: "Dr Mayank Patel",
    img: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1744026223/WhatsApp_Image_2025-04-07_at_4.53.54_PM_3_gifueq.jpg",
    in: "https://www.linkedin.com/in/dr-mayank-patel-cfa-37368011/",
    role: "Advisory Board",
  },
  {
    name: "Nandkumar Khandare",
    img: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1744025431/WhatsApp_Image_2025-04-07_at_4.53.51_PM_mewu3i.jpg",
    in: "",
    role: "Advisory Board",
  },
  {
    name: "Dr Dipak Tatpuje",
    img: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1744026150/WhatsApp_Image_2025-04-07_at_4.53.54_PM_2_ojnh3x.jpg",
    in: "https://www.linkedin.com/in/dtatpuje/",
    role: "Advisory Board",
  },
  {
    name: "Dr Vaishaly Bharambe",
    img: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1744025813/WhatsApp_Image_2025-04-07_at_4.53.52_PM_1_aldx3f.jpg",
    in: "https://www.linkedin.com/in/drvaishalybharambe/",
    role: "Advisory Board",
  },
  {
    name: "Ashvin Savant",
    img: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1744025738/WhatsApp_Image_2025-04-07_at_4.53.52_PM_ljeybo.jpg",
    in: "https://www.linkedin.com/in/ashvinsavant/",
    role: "Advisory Board",
  },
  {
    name: "VINAYAK BOROLE",
    img: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1744025926/WhatsApp_Image_2025-04-07_at_4.53.53_PM_1_k3b35h.jpg",
    in: "",
    role: "Advisory Board",
  },
  {
    name: "Dr Vijay Jangam",
    img: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1744026098/WhatsApp_Image_2025-04-07_at_4.53.54_PM_1_al0nsw.jpg",
    in: "https://www.linkedin.com/in/dr-vijay-jangam-8216ab69/",
    role: "Advisory Board",
  },
];
