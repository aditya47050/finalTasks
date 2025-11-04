"use client";
import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
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
              Welcome, {userdata?.role || "User"}
            </p>
            <p className="text-white text-xs font-medium">
              {userdata?.email}
            </p>
          </div>

          {/* Avatar / Initials */}
          <div className="flex items-center">
            {userdata?.role ? (
              <div className="h-[40px] w-[40px] rounded-full bg-white/20 flex items-center justify-center text-white font-bold shadow-md">
                {userdata.role.charAt(0).toUpperCase()}
              </div>
            ) : (
              <User className="h-10 w-10 bg-white/20 rounded-full p-2 text-white shadow-md" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavBar;
