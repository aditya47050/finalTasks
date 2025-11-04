"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useState } from "react";

const Services = () => {
  const [text, setText] = useState();

  return (
    <div className="mx-auto container font-poppins w-full pb-2 min-h-screen mt-12">
      <div className="justify-center text-center ">
        <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
          Our Service
        </h1>
        <p className="text-[#5271FF] text-[14px] lg:text-[20px]">
          Only for Healthcare Professionals
        </p>
      </div>
      <div className=" lg:mt-4 mt-2 grid md:space-y-4 gap-4 grid-cols-3  pb-4 md:pb-0  lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-7  justify-center   md:px-4">
        {OurServices.map((icon, index) => (
          <div
            className="flex flex-col text-center items-center justify-center"
            key={index}
          >
            <span className="h-16 w-16 mb-3 lg:h-28 lg:w-28 bg-opacity-60  rounded-full ">
              <Image
                src={icon.src}
                width={200}
                height={200}
                alt={icon.text}
                className="p-2"
              />
            </span>
            <p className="text-[#5271FF] truncate lg:text-[12px] text-[10px] font-bold">
              {" "}
              {icon.text.split(" ")[0]} <br />
              {icon.text.split(" ").slice(1).join(" ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
const OurServices = [
  {
    src: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1743861938/WhatsApp_Image_2025-04-05_at_7.35.05_PM_zjw0do.jpg",
    text: "Consultant  Doctor",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227521/super_Consultant_Doctor_huvbcq.png",
    text: "Super  Speciality Doctor",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227406/MBBS_Doctor_e1y9xc.png",
    text: "MBBS  Doctor",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227230/CMO_Doctor_aro9tw.png",
    text: "CMO  Doctor",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227510/RMO_Doctor_d1gewe.png",
    text: "RMO  Doctor",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227423/Nurse_s_xdtp4m.png",
    text: "Nurse's & Brother's",
  },
  {
    src: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1743861323/WhatsApp_Image_2025-04-05_at_7.24.35_PM_1_r8nc3x.jpg",
    text: "Pharmacist Staff",
  },
  {
    src: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1743861310/WhatsApp_Image_2025-04-05_at_7.24.35_PM_2_makqzr.jpg",
    text: "Fresher or Intern Staff",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733562975/Administration_Staff_c34hae.png",
    text: "Administration Staff",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733562986/HR_Staff_ef2rvj.png",
    text: "Human Resource",
  },
  {
    src: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1743861349/WhatsApp_Image_2025-04-05_at_7.24.34_PM_dbward.jpg",
    text: "Paramedical Staff",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733563023/Pathology_Staff_gtqghh.png",
    text: "Pathology Technician",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227929/Healthcare_Reception_segg9d.png",
    text: "Healthcare Reception",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729229190/Insurance_f5ialr.png",
    text: "Insurance Coordinator",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733563034/Senior_Management_Staff_gxet10.png",
    text: "Senior Management Staff",
  },
  {
    src: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1744015479/WhatsApp_Image_2025-04-07_at_2.08.23_PM_toojzz.jpg",
    text: "Marketing Staff",
  },
  {
    src: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1744015467/WhatsApp_Image_2025-04-07_at_2.08.23_PM_1_m0lzmb.jpg",
    text: "Ambulance Driver",
  },
  {
    src: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1744015455/WhatsApp_Image_2025-04-07_at_2.08.23_PM_2_hpujnq.jpg",
    text: "Healthcare Coordinator",
  },
  {
    src: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1744015429/WhatsApp_Image_2025-04-07_at_2.08.23_PM_3_js6sal.jpg",
    text: "Housekeeping Staff",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733563029/Security_Guard_Staff_i4nudc.png",
    text: "Security Staff",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227945/Accountant_staff_ycxdqq.png",
    text: "Accountant Staff",
  },
];
