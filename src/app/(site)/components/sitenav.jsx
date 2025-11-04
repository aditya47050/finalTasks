"use client";
import { ArrowDown, Languages, SearchIcon } from "lucide-react";
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

const SiteNavBar = () => {
  // const navlinks = [
  //   {
  //     title: "English",
  //     link: "#",
  //     submenu: [
  //       { title: "Marathi", link: "#" },
  //       { title: "Hindi", link: "#" },
  //       { title: "English", link: "#" },
  //     ],
  //   },
  // ];

  const navlinks = [
    {
      title: "Login",
      link: "#",
      submenu: [
        { title: "Patient", link: "/patient/login" },
        { title: "Doctor", link: "/doctor/login" },
        { title: "Hospital/Clinic", link: "/hospital/login" },
        { title: "Pathology", link: "#" },
        { title: "Diagnostic Center", link: "#" },
        { title: "Ambulance", link: "/ambulance/login" },
        { title: "Health Professional", link: "#" },
        { title: "Corporate Company", link: "/corporate/login" },
        { title: "Equipment Dealers", link: "#" },
        { title: "Pharmacy", link: "#" },
        { title: "Service Provider", link: "#" },
        { title: "Aarogya Mitra", link: "#" },
      ],
    },
    {
      title: "Register",
      link: "#",
      submenu: [
        { title: "Patient", link: "/patient/register" },
        { title: "Doctor", link: "/doctor/register" },
        { title: "Hospital/Clinic", link: "/hospital/register" },
        { title: "Pathology", link: "#" },
        { title: "Diagnostic Center", link: "#" },
        { title: "Ambulance", link: "/ambulance/register" },
        { title: "Health Professional", link: "#" },
        { title: "Corporate Company", link: "/corporate/register" },
        { title: "Equipment Dealers", link: "#" },
        { title: "Pharmacy", link: "#" },
        { title: "Service Provider", link: "#" },
        { title: "Aarogya Mitra", link: "#" },
        { title: "Registration Enquiry", link: "registrationenquiryform" },
      ],
    },
    {
      title: <Languages />,
      link: "#",
      submenu: [
        { title: "Marathi", link: "#" },
        { title: "Hindi", link: "#" },
        { title: "English", link: "#" },
      ],
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
        className="fixed hidden lg:block top-0  z-50 w-full  "
        style={{
          // backgroundImage:
          //   "url('https://res.cloudinary.com/dnckhli5u/image/upload/v1725813802/aarogya%20aadhar/gmd4skzl3htfs1mmo8ll.png')",
          // backgroundSize: "cover",
          // backgroundPosition: "center",

          // width: "100%",
          backgroundColor : "#fff"
        }}
      >
        <div className=" container mx-auto xl:px-20 w-full flex py-1 items-center justify-between  ">
          <Link href="/" className="flex items-center">
            <Image
              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1724307243/aarogya%20aadhar/ytwdebp7hhsjd56z0vdb.png"
              width={180}
              height={200}
              alt=""
              className="h-[60px] w-full"
            />
            <span className="text-3xl hidden md:block">|</span>
            <Image
              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1723536054/pedchydng2iotseod48y.png"
              width={180}
              height={200}
              alt=""
              className="hidden md:block h-[60px] w-full"
            />
          </Link>

          {/* Centered Search Component */}

          {/* Right Dropdowns */}
          <div className="flex items-center space-x-3 p-0 m-0">
  {navlinks.map((nav, index) => (
    <DropdownMenu key={index}>
      <DropdownMenuTrigger asChild>
        <Button className="font-bold text-blue-950 p-0 m-0">
          <div className="text-blue-950 font-bold text-[12px] lg:text-[16px] inline-flex items-center gap-1 text-base">
            {nav.title}
            <ArrowDown className="h-4 w-4 bg-blue-950 rounded-full" color="#fff" />
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
      </nav>
    </>
  );
};

export default SiteNavBar;