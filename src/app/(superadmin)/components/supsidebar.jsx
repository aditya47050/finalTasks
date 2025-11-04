"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Calendar,
  Bed,
  Ambulance,
  IdCard,
  User2Icon,
  ChartArea,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { FaFileSignature, FaHandHoldingHeart, FaHandshake, FaHospitalAlt, FaUserTie } from "react-icons/fa";
import { FaBuildingShield, FaMessage } from "react-icons/fa6";

const SuperDashboardSidebar = ({ userdata }) => {
  const pathname = usePathname();
  const sidebarRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [submenuStates, setSubmenuStates] = useState({}); // To track submenu states

  // Sidebar items configuration
  const navItems = [
    {
      label: "Dashboard",
      path: `/superprofile/dashboard`,
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "Overview",
      path: `/superprofile`,
      icon: <ChartArea className="h-5 w-5" />,
    },
    {
      label: "Free Appointments",
      path: `/superprofile/bookfreeappointment`,
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: "Bed Booking",
      path: `/superprofile/bedbooking`,
      icon: <Bed className="h-5 w-5" />,
    },
    {
      label: "Ambulance",
      path: `#`,
      icon: <Ambulance className="h-5 w-5" />,
      submenu: [
        {
          label: "Emergency Ambulance",
          path: `/superprofile/emergencyambulance`,
          icon: <Ambulance className="h-5 w-5" />,
        },
        {
          label: "Book Ambulance",
          path: `/superprofile/bookambulance`,
          icon: <Ambulance className="h-5 w-5" />,
        },
      ],
    },
    {
      label: "Health Card",
      path: `/superprofile/applyhealthcard`,
      icon: <IdCard className="h-5 w-5" />,
    },

    {
      label: "Enquiries",
      path: `#`,
      icon: <HelpCircle className="h-5 w-5" />,
      submenu: [
        {
          label: "Business Partnership",
          path: `/superprofile/business-partnership`,
          icon: <FaHandshake className="h-5 w-5" />,
        },
        {
          label: "Careers",
          path: `/superprofile/careers-enq`,
          icon: <FaUserTie className="h-5 w-5" />,
        },
        {
          label: "Contact Us",
          path: `/superprofile/contact-us`,
          icon: <FaMessage className="h-5 w-5" />,
        },
        // {
        //   label: "Aarogya Mitra",
        //   path: `/superprofile/aarogya-mitra`,
        //   icon: <FaHandshake className="h-5 w-5" />,
        // },
        {
          label: "Aarogya Mitra",
          path: `/superprofile/aarogyamitraenq`,
          icon: <FaHandshake className="h-5 w-5" />,
        }, {
          label: "HSP Portal",
          path: `/superprofile/hsp-portal-enq`,
          icon: <FaHospitalAlt className="h-5 w-5" />,
        },
        {
          label: "Corporate Health",
          path: `/superprofile/corporate-health-enq`,
          icon: <FaBuildingShield className="h-5 w-5" />,
        },
        {
          label: "Teleradiology",
          path: `/superprofile/teleradiology-enq`,
          icon: <FaFileSignature className="h-5 w-5" />,
        },
        {
          label: "Aarogya-Dhan",
          path: `/superprofile/aarogya-dhan-enq`,
          icon: <FaHandHoldingHeart className="h-5 w-5" />,
        },
      ],
    },
  ];

  const toggleSubmenu = (index) => {
    setSubmenuStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getButtonClasses = (index) =>
    `flex items-center space-x-2 w-full py-2 rounded-xl ${
      pathname === navItems[index].path
        ? "text-[#116aef] font-bold bg-[#e9f2ff]"
        : "text-[#00000] hover:text-black"
    }`;

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="lg:hidden block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-[#243460] rounded-md focus:outline-none"
        >
          <Menu className="h-6 w-6" color="#fff" />
        </button>
        {isOpen && (
          <div className="fixed inset-0 mt-0 bg-black bg-opacity-50 z-50">
            <div className="absolute top-0 left-0 w-64 h-full bg-white pt-2 shadow-lg">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-black"
              >
                <X className="h-8 w-8" />
              </button>
              <div className="flex pl-2 space-x-2 w-full">
                <div className="w-12 h-12 relative">
                  {userdata.image ? (
                    <Image
                      src={userdata.image}
                      alt="Profile Image"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  ) : (
                    <span className="flex items-center justify-center shadow-lg p-2 h-12 w-12 bg-blue-200 text-black rounded-full">
                      {userdata.name[0]}
                    </span>
                  )}
                </div>
                <div className="text-start">
                  <div className="text-[15px] font-semibold text-[#272727]">
                    {userdata.name || "John Doe"}
                  </div>
                  <div className="text-sm text-[#272727]">
                    {userdata.role || "Software Engineer"}
                  </div>
                </div>
              </div>
              <hr className="my-2" />
              <div className="flex flex-col space-y-0">
                {navItems.map((item, index) => (
                  <div key={index}>
                    <Link
                      href={item.path}
                      className={getButtonClasses(index)}
                      onClick={() => setActiveIndex(index)}
                    >
                      <div className="pl-4 flex items-center justify-between mr-4 w-full">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`${
                              pathname === navItems[index].path
                                ? "bg-[#116aef] p-2 text-white rounded-[10px] shadow-sm"
                                : "bg-[#e9f2ff] text-black p-2 rounded-[10px] shadow-sm"
                            }`}
                          >
                            {item.icon}
                          </span>
                          {!isCollapsed && (
                            <span className="text-[14px] text-black">
                              {item.label}
                            </span>
                          )}
                        </div>
                        {item.submenu && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleSubmenu(index);
                            }}
                            className=""
                          >
                            {submenuStates[index] ? (
                              <ChevronUp className="h-5 w-5" color="#000" />
                            ) : (
                              <ChevronDown className="h-5 w-5" color="#000" />
                            )}
                          </button>
                        )}
                      </div>
                    </Link>
                    {item.submenu && submenuStates[index] && (
                      <div className="ml-8 mt-1 flex flex-col space-y-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.path}
                            className="text-sm ml-2 text-gray-700 hover:text-black"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Sidebar for larger screens */}
      <div className="lg:block hidden">
        <div
          className={`bg-[#fff] fixed pt-16 min-h-screen overflow-auto left-0 h-full shadow-xl flex flex-col space-y-2 ${
            isCollapsed ? "w-[5rem]" : "min-[1000px]:w-[14rem] min-[1100px]:w-[15rem]"
          }`}
          ref={sidebarRef}
        >
          {!isCollapsed && (
            <div className="flex items-center justify-start pl-4 space-x-4 w-full">
              <div className="w-12 h-12 relative">
                {userdata.image ? (
                  <Image
                    src={userdata.image}
                    alt="Profile Image"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                ) : (
                  <span className="flex items-center justify-center shadow-lg p-2 h-12 w-12 bg-blue-200 text-black rounded-full">
                    {userdata.name[0]}
                  </span>
                )}
              </div>
              <div className="text-start">
                <div className="text-[15px] font-semibold text-[#272727]">
                  {userdata.name || "John Doe"}
                </div>
                <div className="text-sm text-[#272727]">
                  {userdata.role || "Software Engineer"}
                </div>
              </div>
            </div>
          )}

          <hr />

          <div className="flex flex-col space-y-0">
            {navItems.map((item, index) => (
              <div key={index}>
                {/* Parent Item */}
                <Link
                  href={item.path}
                  className={getButtonClasses(index)}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="pl-4 flex justify-between items-center  w-full">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`${
                          pathname === item.path
                            ? "bg-[#116aef] p-2 text-white rounded-[10px] shadow-sm"
                            : "bg-[#e9f2ff] p-2 rounded-[10px] shadow-sm"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span className="text-[14px]">{item.label}</span>
                      )}
                    </div>
                    {item.submenu && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleSubmenu(index);
                        }}
                        className=""
                      >
                        {submenuStates[index] ? (
                          <ChevronLeft className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                </Link>

                {/* Submenu Items */}
                {item.submenu && submenuStates[index] && (
                  <div className="ml-6 mt-2 flex flex-col space-y-0">
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.path}
                        className={`flex items-center space-x-3 pl-4 py-2 w-full rounded-xl ${
                          pathname === subItem.path
                            ? "text-[#116aef] font-bold bg-[#e9f2ff]"
                            : "text-[#00000] hover:text-black"
                        }`}
                      >
                        <span
                          className={`${
                            pathname === subItem.path
                              ? "bg-[#116aef] p-2 text-white rounded-[10px] shadow-sm"
                              : "bg-[#e9f2ff] p-2 rounded-[10px] shadow-sm"
                          }`}
                        >
                          {subItem.icon || <ChevronRight className="h-4 w-4" />}
                        </span>
                        {!isCollapsed && (
                          <span className="text-[14px]">{subItem.label}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto flex items-center space-x-4 px-4 py-2 border-t">
            <Image
              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1727068100/Icons/dashboard%20icons/fnuz7jkoykku5s77mlvc.png"
              alt="Logout Icon"
              width={24}
              height={24}
              className="h-5 w-5"
            />
            <button
              onClick={() => signOut()}
              className="text-gray-600 hover:text-red-600 font-bold"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperDashboardSidebar;
