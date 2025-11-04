"use client"

import React from "react"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Star, Calendar } from "lucide-react"
import { FaHospitalAlt, FaAward, FaRegClock, FaMapMarkedAlt } from "react-icons/fa"
import { RiAwardFill, RiHospitalFill, RiStarFill } from "react-icons/ri"
import { LuCalendarClock } from "react-icons/lu"
import Autoplay from "embla-carousel-autoplay"
import HeadingClientMain from "@/app/components/heading"
import { useSearchParams } from "next/navigation"
import BookSurgeryTreatmentclient from "./booksurgeryandtreatment"

const HospitalSingleView = ({ hospitaldata, hospital, patientId }) => {
  
  const images = [
    hospitaldata?.hspdetails?.hsplogo,
    hospitaldata?.hspdetails?.hspregcertificate,
    hospitaldata?.hspdetails?.nabhnablcertificate,
  ].filter(Boolean)
  console.log(hospitaldata.role);

  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: true }))

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("about")

  const stats = [
    {
      icon: <FaHospitalAlt className="md:h-7 md:w-7 h-5 w-5" />,
      label: "6+ Network Hospitals",
    },
    hospitaldata?.hspInfo?.experience && {
      icon: <RiAwardFill className="md:h-7 md:w-7 h-5 w-5" />,
      label: `${hospitaldata.hspInfo.experience} Experience`,
    },
    {
      icon: <LuCalendarClock className="md:h-7 md:w-7 h-5 w-5" />,
      label: "Book Now",
      onClick: () => setDialogOpen(true),
    },
    {
      icon: <RiStarFill className="md:h-7 md:w-7 h-5 w-5" />,
      label: "Hospital Reviews",
    },
  ].filter(Boolean)

  const searchParams = useSearchParams()
  const serviceId = searchParams.get("serviceId")

  return (
    <div className=" min-h-screen md:container lg:pl-[40px] lg:pr-[50px] xl:px-[60px] xlg:container font-sans">
      <HeadingClientMain main={""} />

      {/* Hero Section with Gradient Background */}
      <div className=" text-[#5271FF] py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col xs:flex-row items-center gap-6">
            {/* Hospital Logo */}
            <div className="relative">
              {hospitaldata?.hspdetails?.hsplogo ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-[#5271FF] rounded-full blur-md opacity-30"></div>
                  <Image
                    src={hospitaldata.hspdetails.hsplogo || "/placeholder.svg"}
                    width={140}
                    height={140}
                    alt={hospitaldata.hspInfo?.regname || "Hospital"}
                    className="rounded-full h-32 w-32 object-cover border-4 border-[#5271FF] shadow-xl relative z-10"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 bg-white/20 backdrop-blur-sm border-4 border-[#5271FF] rounded-full flex items-center justify-center text-[#5271FF]">
                  <RiHospitalFill className="h-16 w-16" />
                </div>
              )}

              {/* Rating Badge */}
              <div className="absolute -bottom-2 -right-2 bg-amber-400 text-blue-900 rounded-full px-3 py-1 text-sm font-bold flex items-center gap-1 shadow-lg">
                <Star className="h-4 w-4 fill-current" />
                <span>4.8</span>
              </div>
            </div>

            {/* Hospital Info */}
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <h1 className="text-2xl lg:text-3xl font-bold">{hospitaldata?.hspInfo?.regname || "Hospital Name"}</h1>

              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge className="bg-blue-700 hover:bg-blue-800 text-white">Premium</Badge>
                <Badge className="bg-green-600 hover:bg-green-700 text-white">Verified</Badge>
                {hospitaldata?.role && (
                  <Badge className="bg-purple-600 hover:bg-purple-700 text-white">{hospitaldata.role}</Badge>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 text-sm mt-2">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-full">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span>
                    {hospitaldata?.hspcontact?.city} {hospitaldata?.hspcontact?.state || "Not available"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-full">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span>{hospitaldata?.mobile || "Not available"}</span>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={() => setDialogOpen(true)}
                className="mt-4 bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold py-2.5 px-6 rounded-full transition-all shadow-lg flex items-center gap-2"
              >
                Book Appointment <Calendar className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section */}
          <div className="lg:w-3/5 space-y-8">
            {/* Stats Grid */}
            <div className="grid xs:grid-cols-3 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  onClick={stat.onClick}
                  className={`flex flex-col bg-white rounded-xl items-center gap-3 p-4 text-center shadow-md border border-gray-100 transition-all ${
                    stat.onClick ? "cursor-pointer hover:shadow-lg hover:border-blue-200" : ""
                  }`}
                >
                  <div className="text-blue-600 bg-blue-50 p-3 rounded-full">{stat.icon}</div>
                  <span className="text-sm text-gray-700 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto space-x-2 pb-2 border-b border-gray-200">
              {["about"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* About Section */}
            {activeTab === "about" && (
              <Card className="shadow-md border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-2">
                  <CardTitle className="text-xl text-blue-800">Hospital Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-sm font-semibold text-gray-500 block mb-1">Hospital Type</label>
                        <p className="text-gray-900 font-medium">{hospitaldata?.role || "Not specified"}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-sm font-semibold text-gray-500 block mb-1">Service Area</label>
                        <div className="flex items-center gap-2">
                          <FaMapMarkedAlt className="text-blue-600" />
                          <p className="text-gray-900 font-medium">Pincode - {hospitaldata?.pincode || "N/A"}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-sm font-semibold text-gray-500 block mb-1">Established</label>
                        <p className="text-gray-900 font-medium">
                          {hospitaldata?.hspInfo?.experience
                            ? `${new Date().getFullYear() - Number.parseInt(hospitaldata.hspInfo.experience)}`
                            : "Not specified"}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-sm font-semibold text-gray-500 block mb-1">Working Hours</label>
                        <div className="flex items-center gap-2">
                          <FaRegClock className="text-blue-600" />
                          <p className="text-gray-900 font-medium">24/7 Emergency Services</p>
                        </div>
                      </div>
                    </div>

                    {hospitaldata?.hspdetails?.hspdescription && (
                      <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-600">
                        <label className="text-sm font-semibold text-blue-800 block mb-2">About the Hospital</label>
                        <p className="text-gray-700 leading-relaxed">{hospitaldata.hspdetails.hspdescription}</p>
                      </div>
                    )}

                    {/* Facilities */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <FaAward className="text-amber-500" /> Facilities & Amenities
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {["ICU", "Emergency Care", "Pharmacy", "Laboratory", "Radiology", "Cafeteria"].map(
                          (facility) => (
                            <div key={facility} className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-gray-700">{facility}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Section */}
          <div className="lg:w-2/5 space-y-8">
            {/* Image Carousel with Enhanced UI */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-0">
                <Carousel
                  plugins={[plugin.current]}
                  className="w-full"
                  onMouseEnter={plugin.current.stop}
                  onMouseLeave={plugin.current.reset}
                >
                  <CarouselContent>
                    {images.length > 0 ? (
                      images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="relative w-full h-72 p-1">
                            <Image
                              src={image || "/placeholder.svg"}
                              fill
                              className="rounded-xl object-cover"
                              alt={`Hospital Image ${index + 1}`}
                            />
                            <div className="absolute bottom-4 left-4">
                              <div className="bg-white/80 backdrop-blur-sm p-2 rounded-xl shadow-lg">
                                <div className="flex gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${i < 4 ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs font-medium text-white drop-shadow-md mt-2">129 Reviews</p>
                            </div>
                          </div>
                        </CarouselItem>
                      ))
                    ) : (
                      <CarouselItem>
                        <div className="relative w-full h-72 p-1 bg-gray-100 flex items-center justify-center">
                          <p className="text-gray-500">No images available</p>
                        </div>
                      </CarouselItem>
                    )}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </CardContent>
            </Card>

            {/* Advertisements with enhanced design */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                <Image
                  src="https://res.cloudinary.com/dnckhli5u/image/upload/v1723620961/mtfbf3czjsix5cnpyzv6.png"
                  width={500}
                  height={300}
                  className="w-full h-auto object-cover rounded-xl border-2 border-orange-500"
                  alt="Advertisement"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  
                </div>
              </div>
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                <Image
                  src="https://res.cloudinary.com/dnckhli5u/image/upload/v1723620961/mtfbf3czjsix5cnpyzv6.png"
                  width={500}
                  height={300}
                  className="w-full h-auto object-cover rounded-xl border-2 border-orange-500"
                  alt="Advertisement"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookSurgeryTreatmentclient
        open={dialogOpen}
        hospitalid={hospitaldata.id}
        onOpenChange={setDialogOpen}
        patientId={patientId}
        serviceId={serviceId}
        hspRole={hospitaldata.role}
      />
    </div>
  )
}

export default HospitalSingleView
