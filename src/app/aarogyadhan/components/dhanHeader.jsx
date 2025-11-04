"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LogOutIcon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import HelpCenterDialog from './help-center-dialog';

export function Header({ session }) {
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch("/api/kickback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        router.push("/aarogyadhan");
      } else {
        console.error("Logout failed:", await response.json());
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (


    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex gap-2">
            <Link href="/" className="flex items-center">
              <Image
                src="https://res.cloudinary.com/dnckhli5u/image/upload/v1724307243/aarogya%20aadhar/ytwdebp7hhsjd56z0vdb.png"
                width={180}
                height={200}
                alt="Aarogya Aadhar"
                className="xl:h-[60px] h-[40px] w-full"
              />
            </Link>
            <Link href="/aarogyadhan" className="flex items-center">
              <Image
                src="https://res.cloudinary.com/dnckhli5u/image/upload/v1729240926/2-2_pxsi7g.png"
                width={180}
                height={180}
                alt="Aarogyadhan"
                className="xl:h-[60px] h-[40px] w-full"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {!session ? (

              <>
                <Link href="/aarogyadhan/register">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#5271FF] text-white rounded-xl border-[#5271FF] hover:bg-[#365c99] font-poppins"
                  >
                    Register
                  </Button>
                </Link>
                <Link href="/aarogyadhan/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#5271FF] text-white rounded-xl border-[#5271FF] hover:bg-[#365c99] font-poppins"
                  >
                    Login
                  </Button>
                </Link>
                <HelpCenterDialog
              trigger={
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-[#FFDE59] to-[#FF914D] text-[#243460] rounded-xl hover:opacity-90 font-poppins font-bold"
                >
                  Help
                </Button>
              }
            />
              </>
            ) : (
              <>
                {pathname.includes("photographer") && (
                  <div className="flex justify-between gap-x-4">

                    <Link href="/aarogyadhan/photographer/campaigns">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-[#5271FF] text-white rounded-xl border-[#5271FF] hover:bg-[#365c99] font-poppins"
                      >
                        Campaigns
                      </Button>
                    </Link>
                    <Link href="/aarogyadhan/photographer/certificate">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-[#5271FF] text-white rounded-xl border-[#5271FF] hover:bg-[#365c99] font-poppins"
                      >
                        Certificate
                      </Button>
                    </Link>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 py-2 px-4 text-white bg-red-600 hover:bg-red-700 rounded-xl"
                >
                  <LogOutIcon className="h-5 w-5" />
                  <span>{loading ? "Logging out..." : "Logout"}</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-2 flex flex-col items-center gap-2 px-2 pb-4">
            {!session ? (
              <>
                <Link href="/aarogyadhan/register" className="w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-[#5271FF] text-white border-[#5271FF] hover:bg-[#365c99] rounded-xl font-poppins"
                  >
                    Register
                  </Button>
                </Link>
                <Link href="/aarogyadhan/login" className="w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-[#5271FF] text-white border-[#5271FF] hover:bg-[#365c99] rounded-xl font-poppins"
                  >
                    Login
                  </Button>
                </Link>
                <HelpCenterDialog 
              trigger={
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-[#FFDE59] to-[#FF914D] text-[#243460] rounded-xl hover:opacity-90 font-poppins font-bold"
                >
                  Help
                </Button>
              }
            />
              </>
            ) : (
              <>
                {pathname.includes("photographer") && (
                  <Link href="/aarogyadhan/photographer/campaigns" className="w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-[#5271FF] text-white border-[#5271FF] hover:bg-[#365c99] rounded-xl font-poppins"
                    >
                      Campaigns
                    </Button>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-4 text-white bg-red-600 hover:bg-red-700 rounded-xl"
                >
                  <LogOutIcon className="h-5 w-5" />
                  <span>{loading ? "Logging out..." : "Logout"}</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
