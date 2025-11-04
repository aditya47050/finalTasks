"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboardIcon,
  BriefcaseBusinessIcon,
  UserRoundIcon,
  FileTextIcon,
  ListChecksIcon,
  Briefcase,
  Lock,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function DashboardSidebarContent() {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const navItems = [
    { name: "Dashboard", href: "/jobaadhar/employer/dashboard", icon: LayoutDashboardIcon },
    { name: "Profile", href: "/jobaadhar/employer/dashboard/profile", icon: UserRoundIcon },
    { name: "Job Views", href: "/jobaadhar/employer/dashboard/job-views", icon: BriefcaseBusinessIcon },
    { name: "Applications", href: "/jobaadhar/employer/dashboard/applications", icon: FileTextIcon },
    { name: "Shortlist Candidates", href: "/jobaadhar/employer/dashboard/shortlist", icon: ListChecksIcon },
    { name: "Change Password", href: "/jobaadhar/employer/dashboard/changepassword", icon: Lock },
  ]
  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?")
    if (!confirmed) return

    setLoading(true)

    try {
      const response = await fetch("/api/kickback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        window.location.href = "/jobaadhar";
      } else {
        console.error("Logout failed: ", await response.json())
      }
    } catch (error) {
      console.error("Logout failed", error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <SidebarProvider defaultOpen className="w-64 mt-10 animate-in fade-in slide-in-from-left-4 duration-500">
      <Sidebar className="flex flex-col w-64 min-h-screen border-r bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75 shadow-sm">
        <SidebarContent className="flex-1 p-2 mt-16">
          <SidebarMenu>
            {navItems.map((item) => {
              let isActive = false;

              if (item.href === "/jobaadhar/employer/dashboard") {
                // Dashboard should only match exactly
                isActive = pathname === item.href;
              } else {
                // Others should match exact or nested
                isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              }


              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    >
                    <Link href={item.href} className={cn(
                      "justify-start transition-all rounded-lg flex items-center gap-4 px-3 py-2",
                      "hover:translate-x-0.5 hover:shadow-sm  rounded-xl",
                      isActive
                        ? "bg-blue-500 text-white hover:text-black shadow-md border-l-4  border-blue-700"
                        : "hover:bg-blue-50 text-gray-700 border-l-4 border-transparent hover:border-blue-200"
                    )}>
                      <item.icon
                        className={cn("w-5 h-5", isActive ? "text-black " : "text-blue-500")}
                      />
                      <span className="text-base">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
          <div className="p-4">
            <Button
              className="w-full justify-start bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
              onClick={handleLogout}
              aria-busy={loading}
            >
              <UserRoundIcon className="w-5 h-5 mr-2" />
              <span>{loading ? "Logging out..." : "Logout"}</span>
            </Button>
          </div>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
