"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Autoplay from "embla-carousel-autoplay";
import {
  Briefcase,
  GraduationCap,
  Home,
  IndianRupee,
  MapPin,
  Star,
  Upload,
  Users,
} from "lucide-react";
import { GiMedicalPack, GiHospital } from "react-icons/gi";
import { LuCalendarClock } from "react-icons/lu";
import { FaAmbulance, FaHospitalAlt } from "react-icons/fa";
import { FaHouseMedicalCircleCheck, FaUserDoctor } from "react-icons/fa6";
import { RiAwardFill } from "react-icons/ri";
import {
  Phone,
  User,
  Shield,
  Truck,
  CheckCircle,
  Clock,
  Award,
  Heart,
} from "lucide-react";
import HeadingClientMain from "@/app/components/heading";
import { PiCurrencyInr } from "react-icons/pi";
import { HiOutlinePhoto } from "react-icons/hi2";
import ImageCarouselDialog from "@/app/components/gallerysliders";
import BookAmbulance from "@/app/components/ambulance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UploadButton } from "@uploadthing/react";
import { toast } from "react-toastify";
import BookDiagnosticDialog from './../../../../category/[labtestid]/[labtestdetailsid]/components/booklabtest';
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
const SinglePathlogyClient = (hospitaldetails) => {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );
    const images = [
    hospitaldetails?.hspdetails?.hsplogo,
    hospitaldetails?.hspdetails?.hspregcertificate,
    hospitaldetails?.hspdetails?.nabhnablcertificate,
  ];
  const [loading, setLoading] = useState(false);
  const stats = [
    {
      icon: <button onClick={() => setDialogOpen(true)} className="text-[#2b73ec]">
        <FaHospitalAlt className="md:h-8 md:w-8 h-6 w-6" />
        </button>,
      label: ` Book Appointment`,
    },
    {
        icon:<FaUserDoctor className="md:h-8 md:w-8 h-6 w-6" />,
        label:'In-house Doctor`s'
    },
     {
      icon: <RiAwardFill className="md:h-8 md:w-8 h-6 w-6" />,
      label: `${hospitaldetails?.hospitaldetails?.hspInfo?.experience || 11}+     Experience`,
    },
     {
      icon: <Users className="md:h-8 md:w-8 h-6 w-6" />,
      label: `${hospitaldetails?.BookAmbulance?.length || 100}+    Patient's`,
    },
     {
      icon: <FaHouseMedicalCircleCheck className="md:h-8 md:w-8 h-6 w-6" />,
      label: "Home Healthcare",
    },

    {
      icon: <Star className="md:h-8 md:w-8 h-6 w-6" />,
      label: "HSP Reviews",
    },
  ].filter(Boolean);
  return (
    <div className="container mx-auto font-semibold px-4 py-6 xl:px-[60px] xlg:container font-sans">
        <div className="xs:p-3 xs:mb-6 md:p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Section */}
            <div className="lg:w-3/5 space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col xs:flex-row items-center sm:items-start gap-6">
                {/* Profile Image */}
                {hospitaldetails?.hspdetails ? (
                  <Image
                    src={
                      hospitaldetails?.ambulanceimagefront || "/placeholder.svg"
                    }
                    width={120}
                    height={120}
                    alt={hospitaldetails?.ambulancetype || "Ambulance"}
                    className="rounded-full h-28 w-28 object-cover border-4 border-[#ff5e00] shadow-lg"
                  />
                ) : (
                  <div className="w-28 h-28 bg-white border-4 border-[#ffce38] rounded-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                <div className="flex-1 space-y-4 text-center sm:text-left">
                  <h1 className="text-[#ff5e00] text-xl lg:text-2xl font-semibold">
                    NABL Accredited {hospitaldetails?.hospitaldetails?.hspInfo?.regname}
                  </h1>

                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex items-center gap-2 text-[#243460]">
                      <MapPin className="h-5 w-5 text-blue-700 shrink-0" />
                      <span>
                        Location : {hospitaldetails?.hospitaldetails?.hspcontact?.city && hospitaldetails?.hospitaldetails?.hspcontact?.state
                                  ? `${hospitaldetails?.hospitaldetails?.hspcontact.city} - ${hospitaldetails?.hospitaldetails?.hspcontact.state}`
                                  : hospitaldetails?.hospitaldetails?.pincode}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#243460]">
                      <Phone className="h-5 w-5 text-blue-700 shrink-0" />
                        <span className="flex flex-row items-center"> Contact No : {hospitaldetails?.hospitaldetails?.mobile}
                        </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3  xs:grid-cols-3 xl:grid-cols-6 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex flex-col bg-[#e9e8e9] rounded-[15px]  items-center gap-2 p-2 text-center"
                  >
                    <div className="text-[#2b73ec]">{stat.icon}</div>
                    <span className="xs:text-xs md:text-xs text-[#243460] font-semibold">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* About Section */}
              <div className="space-y-4">
                <button className="bg-[#FF5E00] text-white py-2 px-8 rounded-full font-medium shadow-lg mx-auto block">
                  About
                </button>
                <div className="rounded-xl p-4 text-sm text-[#243460] text-justify">
                  <Card className="shadow-lg border-0 bg-white">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Pathology Information
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-semibold text-gray-600">
                              Type
                            </label>
                            <p className="text-gray-900">
                              {hospitaldetails?.ambulancetype || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-600">
                              Category
                            </label>
                            <p className="text-gray-900">
                              {hospitaldetails?.ambulancecategory ||
                                "Not specified"}
                            </p>
                          </div>
                          {/* <div>
                            <label className="text-sm font-semibold text-gray-600">
                              Registration Number
                            </label>
                            <p className="text-gray-900">
                              {hospitaldetails?.ambulancercno || "Not available"}
                            </p>
                          </div> */}
                          <div>
                            <label className="text-sm font-semibold text-gray-600">
                              Service Area
                            </label>
                            <p className="text-gray-900">
                              Pincode{" "}
                              {hospitaldetails?.ambulanceareapincode || "N/A"}
                            </p>
                          </div>
                        </div>

                        {hospitaldetails?.facilities && (
                          <div>
                            <label className="text-sm font-semibold text-gray-600">
                              Facilities
                            </label>
                            <p className="text-gray-900">
                              {hospitaldetails.facilities}
                            </p>
                          </div>
                        )}

                        {/* Hospital Information */}
                        {hospitaldetails?.ambulance?.AmbulanceHsp && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">
                                Service Provider
                              </h4>
                              <div className="space-y-2">
                                <div>
                                  <p>
                                    <span className="font-medium">Name:</span>{" "}
                                    {
                                      hospitaldetails?.ambulance?.AmbulanceHsp?.hspregname
                                        
                                    }
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Location:
                                    </span>{" "}
                                    {hospitaldetails.ambulance.AmbulanceHsp.city},{" "}
                                    {hospitaldetails.ambulance.AmbulanceHsp.state}
                                  </p>

                                  <p>
                                    <span className="font-medium">
                                      Description:
                                    </span>{" "}
                                    {
                                      hospitaldetails.ambulance.AmbulanceHsp
                                        .hspdescription
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Categories */}
                        {hospitaldetails?.ambulance?.AmbulanceHsp?.categories &&
                          hospitaldetails.ambulance.AmbulanceHsp.categories
                            .length > 0 && (
                            <div>
                              <label className="text-sm font-semibold text-gray-600">
                                Hospital Categories
                              </label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {hospitaldetails.ambulance.AmbulanceHsp.categories.map(
                                  (cat, index) => (
                                    <Badge key={index} variant="secondary">
                                      {cat?.hspcategory?.title}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {/* Certifications */}
                        <div className="flex flex-wrap gap-3">
                          {hospitaldetails?.puc && (
                            <div className="flex items-center gap-2 bg-green-100 text-green-700 rounded-xl px-3 py-2 text-sm font-medium">
                              <CheckCircle className="h-4 w-4" />
                              PUC Certified
                            </div>
                          )}
                          {hospitaldetails?.insurance && (
                            <div className="flex items-center gap-2 bg-blue-100 text-blue-700 rounded-xl px-3 py-2 text-sm font-medium">
                              <Shield className="h-4 w-4" />
                              Insured
                            </div>
                          )}
                          {hospitaldetails.driver?.firstaidtraining && (
                            <div className="flex items-center gap-2 bg-green-100 text-green-700 rounded-xl px-3 py-2 text-sm font-medium">
                              <CheckCircle className="h-4 w-4" />
                              First Aid Training
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="lg:w-2/5 space-y-6">
              <Carousel
  plugins={[plugin.current]}
  className="w-full"
  onMouseEnter={plugin.current.stop}
  onMouseLeave={plugin.current.reset}
>
  <CarouselContent>
    {images.map((image, index) => (
      <CarouselItem key={index} className="basis-full">
        <div className="relative w-full h-64">
          <Image
            src={image || "/placeholder.svg"}   // ✅ use `image` instead of `hospitaldetails[imageKey]`
            fill
            className="bg-[#d9d9d9] rounded-xl object-cover"
            alt={`Pathology image ${index + 1}`} // ✅ unique alt
          />

          <div className="absolute bottom-4 left-4">
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < 4 ? "text-[#ffce38]" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs font-medium text-[#243460] mt-2">
              129 Reviews
            </p>
          </div>
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>

  <CarouselPrevious />
  <CarouselNext />
</Carousel>


              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((_, i) => (
                  <div key={i} className="aspect-square relative">
                    <Image
                      src="https://res.cloudinary.com/dnckhli5u/image/upload/v1723620961/mtfbf3czjsix5cnpyzv6.png"
                      fill
                      className="rounded-xl border-2 border-orange-600 object-cover"
                      alt="Advertisement"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <BookDiagnosticDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        patientId={hospitaldetails.patientId} // Replace with actual patient ID from auth/session/context
        serviceId={hospitaldetails?.testname?.id}
        hospitalId={hospitaldetails?.testname?.Hospital?.id}
      />
      </div>
  )
}

export default SinglePathlogyClient
