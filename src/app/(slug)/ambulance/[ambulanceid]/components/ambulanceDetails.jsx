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
import { FaHouseMedicalCircleCheck } from "react-icons/fa6";
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
import ReviewsDialog from "./reviews-dialog";

const AmbulanceSingleViewClient = ({
  ambulanceData,
  loggeduserId,
  patientdata,
}) => {
  const [loading, setLoading] = useState(false);
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  // Prepare ambulance images for carousel
  const ambulanceImages = [
    ambulanceData?.ambulanceimagefront,
    ambulanceData?.ambulanceimageback,
    ambulanceData?.ambulanceimageleft,
    ambulanceData?.ambulanceimageright,
    ambulanceData?.ambulanceimageinternal,
  ].filter(Boolean);
  // New state variables for additional inputs
  const [diseaseDetails, setDiseaseDetails] = useState("");
  const [medicalDoc1, setMedicalDoc1] = useState(null);
  const [medicalDoc2, setMedicalDoc2] = useState(null);
  const [medicalDoc3, setMedicalDoc3] = useState(null);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = [
    {
      icon: <FaHospitalAlt className="md:h-8 md:w-8 h-6 w-6" />,
      label: ` 6+ NetworkHospitals`,
    },
    ambulanceData?.ambulance?.AmbulanceHsp?.hsptotalexperience && {
      icon: <RiAwardFill className="md:h-8 md:w-8 h-6 w-6" />,
      label: `${ambulanceData?.ambulance?.AmbulanceHsp?.hsptotalexperience} Experience`,
    },
    ambulanceData?.BookAmbulance?.length > 0 && {
      icon: <Users className="md:h-8 md:w-8 h-6 w-6" />,
      label: `${ambulanceData?.BookAmbulance?.length}+ Patient's`,
    },
    ambulanceData?.ambulance?.AmbulanceHsp?.hsphomehealthcarevisit === true && {
      icon: <FaHouseMedicalCircleCheck className="md:h-8 md:w-8 h-6 w-6" />,
      label: "Home Healthcare",
    },

    {
      icon: <ReviewsDialog
            ambulanceid={ambulanceData.ambulance.id}        // pass doctor ID from props/data
            patientId={loggeduserId} // pass logged-in patient ID
          />,
      label: "Ambulance Reviews",
    },
  ].filter(Boolean); // Remove falsy values (undefined or false)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async () => {
   {
      try
       {
        setLoading(true);
        const res = await fetch("/api/ambulance/book-ambulance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ambulancetype: ambulanceData?.ambulancetype || "Not specified",
            ambulancecategory:
              ambulanceData?.ambulancecategory || "Not specified",
            hospitaltype:
              ambulanceData?.ambulance?.AmbulanceHsp?.categories
                ?.map((cat) => cat?.hspcategory?.title)
                .filter(Boolean)
                .join(", ") || "Not specified",
            ambulanceVaichicleId: ambulanceData?.id || "Not specified",
            diseaseDetails: diseaseDetails,
            medicaldoc1: medicalDoc1,
            medicaldoc2: medicalDoc2,
            medicaldoc3: medicalDoc3,
          }),
        });

        const data = await res.json();
        alert(data.message || data.error);
        setIsDialogOpen(false);
      } catch (error) {
        alert("Failed to book ambulance. Please try again.");
      } finally {
        setLoading(false);
      }
    } 
  };

  return (
    <>
      {" "}
      <div className="container mx-auto font-semibold px-4 py-6 xl:px-[60px] xlg:container font-sans">
        <div className="xs:p-3 xs:mb-6 md:p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Section */}
            <div className="lg:w-3/5 space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col xs:flex-row items-center sm:items-start gap-6">
                {/* Profile Image */}
                {ambulanceData?.ambulanceimagefront ? (
                  <Image
                    src={
                      ambulanceData?.ambulanceimagefront || "/placeholder.svg"
                    }
                    width={120}
                    height={120}
                    alt={ambulanceData?.ambulancetype || "Ambulance"}
                    className="rounded-full h-28 w-28 object-cover border-4 border-[#ff5e00] shadow-lg"
                  />
                ) : (
                  <div className="w-28 h-28 bg-white border-4 border-[#ffce38] rounded-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                <div className="flex-1 space-y-4 text-center sm:text-left">
                  <h1 className="text-[#ff5e00] text-xl lg:text-2xl font-semibold">
                    {ambulanceData?.ambulance?.AmbulanceHsp?.hspregname}
                  </h1>

                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex items-center gap-2 text-[#243460]">
                      <MapPin className="h-5 w-5 text-blue-700 shrink-0" />
                      <span>
                        Location : {ambulanceData?.ambulance?.AmbulanceHsp?.city && ambulanceData?.ambulance?.AmbulanceHsp?.state
                                  ? `${ambulanceData.ambulance.AmbulanceHsp.city} - ${ambulanceData.ambulance.AmbulanceHsp.state}`
                                  : ambulanceData?.driver?.pincode}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#243460]">
                      <Phone className="h-5 w-5 text-blue-700 shrink-0" />
                      <span>Contact No: {ambulanceData?.ambulance.mobile}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[#243460] sm:col-span-2">
                      <User className="h-5 w-5 text-blue-700 shrink-0" />
                      <span>
                        Driver:{" "}
                        {ambulanceData?.driver?.firstname || "Not available"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3  xs:grid-cols-3 gap-4">
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
              <div className="flex flex-col xs:flex-wrap md:flex-nowrap xs:flex-row items-center justify-center gap-[10px] mt-6 container mx-auto xs:px-0">
                <button className="px-4 flex items-center gap-1 p-2 justify-center font-bold xs:text-[12px] min-[1000px]:text-[12px] min-[1100px]:text-[14px] xl:text-[16px] rounded-full bg-gradient-to-r from-[#FFDE59] to-[#FF914D] text-[#243460] hover:from-[#FFDE59] hover:to-[#FF914D]">
                  <PiCurrencyInr className="h-5 w-5 min-[1100px]:h-7 min-[1100px]:w-7 bg-blue-600 text-white p-1 rounded-full mr-1" />
                  <span className={`  ${ambulanceData.ambulancediscount ? "line-through" :"" }`}>
                    {ambulanceData.ambulancecharges}
                  </span>
                  {/* Discount Percentage */}
                    {ambulanceData.ambulancediscount ? (
                      <span className=" ">
                        ({ambulanceData.ambulancediscount}% OFF)
                      </span>
                    ) : null}

                    {/* Final Price */}
                    {ambulanceData.ambulancefinalcharge ? (
                      <span className=" ">
                        ₹
                        {ambulanceData.ambulancefinalcharge
                          ? ambulanceData.ambulancefinalcharge
                          : "N/A"}
                      </span>
                      ) : null}
                </button>{" "}
                {/* First Button */}
                <ImageCarouselDialog
                  images={ambulanceImages}
                  title="Ambulance Photos"
                  trigger={
                    <button className=" flex items-center p-2  justify-center xs:text-[12px] min-[1000px]:text-[12px] min-[1100px]:text-[14px] xl:text-[16px] rounded-full bg-gradient-to-r from-[#FFDE59] to-[#FF914D] text-[#243460] hover:from-[#FFDE59] hover:to-[#FF914D]">
                      <HiOutlinePhoto className="h-5 w-5 min-[1100px]:h-7 min-[1100px]:w-7 bg-blue-600 text-white p-1 rounded-full mr-1" />
                      Photos
                    </button>
                  }
                />
                {/* Second Button */}
                <Dialog>
                  <DialogTrigger>
                    <span
                      disabled={loading}
                      className="flex items-center p-2 justify-center font-bold xs:text-[12px] min-[1000px]:text-[12px] min-[1100px]:text-[14px] xl:text-[16px] rounded-full bg-gradient-to-r from-[#FFDE59] to-[#FF914D] text-[#243460] hover:from-[#FFDE59] hover:to-[#FF914D]"
                    >
                      {loading ? (
                        <>
                          <Clock className="animate-spin h-5 w-5 min-[1100px]:h-7 min-[1100px]:w-7 bg-blue-600 text-white p-1 rounded-full mr-1" />
                          Booking...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 min-[1100px]:h-7 min-[1100px]:w-7 bg-blue-600 text-white p-1 rounded-full mr-1" />
                          Book Now
                        </>
                      )}
                    </span>
                  </DialogTrigger>
                  <DialogContent className="h-[400px] overflow-y-auto">
                    <Card>
                      <CardContent className="space-y-6">
                        {/* Disease Details */}
                        <div className="space-y-2">
                          <label htmlFor="disease-details">
                            Disease Details
                          </label>
                          <textarea
                            id="disease-details"
                            placeholder="Please describe the medical condition, symptoms, and any relevant medical history..."
                            value={diseaseDetails}
                            onChange={(e) => setDiseaseDetails(e.target.value)}
                            className="min-h-[100px] rounded-xl w-full border border-gray-100 p-2 resize-none"
                          />
                        </div>

                        <Separator />

                        {/* Medical Documents Upload */}
                        <div className="space-y-4">
                          <label>Medical Documents</label>
                          <p className="text-sm text-muted-foreground">
                            Upload up to 3 medical documents (reports,
                            prescriptions, etc.)
                          </p>

                          <div className="grid gap-3">
                            {[1, 2, 3].map((num) => (
                              <div key={num} className="space-y-2">
                                <span className="text-sm font-medium">
                                  Medical Document {num}
                                </span>
                                <UploadButton
                                  endpoint="fileUploader"
                                  content={{
                                    button({ ready }) {
                                      return (
                                        <div className="flex items-center gap-2">
                                          {ready && (
                                            <>
                                              <Upload className="w-4 h-4" />
                                              <span>
                                                Upload Medical Document {num}
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      );
                                    },
                                    allowedContent({
                                      ready,
                                      fileTypes,
                                      isUploading,
                                    }) {
                                      if (!ready)
                                        return "Checking allowed files...";
                                      if (isUploading)
                                        return "Uploading your files...";
                                      return `Allowed file types: ${fileTypes.join(
                                        ", "
                                      )}`;
                                    },
                                  }}
                                  appearance={{
                                    button:
                                      "w-full h-12 bg-blue-600 hover:bg-blue-700 border-2 border-blue-700 text-white font-medium rounded-xl flex items-center justify-center cursor-pointer transition-colors",
                                    container: "w-full",
                                    allowedContent:
                                      "text-xs text-slate-500 mt-1",
                                  }}
                                  onClientUploadComplete={(res) => {
                                    if (res.length > 0) {
                                      const setters = [
                                        setMedicalDoc1,
                                        setMedicalDoc2,
                                        setMedicalDoc3,
                                      ];
                                      setters[num - 1](res[0].url);
                                     toast.success(
                                        `Document ${num} Upload Completed`
                                      );
                                    }
                                  }}
                                  onUploadError={(error) => {
                                    console.error(`ERROR! ${error.message}`);
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Book Bed Button */}
                    <Card>
                      <CardContent className="pt-6">
                        <Button
                          onClick={handleSubmit}
                          className="w-full bg-blue-600 rounded-xl hover:bg-blue-700 text-white text-lg py-6"
                          size="lg"
                        >
                          <FaAmbulance className="w-5 h-5 mr-2" />
                          {loading ? "Confirming" : "Confirm Booking"}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center mt-3">
                          By booking this Ambulance, you agree to the{" "}
                          {"hospital's"} terms and conditions
                        </p>
                      </CardContent>
                    </Card>
                  </DialogContent>
                </Dialog>
                <BookAmbulance
                  patientdata={patientdata}
                  ambulanceData={ambulanceData}
                  title={"Book For Another Person"}
                  loggeduserId={loggeduserId}
                />
                {/* Third Button */}
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
                        Ambulance Information
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-semibold text-gray-600">
                              Type
                            </label>
                            <p className="text-gray-900">
                              {ambulanceData?.ambulancetype || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-600">
                              Category
                            </label>
                            <p className="text-gray-900">
                              {ambulanceData?.ambulancecategory ||
                                "Not specified"}
                            </p>
                          </div>
                          {/* <div>
                            <label className="text-sm font-semibold text-gray-600">
                              Registration Number
                            </label>
                            <p className="text-gray-900">
                              {ambulanceData?.ambulancercno || "Not available"}
                            </p>
                          </div> */}
                          <div>
                            <label className="text-sm font-semibold text-gray-600">
                              Service Area
                            </label>
                            <p className="text-gray-900">
                              Pincode{" "}
                              {ambulanceData?.ambulanceareapincode || "N/A"}
                            </p>
                          </div>
                        </div>

                        {ambulanceData?.facilities && (
                          <div>
                            <label className="text-sm font-semibold text-gray-600">
                              Facilities
                            </label>
                            <p className="text-gray-900">
                              {ambulanceData.facilities}
                            </p>
                          </div>
                        )}

                        {/* Hospital Information */}
                        {ambulanceData?.ambulance?.AmbulanceHsp && (
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
                                      ambulanceData?.ambulance?.AmbulanceHsp?.hspregname
                                        
                                    }
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Location:
                                    </span>{" "}
                                    {ambulanceData.ambulance.AmbulanceHsp.city},{" "}
                                    {ambulanceData.ambulance.AmbulanceHsp.state}
                                  </p>

                                  <p>
                                    <span className="font-medium">
                                      Description:
                                    </span>{" "}
                                    {
                                      ambulanceData.ambulance.AmbulanceHsp
                                        .hspdescription
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Categories */}
                        {ambulanceData?.ambulance?.AmbulanceHsp?.categories &&
                          ambulanceData.ambulance.AmbulanceHsp.categories
                            .length > 0 && (
                            <div>
                              <label className="text-sm font-semibold text-gray-600">
                                Hospital Categories
                              </label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {ambulanceData.ambulance.AmbulanceHsp.categories.map(
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
                          {ambulanceData?.puc && (
                            <div className="flex items-center gap-2 bg-green-100 text-green-700 rounded-xl px-3 py-2 text-sm font-medium">
                              <CheckCircle className="h-4 w-4" />
                              PUC Certified
                            </div>
                          )}
                          {ambulanceData?.insurance && (
                            <div className="flex items-center gap-2 bg-blue-100 text-blue-700 rounded-xl px-3 py-2 text-sm font-medium">
                              <Shield className="h-4 w-4" />
                              Insured
                            </div>
                          )}
                          {ambulanceData.driver?.firstaidtraining && (
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
                  {[
                    "ambulanceimagefront",
                    "ambulanceimageback",
                    "ambulanceimageleft",
                    "ambulanceimageright",
                  ].map((imageKey, index) =>
                    ambulanceData?.[imageKey] ? (
                      <CarouselItem key={index}>
                        <div className="relative w-full h-64">
                          {" "}
                          {/* This line is the key fix */}
                          <Image
                            src={ambulanceData[imageKey] || "/placeholder.svg"}
                            fill // Use `fill` instead of deprecated `layout="fill"`
                            className="bg-[#d9d9d9] rounded-xl object-cover"
                            alt={`Ambulance ${imageKey}`}
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
                    ) : null
                  )}
                </CarouselContent>
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
      </div>
    </>
  );
};

export default AmbulanceSingleViewClient;
