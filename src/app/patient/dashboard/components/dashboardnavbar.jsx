"use client";
import Link from "next/link";
import DashboardSidebar from "./sidebar";
import Image from "next/image";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
// Helper function to calculate age
function getAge(child) {
  if (!child?.dateOfBirth) return null
  const birth = new Date(child.dateOfBirth)
  const diff = new Date() - birth
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
}
const DashboardNavBar = ({ userdata,connectionRequests }) => {
  const [loading, setLoading] = useState(false);
  const [activeUser, setActiveUser] = useState("main")
    const [isLinking, setIsLinking] = useState(false)
    const [hasKidsProfile, setHasKidsProfile] = useState(false)
    const [kidsProfile, setKidsProfile] = useState(null)
  
    useEffect(() => {
      // Filter approved child connections
      const approvedKids = connectionRequests?.filter(req => req.status === "APPROVED" && req.child && getAge(req.child) <= 16)
      if (approvedKids?.length) {
        setKidsProfile(approvedKids[0].child)
        setHasKidsProfile(true)
      } else {
        setKidsProfile(null)
        setHasKidsProfile(false)
      }
  
      // Load saved preference from localStorage
      const savedUser = localStorage.getItem("activeUser")
      if (savedUser === "kids" && approvedKids?.length) {
        setActiveUser("kids")
      }
    }, [connectionRequests])
  
    const handleSwitch = async () => {
      if (!hasKidsProfile || isLinking) return
  
      setIsLinking(true)
      await new Promise((resolve) => setTimeout(resolve, 800))
  
      const newUser = activeUser === "main" ? "kids" : "main"
      setActiveUser(newUser)
      localStorage.setItem("activeUser", newUser)
  
      await new Promise((resolve) => setTimeout(resolve, 400))
      setIsLinking(false)
    }
  
    const getActiveUserData = () => {
      if (activeUser === "kids" && hasKidsProfile && kidsProfile) {
        return {
          ...userdata,
          firstName: kidsProfile.firstName,
          lastName: kidsProfile.lastName,
          isKidsMode: true,
          originalUser: userdata,
          email: kidsProfile.email,
          gender: kidsProfile.gender,
          mobile: kidsProfile.mobile,
          bloodgroup: kidsProfile.bloodgroup,
          age: kidsProfile.age,
          // Add more fields if you want to display child-specific details
        }
      }
      return { ...userdata, isKidsMode: false }
    }
  
    const activeUserData = getActiveUserData()

  return (
    <nav className="fixed top-0 z-20 w-full bg-[#5b6bf5] backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto px-4 md:px-6 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="https://res.cloudinary.com/dnckhli5u/image/upload/v1732897093/logo_with_tm_1_dovble.png"
            width={160}
            height={40}
            alt="Logo"
            className="h-[38px] lg:h-[42px] w-auto transition-transform duration-200 hover:scale-105"
          />
        </Link>

        {/* Mobile Sidebar */}
        <div className="lg:hidden block">
          <DashboardSidebar data={userdata} />
        </div>

        {/* Desktop Greeting + Avatar */}
        <div className="hidden lg:flex items-center space-x-3 font-poppins">
          <div className="text-right">
            <p className="text-white font-semibold text-sm md:text-base">
              Hi, {activeUserData.firstName}!
            </p>
            <p className="text-gray-200 text-xs md:text-sm">
              How are you today?
            </p>
          </div>

          {/* Avatar */}
          <div className="flex items-center">
            {userdata.passportPhoto ? (
              <Image
                src={userdata.passportPhoto}
                height={50}
                width={50}
                alt="User"
                className="h-12 w-12 rounded-xl object-cover border-2 border-white shadow-md hover:ring-2 hover:ring-white/60 transition"
              />
            ) : (
              <User className="h-12 w-12 bg-blue-400 rounded-xl p-2 text-white shadow-md" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavBar;
