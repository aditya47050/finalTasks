import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaElevator, FaWheelchair } from "react-icons/fa6";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Star, Users } from "lucide-react";
import { FaArrowCircleRight, FaHospital, FaHospitalAlt } from "react-icons/fa";
import { RiAwardFill } from "react-icons/ri";
import { LuCalendarClock, LuHandHeart } from "react-icons/lu";
import Autoplay from "embla-carousel-autoplay";
import {
  Ambulance,
  Syringe,
  FlaskConical,
  Stethoscope,
  ShieldCheck,
  Coffee,
  Hospital,
  User,
  ScanLine,
  Pill,
  Contact,
  Sofa,
  ParkingCircle,
  Wifi,
  Lock,
  CalendarCheck,
  BedDoubleIcon,
} from "lucide-react";
import { FaBedPulse, FaMobileScreen, FaUserDoctor } from "react-icons/fa6";
import { BsBank2 } from "react-icons/bs";
import { BiPlusMedical } from "react-icons/bi";
import { SiMoleculer } from "react-icons/si";
import { MdLocalPharmacy } from "react-icons/md";
import { SlChemistry } from "react-icons/sl";
import { GiRadioactive } from "react-icons/gi";
import { IoHomeOutline } from "react-icons/io5";
import { BsClipboard2PlusFill } from "react-icons/bs";
import { MdOutlineFoodBank } from "react-icons/md";
import { HiMiniUserGroup } from "react-icons/hi2";

export const allIcons = [
  { icon: <FaUserDoctor className="w-8 h-8" />, label1: "250+", label2: "Doctors" },
  { icon: <LuHandHeart className="w-8 h-8" />, label1: "35+", label2: "Speciality" },
  { icon: <Ambulance className="w-8 h-8" />, label1: "24/7", label2: "Ambulance" },
  { icon: <FaBedPulse className="w-8 h-8" />, label1: "100+ Beds", label2: "Hospital" },
  { icon: <BsBank2 className="w-8 h-8" />, label1: "Govt", label2: "Schemes" },
  { icon: <FaUserDoctor className="w-8 h-8" />, label1: "Surgery", label2: "Packages" },
  { icon: <BiPlusMedical className="w-8 h-8" />, label1: "Treatment", label2: "Packages" },
  { icon: <FaHospital className="w-8 h-8" />, label1: "Hospital", label2: "Facilities" },
  { icon: <SiMoleculer className="w-8 h-8" />, label1: "Hospital", label2: "Branches" },
  { icon: <MdLocalPharmacy className="w-8 h-8" />, label1: "24/7", label2: "Pharmacy" },
  { icon: <SlChemistry className="w-8 h-8"/>, label1: "NABL", label2: "Pathology" },
  { icon: <LuHandHeart className="w-8 h-8" />, label1: "Wellness", label2: "Packages" },
  { icon: <FaMobileScreen className="w-8 h-8" />, label1: "Online", label2: "Consultation" },
  { icon: <GiRadioactive className="w-8 h-8" />, label1: "Diagnostic", label2: "Services" },
  { icon: <LuHandHeart className="w-8 h-8" />, label1: "Cashless", label2: "Services" },
  { icon: <IoHomeOutline className="w-8 h-8" />, label1: "Home", label2: "Healthcare" },
  { icon: <BsClipboard2PlusFill className="w-8 h-8" />, label1: "NABH", label2: "Accredited" },
  { icon: <MdOutlineFoodBank className="w-8 h-8" />, label1: "Inhouse", label2: "Canteen" },
  { icon: <HiMiniUserGroup className="w-8 h-8" />, label1: "HSP", label2: "Reviews" },
];

