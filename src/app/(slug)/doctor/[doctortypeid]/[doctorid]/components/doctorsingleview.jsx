"use client";
import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Star,
  Users,
  Calendar,
  Award,
  Phone,
  MessageCircle,
  Clock,
  FileText,
  BadgeCheck,
  Clock4,
  Video,
} from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GiStethoscope, GiMedicalPack } from "react-icons/gi";
import { FaUserMd, FaClinicMedical } from "react-icons/fa";
import { MdHealthAndSafety, MdEmergency } from "react-icons/md";
import { TbHeartPlus } from "react-icons/tb";
import DoctorBooking from "../components/DoctorBooking";

const MedicalDoctorProfile = ({
  doctordata,
  specialitytype,
  selectedSpecialityTitles = [],
  patient,
}) => {
  const [showBooking, setShowBooking] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const reviews = doctordata.DoctorReview || doctordata.reviews || [];
  console.log(
    "🚀 ~ Reviews with patient data:",
    JSON.stringify(reviews, null, 2)
  );
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "4.5";

  // Dynamic images from doctor data
  const images = [
    doctordata?.doctorinfo?.passportphoto && {
      src: doctordata.doctorinfo.passportphoto,
      alt: `Dr ${doctordata.firstName} ${doctordata.lastName}`,
      type: "profile",
      title: "Professional Photo",
    },
    doctordata?.doctorinfo?.medicaldegree && {
      src: doctordata.doctorinfo.medicaldegree,
      alt: "Medical Degree Certificate",
      type: "degree",
      title: "Medical Degree",
    },
    doctordata?.doctorinfo?.pancardfront && {
      src: doctordata.doctorinfo.pancardfront,
      alt: "Medical License",
      type: "license",
      title: "Medical License",
    },
    doctordata?.doctorinfo?.aadharcardfront && {
      src: doctordata.doctorinfo.aadharcardfront,
      alt: "Identity Verification",
      type: "identity",
      title: "ID Verification",
    },
  ].filter(Boolean);

  // Dynamic stats
  const stats = [
    {
      icon: Briefcase,
      value: `${doctordata.totalexperience || "8+"} Years`,
      label: "Experience",
    },
    {
      icon: Users,
      value: `${doctordata.patientCount || "2.5k+"}`,
      label: "Patients",
    },
    {
      icon: Award,
      value: `${doctordata.successRate || "98"}%`,
      label: "Success Rate",
    },
    {
      icon: Clock4,
      value:
        doctordata.doctorinfo?.emergencyavailable === "Yes"
          ? "24/7"
          : "Flexible",
      label: "Availability",
    },
  ];

  // Dynamic medical services
  const medicalServices = [
    {
      name: "General Consultation",
      available: true,
      icon: GiStethoscope,
    },
    {
      name: "Home Healthcare",
      available: doctordata.doctorinfo?.homehealthcarevisit === "Yes",
      icon: FaClinicMedical,
    },
    {
      name: "Video Consultation",
      available: doctordata.doctorinfo?.onlineappointment === "Yes",
      icon: Video,
    },
    {
      name: "Emergency Care",
      available: doctordata.doctorinfo?.emergencyavailable === "Yes",
      icon: MdEmergency,
    },
    {
      name: "Chronic Disease Management",
      available: true,
      icon: TbHeartPlus,
    },
    {
      name: "Health Checkups",
      available: true,
      icon: MdHealthAndSafety,
    },
  ];

  // Dynamic qualifications
  const qualifications = doctordata.education
    ? doctordata.education.split(",").map((q) => q.trim())
    : [
        "MBBS - Bachelor of Medicine",
        "MD - Internal Medicine",
        "DM - Cardiology",
      ];

  const specializations = doctordata.specialities
    ?.map((s) => s.speciality?.name || s.speciality?.title || s.name)
    .filter(Boolean) ||
    selectedSpecialityTitles || ["General Physician", "Internal Medicine"];

  // Dynamic achievements based on data
  const achievements = [
    "Medical Council Certified",
    `${doctordata.totalexperience || "8"}+ Years Clinical Experience`,
    "Patient Satisfaction Award",
    `${specializations[0] || "Medical"} Specialist`,
  ];
  const [loading, setLoading] = useState(false);

  const [requestedCall, setRequestedCall] = useState(null);
  const requestCall = async () => {
    if (!doctordata.id) return alert("Enter Doctor ID");

    setLoading(true);
    const res = await fetch("/api/video-consultation/request", {
      method: "POST",
      body: JSON.stringify({ doctorId: doctordata.id, patientId: patient?.id }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setRequestedCall(data);
    setLoading(false);
    alert("Video call requested. Waiting for doctor to accept.");
  };
  return (
    <>
      <style jsx>{`
        .hospital-gradient {
          background: linear-gradient(
            135deg,
            #1e3a8a 0%,
            #2563eb 50%,
            #3b82f6 100%
          );
        }

        .professional-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .stat-card {
          transition: all 0.3s ease;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .service-card {
          transition: all 0.3s ease;
          border-left: 3px solid #3b82f6;
        }

        @media (max-width: 768px) {
          .mobile-stack {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="min-h-screen bg-slate-50 pb-24 lg:pb-0">
        {/* Booking Modal */}
        {showBooking && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <button
                onClick={() => setShowBooking(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 transition-all"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="p-1">
                <DoctorBooking
                  doctorId={doctordata.id}
                  patient={patient}
                  onClose={() => setShowBooking(false)}
                  doctordata={doctordata}
                  selectedSpecialityTitles={selectedSpecialityTitles}
                />
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-6">
          {/* Sticky Bottom Action Buttons for Mobile */}
          <div
            className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-lg"
            style={{ zIndex: 9999 }}
          >
            <div className="flex gap-3">
              <Button
                onClick={() => setShowBooking(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full text-base shadow-xl flex items-center justify-center"
                style={{
                  color: "white",
                  backgroundColor: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Calendar className="h-5 w-5 mr-2" />
                <span>Book Now</span>
              </Button>
              <Button
                onClick={requestCall}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-full text-base shadow-xl flex items-center justify-center"
              >
                <Video className="h-5 w-5 mr-1" />
                <span>Video Call</span>
              </Button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Profile */}
              <div className="lg:col-span-1 space-y-6">
                {/* Profile Card */}
                <div className="professional-card">
                  <div className="hospital-gradient p-6 text-white">
                    <div className="text-center mb-6">
                      <div className="relative inline-block mb-4">
                        <div className="w-24 h-24 bg-white/20 rounded-xl border-4 border-white shadow-lg flex items-center justify-center mx-auto">
                          {doctordata?.doctorinfo?.passportphoto ? (
                            <Image
                              src={doctordata.doctorinfo.passportphoto}
                              width={88}
                              height={88}
                              alt={`Dr ${doctordata.firstName} ${doctordata.lastName}`}
                              className="rounded-lg object-cover w-full h-full"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-full h-full rounded-lg flex items-center justify-center ${
                              doctordata?.doctorinfo?.passportphoto
                                ? "hidden"
                                : "flex"
                            }`}
                            style={{
                              display: doctordata?.doctorinfo?.passportphoto
                                ? "none"
                                : "flex",
                            }}
                          >
                            <FaUserMd className="h-12 w-12 text-white" />
                          </div>
                        </div>
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          <BadgeCheck className="h-3 w-3" />
                        </div>
                      </div>

                      <h1 className="text-2xl font-bold text-white mb-2">
                        Dr {doctordata.firstName} {doctordata.lastName}
                      </h1>

                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                          <Star className="h-4 w-4 text-amber-300 fill-amber-300" />
                          <span className="text-white font-semibold text-base">
                            {avgRating}
                          </span>
                        </div>
                        <span className="text-white/80 text-base">
                          {doctordata.totalexperience || "8"}+ years
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 justify-center">
                        {specializations.slice(0, 2).map((spec, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/20 text-white rounded-full text-sm"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        onClick={() => setShowBooking(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-full transition-all shadow-lg hover:shadow-xl text-lg flex items-center justify-center"
                        style={{
                          display: "flex",
                          visibility: "visible",
                          color: "white",
                          backgroundColor: "#2563eb",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>Book Appointment Now</span>
                      </Button>

                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            const phoneNumber =
                              doctordata.mobile || doctordata.alternatemobileno;
                            if (phoneNumber) {
                              window.open(`tel:+91${phoneNumber}`, "_self");
                            }
                          }}
                          className="flex items-center justify-center gap-1 rounded-full text-sm bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                        >
                          <Phone className="h-4 w-4" />
                          Call
                        </Button>
                        <Button
                          variant="outline"
                          onClick={requestCall}
                          className="flex items-center justify-center gap-1 rounded-full text-sm bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                        >
                          <Video className="h-4 w-4" />
                          Video
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const phoneNumber =
                              doctordata.mobile || doctordata.alternatemobileno;
                            if (phoneNumber) {
                              const message = `Hello Dr ${doctordata.firstName}, I would like to book an appointment.`;
                              window.open(
                                `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(
                                  message
                                )}`,
                                "_blank"
                              );
                            }
                          }}
                          className="flex items-center justify-center gap-1 rounded-full text-sm bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                        >
                          <MessageCircle className="h-4 w-4" />
                          WhatsApp
                        </Button>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 text-base">
                            Consultation Fee
                          </span>
                          <span className="text-green-600 font-bold text-lg">
                            ₹
                            {doctordata?.doctorinfo?.finalPrice ||
                              doctordata?.doctorinfo?.consultationfee ||
                              "500"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 text-base">
                            Availability
                          </span>
                          <span className="text-slate-800 font-medium text-base">
                            {doctordata.doctorinfo?.emergencyavailable === "Yes"
                              ? "24/7"
                              : "Clinic Hours"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 text-base">
                            Response Time
                          </span>
                          <span className="text-slate-800 font-medium text-base">
                            Within 15 min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact & Location */}
                <div className="professional-card">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-slate-800 text-xl mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      Contact & Location
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-slate-600 mt-0.5" />
                        <div>
                          <div className="text-slate-700 font-medium text-base">
                            Clinic Address
                          </div>
                          <div className="text-slate-600 text-sm mt-1">
                            {doctordata.doctorinfo?.presentaddress ||
                              "925, Ganesh Apartment, Akurdi, Pune"}
                          </div>
                          <div className="text-slate-500 text-sm mt-1">
                            {doctordata.doctorinfo?.city || "Pune"},{" "}
                            {doctordata.doctorinfo?.state || "Maharashtra"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-slate-600" />
                        <div>
                          <div className="text-slate-700 font-medium text-base">
                            Timing
                          </div>
                          <div className="text-slate-600 text-sm">
                            {doctordata.doctorinfo?.clinicinouttime ||
                              "Mon-Sat: 9AM-6PM"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-slate-600" />
                        <div>
                          <div className="text-slate-700 font-medium text-base">
                            Phone
                          </div>
                          <div className="text-slate-800 font-semibold text-base">
                            {doctordata.mobile || "Not available"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* Professional Documents */}
                {images.length > 0 && (
                  <div className="professional-card">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-slate-800 text-xl mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Credentials
                      </h3>

                      <Carousel
                        plugins={[plugin.current]}
                        className="w-full"
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                      >
                        <CarouselContent>
                          {images.map((image, index) => (
                            <CarouselItem key={index}>
                              <div className="relative w-full h-32 bg-slate-100 rounded-lg border border-slate-300 overflow-hidden">
                                <Image
                                  src={image.src}
                                  className="object-cover"
                                  alt={image.alt}
                                  fill
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                                  <p className="text-white font-semibold text-sm">
                                    {image.title}
                                  </p>
                                </div>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        {images.length > 1 && (
                          <>
                            <CarouselPrevious className="left-2 bg-white/90 border-slate-300 hover:bg-white" />
                            <CarouselNext className="right-2 bg-white/90 border-slate-300 hover:bg-white" />
                          </>
                        )}
                      </Carousel>
                    </CardContent>
                  </div>
                )}
              </div>

              {/* Right Column - Detailed Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Enhanced Tabs Navigation */}
                <div className="professional-card">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-4 p-1 bg-blue-50 rounded-lg border border-blue-200">
                      <TabsTrigger
                        value="overview"
                        className="flex items-center gap-2 text-base data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 hover:bg-blue-100"
                      >
                        <GiStethoscope className="h-4 w-4" />
                        Overview
                      </TabsTrigger>
                      <TabsTrigger
                        value="services"
                        className="flex items-center gap-2 text-base data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 hover:bg-blue-100"
                      >
                        <MdHealthAndSafety className="h-4 w-4" />
                        Services
                      </TabsTrigger>
                      <TabsTrigger
                        value="education"
                        className="flex items-center gap-2 text-base data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 hover:bg-blue-100"
                      >
                        <GraduationCap className="h-4 w-4" />
                        Education
                      </TabsTrigger>
                      <TabsTrigger
                        value="reviews"
                        className="flex items-center gap-2 text-base data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 hover:bg-blue-100"
                      >
                        <Star className="h-4 w-4" />
                        Reviews
                      </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6 p-6">
                      {/* Key Stats */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                          <div
                            key={index}
                            className="stat-card rounded-lg p-4 text-center"
                          >
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 mb-2">
                              <stat.icon className="h-5 w-5" />
                            </div>
                            <div className="text-slate-800 font-bold text-lg">
                              {stat.value}
                            </div>
                            <div className="text-slate-600 text-sm">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* About Doctor */}
                      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                        <h3 className="font-semibold text-slate-800 text-xl mb-4 flex items-center gap-2">
                          <GiMedicalPack className="h-5 w-5 text-blue-600" />
                          About Dr. {doctordata.firstName}
                        </h3>
                        <p className="text-slate-700 leading-relaxed text-base">
                          {doctordata.about ||
                            `Dr. ${doctordata.firstName} ${
                              doctordata.lastName
                            } is a highly experienced medical professional with ${
                              doctordata.totalexperience || "8"
                            }+ years of practice in ${specializations.join(
                              " and "
                            )}. Committed to providing exceptional patient care with a focus on evidence-based medicine and personalized treatment approaches.`}
                        </p>
                      </div>

                      {/* Medical Achievements */}
                      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                        <h3 className="font-semibold text-slate-800 text-xl mb-4">
                          Professional Achievements
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {achievements.map((achievement, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200"
                            >
                              <Award className="h-5 w-5 text-blue-600" />
                              <span className="text-slate-700 text-base">
                                {achievement}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Services Tab */}
                    <TabsContent value="services" className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {medicalServices.map((service, index) => (
                          <div
                            key={index}
                            className="service-card bg-white rounded-lg p-4 border border-slate-200"
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                <service.icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-slate-800 text-base mb-2">
                                  {service.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      service.available
                                        ? "bg-green-500"
                                        : "bg-slate-300"
                                    }`}
                                  ></div>
                                  <span
                                    className={`text-sm ${
                                      service.available
                                        ? "text-green-600"
                                        : "text-slate-400"
                                    }`}
                                  >
                                    {service.available
                                      ? "Available"
                                      : "Not Available"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Education Tab */}
                    <TabsContent value="education" className="p-6">
                      <div className="space-y-6">
                        {/* Qualifications */}
                        <div className="bg-white rounded-lg p-6 border border-slate-200">
                          <h3 className="font-semibold text-slate-800 text-xl mb-4 flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-blue-600" />
                            Medical Qualifications
                          </h3>
                          <div className="space-y-3">
                            {qualifications.map((qualification, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                              >
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-slate-700 font-medium text-base">
                                  {qualification}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Experience */}
                        <div className="bg-white rounded-lg p-6 border border-slate-200">
                          <h3 className="font-semibold text-slate-800 text-xl mb-4">
                            Professional Experience
                          </h3>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-slate-200">
                              <span className="text-slate-600 text-base">
                                Total Experience
                              </span>
                              <span className="font-semibold text-slate-800 text-base">
                                {doctordata.totalexperience || "8"}+ years
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-200">
                              <span className="text-slate-600 text-base">
                                Registration Number
                              </span>
                              <span className="font-semibold text-slate-800 text-base">
                                {doctordata.regno || "MH/2024/12345"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                              <span className="text-slate-600 text-base">
                                Practice Type
                              </span>
                              <span className="font-semibold text-slate-800 text-base">
                                {doctordata.doctorinfo?.personalclinic === "Yes"
                                  ? "Private Practice"
                                  : "Hospital Practice"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Reviews Tab */}
                    <TabsContent value="reviews" className="p-6">
                      <div className="space-y-4">
                        {reviews.length > 0 ? (
                          reviews.slice(0, 5).map((review, index) => {
                            const patientName = review.patient?.firstName
                              ? `${review.patient.firstName} ${
                                  review.patient.lastName || ""
                                }`.trim()
                              : review.patientName || "Anonymous Patient";
                            const patientInitial = patientName
                              .charAt(0)
                              .toUpperCase();

                            return (
                              <div
                                key={index}
                                className="bg-white rounded-lg p-4 border border-slate-200"
                              >
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-base">
                                    {patientInitial}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-slate-800 text-base">
                                      {patientName}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-4 w-4 ${
                                            i < review.rating
                                              ? "text-amber-500 fill-amber-500"
                                              : "text-slate-300"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <p className="text-slate-700 text-base">
                                  {review.comment ||
                                    "Great doctor, very professional and caring."}
                                </p>
                                <div className="text-slate-500 text-sm mt-2">
                                  {review.createdAt
                                    ? new Date(
                                        review.createdAt
                                      ).toLocaleDateString()
                                    : "Recently"}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-8">
                            <Star className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 text-base">
                              No reviews yet
                            </p>
                            <p className="text-slate-400 text-sm mt-1">
                              Be the first to review this doctor
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Consultation Information */}
                <div className="professional-card">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-slate-800 text-xl mb-4">
                      Consultation Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                          <span className="text-slate-600 text-base">
                            Online Consultation
                          </span>
                          <span className="font-semibold text-green-600 text-lg">
                            ₹{doctordata.doctorinfo?.consultationfee || "500"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-200">
                          <span className="text-slate-600 text-base">
                            Clinic Visit
                          </span>
                          <span className="font-semibold text-green-600 text-lg">
                            ₹
                            {doctordata.doctorinfo?.clinicconsultationfee ||
                              "800"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-slate-600 text-base">
                            Home Visit
                          </span>
                          <span className="font-semibold text-green-600 text-lg">
                            {doctordata.doctorinfo?.homehealthcarevisit ===
                            "Yes"
                              ? "₹1200"
                              : "Not Available"}
                          </span>
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <h4 className="font-semibold text-slate-800 text-lg mb-3">
                          Why Choose Dr. {doctordata.firstName}?
                        </h4>
                        <ul className="space-y-2 text-base text-slate-700">
                          <li className="flex items-center gap-2">
                            <BadgeCheck className="h-4 w-4 text-green-500" />
                            Verified Medical Credentials
                          </li>
                          <li className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            Minimal Waiting Time
                          </li>
                          <li className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-blue-500" />
                            Follow-up Support
                          </li>
                          <li className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-amber-500" />
                            Patient-Centric Approach
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicalDoctorProfile;
