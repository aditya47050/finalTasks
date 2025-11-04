import Image from "next/image";
import React from "react";
import Link from "next/link";  // Import Link from Next.js

const Dashboardclient = () => {
  return (
    <>
      <div className="md:mt-7 lg:mb-20 pb-40 md:pb-0  container space-y-2 h-auto xl:h-[540px] rounded-xl">
        <div className="justify-center text-center font-poppins pt-4">
          <h1 className="text-[20px] text-[#2b73ec] font-extrabold">
            Healthcare Services
          </h1>
          <p className="text-[#243460] text-[11px]">Dashboard</p>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-8  md:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-0 justify-center ">
          {dashboardicons.map((item, index) => (
            <Link href={item.link} key={index}> {/* Wrap each item with Link */}
              <div className="flex flex-col text-center items-center justify-center mb-4">
                <span className="xl:h-20 xl:w-20 h-20 w-20 bg-[#243460] p-2 rounded-2xl hover:border-2">
                  <Image
                    src={item.img}
                    width={200}
                    height={200}
                    alt={item.title} 
                  />
                </span>
                <p className=" text-[10px] font-poppins font-bold">
                  <span className="text-[#2b73ec]">
                    {item.title.split(" ")[0]}
                  </span>{" "}
                  <br />
                  <span className="text-[#243460]">
                    {item.title.split(" ").slice(1).join(" ")}
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboardclient;

const dashboardicons = [
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/wxwninf7d2dsel0mbpkh.png",
    title: "Your Hospitals",
  },
  // {
  //   link:"/doctor/dashboard/appointment",
  //   img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119010/Patient_s_Appointment_ttx6ix.png",
  //   title: "Patient’s Appointment",
  // },
  {
    link:"/pharmacy/dashboard/order",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118519/Online_Consultation_zeu60w.png",
    title: "Patient Online Order",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119008/Clinic_Schedules_xqla9x.png",
    title: "HSP Patient Leads",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119008/Hospital_Schedules_on23du.png",
    title: "Hospital Orders",
  },
    {
    link:"/pharmacy/dashboard/pharmacybranch",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119006/Your_Orders_oqqoc0.png",
    title: "Pharmacy Network",
  },
  // {
  //   link:"",
  //   img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119010/Surgery_Schedules_pcvzmr.png",
  //   title: "Surgery Schedules",
  // },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119011/Treatment_Schedules_eaktpi.png",
    title: "Order Dispatch",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118526/Prescription_Formats_connkv.png",
    title: "Prescription Formats",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119008/Patient_OPD_Invoice_vdcl53.png",
    title: "Patient OPD Invoice",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119010/Patient_Records_uclxmc.png",
    title: "Patient Records",
  },
  {
    link:"/pharmacy/dashboard/pharmacists",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119010/Patient_Records_uclxmc.png",
    title: "Pharmacists",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119011/Pharmacy_Products_iaddxu.png",
    title: "Pharmacy Stock",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119010/Profile_Analytics_lzd7fz.png",
    title: "HSP Profile Analytics",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119007/AA_Portal_Social_Media_hr5ee9.png",
    title: "AA Portal Social Media",
  },
  {
    link:"/pharmacy/dashboard/documents",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119007/Documents_Registration_mbtklh.png",
    title: "Documents Registration",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119008/Network_Hospital_s_lu5z9m.png",
    title: "Hospital Network",
  },
  {
    link:"",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119006/Doctor_s_Team_lyijof.png",
    title: "Doctor’s Network",
  },
  {
    link:"",
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
    link:"/pharmacy/dashboard/ads-section",
    img: "https://res.cloudinary.com/dorreici1/image/upload/v1760424458/46a89694-3064-49e1-8778-b68c62d24fcb.png",
    title: "Ads Section",
  },
];
