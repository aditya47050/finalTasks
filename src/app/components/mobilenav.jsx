"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Ambulance,
  ArrowDown,
  Bed,
  CalendarDays,
  ChevronRightIcon,
  Home,
  HomeIcon,
  IndianRupee,
  Languages,
  Menu,
  Search,
  SearchIcon,
  SlidersHorizontal,
  UserCircle,
  UserPen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FaAmbulance, FaHome, FaIdCard } from "react-icons/fa";
import { FaBedPulse } from "react-icons/fa6";
import { LuCalendarClock } from "react-icons/lu";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import MBanner from "../(routes)/components/mobilebanner";

const Mobilenav = ({ data }) => {
  const pathname = usePathname();

  const [isVisible, setIsVisible] = useState(true);
  const handleScroll = () => {
    // Check if scroll position is greater than a certain value (e.g., 100px)
    if (window.scrollY > 100) {
      setIsVisible(false); // Hide element
    } else {
      setIsVisible(true); // Show element
    }
  };
  useEffect(() => {
    // Add scroll event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const navlinks = [
    {
      icon: <FaIdCard  className="!h-6 !w-6 "/>,
      link: "/healthcard",
      title: "Health Card",
    },
    {
      icon: <UserPen className="!h-6 !w-6 "/>,
      link: "/mobile-register",
      title: "Register",
      submenu: [
        { title: "Patient", link: "/patient/register" },
        { title: "Doctor", link: "/doctor/register" },
        { title: "Hospital/Clinic", link: "/hospital/register" },
        { title: "Pathology", link: "#" },
        { title: "Diagnostic Center", link: "#" },
        { title: "Ambulance", link: "#" },
        { title: "Health Professional", link: "#" },
        { title: "Corporate Company", link: "/corporate/register" },
        { title: "Equipment Dealers", link: "#" },
        { title: "Pharmacy", link: "#" },
        { title: "Service Provider", link: "#" },
        { title: "Aarogya Mitra", link: "#" },
        { title: "Registration Enquiry", link: "registrationenquiryform" },
      ],
    },
    {
      icon: <UserCircle className="!h-6 !w-6 "/>,
      link: "/mobile-login",
      title: "Login",
      submenu: [
        { title: "Patient", link: "/patient/login" },
        { title: "Doctor", link: "/doctor/login" },
        { title: "Hospital/Clinic", link: "/hospital/login" },
        { title: "Pathology", link: "#" },
        { title: "Diagnostic Center", link: "#" },
        { title: "Ambulance", link: "#" },
        { title: "Health Professional", link: "#" },
        { title: "Corporate Company", link: "/corporate/login" },
        { title: "Equipment Dealers", link: "#" },
        { title: "Pharmacy", link: "#" },
        { title: "Service Provider", link: "#" },
        { title: "Aarogya Mitra", link: "#" },
      ],
    },
  ];
  const loginnavlinks = [
    {
      title: <FaIdCard  className="!h-8 !w-8 "/>,
      link: "/patient/dashboard/digitalhealthcard",
    },

    {
      title: <UserCircle />,
      icon: data?.passportPhoto || <UserCircle className="!h-6 !w-6 "/>,
      link: "/patient/dashboard",
      submenu: [
        { title: "Health Card", link: "/patient/dashboard/digitalhealthcard" },
        { title: "Log Out", link: "" },
      ],
    },
  ];
  return (
    <>
      <nav
        className="font-poppins  fixed top-0 z-20 w-full overflow-auto block lg:hidden"
        style={{
          backgroundColor: "#5b6bf5",
        }}
      >
        <div className="w-full px-1 flex items-center">
          <div className="w-2/5">
            <Link href="/">
              <span className="flex items-center space-x-2">
                <span className="">
                  <Image
                    src="https://res.cloudinary.com/dnckhli5u/image/upload/v1732897093/logo_with_tm_1_dovble.png"
                    width={180}
                    height={200}
                    alt="Logo"
                    className="h-[50px] pl-1 pt-2 w-full"
                  />
                </span>
              </span>
            </Link>
          </div>

          {data !== null ? (
            <div className="w-3/5 flex gap-1 flex-wrap pr-1 justify-end space-x-0">
              {loginnavlinks.map((nav, index) => (
                <div className="relative" key={`${nav.link}-${index}`}>
                  <Link href={nav.link}>
                    {" "}
                    <Button className={cn("text-blue-950 p-1")}>
                      <span className="flex justify-center items-center space-x-0.5">
                        <span className="text-[#FFF] flex items-center text-[11px]">
                          {nav.icon && typeof nav.icon === 'string' && nav.icon.trim() !== '' ? (
                            <span className="mr-1">
                              <Image
                                src={nav.icon}
                                alt="Profile"
                                height={600}
                                width={600}
                                className="h-8 w-8 rounded-full border border-white"
                              />
                            </span>
                          ) : (
                            <span className="flex items-center text-center gap-1">
                              {" "}
                              {nav.title}{" "}
                            </span>
                          )}
                        </span>
                      </span>
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-3/5 flex gap-1 flex-wrap pr-1  justify-end space-x-0">
              {navlinks.map((nav, index) => (
                <div className="relative" key={`${nav.title}-${index}`}>
                  <Link href={nav.link}>
                    {" "}
                    <Button className={cn("text-blue-950 p-1")}>
                      <span className="flex justify-center items-center space-x-0.5">
                        <span className="text-[#FFF] flex items-center text-[20px]">
                        
                            <span className="mr-1 flex justify-center items-center">{nav.icon}</span>
                        </span>
                      </span>
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        {isVisible && pathname === "/" && (
          <div className="transition-opacity duration-300 opacity-100">
            <MBanner />
          </div>
        )}

        <div className="mx-auto container px-0 mb-3">
          <div className="mx-auto container px-4 pt-2 mb-1">
            <div className="flex justify-between items-center">
              {/* Left Icon */}
              <div className="flex items-center pt-1">
                <Link href={"/core-features"}>
                  {" "}
                  <button
                    className={`${
                      pathname === "/core-features"
                        ? "text-black"
                        : "text-white"
                    }`}
                  >
                    <RxDashboard className="h-8 w-8" />
                  </button>
                </Link>
              </div>

              {/* Search Input */}
              <div className="flex-1 mx-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Healthcare Services"
                    className="w-full px-3 py-2 rounded-2xl italic placeholder:text-[13px] text-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    <SearchIcon className="text-gray-400 hover:text-blue-500 cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Right Icon */}
              <div className="flex items-center">
                <button className="text-white">
                  <SlidersHorizontal className="h-8 w-8 p-0" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <nav className="fixed bottom-0 w-full text-center  block lg:hidden z-50">
        
        <div
          className="flex  justify-between md:px-16 w-full p-2 border-t-2 border-blue-500"
          style={{
            backgroundColor: "#fff",
          }}//#243460
        >
          {navItems.map((item, index) => (
            <Link key={`${item.link}-${index}`} href={item.link}>
              <div className="flex items-center xsm:px-4 justify-center flex-col">
                <div>
                  {" "}
                  <span
                    className={` ${
                      pathname === item.link ? "text-blue-900" : "text-blue-500"
                    }`}
                  >
                    {" "}
                    {item.title}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Mobilenav;
const navItems = [
  {
    title: <FaHome className="h-9 w-9 p-1" />,
    link: "/",
  },
  {
    title: <FaBedPulse className="h-9 w-9 p-1" />,
    link: "/beds",
  },
  {
    title: <FaAmbulance className="h-9 w-9 p-1" />,
    link: "/ambulance",
  },

  {
    title: <LuCalendarClock className="h-9 w-9 p-1" />,
    link: "/appointment",
  },
  {
    title: <RiMoneyRupeeCircleFill className="h-9 w-9 p-1" />,
    link: "/aarogyadhan",
  },
];
