"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  MdDashboard,
  MdEditDocument,
  MdOutlinePrivacyTip,
} from "react-icons/md";
import { PiPasswordFill, PiShieldCheckBold } from "react-icons/pi";
import { FaInfo } from "react-icons/fa";
import { IoShieldCheckmark } from "react-icons/io5";
import {
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
import { TbUserFilled } from "react-icons/tb";
import { FaBedPulse } from "react-icons/fa6";
import { LuCalendarClock } from "react-icons/lu";

const DashboardSidebar = ({ data }) => {
  const router = useRouter();
  const pathname = usePathname();
  const sidebarRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [submenuStates, setSubmenuStates] = useState({});
  const [loading, setLoading] = useState(false);

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

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch("/api/kickback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        router.push("/hospital/login");
      } else {
        console.error("Logout failed: ", await response.json());
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  // === 🧠 Role-Based Navigation Items ===
  const navItems = [
    {
      label: "Dashboard",
      path: `/hospital/dashboard`,
      icon: <MdDashboard className="h-5 w-5" />,
      roles: [
        "Hospital",
        "Clinic",
        "homehealthcare",
        "Pathology",
        "DiagnosticCenter",
      ],
    },
    {
      label: "Your Profile",
      path: `/hospital/dashboard/profile`,
      icon: <TbUserFilled className="h-5 w-5" />,
      roles: [
        "Hospital",
        "Clinic",
        "homehealthcare",
        "Pathology",
        "DiagnosticCenter",
      ],
    },
    {
      label: "Beds",
      path: `/hospital/dashboard/beds`,
      icon: <FaBedPulse className="h-5 w-5" />,
      roles: ["Hospital"], // Only hospitals manage beds
    },
    {
      label: "Services",
      path: `/hospital/dashboard/diagnostic-services`,
      icon: <FaBedPulse className="h-5 w-5" />,
      roles: ["DiagnosticCenter"], 
    },
    {
      label: "Bookings",
      path: `/hospital/dashboard/diagnostic-bookings`,
      icon: <LuCalendarClock className="h-5 w-5" />,
      roles: ["DiagnosticCenter"],
    },
    {
      label: "Bookings",
      path: `/hospital/dashboard/bookings`,
      icon: <LuCalendarClock className="h-5 w-5" />,
      roles: ["Pathology"], 
    },
    {
      label: "Services",
      path: `/hospital/dashboard/homehealthcare-services`,
      icon: <FaBedPulse className="h-5 w-5" />,
      roles: ["homehealthcare"],
    },
    {
      label: "Services",
      path: `/hospital/dashboard/pathology-services`,
      icon: <FaBedPulse className="h-5 w-5" />,
      roles: ["Pathology"],
    },
    {
      label: "Bookings",
      path: `/hospital/dashboard/homehealthcareservices`,
      icon: <LuCalendarClock className="h-5 w-5" />,
      roles: ["homehealthcare"],
    },
    {
      label: "Certificate",
      path: `/hospital/dashboard/certificate`,
      icon: <IdCard className="h-5 w-5" />,
      roles: [
        "Hospital",
        "Clinic",
        "homehealthcare",
        "Pathology",
        "DiagnosticCenter",
      ],
    },
    {
      label: "Contact Information",
      path: "",
      icon: <FaInfo className="h-5 w-5" />,
      roles: [
        "Hospital",
        "Clinic",
        "homehealthcare",
        "Pathology",
        "DiagnosticCenter",
      ],
      submenu: [
        {
          label: "Department Contact info",
          path: `/hospital/dashboard/department-contact`,
          icon: <PiShieldCheckBold className="h-4 w-4" />,
          roles: [
            "Hospital",
            "Clinic",
            "homehealthcare",
            "Pathology",
            "DiagnosticCenter",
          ],
        },
        {
          label: "Team Matrix Escalation",
          path: `/hospital/dashboard/team-escalation`,
          icon: <MdOutlinePrivacyTip className="h-4 w-4" />,
          roles: [
            "Hospital",
            "Clinic",
          ],
        },
        {
          label: "Receptionists",
          path: `/hospital/dashboard/department-contact/receptionist`,
          icon: <PiShieldCheckBold className="h-4 w-4" />,
          roles: [
            "Hospital",
            "Clinic",
            "homehealthcare",
            "Pathology",
            "DiagnosticCenter",
          ],
        },
      ],
    },
    {
      label: "Update Documents",
      path: `/hospital/dashboard/update-documents`,
      icon: <MdEditDocument className="h-5 w-5" />,
      roles: [
        "Hospital",
        "Clinic",
        "homehealthcare",
        "Pathology",
        "DiagnosticCenter",
      ],
    },
    {
      label: "Terms & Conditions",
      path: "/terms-and-conditions",
      icon: <IoShieldCheckmark className="h-5 w-5" />,
      roles: [
        "Hospital",
        "Clinic",
        "homehealthcare",
        "Pathology",
        "DiagnosticCenter",
      ],
      submenu: [
        {
          label: "Terms & Conditions",
          path: `/terms-and-conditions`,
          icon: <PiShieldCheckBold className="h-4 w-4" />,
          roles: [
            "Hospital",
            "Clinic",
            "homehealthcare",
            "Pathology",
            "DiagnosticCenter",
          ],
        },
        {
          label: "Privacy Policy",
          path: `/privacy`,
          icon: <MdOutlinePrivacyTip className="h-4 w-4" />,
          roles: [
            "Hospital",
            "Clinic",
            "homehealthcare",
            "Pathology",
            "DiagnosticCenter",
          ],
        },
      ],
    },
    {
      label: "Change Password",
      path: `/hospital/dashboard/changepassword`,
      icon: <PiPasswordFill className="h-5 w-5" />,
      roles: [
        "Hospital",
        "Clinic",
        "homehealthcare",
        "Pathology",
        "DiagnosticCenter",
      ],
    },
  ];

  // === 🧠 Filter nav items based on current user's role ===
  const filteredNavItems = navItems.filter((item) =>
    item.roles?.includes(data?.role)
  );
  const toggleSubmenu = (index) => {
    setSubmenuStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getButtonClasses = (index) =>

    `flex items-center space-x-2 w-full py-2 rounded-xl ${pathname === filteredNavItems[index].path || filteredNavItems[index].path === "#" 
      ? "text-[#116aef] font-bold bg-[#e9f2ff]"
      : "text-[#00000] hover:text-black"
    }`;

  return (
    <>
      {/* Sidebar for both Mobile & Desktop */}
      {/** You can keep your current sidebar rendering logic here **/}

      {/* Example: Desktop Sidebar */}
      <div className="lg:block hidden">
        <div
          className={`bg-white fixed pt-20 min-h-screen left-0 h-full overflow-y-auto shadow-xl flex flex-col transition-all duration-300 ${isCollapsed ? "w-[5rem]" : "w-[15rem]"
            }`}
          ref={sidebarRef}
        >
          {!isCollapsed && data?.hspInfo?.regname && (
            <div className="flex items-start pl-2 space-x-2 w-full">
              <div className="w-12 h-12 relative">
                {data.hspdetails?.hsplogo ? (
                  <Image
                    src={data.hspdetails.hsplogo}
                    alt="Logo"
                    layout="fill"
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center shadow-lg p-2 h-12 w-12 bg-blue-200 text-black rounded-full" />
                )}
              </div>
              <div className="text-start">
                <div className="text-[15px] font-semibold text-[#272727]">
                  {data.hspInfo?.regname}
                </div>
              </div>
            </div>
          )}

          <hr className="my-2" />

          <div className="flex flex-col space-y-0">
            {filteredNavItems.map((item, index) => {
              const submenu = item.submenu?.filter((sub) =>
                sub.roles?.includes(data?.role)
              );

              return (
                <div key={index}>
                  <Link
                    href={item.path}
                    className={getButtonClasses(index)}
                    onClick={() => setActiveIndex(index)}
                  >
                    <div className="pl-4 flex justify-between items-center w-full">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`${pathname === item.path
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
                      {submenu?.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSubmenu(index);
                          }}
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

                  {submenuStates[index] && submenu?.length > 0 && (
                    <div className="ml-4 mt-0 flex flex-col space-y-0">
                      {submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.path}
                          className={`flex items-center space-x-2 pl-4 py-2 w-full rounded-xl ${pathname === subItem.path
                              ? "text-[#116aef] font-bold bg-[#e9f2ff]"
                              : "text-[#00000] hover:text-black"
                            }`}
                        >
                          <span
                            className={`${pathname === subItem.path
                                ? "bg-[#116aef] p-2 text-white rounded-[10px] shadow-sm"
                                : "bg-[#e9f2ff] p-2 rounded-[10px] shadow-sm"
                              }`}
                          >
                            {subItem.icon || (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </span>
                          {!isCollapsed && (
                            <span className="text-[14px]">{subItem.label}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Logout */}
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
                {filteredNavItems.map((item, index) => (
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
    </>
  );
};

export default DashboardSidebar;
