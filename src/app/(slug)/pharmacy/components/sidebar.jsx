"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  MdDashboard,
  MdEditDocument,
  MdOutlinePrivacyTip,
} from "react-icons/md";
import { PiPasswordFill, PiShieldCheckBold } from "react-icons/pi";
import { IoShieldCheckmark } from "react-icons/io5";
import {
  IdCard,
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
        router.push("/pharmacy/login");
      } else {
        console.error("Logout failed: ", await response.json());
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Pharmacy NavItems
  const navItems = [
    {
      label: "Dashboard",
      path: `/pharmacy/dashboard`,
      icon: <MdDashboard className="h-5 w-5" />,
    },
    {
      label: "Your Profile",
      path: `/pharmacy/dashboard/profile`,
      icon: <TbUserFilled className="h-5 w-5" />,
    },
    {
      label: "Online Orders",
      path: `/pharmacy/dashboard/order`,
      icon: <LuCalendarClock className="h-5 w-5" />,
    },
    {
      label: "Certificate",
      path: ``,
      icon: <IdCard className="h-5 w-5" />,
    },
    {
      label: "Update Documents",
      path: ``,
      icon: <MdEditDocument className="h-5 w-5" />,
    },
    {
      label: "Terms & Conditions",
      path: "#",
      icon: <IoShieldCheckmark className="h-5 w-5" />,
      submenu: [
        {
          label: "Terms & Conditions",
          path: `/terms-and-conditions`,
          icon: <PiShieldCheckBold className="h-4 w-4" />,
        },
        {
          label: "Privacy Policy",
          path: ``,
          icon: <MdOutlinePrivacyTip className="h-4 w-4" />,
        },
      ],
    },
    {
      label: "Change Password",
      path: `/pharmacy/dashboard/changepassword`,
      icon: <PiPasswordFill className="h-5 w-5" />,
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

  return (
    <>
      <div className="lg:block hidden">
        <div
          className={`bg-white fixed pt-20 min-h-screen left-0 h-full overflow-y-auto shadow-xl flex flex-col transition-all duration-300 ${
            isCollapsed ? "w-[5rem]" : "w-[15rem]"
          }`}
          ref={sidebarRef}
        >
          {/* ✅ Pharmacy Profile Section */}
{!isCollapsed && (
  <div className="flex items-start pl-2 space-x-2 w-full">
    <div className="w-12 h-12 relative">
      {data?.pharmacydetails?.logo ? (
        <Image
          src={data.pharmacydetails.logo}
          alt="Logo"
          layout="fill"
          className="rounded-full object-cover"
        />
      ) : (
        <span className="flex items-center justify-center shadow-lg p-2 h-12 w-12 bg-blue-200 text-white rounded-full font-bold">
          P
        </span>
      )}
    </div>
    <div className="text-start">
      <div className="text-[15px] font-semibold text-[#272727]">
        {data?.pharmacydetails?.regname || "Pharmacy Name"}
      </div>
    </div>
  </div>
)}


          <hr className="my-2" />

          {/* ✅ Sidebar NavItems */}
          <div className="flex flex-col space-y-0">
            {navItems.map((item, index) => {
              const submenu = item.submenu;

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
    </>
  );
};

export default DashboardSidebar;
