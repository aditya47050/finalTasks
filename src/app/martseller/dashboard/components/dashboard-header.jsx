"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Menu, Search, Bell, User, Settings, LogOut, Store } from "lucide-react"
import { motion } from "framer-motion"


export function DashboardHeader({ onMenuClick }) {

  // useEffect(() => {
  //   // Fetch seller profile
  //   async function fetchProfile() {
  //     try {
  //       const res = await fetch("/api/martseller/profile")
  //       const data = await res.json()
  //       if (data.success) {
  //         setSellerEmail(data.data.email)
  //       }
  //     } catch (err) {
  //       console.error("[v0] Error fetching profile:", err)
  //     }
  //   }
  //   fetchProfile()
  // }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="bg-white border-b border-gray-200 shadow-sm z-20"
    >
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left Section - Menu & Logo */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden hover:bg-gray-100">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Seller Hub
              </h1>
            </div>
          </div>
        </div>

        {/* Right Section - Notifications & Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" className="flex items-center gap-2 rounded-xl">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                S
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
