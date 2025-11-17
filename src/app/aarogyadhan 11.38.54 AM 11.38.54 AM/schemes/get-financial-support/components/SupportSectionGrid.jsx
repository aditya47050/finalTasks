"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Heart, Users, Shield, ArrowRight, Sparkles } from "lucide-react"

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
]

const platforms = ["Ketto", "Milaap", "ImpactGuru", "GoFundMe", "Other"]

const sections = [
  {
    title: "State Health Coverage",
    subtitle: "Reimbursement Schemes",
    description:
      "Discover comprehensive health insurance and reimbursement programs available in your state. Get financial support for medical treatments and procedures.",
    type: "state",
    image:
      "https://res.cloudinary.com/dorreici1/image/upload/v1752228655/pngtree-india-flag-in-map-pin-png-image_8523373_ozksk4.png",
    icon: Shield,
    primaryColor: "emerald",
    bgPattern: "dots",
  },
  {
    title: "Government Funding",
    subtitle: "Financial Assistance",
    description:
      "Access state-sponsored funding schemes designed to make healthcare affordable. Find grants and subsidies for your medical expenses.",
    type: "state",
    image:
      "https://res.cloudinary.com/dorreici1/image/upload/v1752228655/pngtree-india-flag-in-map-pin-png-image_8523373_ozksk4.png",
    icon: MapPin,
    primaryColor: "blue",
    bgPattern: "grid",
  },
  {
    title: "Community Support",
    subtitle: "Crowdfunding Platforms",
    description:
      "Connect with compassionate communities online. Raise funds through trusted crowdfunding platforms with millions of supporters.",
    type: "platform",
    image: "https://res.cloudinary.com/dorreici1/image/upload/v1752228808/download_gaokva.png",
    icon: Users,
    primaryColor: "purple",
    bgPattern: "waves",
  },
  {
    title: "Pharmaceutical Aid",
    subtitle: "Patient Support Programs",
    description:
      "Explore comprehensive assistance programs from pharmaceutical companies. Access free medications, copay assistance, and treatment support.",
    type: "none",
    image: "https://res.cloudinary.com/dorreici1/image/upload/v1752228931/SIP-1_roqaxw.jpg",
    icon: Heart,
    primaryColor: "rose",
    bgPattern: "circles",
  },
]

const colorSchemes = {
  emerald: {
    bg: "bg-gradient-to-br from-emerald-50 via-white to-teal-50",
    card: "bg-white/80",
    accent: "bg-emerald-500",
    text: "text-emerald-600",
    button: "bg-emerald-600 hover:bg-emerald-700",
    ring: "focus:ring-emerald-500",
    border: "border-emerald-200",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-50 via-white to-cyan-50",
    card: "bg-white/80",
    accent: "bg-blue-500",
    text: "text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
    ring: "focus:ring-blue-500",
    border: "border-blue-200",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 via-white to-violet-50",
    card: "bg-white/80",
    accent: "bg-purple-500",
    text: "text-purple-600",
    button: "bg-purple-600 hover:bg-purple-700",
    ring: "focus:ring-purple-500",
    border: "border-purple-200",
  },
  rose: {
    bg: "bg-gradient-to-br from-rose-50 via-white to-pink-50",
    card: "bg-white/80",
    accent: "bg-rose-500",
    text: "text-rose-600",
    button: "bg-rose-600 hover:bg-rose-700",
    ring: "focus:ring-rose-500",
    border: "border-rose-200",
  },
}

