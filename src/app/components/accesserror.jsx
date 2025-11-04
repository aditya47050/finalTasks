"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ShieldAlert,
  User,
  CreditCard,
  Clock,
  CheckCircle,
  ArrowLeft,
  Wallet,
  Percent,
  HandCoins,
  Building,
  Hospital,
  BedDouble,
  Ambulance,
  Star,
  MapPin,
  Shield,
  FileText,
  HeartPulse,
  ShieldCheck,
  Home,
  Timer,
  BadgeIcon as IdCard,
  Landmark,
  ShoppingBag,
  Handshake,
} from "lucide-react"

export default function AnimatedAccessDenied() {
  const [isVisible, setIsVisible] = useState(false)
  const [step1Complete, setStep1Complete] = useState(false)
  const [step2Complete, setStep2Complete] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="w-full bg-white min-h-screen pb-4  md:pl-[32px] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#5271FF]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#5271FF]/5 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      </div>

      <div
        className={` w-full relative z-10 transform md:pr-[32px] transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="bg-white overflow-hidden ">
          {/* Header with white background and #5271FF accents */}
          <div className="bg-white  p-8 text-center relative ">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#5271FF]/5 to-transparent -skew-x-12 transform translate-x-full animate-shimmer"></div>
            <div className="relative z-10">
              <div className="relative inline-block">
                <div className="absolute -inset-4 bg-[#5271FF]/10 rounded-full blur-lg animate-pulse"></div>
                <ShieldAlert className="h-16 w-16 mx-auto mb-4 text-[#5271FF] relative animate-bounce-slow" />
              </div>
              <h1 className="text-3xl font-bold mb-2 text-gray-800 animate-fade-in-up">Service Access Required</h1>
              <p className="text-gray-600 animate-fade-in-up animation-delay-200">
                Complete verification to access Aarogya Aadhar services
              </p>
            </div>
          </div>

          <div className="xs:py-2 xs:px-2 md:py-8 md:px-[100px]">
            <div className="mb-8">
              <h2
                className={`text-xl font-semibold text-gray-800 mb-6 transform transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
                }`}
              >
                Required Steps for Access:
              </h2>
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                {/* Step 1 */}
                <div
                  className={`group transform transition-all duration-700 hover:scale-105 ${
                    isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
                  } animation-delay-300`}
                >
                  <div className="flex items-start p-6 bg-gradient-to-r from-white to-[#5271FF]/5 rounded-2xl border border-[#5271FF]/20 hover:border-[#5271FF]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#5271FF]/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#5271FF]/0 via-[#5271FF]/5 to-[#5271FF]/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#5271FF] to-[#5271FF]/80 rounded-full flex items-center justify-center mr-4 shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                      {step1Complete ? (
                        <CheckCircle className="h-5 w-5 text-white animate-scale-in" />
                      ) : (
                        <span className="text-white font-bold text-sm">1</span>
                      )}
                    </div>
                    <div className="flex-1 relative z-10">
                      <div className="flex items-center mb-2">
                        <User className="h-5 w-5 text-[#5271FF] mr-2 group-hover:animate-pulse" />
                        <h3 className="font-semibold text-gray-800 group-hover:text-[#5271FF] transition-colors">
                          Account Login
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">
                        Sign in to your registered Aarogya Aadhar account
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div
                  className={`group transform transition-all duration-700 hover:scale-105 ${
                    isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
                  } animation-delay-500`}
                >
                  <div className="flex items-start p-6 bg-gradient-to-r from-white to-[#5271FF]/5 rounded-2xl border border-[#5271FF]/20 hover:border-[#5271FF]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#5271FF]/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#5271FF]/0 via-[#5271FF]/5 to-[#5271FF]/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#5271FF] to-[#5271FF]/80 rounded-full flex items-center justify-center mr-4 shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                      {step2Complete ? (
                        <CheckCircle className="h-5 w-5 text-white animate-scale-in" />
                      ) : (
                        <span className="text-white font-bold text-sm">2</span>
                      )}
                    </div>
                    <div className="flex-1 relative z-10">
                      <div className="flex items-center mb-2">
                        <CreditCard className="h-5 w-5 text-[#5271FF] mr-2 group-hover:animate-pulse" />
                        <h3 className="font-semibold text-gray-800 group-hover:text-[#5271FF] transition-colors">
                          Health Card Verification
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">
                        Ensure your health card is registered and Approved
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access Section */}
            <div
              className={`transform transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              } animation-delay-700`}
            >
              <div className="bg-gradient-to-r from-white to-[#5271FF]/5 rounded-2xl p-6 mb-8 border border-[#5271FF]/20 hover:border-[#5271FF]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#5271FF]/10 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#5271FF]/0 via-[#5271FF]/3 to-[#5271FF]/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-3">
                    <div className="relative">
                      <Clock className="h-5 w-5 text-[#5271FF] mr-2 animate-spin-slow" />
                      <div className="absolute inset-0 bg-[#5271FF] rounded-full animate-ping opacity-20"></div>
                    </div>
                    <h3 className="font-semibold text-gray-800">Quick Access</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-6">
                    Once verified, {"you'll"} have instant access to all healthcare services including appointments, medical
                    records, and emergency services.
                  </p>

                  {/* ICON GRID SECTION */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                    {[
                      {
                        icon: <Wallet className="w-8 h-8 text-[#5271FF]" />,
                        text1: "Financial",
                        text2: "Medical Help",
                      },
                      { icon: <Percent className="w-8 h-8 text-[#5271FF]" />, text1: "Upto 70%", text2: "Discount" },
                      {
                        icon: <HandCoins className="w-8 h-8 text-[#5271FF]" />,
                        text1: "Affordability",
                        text2: "Services",
                      },
                      { icon: <User className="w-8 h-8 text-[#5271FF]" />, text1: "Free Doctor", text2: "Appointment" },
                      {
                        icon: <Building className="w-8 h-8 text-[#5271FF]" />,
                        text1: "6000+ HSP",
                        text2: "In Pan India",
                      },
                      {
                        icon: <Hospital className="w-8 h-8 text-[#5271FF]" />,
                        text1: "Hospital &",
                        text2: "HSP Facilities",
                      },
                      { icon: <BedDouble className="w-8 h-8 text-[#5271FF]" />, text1: "Bed", text2: "Availability" },
                      { icon: <Ambulance className="w-8 h-8 text-[#5271FF]" />, text1: "24/7", text2: "Ambulance" },
                      { icon: <Star className="w-8 h-8 text-[#5271FF]" />, text1: "Service Rating", text2: "& Review" },
                      { icon: <MapPin className="w-8 h-8 text-[#5271FF]" />, text1: "Nearby", text2: "Locations" },
                      {
                        icon: <Shield className="w-8 h-8 text-[#5271FF]" />,
                        text1: "All Insurance",
                        text2: "Health Card",
                      },
                      { icon: <FileText className="w-8 h-8 text-[#5271FF]" />, text1: "Cost of", text2: "Treatment" },
                      { icon: <HeartPulse className="w-8 h-8 text-[#5271FF]" />, text1: "Quality", text2: "Treatment" },
                      { icon: <ShieldCheck className="w-8 h-8 text-[#5271FF]" />, text1: "Patient", text2: "Safety" },
                      { icon: <Home className="w-8 h-8 text-[#5271FF]" />, text1: "Home", text2: "Healthcare" },
                      { icon: <Timer className="w-8 h-8 text-[#5271FF]" />, text1: "Treatment", text2: "Waiting Time" },
                      { icon: <IdCard className="w-8 h-8 text-[#5271FF]" />, text1: "ABHA ID", text2: "Ayushman Card" },
                      { icon: <Landmark className="w-8 h-8 text-[#5271FF]" />, text1: "Government Health", text2: "Schemes" },
                      { icon: <ShoppingBag className="w-8 h-8 text-[#5271FF]" />, text1: "Aarogya", text2: "Mart" },
                      { icon: <Handshake className="w-8 h-8 text-[#5271FF]" />, text1: "Aarogya", text2: "Mitra" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-[#5271FF]/5 transition-all duration-300 group/item"
                      >
                        <div className="transform group-hover/item:scale-110 transition-transform duration-300">
                          {item.icon}
                        </div>
                        <p className="text-xs font-semibold mt-2">
                          <span className="block text-[#5271FF]">{item.text1}</span>
                          <span className="block text-gray-700">{item.text2}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              } animation-delay-900`}
            >
              <Link
                href="/patient/login"
                className="group flex-1 px-3 py-2 md:px-6 md:py-4 bg-gradient-to-r from-[#5271FF] to-[#5271FF]/90 text-white rounded-2xl hover:from-[#5271FF]/90 hover:to-[#5271FF] transition-all duration-300 font-semibold text-center transform hover:scale-105 hover:shadow-xl hover:shadow-[#5271FF]/20 relative overflow-hidden"
                onMouseEnter={() => setStep1Complete(true)}
                onMouseLeave={() => setStep1Complete(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <User className="hidden md:block h-4 w-4 group-hover:animate-bounce" />
                  Login to Account
                </span>
              </Link>

              <Link
                href="/patient/register"
                className="group flex-1 px-3 py-2 md:px-6 md:py-4 bg-white border-2 border-[#5271FF] text-[#5271FF] rounded-2xl hover:bg-[#5271FF] hover:text-white transition-all duration-300 font-semibold text-center transform hover:scale-105 hover:shadow-xl hover:shadow-[#5271FF]/20 relative overflow-hidden"
                onMouseEnter={() => setStep2Complete(true)}
                onMouseLeave={() => setStep2Complete(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#5271FF]/0 via-[#5271FF]/10 to-[#5271FF]/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <CreditCard className="hidden md:block h-4 w-4 group-hover:animate-bounce" />
                  Check Health Card
                </span>
              </Link>

              <Link
                href="/"
                className="group px-3 py-2 md:px-6 md:py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-[#5271FF]/30 hover:text-[#5271FF] transition-all duration-300 flex items-center justify-center gap-2 font-medium transform hover:scale-105 hover:shadow-lg"
              >
                <ArrowLeft className="hidden md:block h-4 w-4 group-hover:animate-bounce-left" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes bounce-left {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-5px); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-bounce-left {
          animation: bounce-left 0.6s ease-in-out;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        .animation-delay-700 {
          animation-delay: 700ms;
        }
        .animation-delay-900 {
          animation-delay: 900ms;
        }
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  )
}
