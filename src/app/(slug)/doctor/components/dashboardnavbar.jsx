"use client";
import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { useState } from "react";
import DashboardSidebar from "./doctorsidebar";

const DashboardNavBar = ({ userdata }) => {
  const [loading, setLoading] = useState(false);

  return (
    <nav className="font-poppins fixed top-0 z-20 w-full bg-[#5b6bf5] shadow-md">
      <div className="max-w-screen-2xl xl:max-w-screen-5xl mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="https://res.cloudinary.com/dnckhli5u/image/upload/v1732897093/logo_with_tm_1_dovble.png"
            width={180}
            height={40}
            alt="Logo"
            className="h-[38px] lg:h-[40px] w-auto"
          />
        </Link>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <DashboardSidebar data={userdata} />
        </div>

        {/* Desktop User Info */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="text-right">
            <p className="text-white font-semibold text-sm lg:text-base">
              Hi, {userdata.firstName}!
            </p>
            <p className="text-white/80 text-xs lg:text-sm">
              How are you today?
            </p>
          </div>

          {/* Profile Image */}
          <div className="flex-shrink-0">
            {userdata.doctorinfo?.passportphoto ? (
              <Image
                src={userdata.doctorinfo.passportphoto}
                width={50}
                height={50}
                alt="Profile Photo"
                className="h-[50px] w-[50px] rounded-lg object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <User className="h-12 w-12 bg-blue-500 rounded-lg p-2 text-white" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavBar;
