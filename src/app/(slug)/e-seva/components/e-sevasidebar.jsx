"use client";
import React, { useState, useEffect, useRef } from "react";
import { MdDashboard, MdOutlinePrivacyTip } from "react-icons/md";
import { PiPasswordFill, PiShieldCheckBold } from "react-icons/pi";
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
import { TbPencilCheck, TbUserFilled } from "react-icons/tb";


const DashboardSidebar = ({ data, role }) => {
  const router = useRouter();
  const pathname = usePathname();
  const sidebarRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [submenuStates, setSubmenuStates] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [patientEmail, setPatientEmail] = useState("");
  const [fetching, setFetching] = useState(false);


  // Close sidebar when clicking outside
  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const handleFetchPatient = async () => {
    if (!patientEmail) return;
    setFetching(true);
    // Redirect to the update-by-email page with email as query param
    router.push(`/e-seva/dashboard/patientupdateprofile?email=${encodeURIComponent(patientEmail)}`);
    setFetching(false);
    setShowDialog(false);
    setPatientEmail("");
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

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
        router.push("/e-seva/login");
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
      path: `/e-seva/dashboard`,
      icon: <MdDashboard className="h-5 w-5" />,
      roles: ["Eseva", "Asha", "SubAdmin"],
    },
    {
      label: "Register Patients",
      path: `/e-seva/dashboard/register-patients`,
      icon: <TbUserFilled className="h-5 w-5" />,
      roles: ["Eseva", "Asha", "SubAdmin"],
    },
    {
      label: "View Patients",
      path: `/e-seva/dashboard/view-patients`,
      icon: <TbUserFilled className="h-5 w-5" />,
      roles: ["Eseva", "Asha", "SubAdmin"],
    },
    {
      label: "Update Patient Profile",
      path: "#update-patient-profile", // <-- Use a hash to prevent navigation
      icon: <TbUserFilled className="h-5 w-5" />,
      roles: ["Eseva", "Asha", "SubAdmin"],
      action: "openDialog",
    },
    {
      label: "Update Profile",
      path: `/e-seva/dashboard/profile`,
      icon: <TbPencilCheck className="h-5 w-5" />,
      roles: ["Eseva", "Asha"],
    },
    {
      label: "Create SubAdmin",
      path: `/e-seva/dashboard/subadmin`,
      icon: <TbUserFilled className="h-5 w-5" />,
      roles: ["Eseva"],
    },
    {
      label: "View SubAdmin",
      path: `/e-seva/dashboard/viewsubadmin`,
      icon: <TbUserFilled className="h-5 w-5" />,
      roles: ["Eseva"],
    },
    {
      label: "Certificate",
      path: `/e-seva/dashboard/certificate`,
      icon: <IdCard className="h-5 w-5" />,
      roles: ["Eseva", "SubAdmin"],
    },
    {
      label: "Terms & Conditions",
      path: `#`,
      icon: <IoShieldCheckmark className="h-5 w-5" />,
      roles: ["Eseva", "Asha", "SubAdmin"],
      submenu: [
        {
          label: "Terms & Conditions",
          path: `/terms-and-conditions`,
          icon: <PiShieldCheckBold className="h-4 w-4" />,
        },
        {
          label: "Privacy Policy",
          path: `/privacy`,
          icon: <MdOutlinePrivacyTip className="h-4 w-4" />,
        },
      ],
    },
    {
      label: "Change Password",
      path: `/e-seva/dashboard/changepassword`,
      icon: <PiPasswordFill className="h-5 w-5" />,
    },
  ];

  const restrictedLabels = [
    "Register Patients",
    "View Patients",
    "Create SubAdmin",
    "View SubAdmin",
    "Update Patient Profile",
  ];

  const filterNavItems = (items) =>
    items.filter((item) => {
      if (!Array.isArray(item.roles) || !role) return false;
  
      const isRoleAllowed = item.roles.includes(role);
  
      // Check restricted labels against status
      const isRestricted = restrictedLabels.includes(item.label);
      const isApprovedOrActive =
        data?.status === "APPROVED" || data?.status === "ACTIVE";
  
      if (isRestricted && !isApprovedOrActive) {
        return false;
      }
  
      return isRoleAllowed;
    });
  

  const toggleSubmenu = (index) =>
    setSubmenuStates((prev) => ({ ...prev, [index]: !prev[index] }));
  const getButtonClasses = (item) => {
    const isActive =
      pathname === item.path ||
      (item.submenu && item.submenu.some((subItem) => pathname === subItem.path));
    return `flex items-center space-x-2 w-full py-2 rounded-xl ${isActive
      ? "text-[#116aef] font-bold bg-[#e9f2ff]"
      : "text-[#000] hover:text-black"
      }`;
  };

  return (
    <>
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 p-6">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Update Patient Profile
              </h2>
              <button
                onClick={() => setShowDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Input field */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Patient Email
              </label>
              <input
                type="email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 rounded-lg px-4 py-2 outline-none"
                placeholder="patient@example.com"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                className="px-5 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                onClick={() => setShowDialog(false)}
                disabled={fetching}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                onClick={handleFetchPatient}
                disabled={fetching || !patientEmail}
              >
                {fetching ? "Fetching..." : "Fetch Patient Data"}
              </button>
            </div>
          </div>
        </div>
      )}

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
              className="absolute top-0 left-0 w-64 h-full bg-white pt-2 shadow-lg transition-transform duration-300 flex flex-col justify-between"
              style={{
                transform: isOpen ? "translateX(0)" : "translateX(-100%)",
              }}
            >
              <div className="flex-1 overflow-y-auto">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-black"
                >
                  <X className="h-8 w-8" />
                </button>
                <div className="w-12 h-12 relative mx-4 my-2 flex items-center justify-center shadow-lg bg-blue-200 text-black rounded-full">
                  {data?.name?.[0] || ""}
                </div>
                <div className="text-start px-4">
                  <div className="text-[15px] font-semibold text-[#272727]">
                    {data.name}
                  </div>
                  <div className="text-sm text-[#272727]">{data.address}</div>
                </div>
                <hr className="my-2" />
                <div className="flex flex-col space-y-0 px-2">
                  {filterNavItems(navItems).map((item, index) => (
                    <div key={index}>
                      {item.action === "openDialog" ? (
                        <button
                          className={getButtonClasses(item)}
                          onClick={() => setShowDialog(true)}
                          style={{ width: "100%", textAlign: "left" }}
                        >
                          <div className="pl-4 flex items-center space-x-3">
                            <span className="p-2 rounded-[10px] shadow-sm bg-[#e9f2ff] text-black">
                              {item.icon}
                            </span>
                            <span className="text-[14px] text-black">{item.label}</span>
                          </div>
                        </button>
                      ) : (
                        <Link
                          href={item.path}
                          className={getButtonClasses(item)}
                          onClick={() => setActiveIndex(index)}
                        >
                          {/* ...existing link content... */}
                          <div className="pl-4 flex items-center justify-between mr-4 w-full">
                            <div className="flex items-center space-x-3">
                              <span
                                className={`p-2 rounded-[10px] shadow-sm ${pathname === item.path
                                  ? "bg-[#116aef] text-white"
                                  : "bg-[#e9f2ff] text-black"
                                  }`}
                              >
                                {item.icon}
                              </span>
                              <span className="text-[14px] text-black">
                                {item.label}
                              </span>
                            </div>
                            {item.submenu && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  toggleSubmenu(index);
                                }}
                              >
                                {submenuStates[index] ? (
                                  <ChevronUp className="h-5 w-5" />
                                ) : (
                                  <ChevronDown className="h-5 w-5" />
                                )}
                              </button>
                            )}
                          </div>
                        </Link>
                      )}
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
              {/* Logout button */}
              <div className="p-4 border-t">
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
          className={`bg-[#fff] fixed top-0 left-0 pt-20 min-h-screen h-full shadow-xl flex flex-col justify-between ${isCollapsed ? "w-[5rem]" : "w-[15rem]"
            }`}
          ref={sidebarRef}
        >
          {/* Top part: Profile + Menu */}
          <div className="flex-1 overflow-y-auto">
            {!isCollapsed && (
              <div className="flex items-start pl-2 space-x-2 w-full">
                {data.name ? (
                  <div className="w-12 h-12 relative">
                    <span className="flex items-center justify-center shadow-lg p-2 h-12 w-12 bg-blue-200 text-black rounded-full">
                      {data?.name[0] || ""}
                    </span>
                  </div>
                ) : (
                  <p className="p-2 rounded-xl border-white text-white border font-semibold text-[12px] bg-red-600">
                    Please Fill your Complete Details
                  </p>
                )}
                <div className="text-start">
                  <div className="text-[15px] font-semibold text-[#272727]">
                    {data.name}
                  </div>
                  <div className="text-sm text-[#272727]">{data.address}</div>
                </div>
              </div>
            )}
            <hr className="my-2" />
            <div className="flex flex-col space-y-0">
              {filterNavItems(navItems).map((item, index) => (
                <div key={index}>
                  {item.action === "openDialog" ? (
                    <button
                      className={getButtonClasses(item)}
                      onClick={() => setShowDialog(true)}
                      style={{ width: "100%", textAlign: "left" }}
                    >
                      <div className="pl-4 flex items-center space-x-3">
                        <span className="p-2 rounded-[10px] shadow-sm bg-[#e9f2ff] text-black">
                          {item.icon}
                        </span>
                        <span className="text-[14px]">{item.label}</span>
                      </div>
                    </button>
                  ) : (
                    <Link
                      href={item.path}
                      className={getButtonClasses(item)}
                      onClick={() => setActiveIndex(index)}
                    >
                      {/* ...existing link content... */}
                      <div className="pl-4 flex justify-between items-center w-full">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`p-2 rounded-[10px] shadow-sm ${pathname === item.path
                              ? "bg-[#116aef] text-white"
                              : "bg-[#e9f2ff]"
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
                  )}
                  {item.submenu && submenuStates[index] && (
                    <div className="ml-2 mt-0 flex flex-col space-y-0">
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.path}
                          className={`flex items-center space-x-2 pl-4 py-2 w-full rounded-xl ${pathname === subItem.path
                            ? "text-[#116aef] font-bold bg-[#e9f2ff]"
                            : "text-[#000] hover:text-black"
                            }`}
                        >
                          <span
                            className={`p-2 rounded-[10px] shadow-sm ${pathname === subItem.path
                              ? "bg-[#116aef] text-white"
                              : "bg-[#e9f2ff]"
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
              ))}
            </div>
          </div>

          {/* Logout button fixed at bottom */}
          <div className="p-4 border-t">
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
