"use client"

import { Home, Heart, Users, HelpCircle, Phone, Mail, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Browse Fundraisers",
    url: "/aarogya-dhan",
    icon: Heart,
  },
  {
    title: "Start Fundraiser",
    url: "/start-fundraiser",
    icon: Users,
  },
  {
    title: "How it Works",
    url: "/how-it-works",
    icon: HelpCircle,
  },
]

const supportItems = [
  {
    title: "Contact Us",
    url: "/contact",
    icon: Phone,
  },
  {
    title: "Support",
    url: "/support",
    icon: Mail,
  },
  {
    title: "Terms & Conditions",
    url: "/terms",
    icon: FileText,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r-2 border-[#5271FF]/10">
      <SidebarHeader className="border-b border-[#5271FF]/10 p-4">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="https://res.cloudinary.com/dnckhli5u/image/upload/v1725257022/aarogya%20aadhar/SiteImages/wlvx9w3k5losp57aswjv.png"
            alt="AarogyaDhan"
            width={32}
            height={32}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#5271FF] font-poppins">AarogyaDhan</span>
            <span className="text-xs text-[#243460] font-poppins">Crowdfunding Platform</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#5271FF] font-poppins font-semibold">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="font-poppins">
                    <Link href={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[#5271FF] font-poppins font-semibold">Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="font-poppins">
                    <Link href={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-[#5271FF]/10 p-4">
        <div className="text-center">
          <p className="text-xs text-[#243460] font-poppins mb-2">
            <span className="text-[#FF5E00] font-semibold">AarogyaDhan</span> is an online technology platform
            connecting donors and donees.
          </p>
          <div className="flex justify-center space-x-2">
            <button className="bg-[#5271FF] text-white px-3 py-1 rounded-full text-xs font-poppins hover:bg-[#365c99]">
              Login
            </button>
            <button className="bg-gradient-to-r from-[#FFDE59] to-[#FF914D] text-[#243460] px-3 py-1 rounded-full text-xs font-poppins font-bold">
              Help
            </button>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
