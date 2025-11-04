"use client"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Activity, Heart, Stethoscope, Hospital, Ambulance, Phone, Calendar, Bed } from "lucide-react"
import { LuCalendarClock } from "react-icons/lu"
import { FaBedPulse } from "react-icons/fa6"

/**
 * 404 Not Found page for Aarogya Aadhar.
 * Shows a medical-themed message and navigation options when a page is not found.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 to-indigo-900 text-white px-4">
      <div className="flex justify-center pt-8">
        <Image
          src="https://res.cloudinary.com/dnckhli5u/image/upload/v1732897093/logo_with_tm_1_dovble.png"
          alt="Aarogya Aadhar Logo"
          width={196}
          height={96}
          className="drop-shadow-lg"
          priority
        />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-3xl w-full text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
              <Heart className="h-32 w-32 text-red-400 opacity-30 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl font-bold text-white drop-shadow-lg">404</span>
              </div>
            </div>
          </div>

          <div className="mb-6 inline-flex items-center justify-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <Activity className="h-5 w-5 text-blue-200" />
            <span className="text-lg font-medium text-blue-100">Vital Signs Not Found</span>
          </div>

          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
         {"   We couldn't locate the page you're"} looking for in our medical records system. It may have been moved or is
            no longer available.
          </p>

          <div className="inline-flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/"
              className="px-6 py-3 bg-white text-blue-900 rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Home Page</span>
            </Link>
            
            <Link
              href="/aarogyadhan"
              className="px-6 py-3 bg-transparent border border-white text-white rounded-xl hover:bg-white/10 transition flex items-center justify-center gap-2"
            >
              <Heart className="h-4 w-4" />
              <span>Aarogya Dhan Page</span>
            </Link>
          </div>

          <div className="relative">
            <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent "></div>
          
          </div>

          <h3 className="text-xl font-medium text-blue-100 mt-4 mb-4">Quick Access to Services</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-2xl mx-auto">
            <Link
              href="/appointment"
              className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition group flex flex-col items-center"
            >
              <LuCalendarClock className="h-6 w-6 text-blue-200 mb-2 group-hover:text-white transition-colors" />
              <span className="truncate text-sm">Appointment Booking</span>
            </Link>
            <Link
              href="/bed"
              className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition group flex flex-col items-center"
            >
              <FaBedPulse className="h-6 w-6 text-blue-200 mb-2 group-hover:text-white transition-colors" />
              <span className="truncate text-sm">Bed Booking</span>
            </Link>
            <Link
              href="/ambulance"
              className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition group flex flex-col items-center"
            >
              <Ambulance className="h-6 w-6 text-blue-200 mb-2 group-hover:text-white transition-colors" />
              <span className="truncate text-sm">Ambulance Booking</span>
            </Link>
            <Link
              href="/contact-us"
              className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition group flex flex-col items-center"
            >
              <Phone className="h-6 w-6 text-blue-200 mb-2 group-hover:text-white transition-colors" />
              <span className="truncate text-sm">Contact Us</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="py-6 text-center">
       
        <p className="text-blue-200/70 text-sm">
          &copy; {new Date().getFullYear()} Aarogya Aadhar. All rights reserved.
        </p>
      </div>
    </div>
  )
}
