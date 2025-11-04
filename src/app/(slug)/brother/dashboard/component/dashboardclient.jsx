import Image from "next/image";
import React from "react";

const Dashboardclient = () => {
  return (
    <>
      {" "}
      <div
        className="md:mt-7 lg:mb-20  md:pb-0  container space-y-2 h-auto xl:h-[540px] rounded-xl"
    
      >
        <div className="justify-center text-center font-poppins pt-4">
          <h1 className="text-[20px] text-[#2b73f1] font-extrabold">
            Healthcare Services
          </h1>
          <p className="text-[#2b73f1] text-[11px]">Dashboard</p>
        </div>
        <div className="grid grid-cols-3 xl:grid-cols-6 md:grid-cols-4 lg:grid-cols-6 gap-1 justify-center  ">
          {dashboardicons.map((item, index) => (
            <div
              className="flex flex-col text-center items-center justify-center mb-2"
              key={index}
            >
              <span className="xl:h-24 xl:w-24 p-2 h-20 w-20 bg-[#243460]  rounded-2xl  hover:border-2">
                <Image
                  src={item.img}
                  width={200}
                  height={200}
                  alt={"item.title"}
                />
              </span>
              <p className=" text-[10px] mt-1 font-poppins font-bold">
             <span className='text-[#2b73ec]'> {item.title.split(" ")[0]}</span> <br />
            <span className='text-[#243460]'>  {item.title.split(" ").slice(1).join(" ")}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
  
    </>
  );
};

export default Dashboardclient;

const dashboardicons = [
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/pron8ekjztafetxbardg.png",
    title: "Emergency Patient Call",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735118519/Online_Consultation_zeu60w.png",
    title: "Patient Booking",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/wxwninf7d2dsel0mbpkh.png",
    title: "Hospital Schedules",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119010/Patient_Records_uclxmc.png",
    title: "Patient Records",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119010/Profile_Analytics_lzd7fz.png",
    title: "Profile Analytics",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119007/AA_Portal_Social_Media_hr5ee9.png",
    title: "AA Portal Social Media",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/lmhxfdqozjotifg0sync.png",
    title: "Documents Registration",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/wxwninf7d2dsel0mbpkh.png",
    title: "Network Hospital’s",
  },
  
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/bjb3vd2vejhecbrzbyoa.png",
    title: "Doctor’s Team",
  },
  
 
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/hpjawaahh7ksnsnh5iew.png",
    title: "Your Orders",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/pwb5zw4ykbh4yxusvknj.png",
    title: "Dashboard Settings",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/ys75fhayggrgenmi6ssy.png",
    title: "Your Feedback",
  },
];
