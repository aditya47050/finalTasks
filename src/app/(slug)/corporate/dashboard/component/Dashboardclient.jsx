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
    title: "Upcoming Health Event",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/bjb3vd2vejhecbrzbyoa.png",
    title: "Free Doctor Consultation",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/bjb3vd2vejhecbrzbyoa.png",
    title: "Factory AFIH Doctors",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/gwra62dsiyjwhfxgzems.png",
    title: "Ambulance Services",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119008/Clinic_Schedules_xqla9x.png",
    title: "OHC Dashboard",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1727071977/Icons/pjnbjrvohsraoq7r8knc.png",
    title: "EMP Health Insurance",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119010/Patient_Records_uclxmc.png",
    title: "Health Talks & Training",
  },
  
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/wxwninf7d2dsel0mbpkh.png",
    title: "Hospital Services",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/p5yzmgxtrgdfqkronelr.png",
    title: "Annual Health Check-Ups",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/cabnflawzbf171pi9ozs.png",
    title: "Wellness Packages",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/vk2cbpjzr6m1nvltxblk.png",
    title: "Diagnostic Services",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/dlhbzaxsqjyxymrwa4py.png",
    title: "Pharmacy Services",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/xumuxjuj8kqu9nqcuhkx.png",
    title: "Donate CSR Fund",
  },
  
 
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/gizyowaityhbmd8djvxh.png",
    title: "EMP Health Records",
  },
 
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/expy7mceucklcgb7aw7e.png",
    title: "Blood Banks",
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
