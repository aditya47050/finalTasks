"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const Dashboardclient = () => {
  return (
    <div className="md:mt-4 lg:mt-0 lg:mb-20 md:pb-0 px-4 md:container h-auto xl:h-[580px] rounded-xl">
      {/* Header */}
      <div className="text-center font-poppins pt-6">
        <h1 className="text-[24px] text-[#2b73f1] font-extrabold tracking-wide">
          Healthcare Services
        </h1>
        <p className="text-[#243460] text-[13px] font-medium">Doctor Dashboard</p>
      </div>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 justify-center">
        {dashboardicons.map((item, index) => (
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            key={index}
            className="flex flex-col items-center text-center"
          >
            <Link href={item.link || "#"}>
              <div className="group flex flex-col items-center">
                {/* Icon Box */}
                <div className="h-20 w-20 xl:h-24 xl:w-24 bg-gradient-to-tr from-[#243460] to-[#2b73f1] p-3 rounded-2xl shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:from-[#2b73f1] group-hover:to-[#243460]">
                  <Image
                    src={item.img}
                    width={80}
                    height={80}
                    alt={item.title}
                    className="object-contain w-full h-full"
                  />
                </div>

                {/* Title */}
                <p className="mt-2 text-[11px] sm:text-[12px] md:text-[13px] font-poppins font-semibold leading-tight">
                  <span className="text-[#2b73ec] block">
                    {item.title.split(" ")[0]}
                  </span>
                  <span className="text-[#243460]">
                    {item.title.split(" ").slice(1).join(" ")}
                  </span>
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboardclient;

const dashboardicons = [
  {
    link:"/doctor/dashboard/visitinghospitals",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/wxwninf7d2dsel0mbpkh.png",
    title: "Your Hospitals",
  },
  {
    link:"/doctor/dashboard/appointment",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119010/Patient_s_Appointment_ttx6ix.png",
    title: "Patient’s Appointment",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118519/Online_Consultation_zeu60w.png",
    title: "Online Consultation",
  },
  {
    link:"/doctor/dashboard/clinic-schedule",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119008/Clinic_Schedules_xqla9x.png",
    title: "Clinic Schedules",
  },
  {
    link:"/doctor/dashboard/hospital-schedule",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119008/Hospital_Schedules_on23du.png",
    title: "Hospital Schedules",
  },
  {
    link:"/doctor/dashboard/surgery-schedule",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119010/Surgery_Schedules_pcvzmr.png",
    title: "Surgery Schedules",
  },
  {
    link:"/doctor/dashboard/treatment-schedule",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119011/Treatment_Schedules_eaktpi.png",
    title: "Treatment Schedules",
  },
  {
    link:"/doctor/dashboard/prescription-templates",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118526/Prescription_Formats_connkv.png",
    title: "Prescription Formats",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119008/Patient_OPD_Invoice_vdcl53.png",
    title: "Patient OPD Invoice",
  },
  {
    link:"/doctor/dashboard/prescriptions",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119010/Patient_Records_uclxmc.png",
    title: "Patient Presctiption Records",
  },
  {
    link:"/doctor/dashboard/products",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119011/Pharmacy_Products_iaddxu.png",
    title: "Pharmacy Products",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119010/Profile_Analytics_lzd7fz.png",
    title: "Profile Analytics",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119007/AA_Portal_Social_Media_hr5ee9.png",
    title: "AA Portal Social Media",
  },
  {
    link:"/doctor/dashboard/documents",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119007/Documents_Registration_mbtklh.png",
    title: "Documents Registration",
  },
  {
    link:"/doctor/dashboard/associatedhospital",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119008/Network_Hospital_s_lu5z9m.png",
    title: "Network Hospital’s",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119006/Doctor_s_Team_lyijof.png",
    title: "Doctor’s Team",
  },
  {
    link:"/doctor/dashboard/view-orders",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119006/Your_Orders_oqqoc0.png",
    title: "Your Orders",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119006/Dashboard_Settings_rxvvhp.png",
    title: "Dashboard Settings",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119006/Your_Feedback_owe2gw.png",
    title: "Your Feedback",
  },
  {
    link:"/doctor/dashboard/ads-section",
    img: "https://res.cloudinary.com/dorreici1/image/upload/v1760424458/46a89694-3064-49e1-8778-b68c62d24fcb.png",
    title: "Ads Section",
  },
];
