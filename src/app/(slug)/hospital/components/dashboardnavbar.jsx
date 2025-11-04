"use client";
import Link from "next/link";
import Image from "next/image";
import { MapPin, User } from "lucide-react";
import { useState } from "react";
import DashboardSidebar from "./sidebar";

const DashboardNavBar = ({ userdata }) => {
  const [loading, setLoading] = useState(false);

  return (
    <nav
      className="font-poppins fixed top-0 z-20 w-full shadow-md"
      style={{ backgroundColor: "#5b6bf5" }}
    >
      <div className="max-w-screen-2xl xl:max-w-screen-5xl mx-auto px-3 lg:px-8 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="https://res.cloudinary.com/dnckhli5u/image/upload/v1732897093/logo_with_tm_1_dovble.png"
            width={160}
            height={40}
            alt="Logo"
            className="h-[38px] lg:h-[40px] object-contain"
          />
        </Link>

        {/* Mobile Sidebar */}
        <div className="lg:hidden block">
          <DashboardSidebar data={userdata} />
        </div>

        {/* Desktop Info Section */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="text-right">
            <p className="text-white font-semibold text-sm">
              Welcome, {userdata?.hspInfo?.regname || "Hospital Admin"}
            </p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <MapPin className="w-4 h-4 text-white" />
              <p className="text-white text-xs font-medium">
                {userdata?.hspInfo?.city || "Location unavailable"}
              </p>
            </div>
          </div>

          {/* Avatar / Hospital Logo */}
          <div className="flex items-center">
            {userdata?.hspInfo?.hsplogo ? (
              <Image
                src={userdata.hspInfo.hsplogo}
                height={50}
                width={50}
                alt="Hospital Logo"
                className="h-[50px] w-[50px] rounded-lg object-cover border-2 border-white shadow-md"
              />
            ) : (
              <User className="h-12 w-12 bg-white/20 rounded-lg p-2 text-white shadow-md" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavBar;
