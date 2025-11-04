import { Linkedin, User2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const RadiologistClient = () => {
  return (
    <>
      <div className="mx-auto mt-6 md:mt-0">
        {" "}
        <div className=" justify-center text-center ">
          <h1 className="py-1 lg:text-[25px] md:my-4 text-[20px] text-[#4671b8] font-poppins font-extrabold ">
            <span className="shadow-inherit ">Radiologists</span>
          </h1>
        </div>
        {/* <div className="flex items-center mt-4 pt-8  md:pt-12 flex-wrap justify-center md:h-full h-auto overflow-auto gap-4 gap-y-8 space-x-0 sm:space-x-4 sm:mt-2  md:mt-8 px-4"> */}
          <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:mx-[5%] xl:mx-[10%] mt-16 place-items-center lg:gap-y-12">
          {radiologist.map((item, index) => (
            <div
              className="relative mb-10 md:mb-10 bg-white p-4 md:p-4 shadow-md rounded-2xl border"
              key={index}
            >
              <div className="relative  -mt-12 md:-mt-20 flex justify-center items-center" >
                {item.img ? (
                  <img
                    src={item.img}
                    alt={``}
                    width={96}
                    height={96}
                    className=" object-contain rounded-full border-4 w-20 h-20 sm:w-24 sm:h-24 border-[#ff5e00] shadow-md"
                  />
                ) : (
                  <User2Icon className="w-full h-full md:h-24 md:w-24 lg:h-28 lg:w-28 object-contain rounded-full border-2  border-[#ff5e00] shadow-md" />
                )}
              </div>
              <div className="relative z-0 mt-2">
                <p className="text-[#FF5e00] truncate text-center font-poppins text-[12px] lg:text-[16px] font-semibold">
                  {" "}
                  {item.name
                    .split(" ")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ")}
                </p>
              </div>
              <div className="relative z-0">
                <p className="text-[#243460] text-center text-[10px] lg:text-[14px]">
                  {item.exp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RadiologistClient;

const radiologist = [
  {
    name: "Dr. John Smith",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    exp: "15+ Yrs Experience",
  },
  {
    name: "Dr. Emily Johnson",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    exp: "12+ Yrs Experience",
  },
  {
    name: "Dr. Michael Brown",
    img: "https://randomuser.me/api/portraits/men/85.jpg",
    exp: "20+ Yrs Experience",
  },
  {
    name: "Dr. Sarah Davis",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    exp: "10+ Yrs Experience",
  },
  {
    name: "Dr. David Wilson",
    img: "https://randomuser.me/api/portraits/men/15.jpg",
    exp: "18+ Yrs Experience",
  },
  {
    name: "Dr. Laura Martinez",
    img: "https://randomuser.me/api/portraits/women/33.jpg",
    exp: "8+ Yrs Experience",
  },
  {
    name: "Dr. James Anderson",
    img: "https://randomuser.me/api/portraits/men/50.jpg",
    exp: "25+ Yrs Experience",
  },
  {
    name: "Dr. Olivia Thompson",
    img: "https://randomuser.me/api/portraits/women/72.jpg",
    exp: "14+ Yrs Experience",
  },
  {
    name: "Dr. William Taylor",
    img: "https://randomuser.me/api/portraits/men/24.jpg",
    exp: "11+ Yrs Experience",
  },
  {
    name: "Dr. Sophia Moore",
    img: "https://randomuser.me/api/portraits/women/56.jpg",
    exp: "9+ Yrs Experience",
  },
];

