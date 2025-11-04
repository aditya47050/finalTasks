"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchSuggestions } from "./search-suggestions"
import { useCart } from "./cart-context"
import Link from "next/link"
import { FaRegHeart, FaUser } from "react-icons/fa"
import { MdAddShoppingCart, MdCategory, MdOutlineDashboardCustomize, MdOutlineManageAccounts } from "react-icons/md"
import { BsFillPatchQuestionFill } from "react-icons/bs";
import { FiX } from "react-icons/fi"
import { HiMenuAlt2 } from "react-icons/hi"
import Image from "next/image"
import { TbShoppingCartCopy } from "react-icons/tb"
import { useWishlist } from "./wishlist-context"
import { BiGridAlt } from 'react-icons/bi';
import { CiLogin } from "react-icons/ci"
const loginRoles = [
  { title: "Patient", link: "/patient/login" },
  { title: "Doctor", link: "/doctor/login" },
  { title: "Hospital", link: "/hospital/login?role=Hospital" },
  { title: "Clinic", link: "/hospital/login?role=Clinic" },
  { title: "Pathology", link: "/hospital/login?role=Pathology" },
  { title: "Diagnostic Center", link: "/hospital/login?role=DiagnosticCenter" },
  { title: "Home Health Care", link: "/hospital/login?role=homehealthcare" },
  { title: "Receptionist", link: "/hospital/login?role=Receptionist" },
  { title: "Ambulance", link: "/ambulance/login" },
  { title: "Health Professional", link: "#" },
  { title: "Corporate Company", link: "/corporate/login" },
  { title: "Equipment Dealers", link: "#" },
  { title: "Pharmacy", link: "/pharmacy/login" },
  { title: "Service Provider", link: "#" },
  { title: "Aarogya Mitra", link: "#" },
  { title: "E-Seva/Asha Worker", link: "/e-seva/login" },
];

