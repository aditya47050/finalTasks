"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Briefcase } from "lucide-react"
import Image from "next/image"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between lg:px-8 gap-4 border-b bg-gradient-to-r from-gray-200 to-gray-300 px-4 text-white shadow-sm">
      <Link href={"/jobaadhar"}>
        <div className="flex items-center gap-2 cursor-pointer">
          <Image
            src="https://res.cloudinary.com/dorreici1/image/upload/v1760074393/Gemini_Generated_Image_8dwyy78dwyy78dwy-removebg-preview_mtkfxj.png"
            width={180}
            height={200}
            alt="Aarogya Aadhar Logo"
            className="h-[45px] w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <Button
        variant="outline"
        size="icon"
        className="overflow-hidden rounded-full bg-transparent border-black/20 hover:bg-black/10 hover:border-black/30 transition"
      >
        <Avatar className="ring-1 ring-black/20 hover:ring-black/40 transition">
          <AvatarImage src="/diverse-avatars.png" alt="Avatar" />
          <AvatarFallback className="text-black">EM</AvatarFallback>
        </Avatar>
      </Button>
    </header>
  )
}
