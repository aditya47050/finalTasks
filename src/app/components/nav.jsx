"use client";
import {
  SearchIcon,
  Languages,
  ChevronDown,
  ScanQrCode,
  Bell,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Facilities from "./facitransperent";
import { Input } from "@/components/ui/input";
import PatientSearchDialog from "../components/patientsearchdialogbox";
import { useRouter } from "next/navigation";

const navlinks = [
  {
    title: "Login",
    link: "#",
    submenu: [
      { title: "Patient", link: "/patient/login" },
      { title: "Doctor", link: "/doctor/login" },
      { title: "Hospital", link: "/hospital/login?role=Hospital" },
      { title: "Clinic", link: "/hospital/login?role=Clinic" },
      { title: "Pathology", link: "/hospital/login?role=Pathology" },
      {
        title: "Diagnostic Center",
        link: "/hospital/login?role=DiagnosticCenter",
      },
      {
        title: "Home Health Care",
        link: "/hospital/login?role=homehealthcare",
      },
      { title: "Receptionist", link: "/hospital/login?role=Receptionist" },
      { title: "Ambulance", link: "/ambulance/login" },
      { title: "Health Professional", link: "#" },
      { title: "Corporate Company", link: "/corporate/login" },
      { title: "Equipment Dealers", link: "#" },
      { title: "Pharmacy", link: "/pharmacy/login" },
      { title: "Service Provider", link: "#" },
      { title: "Aarogya Mitra", link: "#" },
      { title: "E-Seva/Asha Worker", link: "/e-seva/login" },
    ],
  },
  {
    title: "Register",
    link: "#",
    submenu: [
      { title: "Patient", link: "/patient/register" },
      { title: "Doctor", link: "/doctor/register" },
      { title: "Hospital/Clinic", link: "/hospital/register?role=Hospital" },
      { title: "Pathology", link: "/hospital/register?role=Pathology" },
      {
        title: "Diagnostic Center",
        link: "/hospital/register?role=DiagnosticCenter",
      },
      {
        title: "Home Health Care",
        link: "/hospital/register?role=homehealthcare",
      },
      { title: "Ambulance", link: "/ambulance/register" },
      { title: "Health Professional", link: "#" },
      { title: "Corporate Company", link: "/corporate/register" },
      { title: "Equipment Dealers", link: "#" },
      { title: "Pharmacy", link: "/pharmacy/register" },
      { title: "Service Provider", link: "#" },
      { title: "Aarogya Mitra", link: "#" },
      { title: "E-Seva/Asha Worker", link: "/e-seva/register" },
      { title: "Registration Enquiry", link: "registrationenquiryform" },
    ],
  },
  {
    title: <Languages className="h-4 w-4" />, // Standardized icon size
    link: "#",
    submenu: [
      { title: "Marathi", link: "#" },
      { title: "Hindi", link: "#" },
      { title: "English", link: "#" },
    ],
  },
];

const NavBar = ({
  hspcategory,
  doctorcategory,
  diagnosticCategory,
  userData,
}) => {
  console.log(userData)
  const [showAlert, setShowAlert] = useState(false);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [buttonStates, setButtonStates] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [passportPhoto, setPassportPhoto] = useState(null);
  const pathname = usePathname();
  const activeButtonRef = useRef(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const router = useRouter();

  // Fetch passport photo on mount to simulate logged in user
  useEffect(() => {
    const fetchPassportPhoto = async () => {
      try {
        const res = await fetch("/api/user/profile-img");
        const data = await res.json();
        if (data.passportPhoto) {
          setPassportPhoto(data.passportPhoto);
        }
      } catch (err) {
        console.error("Error fetching passport photo:", err);
      }
    };
    fetchPassportPhoto();
  }, []);

  const handleSearch = async () => {
    setIsSearching(true);
    const url = new URL(window.location.href);
    if (!text) {
      url.searchParams.delete("query");
    } else {
      url.searchParams.set("query", text);
    }
    setTimeout(() => {
      window.location.href = url.toString();
      setIsSearching(false);
    }, 500);
  };

  const handleClick = (buttonId) => {
    setButtonStates(buttonId);
  };

  const handleClickOutside = (event) => {
    if (
      activeButtonRef.current &&
      !activeButtonRef.current.contains(event.target)
    ) {
      setButtonStates(null);
    }
  };

  const handleItemClick = (title) => {
    // Handle item click logic here
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={cn(
          "fixed top-0 bg-white font-poppins w-full transition-all duration-500 ease-in-out",
          isScrolled
            ? " z-50 shadow-2xl border-b border-blue-100/50"
            : " z-50 via-white to-blue-50/30"
        )}
      >
        {/* Desktop View */}
        <div className="hidden lg:block xlg:pl-12 lg:pl-12">
          <div className="container mx-auto xl:px-12 w-full flex pt-1 items-center justify-between">
            {/* Enhanced Logo Section */}
            <div className="flex items-center gap-x-4">
              {" "}
              {/* Adjusted gap */}
              <Link
                href="/"
                className="group flex items-center hover:opacity-90 transition-all duration-300"
              >
                <div className="relative">
                  <Image
                    src="https://res.cloudinary.com/dnckhli5u/image/upload/v1724307243/aarogya%20aadhar/ytwdebp7hhsjd56z0vdb.png"
                    width={180}
                    height={200}
                    alt="Aarogya Aadhar Logo"
                    className="h-[50px] w-auto transition-transform duration-300 group-hover:scale-105" // Standardized height
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </div>
              </Link>
              <div className="relative">
                <span className="text-3xl bg-gradient-to-b from-blue-300 to-blue-500 bg-clip-text text-transparent hidden md:block">
                  |
                </span>
                <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 to-blue-600/20 blur-sm opacity-50"></div>
              </div>
              <Link
                href="/aarogyadhan"
                className="group flex items-center hover:opacity-90 transition-all duration-300"
              >
                <div className="relative">
                  <Image
                    src="https://res.cloudinary.com/dnckhli5u/image/upload/v1729240926/2-2_pxsi7g.png"
                    width={180}
                    height={180}
                    alt="Aarogya Dhan Logo"
                    className="h-[50px] w-auto transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </div>
              </Link>
            </div>

            {/* Search Component */}
            <div className="flex-grow flex justify-center mx-6">
              <div
                className={cn(
                  "relative w-full max-w-xl transition-all duration-300"
                )}
              >
                <div className="relative group">
                  {/* Search Icon */}
                  <span className="absolute inset-y-0 left-0 flex items-center pl-1 z-10">
                    {" "}
                    {/* Standardized padding */}
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full text-white p-2 transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-900"
                      )}
                    >
                      <SearchIcon className="h-4 w-4" />
                      {/* Standardized icon size */}
                    </div>
                  </span>
                  {/* Enhanced Input */}
                  <Input
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Search Healthcare Services"
                    className={cn(
                      "w-full rounded-full pl-12 py-2.5 pr-28 border-0 transition-all duration-300 shadow-lg min-[1000px]:text-[11px] min-[1100px]:text-sm bg-gradient-to-r from-blue-100 to-indigo-100 placeholder-blue-800 hover:shadow-xl"
                    )}
                  />
                  {/* Enhanced Search Button */}
                  <button
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-1 group" // Standardized margin
                  >
                    <span
                      className={cn(
                        "py-1.5 px-3 font-bold text-sm rounded-full hidden lg:flex items-center gap-2 transition-all duration-300", // Standardized padding and text size
                        isSearching
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                          : "bg-gradient-to-r from-white to-blue-50 text-blue-700 hover:from-blue-50 hover:to-blue-100 hover:shadow-lg hover:scale-105"
                      )}
                    >
                      {isSearching ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Searching...
                        </>
                      ) : (
                        <>Search</>
                      )}
                    </span>
                  </button>
                  {/* Search suggestions hint */}
                  {text && !searchFocused && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-blue-100 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="text-xs text-blue-600">
                        Press Enter to search for `{text}`
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right side: conditionally render navlinks or icons/profile */}
            <div className="flex items-center gap-x-0 min-[1000px]:mr-1">
              {passportPhoto || userData ? (
                <>
                  {userData?.role?.toLowerCase() === "patient" ? (
                    <Link
                      href="/patient/dashboard/digitalhealthcard"
                      className="px-2"
                    >
                      <ScanQrCode className="w-7 h-7 text-blue-800 hover:text-blue-600" />
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsScannerOpen(true)}
                        className="px-2"
                      >
                        <ScanQrCode className="w-7 h-7 text-blue-800 hover:text-blue-600" />
                      </button>
                      <PatientSearchDialog
                        isOpen={isScannerOpen}
                        onClose={() => setIsScannerOpen(false)}
                        onPatientFound={(patient) => {
                          router.push(`/scanner/patient/${patient.id}?role=${userData?.role}`);
                        }}
                      />
                    </>
                  )}
                  <Link
                    href="/notifications"
                    aria-label="Notifications"
                    className="px-2"
                  >
                    <Bell
                      className="w-7 h-7"
                      style={{ stroke: "none", fill: "#2563eb" }}
                    />
                  </Link>
                  <Link
                    href={
                      userData?.role?.toLowerCase() === "patient" ||
                      userData?.role?.toLowerCase() === "doctor"
                        ? `/${userData?.role?.toLowerCase()}/dashboard`
                        : "/hospital/dashboard"
                    }
                    aria-label="Profile"
                    className="px-2"
                  >
                    {passportPhoto ? (
                      <Image
                        src={passportPhoto}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full object-cover border border-gray-300 cursor-pointer"
                      />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white">
                        {userData?.role?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                </>
              ) : (
                navlinks.map((nav, index) => (
                  <DropdownMenu key={index}>
                    <DropdownMenuTrigger asChild>
                      <span
                        className="group cursor-pointer transition-all duration-300"
                        onClick={() => handleItemClick(nav.title)}
                      >
                        <div
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-base transition-all duration-300", // Standardized text size and padding
                            "text-blue-900 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md hover:scale-105"
                          )}
                        >
                          <span className="relative">
                            {nav.title}
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></div>
                          </span>
                          <ChevronDown // Replaced FaArrowCircleDown with ChevronDown
                            className={cn(
                              "h-4 w-4 rounded-full transition-all duration-300", // Standardized icon size
                              "text-blue-800 group-hover:text-blue-600 group-hover:rotate-180 group-hover:shadow-lg"
                            )}
                          />
                        </div>
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="mt-2 bg-white/95 backdrop-blur-md border border-blue-100 shadow-2xl rounded-2xl p-2 min-w-[200px]"
                      align="start"
                    >
                      {nav.submenu.map((item, itemIndex) => (
                        <DropdownMenuItem
                          key={item.link}
                          className={cn(
                            "rounded-xl transition-all duration-200 hover:bg-gradient-to-r ",
                            "focus:bg-gradient-to-r focus:from-blue-50 focus:to-indigo-50"
                          )}
                        >
                          <Link href={item.link} className="w-full group">
                            <span className="text-blue-900 font-medium transition-colors duration-200 flex items-center gap-2">
                              {item.title}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-blue-200 to-transparent my-2" />
                    </DropdownMenuContent>
                  </DropdownMenu>
                ))
              )}
            </div>
          </div>

          {/* Enhanced Facilities Section */}
          <div className="md:container md:pl-[20px] lg:px-auto xl:pl-12 xl:pr-[60px] xlg:container pt-2 mx-auto">
            <div className="relative">
              <Facilities
                hspcategory={hspcategory}
                doctorcategory={doctorcategory}
                diagnosticCategory={diagnosticCategory}
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