export function Header({role}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState([]) // dynamic categories
  const { toggleCart, getTotalItems } = useCart()
  const { toggleWishlist, getWishlistTotalItems } = useWishlist()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/aarogyamart/categories/countwithdata")
        if (!res.ok) throw new Error("Failed to fetch categories")
        const data = await res.json()
        setCategories(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchCategories()
  }, [])

  // Generate random light gradient for category background
  const getRandomGradient = () => {
    const colors = [
      ["#FFC1C1", "#FF9A9E"], // soft pink → rose
      ["#FFD8A8", "#FFB347"], // light orange → orange
      ["#A8D5BA", "#64C7CC"], // mint green → teal
      ["#B5A8FF", "#7D5FFF"], // light purple → violet
      ["#FFE29A", "#FFB347"], // soft yellow → warm orange
      ["#A8E6FF", "#64B6FF"], // sky blue → deeper blue
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }
  return (
    <header className="sticky top-0 z-50 pb-1 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-blue-500 text-white py-2">
        <div className="container mx-auto px-4 text-center text-[10px] md:text-sm">
          Free shipping on orders above ₹2,000 | 24/7 Customer Support
        </div>
      </div>

      {/* Main Header */}
      <div className="hidden md:block container mx-auto px-4 py-4">
        <div className=" flex items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex flex-row gap-4">
            <Link href="/aarogyamart" className="flex items-center gap-2">
              <Image
                src="https://res.cloudinary.com/dorreici1/image/upload/v1758624955/Gemini_Generated_Image_g3i2u0g3i2u0g3i2-removebg-preview_hcj8l3.png"
                width={180}
                height={200}
                alt="Aarogya Aadhar Logo"
                className="h-[50px] w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex  max-w-xl w-full">
            <SearchSuggestions className="w-full" />
          </div>

          {/* Right Actions */}
          <div className="hideen md:flex items-center gap-12">
            {/* User Dropdown */}
            {/* User / Login Dropdown */}
            <div className="w-full" >
              <Button className="bg-blue-500 hover:bg-blue-500 rounded-xl text-white">
                <Link href={'/martseller'} className="flex flex-row gap-2 items-center">
                  Are You Seller<BsFillPatchQuestionFill className="text-white" />
                </Link>
              </Button>
            </div>
            <div className="relative w-full" ref={dropdownRef}>
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex"
                onClick={() => setOpen((prev) => !prev)}
              >
                {role ? <FaUser className="!h-5 !w-5 text-blue-500" /> : <CiLogin className="!h-5 !w-5 text-blue-500"/>}
                <span className="hover:text-blue-500 text-base">{role ? role : "Login"}</span>
              </Button>

              {open && (
                <div className="absolute -right-16 mt-2 w-44 bg-white shadow-lg rounded-xl border z-50">
                  <ul className="text-base text-gray-700">
                    {role ? (
                      <>
                        {/* Dashboard items for logged in user */}
                        <li>
                          <Link
                            href={
                              role === "Patient"
                                ? "/patient/dashboard"
                                : role === "Doctor"
                                ? "/doctor/dashboard"
                                : role === "Hospital"
                                ? "/hospital/dashboard"
                                : role === "Clinic"
                                ? "/clinic/dashboard"
                                : role === "Pathology"
                                ? "/pathology/dashboard"
                                : role === "DiagnosticCenter"
                                ? "/diagnostic/dashboard"
                                : role === "Ambulance"
                                ? "/ambulance/dashboard"
                                : role === "Corporate Company"
                                ? "/corporate/dashboard"
                                : "/dashboard"
                            }
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 hover:text-blue-500"
                          >
                            <MdOutlineDashboardCustomize size={20} />
                            <span>Dashboard</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/aarogyamart/account" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 hover:text-blue-500">
                            <MdOutlineManageAccounts size={20} />
                            <span>Account</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/aarogyamart/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 hover:text-blue-500">
                            <TbShoppingCartCopy size={20} />
                            <span>Orders</span>
                          </Link>
                        </li>
                      </>
                    ) : (
                      <>
                        {loginRoles.map((r) => (
                          <li key={r.title}>
                            <Link
                              href={r.link}
                              className="flex items-center gap-0 px-2 text-[12px] min-w-[100px] hover:rounded-xl rounded-xl hover:bg-gray-100 hover:text-blue-500"
                            >
                              <span>{r.title} Login</span>
                            </Link>
                          </li>
                        ))}
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <div className="w-full">
              {/* Wishlist */}
              <Button variant="ghost" size="icon" className="relative" onClick={toggleWishlist}>
                <FaRegHeart className="!h-5 !w-5 text-blue-500" />
                {getWishlistTotalItems() > 0 && (
                  <Badge className="absolute -top-1 right-9 h-4 w-4 bg-blue-500 text-white rounded-full p-0 flex items-center justify-center text-xs">
                    {getWishlistTotalItems()}
                  </Badge>
                )}
                <span className="text-base hover:text-blue-500">Wishlist</span>
              </Button>
            </div>
            <div className="w-full">
              {/* Cart */}
              <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
                <MdAddShoppingCart className="!h-6 !w-6 text-blue-500" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-1 right-5 h-4 w-4 bg-blue-500 text-white rounded-full p-0 flex items-center justify-center text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
                <span className="hover:text-blue-500 text-base">Cart</span>
              </Button>
            </div>




          </div>
        </div>

      </div>
      <div className="flex md:hidden items-center justify-between p-2">
        <div className="flex flex-row gap-4">
          <Link href="/aarogyamart" className="flex items-center gap-2">
            <Image
              src="https://res.cloudinary.com/dorreici1/image/upload/v1758624955/Gemini_Generated_Image_g3i2u0g3i2u0g3i2-removebg-preview_hcj8l3.png"
              width={180}
              height={200}
              alt="Aarogya Aadhar Logo"
              className="h-[50px] w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>
        <div className="px-4 py-4 flex items-center gap-4 justify-start">
          <Button variant="ghost" size="icon" onClick={toggleWishlist} className="relative">
            <FaRegHeart className="text-blue-500 !h-6 !w-6" />
            {getWishlistTotalItems() > 0 && (
              <Badge className="absolute -top-1 right-1 h-4 w-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                {getWishlistTotalItems()}
              </Badge>
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleCart} className="relative">
            <MdAddShoppingCart className="text-blue-500 !h-6 !w-6" />
            {getTotalItems() > 0 && (
              <Badge className="absolute -top-1 right-1 h-4 w-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                {getTotalItems()}
              </Badge>
            )}
          </Button>
          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FiX className="!h-6 !w-6" /> : <HiMenuAlt2 className="!h-6 !w-6" />}
          </Button>
        </div>

      </div>
        {/* Mobile Search */}
        <div className="md:hidden m-4">
          <SearchSuggestions className="w-full" placeholder="Search medical equipment..." />
        </div>

      {/* Navigation */}
      <nav className="xl:container">
        <div className="mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-start py-3 lg:gap-0 xl:gap-4">
            <Link href="/aarogyamart/products">
              <Button variant="ghost" className="flex items-center ...">
                <BiGridAlt className="h-4 w-4 " />
                All Products
              </Button>
            </Link>

            {categories.slice(0, 7).map((cat) => {  // Limit to 7 categories
              const [start, end] = getRandomGradient();
              return (
                <Link key={cat.id} href={`/aarogyamart/category/${cat.id}`} className="overflow-hidden">
                  <Button variant="ghost" className="flex ... gap-2 !text-gray-800">
                    <span>{cat.name}</span>
                  </Button>
                </Link>
              )
            })}
          </div>
          {/* Mobile Menu Drawer */}
          {isMenuOpen && (
            <div className="fixed top-0 right-0 h-full w-full bg-white z-50 shadow-lg overflow-y-auto transition-transform duration-300">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold">Menu</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                  <FiX className="h-6 w-6" />
                </Button>
              </div>

              {/* Seller Button */}
              <div className="px-4 py-2">
                <Button className="bg-blue-500 hover:bg-blue-500 rounded-xl text-white w-full flex  items-center justify-center gap-2">
                  <Link href={'/martseller'} className="flex items-center gap-2">Are You Seller<BsFillPatchQuestionFill className="text-white" /></Link>
                </Button>
              </div>

              {/* User Login / Dropdown */}
              <div className="px-4 py-2" ref={dropdownRef}>
                <Button
                  className="w-full flex items-center rounded-xl text-blue-500 border justify-center"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  <span>{role ? role : "Login"}</span>
                  {role ? <FaUser className="text-blue-500" /> : <CiLogin className="text-blue-500"/>}
                </Button>
                {open && (
                  <ul className="mt-2 bg-white shadow rounded-xl border text-gray-700">
                    {role ? (
                      <>
                        {/* Logged-in dashboard links */}
                        <li><Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link></li>
                        <li><Link href="/aarogyamart/account" className="block px-4 py-2 hover:bg-gray-100">Account</Link></li>
                        <li><Link href="/aarogyamart/orders" className="block px-4 py-2 hover:bg-gray-100">Orders</Link></li>
                      </>
                    ) : (
                      loginRoles.map((r) => (
                        <li key={r.title}><Link href={r.link} className="block px-4 py-2 hover:bg-gray-100">{r.title} Login</Link></li>
                      ))
                    )}
                  </ul>
                )}
              </div>

              {/* All Products */}
              <div className="px-4 py-2">
                <Link href="/aarogyamart/products">
                  <Button className="w-full flex items-center gap-2">
                    <BiGridAlt /> All Products
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
