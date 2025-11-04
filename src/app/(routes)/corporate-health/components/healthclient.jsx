"use client";
import Image from "next/image";
import React from "react";
import HealthPackageClient from "../../health-packages/components/healthpackageclient";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Healthclient = () => {
  const pathname = usePathname();
  return (
    <>
      <div className="mx-auto container md:mt-5 mt-4 mb-5 w-full">
        <div className="flex justify-center">
          <button className="md:bg-[#2b73ec] font-sans lg:text-[18px] text-[14px] md:text-[14px] rounded-full py-1 px-4 text-[#2b73ec] md:text-white font-bold">
            Our Corporate Services
          </button>
        </div>
        <div className="lg:mx-auto lg:container md:gap-4 mt-2 grid xs:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 justify-center lg:px-16">
          {corporatehealth.map((icon, index) => {
            const words = icon.text.split(" ");
            let firstLine, secondLine;

            if (words.length === 1) {
              firstLine = words[0]; // 1 word
              secondLine = ""; // No second line
            } else if (words.length === 2) {
              firstLine = words.join(" "); // 2 words
              secondLine = ""; // No second line
            } else if (words.length === 3) {
              firstLine = words.slice(0, 2).join(" "); // 2 words
              secondLine = words[2]; // 1 word
            } else {
              firstLine = words.slice(0, 3).join(" "); // 3 words
              secondLine = words.slice(3).join(" "); // Remaining words
            }

            return (
              <div
                className="flex flex-col text-center  space-y-2 items-center justify-center"
                key={index}
              >
                <span className="md:h-28  md:w-28 h-16 w-16 rounded-full">
                  <Image
                    src={icon.src}
                    width={200}
                    height={200}
                    alt={icon.text}
                    className=""
                  />
                </span>
                <p className="text-[#5271FF] lg:text-[12px] text-[9px] font-poppins font-bold">
                  {firstLine}
                  <br />
                  {secondLine}
                </p>
              </div>
            );
          })}
        </div>

        {pathname == "/" && (
          <div className="flex text-center justify-center mt-6">
            <Link href={"/corporate-health"}>
              <span className="bg-[#243460] font-sans shadow-lg rounded-2xl text-white text-[14px] font-medium border-white border px-4 py-2">
                View More
              </span>
            </Link>
          </div>
        )}
        {/* {pathname !== "/" && (
          <div>
            <div className="mt-6 mb-6 hidden lg:block">
              <HealthPackageClient />
            </div> */}
            {/* <div className="mt-6 rounded-3xl">
      <Image
        src="https://res.cloudinary.com/dnckhli5u/image/upload/v1731671663/13_jcgwel.png"
        width={4000}
        height={844}
        alt="Health package banner"
        className="w-full md:h-[270px] h-auto rounded-[15px]"
      />
    </div> */}
          {/* </div>
        )} */}
      </div>
    </>
  );
};

export default Healthclient;

const corporatehealth = [
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729082436/10-removebg-preview_ccrb4j.png",
    alt: "",
    text: "Employees  Vaccination",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733563076/Personal_fzkjbl.png",
    alt: "",
    text: "Medical Personnel Manning",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729082599/14-removebg-preview_faz1jp.png",
    alt: "",
    text: "Employee Health Insurance",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733563045/CSR_m1vxmm.png",
    alt: "",
    text: "Healthcare CSR Services",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733563072/OHC_zzkejv.png",
    alt: "",
    text: "OHC Health Center",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733563062/Health_Talks_Seminars_txkahk.png",
    alt: "",
    text: "Health Talks & Seminars",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733563057/Health_Checkup_dfua8w.png",
    alt: "",
    text: "Annual Health Check-Ups",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733563039/Ambulance_g50gy4.png",
    alt: "",
    text: "24/7 Ambulance Services",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733563067/Medical_Unit_dgftfr.png",
    alt: "",
    text: "Equipped Mobile Medical Unit",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729160734/medical_staff_wyezyo.png",
    alt: "",
    text: "OHC AFIH Doctor & Medical Staff",
  },
];
