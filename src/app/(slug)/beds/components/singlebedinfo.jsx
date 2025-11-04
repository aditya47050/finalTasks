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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Autoplay from "embla-carousel-autoplay";
import {
  Briefcase,
  Building2,
  FileText,
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
import { FaHospitalAlt } from "react-icons/fa";
import { FaBedPulse, FaHouseMedicalCircleCheck } from "react-icons/fa6";
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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeadingClientMain from "@/app/components/heading";
import { PiCurrencyInr } from "react-icons/pi";
import { HiOutlinePhoto } from "react-icons/hi2";
import ImageCarouselDialog from "@/app/components/gallerysliders";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Bedbook from "@/app/components/bedbook";
import { UploadButton } from "@uploadthing/react";
import { MdLabel } from "react-icons/md";

const availableServices = [
  { key: "cashlessservices", label: "Cashless Services", icon: <PiCurrencyInr className="w-4 h-4" /> },
  { key: "diagnosticservices", label: "Diagnostic Services", icon: <GiMedicalPack className="w-4 h-4" /> },
  { key: "governmentschemes", label: "Govt. Schemes", icon: <RiAwardFill className="w-4 h-4" /> },
  { key: "homehealthcare", label: "Home Healthcare", icon: <FaHouseMedicalCircleCheck className="w-4 h-4" /> },
  { key: "onlineconsultation", label: "Online Consultation", icon: <Phone className="w-4 h-4" /> },
  { key: "pathology", label: "Pathology", icon: <LuCalendarClock className="w-4 h-4" /> },
  { key: "pharmacy", label: "Pharmacy", icon: <FaHospitalAlt className="w-4 h-4" /> },
];


const Bedsingleview = ({ data, bedsdata, loggeduserId, patientdata }) => {
  const [loading, setLoading] = useState(false);
  const [beds, setBeds] = useState(bedsdata);
  const [selectedBed, setSelectedBed] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isopen, setIsOpen] = useState(false);

  // New state variables for additional inputs
  const [diseaseDetails, setDiseaseDetails] = useState("");
  const [medicalDoc1, setMedicalDoc1] = useState(null);
  const [medicalDoc2, setMedicalDoc2] = useState(null);
  const [medicalDoc3, setMedicalDoc3] = useState(null);
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const handleBedClick = (bed) => {
    setSelectedBed(bed);
    setIsDialogOpen(true);
  };

  // ... existing code ...
const handleBook = async () => {
  setLoading(true);
  try {
    const payload = {
      bedId: selectedBed?.id,
      userId: loggeduserId,
      diseaseDetails,
      medicaldoc1: medicalDoc1,
      medicaldoc2: medicalDoc2,
      medicaldoc3: medicalDoc3,
    };

    const res = await fetch("/api/bedbooking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    // If user is not logged in or unauthorized
    if (res.status === 401 || data.error?.toLowerCase().includes("login")) {
      toast.error("Please login to book.");
      return;
    }

    // Other backend errors
    if (!res.ok) {
      toast.error(data.error || "Failed to book hospital");
      return;
    }

    // Success
    toast.success(data.message || "Hospital booked successfully!");
  } catch (error) {
    // Only network or unexpected errors
    console.error(error);
    toast.error("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


  // ... existing code ...

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
  const images = [data?.image, data?.image1, data?.image2, data?.image3].filter(
    Boolean
  );
  const stats = [
    {
      icon: <FaHospitalAlt className="md:h-8 md:w-8 h-6 w-6" />,
      label: ` 6+ NetworkHospitals`,
    },
    data?.hospital?.hspInfo?.experience && {
      icon: <RiAwardFill className="md:h-8 md:w-8 h-6 w-6" />,
      label: `${data?.hospital?.hspInfo?.experience} Experience`,
    },
    data?.length > 0 && {
      icon: <Users className="md:h-8 md:w-8 h-6 w-6" />,
      label: `${data?.length}+ Patient's`,
    },

    {
      icon: <LuCalendarClock className="md:h-8 md:w-8 h-6 w-6" />,
      label: "Booking Schedules",
      onClick: () => setIsOpen((prev) => !prev), // 👈 Toggle on click
    },
    {
      icon: <Star className="md:h-8 md:w-8 h-6 w-6" />,
      label: "hospital Reviews",
    },
  ].filter(Boolean); // Remove falsy values (undefined or false)

  return (
    <>
      <div className="container mx-auto font-semibold px-4 py-6 xl:px-[60px] xlg:container font-sans">
        <div className="xs:p-3 mb-6 md:p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Section */}
            <div className="lg:w-3/5 space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col xs:flex-row items-center xs:items-start gap-6">
                {/* Profile Image */}
                {data?.image ? (
                  <Image
                    src={data?.image || "/placeholder.svg"}
                    width={120}
                    height={120}
                    alt={data?.hospitaltype || "hospital"}
                    className="rounded-full h-28 w-28 object-cover border-4 border-[#ff5e00] shadow-lg"
                  />
                ) : (
                  <div className="w-28 h-28 bg-white border-4 border-[#ffce38] rounded-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                <div className="flex-1 space-y-4 text-center xs:text-left">
                  <h1 className="text-[#ff5e00] xs:text-sm md:text-xl lg:text-2xl font-semibold">
                    {data?.hospital.hspInfo.regname}
                  </h1>

                  <div className="flex flex-col gap-3 xs:text-xs md:text-sm">
                    <div className="flex items-center gap-2 text-[#243460]">
                      <MapPin className="h-5 w-5 text-blue-700 shrink-0" />
                      <span>
                        Location : {data?.hospital.hspcontact.city} -{" "}
                        {data?.hospital.hspcontact.state}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#243460]">
                      <Phone className="h-5 w-5 text-blue-700 shrink-0" />
                      <span>Contact No: {data?.hospital.mobile}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    onClick={stat.onClick}
                    className="flex flex-col bg-[#e9e8e9] rounded-[15px]  items-center gap-2 p-2 text-center"
                  >
                    <div className="text-[#2b73ec]">{stat.icon}</div>
                    <span className="text-xs text-[#243460] font-semibold">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col xs:flex-row items-center justify-center gap-3 mt-6 container xs:px-0 mx-auto">
                {/* First Button */}
                <ImageCarouselDialog
                  images={images}
                  title="Bed Photos"
                  trigger={
                    <button className=" flex items-center p-2  justify-center xs:text-[12px] md:text-[16px] rounded-full bg-gradient-to-r from-[#FFDE59] to-[#FF914D] text-[#243460] hover:from-[#FFDE59] hover:to-[#FF914D]">
                      <HiOutlinePhoto className="h-5 w-5 md:h-7 md:w-7 bg-blue-600 text-white p-1 rounded-full mr-1" />
                      Photos
                    </button>
                  }
                />

                {/* Second Button */}
                <button
                  onClick={() => {

                    setIsOpen((prev) => !prev);
                  }}
                  disabled={loading}
                  className=" flex items-center p-2 justify-center font-bold xs:text-[12px] md:text-[16px] rounded-full bg-gradient-to-r from-[#FFDE59] to-[#FF914D] text-[#243460] hover:from-[#FFDE59] hover:to-[#FF914D]"
                >
                  <>
                    <CheckCircle className="h-5 w-5 md:h-7 md:w-7 bg-blue-600 text-white p-1 rounded-full mr-1" />
                    Book Now
                  </>

                </button>

                {/* Third Button */}
                <button className="flex items-center p-2 justify-center font-bold xs:text-[12px] md:text-[16px] rounded-full bg-gradient-to-r from-[#FFDE59] to-[#FF914D] text-[#243460] hover:from-[#FFDE59] hover:to-[#FF914D]">
  <PiCurrencyInr className="h-5 w-5 md:h-7 md:w-7 bg-blue-600 text-white p-1 rounded-full mr-1" />
  {/* Price Range */}
  ₹{data.minPrice} - ₹{data.maxPrice}
  
  {/* Separator */}
  {data.finalPrice && <span className="mx-2">|</span>}
  
  {/* Final Price */}
  {data.finalPrice && (
    <span className="text-green-700">
      ₹{data.finalPrice}
    </span>
  )}

  {/* Discount */}
  {data.discount && (
    <span className="ml-2 text-red-600">
      ({data.discount}% off)
    </span>
  )}

  {/* Charge Type */}
  {data.chargeType && (
    <span className="ml-2 text-slate-700 capitalize">
      / {data.chargeType}
    </span>
  )}
</button>

              </div>

              {/* About Section */}
              <div className="space-y-4">
                <button className="bg-[#FF5E00] text-white py-2 px-8 rounded-full font-medium shadow-lg mx-auto block">
                  About
                </button>
                {isopen && (
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Bed Layout
                      </CardTitle>
                      <CardDescription>
                        Click on any bed to view details or booking information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex flex-wrap  gap-4">
                        {beds.map((bed) => (
                          <div
                            key={bed.id}
                            onClick={() => handleBedClick(bed)}
                            className={`p-4 rounded-xl md:w-32 w-auto border-2 border-[#5271ff] transition-all duration-200 cursor-pointer hover:scale-105 ${getBedStatusColor(
                              bed.status
                            )}`}
                          >
                            <div className="justify-center items-center flex">
                              {" "}
                              {getBedStatusIcon(bed.status)}{" "}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-lg">
                                {bed.bedNumber}
                              </span>{" "}
                              <Badge className="text-xs mt-1 truncate w-full  justify-center">
                                {bed.status.replace(/_/g, " ")}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogContent className="sm:max-w-[600px] bg-white">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FaBedPulse className="w-5 h-5" />
                        Bed #{selectedBed?.bedNumber} Details
                      </DialogTitle>
                      <DialogDescription>
                        {selectedBed?.status === BedStatus.BOOKED
                          ? "Already booked by a patient. Please try another bed."
                          : "Bed status and availability information"}
                      </DialogDescription>
                    </DialogHeader>

                    {selectedBed && (
                      <div className="space-y-6">
                        {/* Bed Status */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            {getBedStatusIcon(selectedBed.status)}
                            <div>
                              <h3 className="font-semibold">Bed Status</h3>
                              <p className="text-sm text-slate-600">
                                {selectedBed.status.replace(/_/g, " ")}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`${getBedStatusColor(
                              selectedBed.status
                            )} border-current`}
                          >
                            {selectedBed.status.replace(/_/g, " ")}
                          </Badge>
                        </div>

                        {/* Available Bed Actions */}

                        {selectedBed.status === BedStatus.AVAILABLE && (
                          <div className="max-w-2xl h-[400px] overflow-auto mx-auto p-6 space-y-6">
                            <div className="grid gap-6">
                              {/* Book for Someone Else Section */}
                              <Card>
                                <CardContent>
                                  <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700 mt-2 rounded-xl text-white"
                                    size="lg"
                                  >
                                    <Bedbook
                                      title="Book for Another Person"
                                      bedId={selectedBed.id}
                                      loggeduserId={loggeduserId}
                                      patientdata={patientdata}
                                    />
                                  </Button>
                                </CardContent>
                              </Card>

                              {/* Medical Information Section */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Book For Yourself
                                  </CardTitle>

                                </CardHeader>
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
                                      onChange={(e) =>
                                        setDiseaseDetails(e.target.value)
                                      }
                                      className="min-h-[100px] w-full border border-gray-100 p-2 resize-none"
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
                                                          Upload Medical
                                                          Document {num}
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
                                                console.log(
                                                  `Document ${num} Upload Completed`
                                                );
                                              }
                                            }}
                                            onUploadError={(error) => {
                                              console.error(
                                                `ERROR! ${error.message}`
                                              );
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
                                    onClick={handleBook}
                                    className="w-full bg-blue-600 rounded-xl hover:bg-blue-700 text-white text-lg py-6"
                                    size="lg"
                                  >
                                    <FaBedPulse className="w-5 h-5 mr-2" />
                                    Confirm Bed Booking
                                  </Button>
                                  <p className="text-xs text-muted-foreground text-center mt-3">
                                    By booking this bed, you agree to the{" "}
                                    {"hospital's"} terms and conditions
                                  </p>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        )}

                        {(selectedBed.status === BedStatus.UNDER_MAINTENANCE ||
                          selectedBed.status === BedStatus.OUT_OF_SERVICE) && (
                            <div className="p-4 bg-orange-50 rounded-xl">
                              <h4 className="font-medium text-orange-900 mb-2">
                                {selectedBed.status ===
                                  BedStatus.UNDER_MAINTENANCE
                                  ? "Under Maintenance"
                                  : "Out of Service"}
                              </h4>
                              <p className="text-sm text-orange-700">
                                This bed is currently not available for patient
                                admission.
                              </p>
                            </div>
                          )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <div className="rounded-xl p-4 text-sm text-[#243460] text-justify">
                  <Card className="shadow-lg border-0 bg-white">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        hospital Information
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                              Type
                            </label>
                            <p className="text-gray-900">
                              {data?.hospitaltype || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <label className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                              Category
                            </label>
                            <p className="text-gray-900">
                              {data?.hospitalcategory || "Not specified"}
                            </p>
                          </div>

                          <div>
                            <label className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                              Service Area
                            </label>
                            <p className="text-gray-900">
                              Pincode {data?.hospital?.hspcontact?.pincode || "N/A"}
                            </p>
                          </div>
                        </div>

                        {data?.facilities && (
                          <div>
                            <label className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                              Facilities
                            </label>
                            <p className="text-gray-900">{data.facilities}</p>
                          </div>
                        )}

                        {data?.hospital?.hspInfo && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Service Provider
                              </h4>
                              <div className="space-y-2">
                                <div>
                                  <p>
                                    <span className="font-medium">Name:</span>{" "}
                                    {data.hospital.hspcontact.adminname}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Location:
                                    </span>
                                    {data.hospital.hspcontact.taluka},{" "}
                                    {data.hospital.hspcontact.city},{" "}
                                    {data.hospital.hspcontact.state}
                                  </p>

                                  <p>
                                    <span className="font-medium">
                                      Description:
                                    </span>{" "}
                                    {data.hospital.hspInfo.hspdescription}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {data?.hospital?.hspInfo && (
                          <>
                            <Separator />
                            <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Available Services</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                              {availableServices.map((service) => {
                                const isAvailable = data.hospital.hspInfo[service.key] === "Yes";
                                if (!isAvailable) return null;

                                return (
                                  <div
                                    key={service.key}
                                    className="flex items-center gap-2 text-sm text-gray-700 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 shadow-sm"
                                  >
                                    {service.icon}
                                    <span>{service.label}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        )}

                        {/* Categories */}
                        {data?.hospital?.hspInfo?.categories &&
                          data.hospital.hspInfo.categories.length > 0 && (
                            <div>
                              <label className="text-sm font-semibold text-gray-600">
                                Hospital Categories
                              </label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {data.hospital.hspInfo.categories.map(
                                  (cat, index) => (
                                    <Badge key={index} variant="secondary">
                                      {cat?.hspcategory?.title}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          )}
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
                    "image",
                    "image",
                    "hospitalimageleft",
                    "hospitalimageright",
                  ].map((imageKey, index) =>
                    data?.[imageKey] ? (
                      <CarouselItem key={index}>
                        <div className="relative w-full h-64">
                          {" "}
                          {/* This line is the key fix */}
                          <Image
                            src={data[imageKey] || "/placeholder.svg"}
                            fill // Use `fill` instead of deprecated `layout="fill"`
                            className="bg-[#d9d9d9] rounded-xl object-cover"
                            alt={`hospital ${imageKey}`}
                          />
                          <div className="absolute bottom-4 left-4">
                            <div className="bg-white p-2 rounded-xl shadow-lg">
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < 4 ? "text-[#ffce38]" : "text-gray-300"
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

export default Bedsingleview;

const BedStatus = {
  AVAILABLE: "AVAILABLE",
  BOOKED: "BOOKED",
  RESERVED: "RESERVED",
  UNDER_MAINTENANCE: "UNDER_MAINTENANCE",
  OUT_OF_SERVICE: "OUT_OF_SERVICE",
};

const getBedStatusColor = (status) => {
  switch (status) {
    case BedStatus.AVAILABLE:
      return "bg-emerald-50 text-[#243460] border-[#5271ff] hover:bg-emerald-100";
    case BedStatus.BOOKED:
      return "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100";
    case BedStatus.RESERVED:
      return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";
    case BedStatus.UNDER_MAINTENANCE:
      return "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100";
    case BedStatus.OUT_OF_SERVICE:
      return "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100";
  }
};

const getBedStatusIcon = (status) => {
  switch (status) {
    case BedStatus.AVAILABLE:
      return <FaBedPulse className="w-4 h-4 md:h-8 md:w-8" />;
    case BedStatus.BOOKED:
      return <FaBedPulse className="w-4 h-4 md:h-8 md:w-8" />;
    case BedStatus.RESERVED:
      return <FaBedPulse className="w-4 h-4 md:h-8 md:w-8" />;
    case BedStatus.UNDER_MAINTENANCE:
      return <FaBedPulse className="w-4 h-4 md:h-8 md:w-8" />;
    case BedStatus.OUT_OF_SERVICE:
      return <FaBedPulse className="w-4 h-4 md:h-8 md:w-8" />;
    default:
      return <FaBedPulse className="w-4 h-4 md:h-8 md:w-8" />;
  }
};
