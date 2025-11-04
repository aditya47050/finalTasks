"use client";
import {
  LayoutDashboard,
  GitBranch,
  User,
  X,
  ScanQrCode,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import PatientSearchDialog from "@/app/components/patientsearchdialogbox";

const HospitalDashboardSidebar = ({ userdata }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [Loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const navitems = [
    {
      label: "Dashboard",
      link: `/hospital/dashboard`,
      icon: <LayoutDashboard className="w-6 h-6 text-[#2b73ec]" />,
      active: <LayoutDashboard className="w-6 h-6 text-[#ff5e00]" />,
    },
    {
      label: "Branches",
      link: `/hospital/dashboard/branches`,
      icon: <GitBranch className="w-6 h-6 text-[#2b73ec]" />,
      active: <GitBranch className="w-6 h-6 text-[#ff5e00]" />,
    },
  ];

  const handleLinkClick = () => setIsOpen(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".sidebar") && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  return (
    <nav>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shadow-xl">
        <div className="min-h-screen w-64 bg-white rounded-xl border border-gray-100 flex flex-col sidebar">
          {/* Logo */}
          <div className="p-6 flex justify-center border-b border-gray-200">
            <Link href="/">
              <Image
                src="https://res.cloudinary.com/dnckhli5u/image/upload/v1724307243/aarogya%20aadhar/ytwdebp7hhsjd56z0vdb.png"
                width={160}
                height={160}
                alt="Logo"
                className="object-contain"
              />
            </Link>
          </div>

          {/* User / Hospital Section */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="p-2 rounded-lg hover:bg-blue-100 transition"
            >
              <ScanQrCode className="w-6 h-6 text-blue-700" />
            </button>

            <PatientSearchDialog
              isOpen={isScannerOpen}
              onClose={() => setIsScannerOpen(false)}
              onPatientFound={(patient) => {
                router.push(`/hospital/dashboard/patient/${patient.id}`);
              }}
            />

            <div className="flex items-center gap-2">
              <div className="bg-[#2b73ec] rounded-xl p-2 flex items-center justify-center shadow-sm">
                <User className="h-10 w-10 text-white" />
              </div>
              <div>
                <p className="text-[#2b73ec] font-semibold text-sm">
                  Welcome, {userdata.name}
                </p>
                <p className="text-gray-600 text-xs font-medium">
                  {userdata.hospitalName || "Hospital Admin Dashboard"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-4">
            <ul className="space-y-2">
              {navitems.map((item) => {
                const isActive = pathname === item.link;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.link}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium text-sm ${
                        isActive
                          ? "bg-orange-50 text-[#ff5e00] font-semibold shadow-sm"
                          : "text-[#243460] hover:bg-blue-50 hover:text-[#2b73ec]"
                      }`}
                      onClick={handleLinkClick}
                    >
                      {isActive ? item.active : item.icon}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Logout */}
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                setLoading(true);
                signOut();
              }}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 transition"
            >
              <X className="w-5 h-5" />
              {Loading ? "Logging Out..." : "Log Out"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HospitalDashboardSidebar;
