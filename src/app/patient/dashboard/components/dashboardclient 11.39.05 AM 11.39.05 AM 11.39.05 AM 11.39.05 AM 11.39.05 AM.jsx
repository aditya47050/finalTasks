"use client";
import React from "react";
import { motion } from "framer-motion";
import { Stethoscope, HeartPulse, Activity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


const Dashboardclient = () => {
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
            Patient Dashboard
          </p>
        </div>
      </motion.div>

      {/* Grid Section */}
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
    link: "/patient/dashboard/upcomingschedule",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/pron8ekjztafetxbardg.png",
    title: "Upcoming Schedule",
  },
  {
    link: "/patient/dashboard/appointment",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/bjb3vd2vejhecbrzbyoa.png",
    title: "Doctor Appointment",
  },
  {
    link: "/patient/dashboard/ambulancebooking",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/gwra62dsiyjwhfxgzems.png",
    title: "Ambulance Booking",
  },
  {
    link: "/patient/dashboard/bedbooking",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/siszcbws6ib8zwxlai8g.png",
    title: "Bed Booking",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/xumuxjuj8kqu9nqcuhkx.png",
    title: "AarogyaDhan",
    link: "/patient/dashboard/aarogyadhan",
  },
  {
    link: "/patient/dashboard/healthinsurance",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1727071977/Icons/pjnbjrvohsraoq7r8knc.png",
    title: "Health Insurance",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/wxwninf7d2dsel0mbpkh.png",
    title: "Hospital Services",
  },
  {
    link:"/patient/dashboard/pathology",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/p5yzmgxtrgdfqkronelr.png",
    title: "Pathology Services",
  },
  {
    link:"/patient/dashboard/wellness",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/cabnflawzbf171pi9ozs.png",
    title: "Wellness Services",
  },
  {
    link: "/patient/dashboard/diagnosticcenter",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/vk2cbpjzr6m1nvltxblk.png",
    title: "Diagnostic Centers",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/dlhbzaxsqjyxymrwa4py.png",
    title: "Pharmacy Services",
  },
  {
     link: "/patient/dashboard/bookhomehealthcare",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/qzf91el2p32zneudsaib.png",
    title: "Home Healthcare",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/gizyowaityhbmd8djvxh.png",
    title: "Health Records",
    link: "/patient/dashboard/prescription",
  },
  {
    link: "/patient/dashboard/paymenthistory",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/xumuxjuj8kqu9nqcuhkx.png",
    title: "Payment History",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/lmhxfdqozjotifg0sync.png",
    title: "Government Schemes",
  },
  {
    link:"/patient/dashboard/bloodbank",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/expy7mceucklcgb7aw7e.png",
    title: "Blood Banks",
  },
  {
    link:"/patient/dashboard/pharmacy-order",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/hpjawaahh7ksnsnh5iew.png",
    title: "Your Orders",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/pwb5zw4ykbh4yxusvknj.png",
    title: "Dashboard Settings",
  },
  {
    link: "/patient/dashboard/surgeryschedule",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119010/Surgery_Schedules_pcvzmr.png",
    title: "Surgery Schedules",
  },
  {
    link: "/patient/dashboard/treatmentschedule",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119011/Treatment_Schedules_eaktpi.png",
    title: "Treatment Schedules",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/ys75fhayggrgenmi6ssy.png",
    title: "Your Feedback",
  },
];
