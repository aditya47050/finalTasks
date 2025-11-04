"use client";
import { signOut } from "next-auth/react"
import React, { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SuperDashboardSidebar from "./supsidebar";
  

const Header = ({userdata}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <nav className=" fixed start-0 top-0  w-full">
    <header className=" bg-[#116aef] text-white shadow-sm   p-1 flex justify-between">
   
      {/* User Icon with Dropdown */} <Link href="/" className="flex pl-0 pt-1 items-center">
        <Image
          src="https://res.cloudinary.com/dnckhli5u/image/upload/v1732897093/logo_with_tm_1_dovble.png"
          width={680}
          height={360}
          alt="Aarogya Aadhar Logo"
          className="h-[40px] pl-2 w-auto"
        />
      </Link> 
 
<div className="lg:hidden block">      <SuperDashboardSidebar userdata={userdata}/>  </div>  </header>
    </nav>
  );
};

export default Header;
