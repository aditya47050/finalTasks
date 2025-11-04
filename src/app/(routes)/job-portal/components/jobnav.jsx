"use client";
import { ArrowDown, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Image from "next/image";

const JobNavBar = () => {
  const navlinks = [
    {
      title: "Login",
      link: "#",
      submenu: [],
    },
    {
      title: "Register",
      link: "#",
      submenu: [],
    },
    {
      title: "Employer",
      link: "#",
      submenu: [],
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [buttonStates, setButtonStates] = useState(null);
  const pathname = usePathname();

  const handleClick = (buttonId) => {
    setButtonStates(buttonId);
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav
        className="sticky top-0 z-20 w-full"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dnckhli5u/image/upload/v1725813802/aarogya%20aadhar/gmd4skzl3htfs1mmo8ll.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
        }}
      >
        <div className="lg:mx-10 mx-2 flex pt-1 max-w-screen-2xl xl:max-w-screen-5xl items-center justify-between">
          {/* Left Images */}
          <Link href="/" className="flex items-center">
            <Image
              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1724307243/aarogya%20aadhar/ytwdebp7hhsjd56z0vdb.png"
              width={180}
              height={200}
              alt=""
              className="md:h-auto h-12 w-full md:w-40"
            />
            <span className="text-3xl hidden md:block">|</span>
            <Image
              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1723536054/pedchydng2iotseod48y.png"
              width={180}
              height={200}
              alt=""
              className="hidden md:block md:h-auto h-12 w-full md:w-40"
            />
          </Link>

          {/* Right Menu Icon (Mobile) */}
          <div className="md:hidden">
            <Button onClick={toggleDrawer} className="text-blue-950">
              <Menu className="h-8 w-8" />
            </Button>
          </div>

          {/* Mobile Dropdown */}
          {isOpen && (
            <div className="md:hidden absolute top-16 right-0 bg-white w-full rounded-md shadow-lg">
              {navlinks.map((nav, index) => (
                <DropdownMenu key={index}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="w-full text-left text-blue-950 font-bold p-4"
                      onClick={() => handleClick(nav.title)}
                    >
                      <div className="flex justify-between items-center w-full">
                        {nav.title}
                        <ArrowDown className="h-4 w-4" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  {nav.submenu.length > 0 && (
                    <DropdownMenuContent className="mt-2 bg-gray-200 w-full">
                      {nav.submenu.map((item) => (
                        <DropdownMenuItem key={item.link}>
                          <Link href={item.link}>
                            <span className="text-blue-950 font-bold px-2 hover:bg-white p-2 rounded-2xl">
                              {item.title}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                    </DropdownMenuContent>
                  )}
                </DropdownMenu>
              ))}
            </div>
          )}

          {/* Right Dropdowns (Desktop) */}
          <div className="hidden md:block">
            <div className="flex items-center">
              {navlinks.map((nav, index) => (
                <DropdownMenu key={index}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="font-bold text-blue-950"
                      onClick={() => handleClick(nav.title)}
                    >
                      <div
                        className={`flex item-center text-white p-2 relative text-[15px] gap-1 rounded-3xl ${
                          index < 2
                            ? "bg-gradient-to-r from-[#5de0e6] via-[#004aad] to-[#004aad]"
                            : "bg-gradient-to-br from-[#b6ff83] via-[#53e418] to-[#79b50c]"
                        }`}
                      >
                        {nav.title}
                        <ArrowDown className="h-4 w-4 bg-white rounded-full" color="#243460" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mt-2 bg-gray-200">
                    {nav.submenu.map((item) => (
                      <DropdownMenuItem key={item.link}>
                        <Link href={item.link}>
                          <span className="text-blue-950 font-bold px-2 hover:bg-white p-2 rounded-2xl">
                            {item.title}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default JobNavBar;