export default function SupportSection() {
  const [stateSearch, setStateSearch] = useState("")
  const [platformSearch, setPlatformSearch] = useState("")
  const router = useRouter()

  const handleStateChange = (value, sectionTitle) => {
    const isFunding = sectionTitle === "Government Funding"
    const route = isFunding ? "/aarogyadhan/funding-support" : "/aarogyadhan/state-support"
    router.push(`${route}?state=${encodeURIComponent(value)}`)
  }

  const handlePlatformChange = (value) => {
    router.push(`/aarogyadhan/crowdfunding-platform?platform=${encodeURIComponent(value)}`)
  }

  const filteredStates = states.filter((s) => s.toLowerCase().includes(stateSearch.toLowerCase()))

  const filteredPlatforms = platforms.filter((p) => p.toLowerCase().includes(platformSearch.toLowerCase()))

  return (
    <section className=" bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(0,0,0)_1px,transparent_0)] bg-[length:20px_20px]" />
      </div>

      <div className="md:container mx-auto px-2 md:px-4 lg:px-8 max-w-7xl relative">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Available Support
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Programs
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover various financial assistance programs designed to help patients and families navigate cancer
                treatment costs.
          </p>
        </div>

        {/* Support Cards */}
        <div className="space-y-24">
          {sections.map((section, index) => {
            const isEven = index % 2 === 0
            const colors = colorSchemes[section.primaryColor]
            const IconComponent = section.icon

            return (
              <div
                key={index}
                className={`flex flex-col ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-12 lg:gap-20`}
              >
                {/* Content Card */}
                <div className="w-full lg:w-1/2">
                  <Card
                    className={`group relative overflow-hidden ${colors.card} backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3`}
                  >
                    {/* Decorative Elements */}
                    <div className={`absolute top-0 left-0 w-full h-2 ${colors.accent}`} />
                    <div
                      className={`absolute -top-10 -right-10 w-32 h-32 ${colors.accent} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500`}
                    />

                    <CardContent className="p-10 lg:p-12 relative">
                      {/* Icon Badge */}
                      <div
                        className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl ${colors.bg} ${colors.border} border-2 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                      >
                        <IconComponent className={`w-10 h-10 ${colors.text}`} />
                      </div>

                      {/* Title */}
                      <div className="mb-8">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                          {section.title}
                        </h2>
                        <p className={`text-lg font-medium ${colors.text} mb-4`}>{section.subtitle}</p>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 text-lg leading-relaxed mb-10">{section.description}</p>

                      {/* Interactive Elements */}
                      <div className="space-y-6">
                        {/* State Dropdown */}
                        {section.type === "state" && (
                          <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-800 block uppercase tracking-wide">
                              Select Your State
                            </label>
                            <Select onValueChange={(value) => handleStateChange(value, section.title)}>
                              <SelectTrigger
                                className={`w-full h-14 bg-white border-2 ${colors.border} hover:border-gray-300 ${colors.ring} focus:border-transparent rounded-2xl transition-all duration-300 text-base`}
                              >
                                <SelectValue placeholder="Choose your state..." />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                                <div className="p-4 border-b border-gray-100">
                                  <Input
                                    placeholder="Search state..."
                                    value={stateSearch}
                                    onChange={(e) => setStateSearch(e.target.value)}
                                    className="border-gray-200 rounded-xl h-12"
                                  />
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                  {filteredStates.map((state) => (
                                    <SelectItem
                                      key={state}
                                      value={state}
                                      className="py-4 px-6 hover:bg-gray-50 cursor-pointer text-base"
                                    >
                                      {state}
                                    </SelectItem>
                                  ))}
                                </div>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Platform Dropdown */}
                        {section.type === "platform" && (
                          <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-800 block uppercase tracking-wide">
                              Choose Platform
                            </label>
                            <Select onValueChange={handlePlatformChange}>
                              <SelectTrigger
                                className={`w-full h-14 bg-white border-2 ${colors.border} hover:border-gray-300 ${colors.ring} focus:border-transparent rounded-2xl transition-all duration-300 text-base`}
                              >
                                <SelectValue placeholder="Select platform..." />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                                <div className="p-4 border-b border-gray-100">
                                  <Input
                                    placeholder="Search platform..."
                                    value={platformSearch}
                                    onChange={(e) => setPlatformSearch(e.target.value)}
                                    className="border-gray-200 rounded-xl h-12"
                                  />
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                  {filteredPlatforms.map((platform) => (
                                    <SelectItem
                                      key={platform}
                                      value={platform}
                                      className="py-4 px-6 hover:bg-gray-50 cursor-pointer text-base"
                                    >
                                      {platform}
                                    </SelectItem>
                                  ))}
                                </div>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Explore Button for Patient Support Programs */}
                        {section.title === "Pharmaceutical Aid" && (
                          <div className="pt-6 flex justify-center mx-auto">
                            <Button
                              onClick={() => router.push("/patient-support")}
                              className={`group w-full sm:w-auto px-8 py-4 h-auto ${colors.button} text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-base`}
                            >
                              <Heart className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                              Explore Programs
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Image Section */}
                <div className="w-full lg:w-1/2 flex justify-center">
                  <div className="relative group">
                    {/* Background Decoration */}
                    <div
                      className={`absolute -inset-8 ${colors.bg} rounded-[3rem] opacity-30 group-hover:opacity-50 transition-all duration-500 blur-xl`}
                    />

                    {/* Main Image Container */}
                    <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[480px] lg:h-[480px]">
                      <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500 border border-gray-100" />
                      <div className="relative p-8 h-full flex items-center justify-center">
                        <div className="relative w-full h-full">
                          <Image
                            src={section.image || "/placeholder.svg"}
                            alt={section.title}
                            fill
                            className="object-contain rounded-2xl group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 768px) 320px, (max-width: 1024px) 384px, 480px"
                          />
                        </div>
                      </div>

                      {/* Floating Badge */}
                      <div
                        className={`absolute right-2 -top-4 md:-right-4 w-12 h-12 ${colors.accent} rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Enhanced CTA Section */}
        <div className="mt-8 md:mt-32 text-center">
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-[2rem] xs:p-4 md:p-12 lg:p-16 shadow-2xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,white_2px,transparent_0)] bg-[length:40px_40px]" />
            </div>

            <div className="relative mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
                <Heart className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">Personalized Care</span>
              </div>

              <h3 className="xs:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">Need Expert Guidance?</h3>
              <p className="text-blue-100 text-[18px] xs:mb-4 md:mb-10 max-w-3xl mx-auto leading-relaxed">
                Our dedicated healthcare support specialists are ready to provide personalized assistance. Get expert
                guidance on funding options, program eligibility, and application processes.
              </p>

              <Button
                onClick={() => router.push("/contact-us")}
                className="group bg-white text-blue-600 hover:bg-blue-50 px-10 py-5 h-auto font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg"
              >
                <Users className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                Contact Us
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
