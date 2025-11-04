"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, User, Menu, Briefcase } from "lucide-react";
import Link from "next/link";
import { NotificationPopup } from "./NotificationPopup";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export function HeaderWithNotifications({ user, seekerId }) {
  const router = useRouter();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showsuggesstion, setshowsuggesstion] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isEmployerDropdownOpen, setIsEmployerDropdownOpen] = useState(false);


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
       if (
        (dropdownRef.current && !dropdownRef.current.contains(event.target)) &&
        (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target))
        ) {
          setIsProfileDropdownOpen(false);
          setIsEmployerDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch search suggestions from API
  useEffect(() => {
    if (!searchTerm) return setSearchSuggestions([]);
    
    const controller = new AbortController();

    const fetchSuggestions = async () => {
      try {
        const params = new URLSearchParams();
        params.append("keyword", searchTerm);
        params.append("sortBy", "postedAt");
        params.append("order", "desc");

        const res = await fetch(`/api/jobaadhar/hero?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setshowsuggesstion(true);
        setSearchSuggestions(data.jobs?.slice(0, 5) || []);
      } catch (error) {
        if (error.name !== "AbortError") console.error("Error fetching suggestions", error);
      }
    };

    fetchSuggestions();

    return () => controller.abort();
  }, [searchTerm]);

  const handleSearch = (keyword) => {
    const query = new URLSearchParams();
    if (keyword) query.append("keyword", keyword);
    setshowsuggesstion(false);
    router.push(`/jobaadhar/search?${query.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch(searchTerm);
  };

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch("/api/kickback", { method: "POST" });
      if (response.ok) {
        window.location.href = "/jobaadhar/job-seeker/login";
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications
  useEffect(() => {
    if (!seekerId) return;
    fetch(`/api/jobaadhar/job-seeker/notification?seekerId=${seekerId}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Error fetching notifications", err));
  }, [seekerId]);

  // Dummy profile completion percentage
  const profileCompletion = user ? 75 : 0;

  return (
    <>
      <header className="hidden md:block border-b border-gray-300 bg-gray-500/10 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-8">
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
              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/jobaadhar/jobs" className="text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors">
                  Find Jobs
                </Link>
                <Link href="/jobaadhar/companies" className="text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors">
                  Companies
                </Link>
              </nav>
            </div>

            {/* Search */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-8 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search jobs or companies..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              {searchSuggestions.length > 0 && showsuggesstion && (
                <div className="absolute mt-1 top-[100%] w-full bg-white shadow-lg rounded-xl z-50 max-h-60 overflow-y-auto">
                  {searchSuggestions.map((job) => (
                    <div
                      key={job.id}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                      onClick={() => handleSearch(job.title)}
                    >
                      <span className="font-medium">{job.title}</span> @ {job.company}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 relative">
              {/* Profile & Notifications */}
              {user ? (
                <>
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsProfileDropdownOpen((prev) => !prev)} ref={dropdownRef}>
                    <div className="h-8 w-8 rounded-full text-white flex items-center justify-center bg-blue-500 font-bold">
                      {user.fullName?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="text-blue-500 text-sm font-medium">{user.fullName}</div>
                  </div>

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-[100%] w-48 bg-white shadow-lg rounded-xl py-2 z-50"
                      >
                        <Link href="/jobaadhar/job-seeker/profile" className="block px-4 py-2 text-gray-700 hover:bg-blue-100" onClick={() => setIsProfileDropdownOpen(false)}>Profile</Link>
                        <Link href="/jobaadhar/job-seeker/saved-jobs" className="block px-4 py-2 text-gray-700 hover:bg-blue-100" onClick={() => setIsProfileDropdownOpen(false)}>Saved Jobs</Link>
                        <Link href="/jobaadhar/job-seeker/applied-jobs" className="block px-4 py-2 text-gray-700 hover:bg-blue-100" onClick={() => setIsProfileDropdownOpen(false)}>Applied Jobs</Link>
                        <Link href="/jobaadhar/job-seeker/followed-companies" className="block px-4 py-2 text-gray-700 hover:bg-blue-100" onClick={() => setIsProfileDropdownOpen(false)}>Follow Companies</Link>
                        <Link href="/jobaadhar/job-seeker/changepassword" className="block px-4 py-2 text-gray-700 hover:bg-blue-100" onClick={() => setIsProfileDropdownOpen(false)}>Change Password</Link>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100">Logout</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <>
                  {/* Employer Dropdown (Click Based) */}
                  <div className="relative" ref={dropdownRef}>
                    <Button
                      onClick={() => setIsEmployerDropdownOpen((prev) => !prev)}
                      className="hidden sm:flex bg-blue-500 rounded-xl hover:bg-blue-600 text-white"
                    >
                      For Employers
                    </Button>

                    <AnimatePresence>
                      {isEmployerDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute -right-2 top-[110%] w-36 bg-white shadow-lg rounded-xl z-50"
                        >
                          <Link
                            href="/jobaadhar/employer/login"
                            className="block text-sm px-3 py-2 text-gray-700 hover:bg-blue-100 rounded-t-xl"
                            onClick={() => setIsEmployerDropdownOpen(false)}
                          >
                            Employer Login
                          </Link>
                          <Link
                            href="/jobaadhar/employer/register"
                            className="block text-sm px-3 py-2 text-gray-700 hover:bg-blue-100 rounded-b-xl"
                            onClick={() => setIsEmployerDropdownOpen(false)}
                          >
                            Employer Register
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <Link href={"/jobaadhar/job-seeker/login"}>
                    <Button className="rounded-xl bg-white hover:bg-gray-300">
                      <User className="h-5 w-5 text-blue-500" /> <span className="text-blue-500">Login</span>
                    </Button>
                  </Link>
                  <Link href={"/jobaadhar/job-seeker/register"}>
                    <Button className="bg-blue-500 hover:bg-blue-500 text-white rounded-xl">
                      <User className="h-5 w-5" /> <span>SignUp</span>
                    </Button>
                  </Link>
                </>
              )}

              {/* Bell Icon */}
              <Button size="icon" className="relative" onClick={() => setIsNotificationOpen(true)}>
                <Bell className="!h-5 !w-5 text-blue-500 hover:text-blue-500" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-500 text-white text-xs p-0 flex items-center justify-center">
                  {notifications.length ?? 0}
                </Badge>
              </Button>

              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-4 w-4 " />
              </Button>
            </div>
          </div>
        </div>
      </header>
      {/* MOBILE HEADER */}
      <header className="block md:hidden border-b border-gray-300 bg-gray-200 fixed top-0 left-0 w-full z-50">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Logo */}
          <Link href="/jobaadhar">
            <Image
              src="https://res.cloudinary.com/dorreici1/image/upload/v1760074393/Gemini_Generated_Image_8dwyy78dwyy78dwy-removebg-preview_mtkfxj.png"
              width={140}
              height={160}
              alt="Aarogya Aadhar Logo"
              className="h-[40px] w-auto"
            />
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link href="/jobaadhar/jobs">
                  <Briefcase className="h-5 w-5 text-blue-500" />
                </Link>
                <Link href="/jobaadhar/companies">
                  <User className="h-5 w-5 text-blue-500" />
                </Link>
                <Button size="icon" variant="ghost" onClick={() => setIsNotificationOpen(true)}>
                  <Bell className="!h-5 !w-5 text-blue-500" />
                  <Badge className="absolute top-2 right-[70px] h-5 w-5 rounded-full bg-blue-500 text-white text-xs p-0 flex items-center justify-center">
                    {notifications.length ?? 0}
                  </Badge>
                </Button>
              </>
            ) : null}

            {/* Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
            >
              <Menu className="h-5 w-5 text-blue-600" />
            </Button>
          </div>
        </div>

        {/* Search bar below header */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search jobs or companies..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            {searchSuggestions.length > 0 && showsuggesstion && (
              <div className="absolute mt-1 top-[100%] w-full bg-white shadow-lg rounded-xl z-50 max-h-60 overflow-y-auto">
                {searchSuggestions.map((job) => (
                  <div
                    key={job.id}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                    onClick={() => handleSearch(job.title)}
                  >
                    <span className="font-medium">{job.title}</span> @ {job.company}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dropdown Panel (expands below header, not fullscreen) */}
        <AnimatePresence>
          {isProfileDropdownOpen && (
            <motion.div
              ref={mobileDropdownRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden bg-white border-t border-gray-200 shadow-lg rounded-b-2xl"
            >
              <div className="p-4">
                {user ? (
                  <>
                    <Link href="/jobaadhar/job-seeker/profile" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsProfileDropdownOpen(false)}>Profile</Link>
                    <Link href="/jobaadhar/job-seeker/saved-jobs" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsProfileDropdownOpen(false)}>Saved Jobs</Link>
                    <Link href="/jobaadhar/job-seeker/applied-jobs" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsProfileDropdownOpen(false)}>Applied Jobs</Link>
                    <Link href="/jobaadhar/job-seeker/followed-companies" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsProfileDropdownOpen(false)}>Followed Companies</Link>
                    <Link href="/jobaadhar/job-seeker/changepassword" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsProfileDropdownOpen(false)}>Change Password</Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 text-red-500 font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link href="/jobaadhar/job-seeker/login" onClick={() => setIsProfileDropdownOpen(false)}>
                      <Button className="w-full bg-blue-500 text-white rounded-xl">Login</Button>
                    </Link>
                    <Link href="/jobaadhar/job-seeker/register" onClick={() => setIsProfileDropdownOpen(false)}>
                      <Button className="w-full bg-white border border-blue-500 text-blue-500 rounded-xl">Signup</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Popup */}
        <NotificationPopup
          isOpen={isNotificationOpen}
          setIsOpen={setIsNotificationOpen}
          seekerId={seekerId}
        />
      </header>
      {/* Notification Popup */}
      <NotificationPopup isOpen={isNotificationOpen} setIsOpen={setIsNotificationOpen} seekerId={seekerId} />
    </>
  );
}
