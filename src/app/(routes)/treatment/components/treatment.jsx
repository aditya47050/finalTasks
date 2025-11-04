import Facilities from "@/app/components/facitransperent";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Icons from "@/lib/icons";

const Treatment = () => {
  const iconsArray = Object.values(Icons);

  return (
    <>
      <div className="mx-auto min-[1000px]:pr-5 min-[1000px]:pl-[60px] min-[1100px]:pr-5 min-[1100px]:pl-[60px] container w-full  xl:mr-0 xl:pl-[80px] xl:pr-[40px] xlg:container  mt-4 md:mt-12 mb-4 md:mb-10 hidden lg:block ">
        <div className="w-full font-poppins flex space-x-5 ">
          <div
            className="w-9/12 rounded-[15px] h-auto pb-4"
            // style={{
            //   backgroundImage:
            //     "url('https://res.cloudinary.com/dnckhli5u/image/upload/v1723620961/mtfbf3czjsix5cnpyzv6.png')",
            //   backgroundSize: "cover",
            //   backgroundPosition: "right",
            // }}
          >
            <div className="justify-center text-center pt-4">
              <h1 className="text-[25px] text-[#5271FF] font-extrabold">
                Treatment by Specialities
              </h1>
              <p className="text-[#5271FF] text-[15px]">
                Select the Speciality
              </p>
            </div>
            <div className="grid  grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-5 justify-center mx-auto sm:mt-2 md:mt-8 px-4 lg:pl-0 lg:px-8">
              {iconsArray.slice(0, 10).map((icon, index) => (
                <Link href={`/treatment/speciality/${icon.title.toLowerCase().replace(/\s+/g, '-')}`} key={index}>
                <div
                  className="flex flex-col text-center items-center justify-center mb-4 bg-gray-50 rounded-2xl border"
                  key={index}
                >
                  <span className="xl:h-24 xl:w-24 md:h-16 md:w-16">
                    <Image
                      src={icon.src}
                      width={200}
                      height={200}
                      alt={icon.title}
                    />
                  </span>
                  <p className="text-[#5271FF] font-poppins text-[14px]  font-bold mb-2">
                    {icon.title}
                  </p>
                </div>
                </Link>
              ))}
            </div>
            <div className="flex text-center justify-center mt-6">
              <Link href={"/treatment"}>
                <span className="bg-[#243460] font-sans shadow-lg rounded-full text-white text-[14px] font-medium border-white border px-4 py-2">
                  View More
                </span>
              </Link>
            </div>
          </div>

          <div className="w-3/12 space-y-4">
            <div
              className="rounded-[15px]"
              // style={{
              //   backgroundImage:
              //     "url('https://res.cloudinary.com/dnckhli5u/image/upload/v1731664637/3_pm8twl.png')",
              //   height: "160px",
              //   backgroundSize: "cover",
              //   backgroundPosition: "right",
              // }}
            >
              {" "}
              <Image
                src="https://res.cloudinary.com/dnckhli5u/image/upload/v1731825086/24_lgyhks.png"
                alt="First image"
                width={1200}
                height={160}
                className="mt-4 xl:h-[160px] rounded-[15px]"
              />
            </div>
            <div
              // style={{
              //   backgroundImage:
              //     "url('https://res.cloudinary.com/dnckhli5u/image/upload/v1731665093/2_yihh8a.png')",

              //   backgroundSize: "cover",
              //   backgroundPosition: "right",
              // }}
              className=""
            >
              {" "}
              <Image
                src="https://res.cloudinary.com/dnckhli5u/image/upload/v1731665093/2_yihh8a.png"
                alt="First image"
                width={1200}
                height={160}
                className="h-auto md:h-[240px] lg:h-[260px] rounded-[15px] xl:h-[340px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Screen */}
      <div className="mx-auto container block font-poppins lg:hidden">
        <div className="justify-center text-center pt-1">
          <h1 className="text-[20px] text-[#5271FF] font-extrabold">
            Treatment by Specialities
          </h1>
          <p className="text-[#5271FF] text-[11px]">Select the Speciality</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 mt-2 gap-2 justify-center ">
          {iconsArray.slice(0, 6).map((icon, index) => (
            <Link href={`/treatment/speciality/${icon.title.toLowerCase().replace(/\s+/g, '-')}`} key={index}>
            <div
              className="flex flex-col text-center bg-slate-100 rounded-[15px] bg-opacity-80 hover:border-[#FF5E00] items-center justify-center mb-4"
              key={index}
            >
              <span className="h-20 w-20  rounded-2xl ">
                <Image
                  src={icon.src}
                  width={200}
                  height={200}
                  alt={icon.title}
                />
              </span>
              <p className="text-[#243460] mb-4 text-[10px] font-bold">
                {icon.title}
              </p>
            </div>
            </Link>
          ))}
        </div>
        <div className="flex text-center justify-center mt-2">
          <Link href={"/treatment"}>
            <span className="bg-[#243460] shadow-lg rounded-2xl text-white text-[10px] font-medium  border-2 px-4 p-2">
              View More
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Treatment;
