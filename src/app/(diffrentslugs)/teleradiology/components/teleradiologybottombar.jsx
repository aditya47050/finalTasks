"use client";
import {
  IdCard,
  Inbox,
  LayoutDashboardIcon,
  Lock,
  LogOut,
  MapPinned,
  User,
  User2,
  X,
  Menu,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const TeleradiologySidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [Loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  const navitems = [
    {
      label: "Home",
      link: `/teleradiology`,
    },
    {
      label: "Technology",
      link: `/teleradiology/technology`,
    },
    {
      label: "Teleradiology Services",
      link: `/teleradiology/services`,
    },
    {
      label: "Radiologists",
      link: `/teleradiology/radiologist`,
    },
    {
      label: "Join with Us ",
      link: `/teleradiology/join-with-us`,
    },
    {
      label: "Contact Us ",
      link: `/teleradiology/contact`,
    },
  ];

  const handleLinkClick = () => {
    setIsOpen(false); // Close the sidebar
  };

  return (
    <nav className="z-50  ">
      {/* Desktop View */}
      <div
        className=" fixed lg:block hidden lg:bottom-0 bottom-10 w-full"
        style={{
          backgroundColor: "#fff", // Ensures the background is white
          zIndex: 10, // Set lower than mobile sidebar
        }}
      >
        {/* Desktop Sidebar */}
        <div className="md:container space-y-2 rounded-xl flex flex-col justify-between relative">
          <div className="container max-w-5xl mx-auto pb-6 lg:py-6">
            <ul className="flex justify-center text-center space-x-2 lg:space-x-4 items-center">
              {navitems.map((item) => (
                <li
                  key={item.label}
                  className="flex flex-col items-center space-y-0"
                >
                  <Link href={item.link}>
                    <span
                      className={`font-bold p-2 lg:text-[16px] md:text-[14px] text-[7px] text-white shadow-2xl rounded-[8px] ${
                        pathname === item.link ? "bg-[#ff5e00]" : "bg-[#2b73ec]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div
        className=" fixed block lg:hidden lg:bottom-0 bottom-10 w-full"
        style={{
          backgroundColor: "#fff", // Ensures the background is white
          zIndex: 10, // Set lower than mobile sidebar
        }}
      >
        <div className=" space-y-1 rounded-xl flex flex-col justify-between relative">
          <div className=" mx-auto pb-[22px]">
            <ul className="flex justify-center text-center space-x-2 lg:space-x-4 items-center">
              {navitems.slice(0, 5).map((item) => (
                <li
                  key={item.label}
                  className="flex flex-col items-center space-y-0"
                >
                  <Link href={item.link}>
                    <span
                      className={`font-bold p-2 lg:text-[16px] md:text-[14px] text-[7px] text-white shadow-2xl rounded-[8px] ${
                        pathname === item.link ? "bg-[#ff5e00]" : "bg-[#2b73ec]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TeleradiologySidebar;
