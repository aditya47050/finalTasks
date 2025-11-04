import { HeartIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import Icons from "@/lib/icons";
import Link from 'next/link';


const Treatmentindex = () => {
  const iconsArray = Object.values(Icons);

  return (
    <>
      <div className="mx-auto mb-2  font-poppins pt-4 container hidden lg:block">
        <div
          className="w-full rounded-[15px] h-auto "
        
        >
          <div className="justify-center text-center pt-2">
            <h1 className="text-[25px] text-[#5271FF] font-extrabold">
              <span className="shadow-inherit">Treatment by Specialities</span>
            </h1>
            <p className="text-[#5271FF] text-[15px] stroke-[#5271FF]">
              Select the Speciality
            </p>
          </div>
          <div className="grid  grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-5 justify-center mx-auto sm:mt-2 md:mt-8 px-4 lg:px-8">
              {iconsArray.map((icon, index) => (
                <Link href={`/treatment/speciality/${icon.title.toLowerCase().replace(/\s+/g, '-')}`} key={index}>
                <div
                  className="flex flex-col text-center items-center justify-center mb-4 bg-gray-50 rounded-2xl border"
                  
                >
                  <span className="xl:h-24 xl:w-24 md:h-16 md:w-16" >
                    <Image
                      src={icon.src}
                      width={200}
                      height={200}
                      alt={icon.title}
                    />
                  </span>
                  <p className="text-[#5271FF] font-poppins text-[14px]  font-bold mb-2">{icon.title}</p>
                </div>
                </Link>
              ))}
            </div>
        </div>
      </div>
      <div className="mx-auto font-poppins block lg:hidden"> <div className="justify-center text-center pt-4">
          <h1 className="text-xl text-[#5271FF] font-extrabold">
            Treatment by Specialities
          </h1>
          <p className="text-[#5271FF] text-[10px]">Select the Speciality</p>
        </div>
        <div className="grid grid-cols-3 mx-auto container md:grid-cols-6 mt-2 gap-2 justify-center ">
          {iconsArray.map((icon, index) => (
          <Link href={`/treatment/speciality/${icon.title.toLowerCase().replace(/\s+/g, '-')}`} key={index}>
            <div
              className="flex flex-col text-center bg-slate-100 rounded-[15px] bg-opacity-80 hover:border-[#FF5E00] items-center justify-center mb-4"
             
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
        </div></div>
    </>
  );
};

export default Treatmentindex;
