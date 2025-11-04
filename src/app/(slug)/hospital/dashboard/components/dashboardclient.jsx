"use client";
import React from "react";
import { motion } from "framer-motion";
import { Stethoscope, HeartPulse, Activity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Dashboard Icons - Moved to separate file to avoid duplication
const dashboardicons = [
  {
    link: "/hospital/dashboard/branches",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/wxwninf7d2dsel0mbpkh.png",
    title: "Your Branches",
  },
  {
    link: "/hospital/dashboard/patient-appointment",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118522/Patient_s_Appointment_ttlygh.png",
    title: "Patient's Appointment",
    hiddenFor: ["DiagnosticCenter", "Pathology", "homehealthcare"],
  },
  {
    link: "/hospital/dashboard/bookings",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118522/Patient_s_Appointment_ttlygh.png",
    title: "Patient's Appointment",
    hiddenFor: ["Hospital", "Clinic", "DiagnosticCenter", "homehealthcare"]
  },
  {
    link: "/hospital/dashboard/diagnostic-bookings",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118522/Patient_s_Appointment_ttlygh.png",
    title: "Patient's Appointment",
    hiddenFor: ["Pathology", "Clinic", "Hospital", "homehealthcare"],
  },
  {
    link: "/hospital/dashboard/homehealthcareservices",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118522/Patient_s_Appointment_ttlygh.png",
    title: "Patient's Appointment",
    hiddenFor: ["Pathology", "Clinic", "Hospital", "DiagnosticCenter"],
  },
  {
    link: "/hospital/dashboard/doctor-speciality",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118517/Doctor_s_Schedules_ljln7l.png",
    title: "Doctor Speciality",
    hiddenFor: ["Pathology"],
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119008/Online_Consultation_sh8mq0.png",
    title: "Online Consultation",
    hiddenFor: ["Pathology"],
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119008/Online_Consultation_sh8mq0.png",
    title: "Home Collection",
    hiddenFor: ["Hospital", "Clinic", "homehealthcare", "DiagnosticCenter"],
  },
  {
    link: "/hospital/dashboard/beds",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119008/Hospital_Schedules_on23du.png",
    title: "Hospital Schedules",
    hiddenFor: ["homehealthcare", "Pathology", "DiagnosticCenter", "Clinic"],
  },
  {
    link: "/hospital/dashboard/surgery",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119010/Surgery_Schedules_pcvzmr.png",
    title: "Surgery Schedules",
    hiddenFor: ["homehealthcare", "Pathology", "DiagnosticCenter", "Clinic"],
  },
  {
    link: "/hospital/dashboard/treatment",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119011/Treatment_Schedules_eaktpi.png",
    title: "Treatment Schedules",
    hiddenFor: ["homehealthcare", "Pathology", "DiagnosticCenter", "Clinic"],
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119011/Prescription_Formats_buqyh8.png",
    title: "Prescription Formats",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119008/Patient_OPD_Invoice_vdcl53.png",
    title: "Patient OPD Invoice",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118524/Patient_Records_xz9bxo.png",
    title: "Patient Records",
  },
  {
    link: "/hospital/dashboard/inhouse-doctors",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118517/Doctor_s_Schedules_ljln7l.png",
    title: "Doctor's Schedules",
    hiddenFor: ["Pathology"],
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118518/HSP_Patient_Leads_i0xug5.png",
    title: "HSP Patient Leads",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118513/Pharmacy_Recodrs_e0unfc.png",
    title: "Pharmacy Recodrs",
    hiddenFor: ["Pathology"],
  },
  {
    link: "/hospital/dashboard/documents",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118509/Documents_Registration_qcfljg.png",
    title: "Documents Registration",
  },
  {
    link: "/hospital/dashboard/associateddiagnosticcenters",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/wxwninf7d2dsel0mbpkh.png",
    title: "Hospital Network",
    hiddenFor: ["Hospital", "homehealthcare", "Pathology", "Clinic","DiagnosticCenter" ],
  },
  {
    link: "/hospital/dashboard/inhouse-ambulances",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118516/Ambulance_Patient_Call_oc68op.png",
    title: "View Ambulances",
    hiddenFor: ["Pathology", "Pharmacy", "DiagnosticCenter","Clinic"],
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118511/HSP_Profile_Analytics_awa7zd.png",
    title: "HSP Profile Analytics",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118511/AA_Portal_Social_Media_mbqv3x.png",
    title: "AA Portal Social Media",
  },
  {
    link: "/hospital/dashboard/view-orders",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118517/Your_Orders_e9yjxd.png",
    title: "Your Orders",
  },
  {
    link: "/hospital/dashboard/inhouse-ambulances/bookambulance",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118516/Ambulance_Patient_Call_oc68op.png",
    title: "Ambulance Patient Call",
    hiddenFor: ["Pathology", "DiagnosticCenter", "Clinic"],
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118511/Dashboard_Settings_irkudq.png",
    title: "Dashboard Settings",
  },
  {
    link:"/hospital/dashboard/ads-section",
    img: "https://res.cloudinary.com/dorreici1/image/upload/v1760424458/46a89694-3064-49e1-8778-b68c62d24fcb.png",
    title: "Ads Section",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119006/Your_Feedback_owe2gw.png",
    title: "Your Feedback",
  },
];

const Dashboardclient = ({ session }) => {
  return (
    <div className="md:mt-4 lg:mt-0 lg:mb-20 md:pb-0 px-4 md:container h-auto xl:h-[580px] rounded-xl">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 p-8 shadow-lg"
      >
        {/* Background Accent */}
        <div className="absolute top-0 right-0 opacity-20 text-white text-[120px] font-extrabold select-none">
          +
        </div>

        <div className="relative z-10 text-center text-white font-poppins">
          <div className="flex justify-center gap-3 mb-4">
            <HeartPulse className="w-8 h-8 text-white drop-shadow-md" />
            <Stethoscope className="w-8 h-8 text-white drop-shadow-md" />
            <Activity className="w-8 h-8 text-white drop-shadow-md" />
          </div>
          <h1 className="text-[28px] md:text-[34px] font-extrabold tracking-wide drop-shadow-sm">
            Healthcare Services
          </h1>
          <p className="mt-2 text-[14px] md:text-[16px] font-medium opacity-90">
            Your Personalized Health Hub
          </p>
        </div>
      </motion.div>

      {/* Grid Section */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 justify-center">
        {dashboardicons
          .filter((item) => !item.hiddenFor?.includes(session))
          .map((item, index) => (
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