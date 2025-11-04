"use client";
import React, { useEffect, useRef, useState } from "react";
import { Home, Calendar, Bed, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBedPulse, FaBuildingShield } from "react-icons/fa6";
// Import components directly at the top
import ApplyHealthCard from "./applyhcard";
import Bedbook from "./bedbook";
import BookAmbulance from "./ambulance";
import Formitems from "./formitems";
import { TbBriefcaseFilled } from "react-icons/tb";
import { FaHandshake } from "react-icons/fa6";
import { FaAmbulance, FaHospitalAlt } from "react-icons/fa";
import { FaFileSignature } from "react-icons/fa";
const MainSidebar = ({ doctorcategory, hospital }) => {
  const pathname = usePathname();

  const sidebarRef = useRef(null);
  const [buttonStates, setButtonStates] = useState(null);

  // Sidebar items configuration, using components directly
  const sidebarItems = [
    { name: "Apply Health Card", component: <ApplyHealthCard /> },
    {
      name: "Book Ambulance",
      icon: (
        <FaAmbulance className="md:h-6 md:w-6  xl:h-[25px] xl:w-[25px] p-1" />
      ),
      path: "/ambulance",
    },
    {
      name: "Form Items",
      component: <Formitems doctorcategory={doctorcategory} />,
    },
    {
      name: "Bed Booking",
      icon: (
        <FaBedPulse className="md:h-6 md:w-6  xl:h-[25px] xl:w-[25px] p-1" />
      ),
      path: "/beds",
    },
    {
      name: "Aarogya Mitra",
      icon: (
        <FaHandshake className="md:h-6 md:w-6  xl:h-[25px] xl:w-[25px] p-1" />
      ),
      path: "/aarogya-mitra",
    },
    {
      name: "HSP Portal",
      icon: (
        <FaHospitalAlt className="md:h-6 md:w-6  xl:h-[25px] xl:w-[25px] p-1" />
      ),
      path: "/hsp-portal",
    },
    {
      name: "Corporate Health",
      icon: (
        <FaBuildingShield className="md:h-6 md:w-6  xl:h-[25px] xl:w-[25px] p-1" />
      ),
      path: "/corporate-health",
    },
    {
      name: "Tele Radiology",
      icon: (
        <FaFileSignature className="md:h-6 md:w-6  xl:h-[25px] xl:w-[25px] p-1" />
      ),
      path: "/teleradiology",
    },
    {
      name: "Job Portal",
      icon: (
        <TbBriefcaseFilled className="md:h-6 md:w-6  xl:h-[25px] xl:w-[25px] p-1" />
      ),
      path: "/job-portal",
    },
  ];

  // Handle click outside the sidebar
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setButtonStates(null); // Reset the active button state
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleClick = (buttonId) => setButtonStates(buttonId);

  // Classes for active and inactive states
  const getButtonClasses = (buttonId, isLink) =>
    `${
      buttonStates === buttonId ? "text-[#00008B] font-bold" : "text-gray-600"
    } ${
      isLink ? "hover:text-black" : ""
    } hover:text-black flex flex-col items-center`;

  return (
    <div className="hidden lg:block ">
      {" "}
      <div
        ref={sidebarRef}
        className="bg-white xl:z-[999]   md:z-[999] fixed top-0 left-0 px-0 h-full border-r border-2 side-bar-text-size side-bar-lg-text xl:text-[8px] xlg:text-[10px] flex flex-col items-center custom-sidebar-spacing min-h-screen overflow-auto lg:pt-0 xl:pt-4 xlg:pt-4 min-[1000px]:w-12 min-[1100px]:w-16 xl:w-16 xlg:w-20"
      >
        {/* Render Sidebar Items */}
        {sidebarItems.map((item, index) =>
          item.component ? (
            // Component items (without links)
            <div
              key={item.name}
              className={getButtonClasses(index, false)}
              onClick={() => handleClick(index)}
            >
              {item.component}
            </div>
          ) : (
            // Link items (with paths)
            <Link
              key={item.name}
              href={item.path}
              className={`${
                pathname === item.path
                  ? "text-[#00008B] font-bold"
                  : "text-gray-600"
              } hover:text-black flex flex-col items-center text-center `}
            >
              <span
                className={`${
                  pathname === item.path
                    ? "text-[#00008B] font-bold"
                    : "text-gray-600"
                } hover:text-black flex flex-col items-center text-center `}
              >
                {item.icon}
              </span>
              <span className="text-center">
                {item.name.split(" ")[0]}
                <br />
                {item.name.split(" ")[1]}
              </span>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default MainSidebar;
