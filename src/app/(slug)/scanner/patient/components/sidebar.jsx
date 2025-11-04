// src/app/(slug)/scanner/patient/components/sidebar.jsx
"use client";
import React, { useState, useRef } from "react";
import { LogOutIcon, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const SidebarContent = ({
  allowedItems,
  pathname,
  handleLogout,
  loading,
  data,
  role,
  onNavigate,
}) => (
  <>
    {/* User Profile */}
    <div className="flex items-center p-4 space-x-2">
      <div className="w-12 h-12 relative">
        {data?.image ? (
          <Image
            src={data.image}
            alt="User Profile"
            layout="fill"
            className="rounded-full object-cover"
          />
        ) : (
          <span className="flex items-center justify-center shadow-lg p-2 h-12 w-12 bg-blue-200 text-black rounded-full" />
        )}
      </div>
      <div className="text-start">
        <div className="text-[15px] font-semibold text-[#272727]">
          {role || "User Name"}
        </div>
        <div className="text-[13px] text-gray-500 break-words max-w-[10rem]">
          {data?.email || "user@example.com"}
        </div>
      </div>
    </div>
    <hr className="my-2" />
    {/* Navigation */}
    <div className="flex flex-col space-y-0">
      {allowedItems.map((item, index) => (
        <Link
          key={index}
          href={item.path}
          className={`flex items-center space-x-2 w-full py-2 rounded-xl ${pathname === item.path
              ? "text-[#116aef] font-bold bg-[#e9f2ff]"
              : "text-[#000000] hover:text-black"
            }`}
          onClick={onNavigate}
        >
          <div className="pl-4 flex justify-between items-center w-full">
            <span className="text-[14px]">{item.label}</span>
          </div>
        </Link>
      ))}
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
  </>
);

const DashboardSidebar = ({ patientId, role, data }) => {
  const router = useRouter();
  const pathname = usePathname();
  const sidebarRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    setLoading(true);
    try {
      const response = await fetch("/api/kickback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) router.push("/hospital/login");
      else console.error("Logout failed:", await response.json());
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Navigation items with roles
  const navItems = [
    { label: "Patient Profile", path: `/scanner/patient/${patientId}`, roles: ["Doctor", "Hospital", "Clinic", "homehealthcare", "receptionist", "DiagnosticCenter", "Pathology", "Pharmacy"] },
    { label: "View Appointments", path: `/scanner/patient/${patientId}/appointment`, roles: ["Doctor", "Hospital", "Clinic", "homehealthcare", "receptionist"] },
    { label: "View Ambulance Booking", path: `/scanner/patient/${patientId}/ambulancebooking`, roles: ["Hospital", "receptionist"] },
    { label: "View Bed Booking", path: `/scanner/patient/${patientId}/bedbooking`, roles: ["Hospital", "receptionist"] },
    { label: "View Blood Booking", path: `/scanner/patient/${patientId}/bloodbank`, roles: ["Doctor", "Hospital", "receptionist"] },
    { label: "View Home HealthCare Booking", path: `/scanner/patient/${patientId}/bookhomehealthcare`, roles: ["Hospital", "receptionist"] },
    { label: "View Diagnostic Center Booking", path: `/scanner/patient/${patientId}/diagnosticcenter`, roles: ["Doctor", "Hospital", "receptionist", "DiagnosticCenter"] },
    { label: "View Health Insurance", path: `/scanner/patient/${patientId}/healthinsurance`, roles: ["Hospital", "receptionist"] },
    { label: "Pathology", path: `/scanner/patient/${patientId}/pathology`, roles: ["Doctor", "Hospital", "receptionist", "Pathology"] },
    { label: "Pharmacy Order", path: `/scanner/patient/${patientId}/pharmacy-order`, roles: ["Doctor", "Hospital", "receptionist", "Pharmacy"] },
    { label: "Surgery Booking", path: `/scanner/patient/${patientId}/surgeryschedule`, roles: ["Doctor", "Hospital", "Clinic", "receptionist"] },
    { label: "Treatment Booking", path: `/scanner/patient/${patientId}/treatmentschedule`, roles: ["Doctor", "Hospital", "Clinic", "receptionist"] },
    { label: "Wellness Package Booking", path: `/scanner/patient/${patientId}/wellness`, roles: ["Doctor", "Hospital", "Clinic", "receptionist"] },
    { label: "Medical History", path: `/scanner/patient/${patientId}/medical-history`, roles: ["Doctor", "Hospital", "Clinic", "receptionist"] },
    { label: "Family Details", path: `/scanner/patient/${patientId}/family-details`, roles: ["Doctor", "Hospital", "Clinic", "receptionist"] },
    { label: "Prescription", path: `/scanner/patient/${patientId}/prescription`, roles: ["Doctor", "Hospital", "Clinic", "receptionist", "Pharmacy"] },
  ];

  // Filter nav items based on session role
  const allowedItems = navItems.filter(item => item.roles.includes(role));

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded shadow"
        onClick={() => setIsOpen(true)}
        aria-label="Open sidebar"
        type="button"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex">
          <div className="w-64 max-w-full bg-white h-full shadow-xl p-0 flex flex-col">
            <div className="flex justify-end p-2">
              <button
                className="p-2 bg-white rounded shadow"
                onClick={() => setIsOpen(false)}
                aria-label="Close sidebar"
                type="button"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <SidebarContent
                allowedItems={allowedItems}
                pathname={pathname}
                handleLogout={handleLogout}
                loading={loading}
                data={data}
                role={role}
                onNavigate={() => setIsOpen(false)}
              />
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsOpen(false)} />
        </div>
      )}

      {/* Desktop Sidebar */}
      <div
        className="lg:block hidden bg-white fixed pt-20 min-h-screen left-0 h-full overflow-y-auto shadow-xl flex flex-col w-[15rem]"
        ref={sidebarRef}
      >
        <SidebarContent
          allowedItems={allowedItems}
          pathname={pathname}
          handleLogout={handleLogout}
          loading={loading}
          data={data}
          role={role}
        />
      </div>
    </>
  );
};

export default DashboardSidebar;