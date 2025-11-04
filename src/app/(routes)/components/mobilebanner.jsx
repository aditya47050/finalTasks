"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaFilePrescription,
  FaHospitalAlt,
} from "react-icons/fa";
import {
  FaBuildingShield,
  FaHouseMedicalCircleCheck,
  FaUserDoctor,
} from "react-icons/fa6";
import { GiRadioactive, GiTestTubes } from "react-icons/gi";
import { PiHeartbeatFill } from "react-icons/pi";
import { RiHandHeartFill } from "react-icons/ri";
import { ArrowRightCircle } from "lucide-react";
const MBanner = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const pathname = usePathname();
  const [isIos, setIsIos] = useState(false);
  
    useEffect(() => {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
  
      // iOS detection (iPhone, iPad)
      const isiOSDevice = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  
      // Optional: You can also check screen size if needed for broader tablet detection
      const isTablet = /iPad/.test(ua) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
  
      if (isiOSDevice || isTablet) {
        setIsIos(true); // hide banner on iOS devices
      }
    }, []);

  //   {
  //     src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729322837/aarogya_aadhar_benifit_te677d.png",
  //   },
  //   {
  //     src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729161773/expert_doctors_sdcxku.png",
  //     text: [
  //       {
  //         id: 1,
  //         title: "Innovative Care Trusted Aarogya Aadhar Expertise",
  //         subtitle: "Aadhar Expertise",
  //       },
  //     ],
  //   },
  //   {
  //     src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729161755/hospital_elloe8.png",
  //     text: [
  //       {
  //         id: 1,
  //         title: "Expert Aarogya Aadhar Hospital Care",
  //         subtitle: "Close to Home",
  //       },
  //     ],
  //   },
  //   {
  //     src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729161782/diagnostic_fb3zqx.png",
  //     text: [
  //       {
  //         id: 1,
  //         title: "Unlocking the secrets of disease through the",
  //         subtitle: " lens of diagnosis",
  //       },
  //     ],
  //   },
  //   {
  //     src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729161499/surgery_amumny.png",
  //     text: [
  //       {
  //         id: 1,
  //         title: "Compare, Decide, and Heal with ",
  //         subtitle: " Confidence",
  //       },
  //     ],
  //   },
  //   {
  //     src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729161762/home_health_care_v8v1kx.png",
  //     text: [
  //       {
  //         id: 1,
  //         title: " Personalized Care ",
  //         subtitle: "Where You Live",
  //       },
  //     ],
  //   },
  //   {
  //     src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729070361/Pathology_t6f11p.png",
  //     text: [
  //       {
  //         id: 1,
  //         title: "       Expert Analysis ",
  //         subtitle: "Trusted Answers",
  //       },
  //     ],
  //   },
  //   {
  //     src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729161767/health_insurance_leqbi0.png",
  //     text: [
  //       {
  //         id: 1,
  //         title: "  Your Health Partner ",
  //         subtitle: "Every Step of the Way",
  //       },
  //     ],
  //   },
  //   {
  //     src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729161798/corporate_health_uft9ug.png",
  //     text: [
  //       {
  //         id: 1,
  //         title: " Empower your team health culture with ",
  //         subtitle: "Aarogya Aadhar wellness.",
  //       },
  //     ],
  //   },
  //   {
  //     src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729161788/pharmacy_zheukw.png",
  //     text: [
  //       {
  //         id: 1,
  //         title: "Your Neighborhood Aarogya Aadhar Pharmacy",
  //         subtitle: " Any Time, Any Where",
  //       },
  //     ],
  //   },
  // ];
  const images = [
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1731666351/Expert_Doctors_ajbmlx.png",
      text: [
        {
          id: 1,
          title: "Innovative Care Trusted Aarogya Aadhar Expertise",
          subtitle: "Aadhar Expertise",
        },
      ],
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1731666358/Hospitals_siexvj.png",
      text: [
        {
          id: 1,
          title: "Expert Aarogya Aadhar Hospital Care",
          subtitle: "Close to Home",
        },
      ],
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1731666367/Diagnostic_Center_mi3jgg.png",
      text: [
        {
          id: 1,
          title: "Unlocking the secrets of disease through the",
          subtitle: " lens of diagnosis",
        },
      ],
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1731667143/Surgery_svca4e.png",
      text: [
        {
          id: 1,
          title: "Compare, Decide, and Heal with ",
          subtitle: " Confidence",
        },
      ],
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1731667157/Home_Healthcare_opg6ih.png",
      text: [
        {
          id: 1,
          title: " Personalized Care ",
          subtitle: "Where You Live",
        },
      ],
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1731667211/Pathology_h5wmn4.png",
      text: [
        {
          id: 1,
          title: "       Expert Analysis ",
          subtitle: "Trusted Answers",
        },
      ],
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1731667184/Health_Insurance_2_uxwt7l.png",
      text: [
        {
          id: 1,
          title: "  Your Health Partner ",
          subtitle: "Every Step of the Way",
        },
      ],
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1731667196/Corporate_Healthcare_xrtfck.png",
      text: [
        {
          id: 1,
          title: " Empower your team health culture with ",
          subtitle: "Aarogya Aadhar wellness.",
        },
      ],
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1731667242/Pharmacy_yd7a0w.png",
      text: [
        {
          id: 1,
          title: "Your Neighborhood Aarogya Aadhar Pharmacy",
          subtitle: " Any Time, Any Where",
        },
      ],
    },
  ];

  const [showAll, setShowAll] = useState(false);
  const logos = [
    {
      title: "Upcoming Schedules",
      link: "#",
      logo: <FaCalendarAlt className="h-8 w-8 p-0" />,
    },
    {
      title: "Expert Doctors",
      link: "/mobilenav/0",
      logo: <FaUserDoctor className="h-8 w-8 p-0" />,
    },
    {
      title: "Nearest Hospitals",
      link: "/mobilenav/1",
      logo: <FaHospitalAlt className="h-8 w-8 p-0" />,
    },
    {
      title: "Nearest Pathology",
      link: "/mobilenav/5",
      logo: <GiTestTubes className="h-8 w-8 p-0" />,
    },
    {
      title: "Home Healthcare",
      link: "/mobilenav/4",
      logo: <FaHouseMedicalCircleCheck className="h-8 w-8 p-0" />,
    },
    {
      title: "Diagnostic Centers",
      link: "/mobilenav/2",
      logo: <GiRadioactive className="h-8 w-8 p-0" />,
    },
    {
      title: "Surgery Packages",
      link: "/mobilenav/3",
      logo: <PiHeartbeatFill className="h-8 w-8 p-0" />,
    },
    {
      title: "Nearest Pharmacy",
      link: "/mobilenav/8",
      logo: <FaFilePrescription className="h-8 w-8 p-0" />,
    },
    {
      title: "Health Insurance",
      link: "/mobilenav/6",
      logo: <RiHandHeartFill className="h-8 w-8 p-0" />,
    },
    {
      title: "Corporate Health",
      link: "/mobilenav/7",
      logo: <FaBuildingShield className="h-8 w-8 p-0" />,
    },
  ];

  const visibleLogos = showAll ? logos : logos.slice(0, 5);
  return (
    <>
      <div className="block  lg:hidden  ">
        {" "}
        {!isIos &&  (<div
          className={`w-full ${
            pathname === "/" && ""
          }pl-3   justify-center text-center items-center  `}
        >
          <div className="w-full  mx-auto">
            <Carousel
              plugins={[plugin.current]}
              className="w-full max-w-full  px-2 mx-auto"
              onMouseEnter={() => plugin.current.stop()}
              onMouseLeave={() => plugin.current.reset()}
            >
              <CarouselContent className="w-full ">
                {images.map((image, index) => (
                  <CarouselItem key={index} className="w-full">
                    <Image
                      src={image.src}
                      height={1094}
                      width={3000}
                      quality={100}
                      className="w-auto h-full rounded-[15px] p-2 object-contain"
                      onClick={() =>
                        (window.location.href = `/mobilenav/${index}`)
                      }
                      alt={`Slide ${index + 1}`}
                    />{" "}
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>)}
        <div className="mx-auto container px-4 mb-2">
          <div className="flex justify-end items-center text-left">
            <span
              className="cursor-pointer text-white text-[10px] font-semibold flex items-center gap-1"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : "Show All"}
              <ArrowRightCircle className="h-3 w-3" />
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 mt-2">
            {visibleLogos.map((logo) => (
              <div
                key={logo.title}
                className="flex flex-col justify-center items-center text-center"
              >
                {/* Logo */}
                <Link
                  href={logo.link}
             
                  className="text-blue-500 hover:underline"
                >
                  <div className="text-black bg-white rounded-xl p-2">
                    {logo.logo}
                  </div>
                </Link>
                {/* Title */}
                <h3 className="text-[8px] text-white font-medium mt-1 text-center leading-tight">
                  {logo.title.split(" ").map((word, index) => (
                    <span key={index} className="block">
                      {word}
                    </span>
                  ))}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MBanner;
//  {/* <div className=" overflow-x-auto container mx-auto w-full  mt-4 pb-4">
//     <div className="flex space-x-8 text-[#243460]  ">
//       {/** Reusable Stats Card Component */}
// {[
//   {
//     src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725865614/aarogya%20aadhar/mobilescreen/xy70ezpsmszyk2vswlin.png",
//     count: "5500+",
//     label: "Healthcare Service Providers",
//   },
//   {
//     src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725865614/aarogya%20aadhar/mobilescreen/nqxecmuikwedir4h2jfa.png",
//     count: "50000+",
//     label: "Happy Patients",
//   },
//   {
//     src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725865614/aarogya%20aadhar/mobilescreen/zk3slutdoszvqxfgguzm.png",
//     count: "20+",
//     label: "Covered Cities",
//   },
//   {
//     src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725865614/aarogya%20aadhar/mobilescreen/bqf6qqowjildaubzb2lu.png",
//     count: "45+",
//     label: "Doctor Specialists",
//   },
// ].map((item, index) => (
//   <div key={index} className="inline-block w-1/5  text-center">
//     <div className="flex justify-center items-center space-x-1 ">
//       <Image
//         src={item.src}
//         width={24}
//         height={24}
//         alt=""
//         className="h-6 w-6"
//       />
//       <span className="font-extrabold text-[12px]">
//         {item.count}
//       </span>
//     </div>
//     <div className="text-[8px] font-bold break-words whitespace-normal flex flex-wrap mt-1">
//       {item.label}
//     </div>
//   </div>
// ))}
// </div></div>
// </div>
// <style jsx>{`
//   .scrolling-wrapper {
//     overflow-x: auto;
//     scroll-snap-type: x mandatory;
//   }
//   .scrolling-wrapper > div {
//     scroll-snap-align: start;
//   }
//   @keyframes autoScroll {
//     0% {
//       transform: translateX(100%);
//     }
//     100% {
//       transform: translateX(-100%);
//     }
//   }
//   .animate-auto-scroll {
//     display: inline-flex;
//     white-space: nowrap;
//     animation: autoScroll 15s linear infinite;
//   }
// `}</style>