export default function HospitalDetails({ hospital, onAboutClick }) {
  const [showAllIcons, setShowAllIcons] = useState(false);
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])
const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const reviewItems = [
    {
      image: "https://res.cloudinary.com/dorreici1/image/upload/v1757149672/c50df687-1a78-4175-a9ca-0a85dfe55585.png",
      review: "Very clean and good service.",
    },
    {
      image: "https://res.cloudinary.com/dorreici1/image/upload/v1757149672/c50df687-1a78-4175-a9ca-0a85dfe55585.png",
      review: "Staff was helpful and experienced.",
    },
  ];

  const icons = showAllIcons ? allIcons : allIcons.slice(0, 9);

  return (
    <>
      <div className="hidden lg:block bg-white rounded-xl p-6 shadow-md border my-4 space-y-6">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          {/* LEFT: Scrollable images/reviews */}
          <div className="w-full lg:w-1/2 space-y-4">
            {/* Scrollable Review Images */}
            <Carousel
              className="w-full hidden md:block"
              plugins={[plugin.current]}
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
            >
              <CarouselContent>
                {reviewItems.map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3 px-2"
                  >
                    <div className="bg-gray-100 rounded-lg p-2 h-full flex flex-col">
                      <div className="w-full h-32 rounded-md overflow-hidden mb-2">
                        <Image
                          src={item.image}
                          alt="Hospital"
                          width={160}
                          height={100}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <p className="text-sm text-gray-700">{item.review}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Star Rating & Review Count */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < hospital.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">{hospital.reviews} Reviews</p>
            </div>
          </div>


          {/* RIGHT: Hospital Details */}
          <div className="w-full lg:w-1/2 space-y-2">
            <h2 className="text-[#FF6B35] font-bold text-lg">{hospital.name}</h2>
            <p className="text-sm font-semibold text-gray-700">Address:</p>
            <p className="text-sm text-blue-600 font-medium">(Contact Number)</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {["Ambulance", "Bed Booking", "Specialities"].map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1 text-xs rounded-full ${
                    tag === "Ambulance" ? "bg-red-500" : "bg-blue-500"
                  } text-white`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Icon Grid */}
        <div className="grid xs:grid-cols-4 lg:grid-cols-10 gap-4">
          {icons.map((icon, idx) => (
            <IconCard key={idx} icon={icon.icon} label={icon.label} />
          ))}
        </div>

        {/* Toggle Icon Visibility */}
        {allIcons.length > 9 && (
          <div className="text-center">
            <button
              onClick={() => setShowAllIcons(!showAllIcons)}
              className="text-blue-600 text-sm hover:underline"
            >
              {showAllIcons ? "" : <FaArrowCircleRight size={30}/>}
            </button>
          </div>
        )}
        <Carousel
              className="w-full block md:hidden"
              plugins={[plugin.current]}
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
            >
              <CarouselContent>
                {reviewItems.map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3 px-2"
                  >
                    <div className="bg-gray-100 rounded-lg p-2 h-full flex flex-col">
                      <div className="w-full h-32 rounded-md overflow-hidden mb-2">
                        <Image
                          src={item.image}
                          alt="Hospital"
                          width={160}
                          height={100}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <p className="text-sm text-gray-700">{item.review}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
        {/* About Button */}
        <div className="text-center">
          <button
            onClick={onAboutClick}
            className="bg-[#FF6B35] text-white px-5 py-1 rounded-full text-[13px] hover:bg-[#e85c20] transition"
          >
            About
          </button>
        </div>
        <div className="xs:block md:hidden">
          <div className="text-center border-2 border-[#173F5F] rounded-xl py-10 text-[12px] font-semibold text-[#173F5F] mb-4">
            Hospital/HSP Profile Information 5000 Words
          </div>

          <div className="grid grid-cols-2  gap-4">
            {Array(2).fill().map((_, i) => (
              <div
                key={i}
                className="border rounded-md p-4 text-center text-gray-600 text-sm bg-gray-50"
              >
                Hospital/HSP Photos upload by Hospital/HSP<br />(Paid Ads)
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="block lg:hidden min-h-screen bg-gray-50 py-4">
      
            {/* Hospital Image Carousel */}
            <div
              className={`transition-all rounded-xl duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <Carousel
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
              >
                <CarouselContent>
                  {reviewItems.length > 0 ? (
                    reviewItems.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative rounded-xl w-full h-64">
                          <Image
                            src={image.image || "/placeholder.svg?height=256&width=400&query=modern hospital building"}
                            fill
                            className="object-cover rounded-xl"
                            alt={`Hospital Image ${index + 1}`}
                          />
                          {/* Rating overlay */}
                          <div className="absolute bottom-4 right-4">
                            <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-2xl shadow-lg">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                <span className="text-sm font-semibold text-gray-900">4.8</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    <CarouselItem>
                      <div className="relative w-full h-64">
                        <Image src="/modern-hospital-exterior.png" fill className="object-cover" alt="Hospital" />
                        <div className="absolute bottom-4 right-4">
                          <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-2xl shadow-lg">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                              <span className="text-sm font-semibold text-gray-900">4.8</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>
              </Carousel>
            </div>
      
            {/* Hospital Info Card */}
            <div
              className={`  transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <Card className="bg-white rounded-3xl shadow-xl border-0 overflow-hidden">
                <CardContent className="p-6">
                  {/* Hospital Name and Location */}
                  <div className="mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {hospital.name || "City General Hospital"}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">
                        {hospital?.hspcontact?.city || "Downtown"}, {hospital?.hspcontact?.state || "State"}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Phone className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">{hospital?.mobile || "+1 (555) 123-4567"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 4 ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm font-semibold text-gray-900">4.8</span>
                        <span className="ml-1 text-sm text-gray-600">(3,341)</span>
                        <span className="ml-2 text-sm text-blue-500 font-medium">See all reviews</span>
                      </div>
                    </div>
                  </div>
      
                  {/* Book Now Button */}
                  <button className="w-full bg-blue-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all duration-300 hover:bg-blue-600 active:scale-98 mb-6">
                    Book Appointment
                  </button>
      
                  {/* Services Grid */}
                  <div className="mb-6 ">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>
                    <div className="grid grid-cols-4 gap-3 ">
                      {allIcons.map((item, idx) => (
                        <IconCard key={idx} icon={item.icon} label1={item.label1} label2={item.label2} />
                      ))}
                    </div>
                  </div>
                  {/* Service Tags */}
                  <div className="flex justify-center gap-2 mb-6 flex-nowrap">
                    {["Emergency Care", "Specialist Doctors", "24/7 Available"].map((tag, index) => (
                      <span
                        key={tag}
                        className={`px-4 py-2 text-xs font-medium rounded-xl text-center transition-all duration-300 ${
                          index === 0 ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
      
            {/* Hospital Details */}
            <div
              className={` mt-6 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <Card className="bg-white rounded-3xl shadow-lg border-0">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Hospital Information</h3>
      
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-2 rounded-2xl">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</label>
                        <p className="text-gray-900 font-medium mt-1">{hospital?.role || "Multi-Specialty"}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-2xl">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</label>
                        <p className="text-gray-900 font-medium mt-1">
                          {hospital?.hspInfo?.hspcategory?.map((cat) => cat.title).join(", ") || "General Hospital"}
                        </p>
                      </div>
                    </div>
      
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-2 rounded-2xl border border-blue-100">
                        <label className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Pathology</label>
                        <p className="text-blue-900 font-medium mt-1">
                          {hospital?.hspInfo?.pathology === "yes" ? "Available" : "Not Available"}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-2 rounded-2xl border border-blue-100">
                        <label className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Pharmacy</label>
                        <p className="text-blue-900 font-medium mt-1">
                          {hospital?.hspInfo?.pharmacy === "yes" ? "Available" : "Not Available"}
                        </p>
                      </div>
                    </div>
      
                    <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-2xl border border-blue-100">
                      <label className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                        Online Consultation
                      </label>
                      <p className="text-blue-900 font-medium mt-1">
                        {hospital?.hspInfo?.onlineconsultation === "yes" ? "Available 24/7" : "Not Available"}
                      </p>
                    </div>

                      <div className="bg-gray-50 p-2 rounded-2xl">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                          About Hospital
                        </label>
                        <p className="text-gray-700 text-justify text-sm leading-relaxed">{
                        // hospital.hspdetails.hspdescription || 
                        "A hospital provides comprehensive healthcare services, including emergency care, outpatient and inpatient treatment, surgeries, diagnostics, and rehabilitation. Staffed by specialists across departments like cardiology, neurology, pediatrics, and orthopedics, it ensures patient care through advanced technology, labs, imaging, and pharmacy services, emphasizing prevention, education, and support for improved health outcomes."} </p>
                      </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
    </>
  );
}

function IconCard({ icon, label1, label2 }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="xs:w-16 xs:h-16 md:w-20 md:h-20  rounded-xl flex items-center justify-center text-blue-500 text-xl px-3 py-1">
        {icon}
      </div>
      <p className="xs:text-[10px] md:text-[14px] leading-4">
        {label1}
      </p>
      <p className="xs:text-[10px] md:text-[14px] leading-4">
        {label2}
      </p> 
    </div>
  );
}
