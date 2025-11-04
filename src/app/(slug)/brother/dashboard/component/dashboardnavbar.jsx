"use client";
import Link from "next/link";
import DashboardSidebar from "./sidebar";
import Image from "next/image";
import { Locate, MapPin, User } from "lucide-react";
import { useState } from "react";

const DashboardNavBar = ({ userdata }) => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <nav
        className="font-poppins fixed top-0 z-20 w-full overflow-auto "
        style={{
          backgroundColor: "#5b6bf5",
        }}
      >
        <div className="md:container md:mx-auto px-2 md:px-0  my-1 w-full flex pt-1 lg:pt-0 max-w-screen-2xl xl:max-w-screen-5xl items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1732897093/logo_with_tm_1_dovble.png"
              width={180}
              height={200}
              alt="Logo"
              className="h-[38px] lg:h-[40px] pl-1 w-full"
            />
          </Link>
          <div className="lg:hidden block">
            <DashboardSidebar data={userdata} />
          </div>
          <div className="lg:block hidden">
            <div className="flex items-center text-[12px] md:text-[12px] mr-[-10px] space-x-0">
              <div className="flex justify-center items-center font-poppins space-x-2 font-bold">
                <div className="text-right space-y-0">
                  <p className="text-blue-500 lg:text-white font-semibold ">
                    Hi, {userdata.firstName}!
                  </p>
                  <p className="text-[#243460] text-[10px] md:text-[12px] ">
                    How are you today?
                  </p>

                  <div className="flex items-center justify-end space-x-1">
                    {/* Locate icon */}
                    <MapPin className="w-5 h-5 text-blue-500 lg:text-white" />
                    <p className="text-[#ff5e00] lg:text-white text-[8px] md:text-[10px] font-medium">
                      {userdata.city ? userdata.city : "Location unavailable"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  {" "}
                  {userdata.passportPhoto ? (
                    <Image
                      src={userdata.passportPhoto}
                      height={400}
                      width={400}
                      alt=""
                      className="h-[50px] w-[50px] rounded-[10px] object-cover border-2 shadow-sm "
                    />
                  ) : (
                    <User className="h-16 w-16 bg-blue-500 rounded-[10px] p-2 text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default DashboardNavBar;
