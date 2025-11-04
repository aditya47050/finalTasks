"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  MdDashboard,
  MdEditDocument,
  MdFamilyRestroom,
  MdOutlinePrivacyTip,
} from "react-icons/md";
import { PiPasswordFill, PiShieldCheckBold } from "react-icons/pi";
import { FaBookMedical, FaClipboardList } from "react-icons/fa";
import { IoShieldCheckmark } from "react-icons/io5";
import {
  LayoutDashboard,
  IdCard,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  LogOutIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import { HiDocument } from "react-icons/hi2";
import { IoLogOutSharp } from "react-icons/io5";
import { TbUserFilled } from "react-icons/tb";

const DashboardSidebar = ({ data }) => {
  const router = useRouter();
  const pathname = usePathname();
  const sidebarRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [submenuStates, setSubmenuStates] = useState({});
  const [loading, setLoading] = useState(false);

  // Close sidebar when clicking outside
  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  // Listen for click events outside the sidebar when it's open
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    // Ask for confirmation before proceeding with logout
    const confirmed = window.confirm("Are you sure you want to log out?");

    if (!confirmed) {
      return; // If the user cancels, do nothing and return early
    }

    setLoading(true);

    try {
      const response = await fetch("/api/kickback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Optionally refresh the page or clear any session data here
        router.push("/patient/login"); // Redirect to homepage after logout
      } else {
        console.error("Logout failed: ", await response.json());
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    {
      label: "Dashboard",
      path: `/brother/dashboard`,
      icon: <MdDashboard className="h-5 w-5" />,
    },
    {
      label: "Your Profile",
      path: `/patient/dashboard/profile`,
      icon: <TbUserFilled className="h-5 w-5" />,
    },
    
    {
      label: "HSP Certificate",
      path: `/patient/dashboard/digitalhealthcard`,
      icon: <IdCard className="h-5 w-5" />,
    },
    {
      label: "Terms & Conditions",
      path: `/patient/dashboard/update-documents`,
      icon: <IoShieldCheckmark className="h-5 w-5" />,
    },
   
    {
      label: "Change Password",
      path: `/brother/dashboard/changepassword`,
      icon: <PiPasswordFill className="h-5 w-5" />,
    },
    // {
    //   label: "Log Out",
    //   path: "#",
    //   icon: <IoLogOutSharp className="h-5 w-5" />,
    //   onClick: handleLogout,
    // },
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
      {/* Mobile Sidebar */}
      <div className="lg:hidden block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-[#243460] rounded-md focus:outline-none"
        >
          <Menu className="h-6 w-6" color="#fff" />
        </button>
        {isOpen && (
          <div className="fixed inset-0 mt-0 bg-black bg-opacity-50 z-50">
            <div
              ref={sidebarRef}
              className="absolute top-0 left-0 w-64 h-full bg-white pt-2 shadow-lg transition-transform duration-300 ease-in-out transform"
              style={{
                transform: isOpen ? "translateX(0)" : "translateX(-100%)",
              }}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-black"
              >
                <X className="h-8 w-8" />
              </button>
              <div className="flex pl-2 space-x-2 w-full">
                <div className="w-12 h-12 relative">
                  {data?.passportPhoto ? (
                    <Image
                      src={data.passportPhoto}
                      alt="Profile Image"
                      layout="fill"
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex items-center justify-center shadow-lg p-2 h-12 w-12 bg-blue-200 text-black rounded-full">
                      {/* {data?.firstName[0] || ""} */}
                    </span>
                  )}
                </div>
                <div className="text-start">
                  <div className="text-[15px] font-semibold text-[#272727]">
                    {data.firstName}
                  </div>
                  <div className="text-sm text-[#272727]">{data.city}</div>
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
              {/* Logout Button for Mobile */}
              <div className="mt-auto px-4 py-3">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-4 text-white bg-red-600 hover:bg-red-700 rounded-xl"
                >
                  <LogOutIcon className="h-5 w-5" />
                  <span>{loading ? "Logging out..." : "Logout"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="lg:block hidden">
        <div
          className={`bg-[#fff] fixed pt-20 min-h-screen  left-0 h-full overflow-scroll shadow-xl flex flex-col space-y-2 transition-all duration-300 ${
            isCollapsed ? "w-[5rem]" : "w-[15rem]"
          }`}
          ref={sidebarRef}
        >
          {!isCollapsed && (
            <div className="flex items-start pl-2 space-x-2 w-full">
              {data.firstName ? (
                <div className="w-12 h-12 relative">
                  {data.passportPhoto ? (
                    <Image
                      src={data.passportPhoto}
                      alt="Profile Image"
                      layout="fill"
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex items-center justify-center shadow-lg p-2 h-12 w-12 bg-blue-200 text-black rounded-full">
                      {/* {data?.firstName[0]||""} */}
                    </span>
                  )}
                </div>
              ) : (
                <p className="p-2 rounded-xl border-white text-white border font-semibold text-[12px] bg-red-600">
                  Please Fill your Complete Details
                </p>
              )}
              <div className="text-start">
                <div className="text-[15px] font-semibold text-[#272727]">
                  {data.firstName}
                </div>
                <div className="text-sm text-[#272727]">{data.city}</div>
              </div>
            </div>
          )}
          <hr />

          <div className="flex flex-col space-y-0">
            {navItems.map((item, index) => (
              <div key={index}>
                <Link
                  href={item.path}
                  className={getButtonClasses(index)}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="pl-4 flex justify-between items-center w-full">
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
                        className=" "
                      >
                        {submenuStates[index] ? (
                          <ChevronUp className="h-5 w-5 mr-2" />
                        ) : (
                          <ChevronRight className="h-5 w-5 mr-2" />
                        )}
                      </button>
                    )}
                  </div>
                </Link>
                {item.submenu && submenuStates[index] && (
                  <div className="ml-2 mt-0 flex flex-col space-y-0">
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.path}
                        className={`flex items-center space-x-2 pl-4 py-2 w-full rounded-xl ${
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
          {/* Logout Button for Desktop */}
          <div className="mt-auto px-4 py-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-2 px-4 text-white bg-red-600 hover:bg-red-700 rounded-xl"
            >
              <LogOutIcon className="h-5 w-5" />
              <span>{loading ? "Logging out..." : "Logout"}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
