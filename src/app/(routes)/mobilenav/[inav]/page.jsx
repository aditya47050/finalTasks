import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  ShieldCheck, 
  Stethoscope, 
  Hospital, 
  Pill, 
  FlaskConical, 
  HeartPulse, 
  User,
  Sparkles,
  Activity,
  Heart,
  Shield,
  Building2,
  UserCheck,
  Star,
  Award,
  Clock,
  Users
} from "lucide-react";
import Hospitalmainclient from "./components/hospitalmainclient";
import { db } from "@/lib/db";
import Link from "next/link";
import ImageSlideshow from "./components/slideshow";

// Image mapping utility
const getCategoryImages = (categoryTitle) => {
  const imageMap = {
    "Expert Doctor's": [
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=400&fit=crop"
    ],
    "Hospitals": [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1516549655469-943f0f9b6d7c?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=400&fit=crop"
    ],
   "Diagnostic Center": [
  "https://images.unsplash.com/photo-1586771107445-3b3e016813e1?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1624726170933-5b6a4773d1a3?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1530497617365-d62c2b6c8be3?w=800&h=400&fit=crop"
],
    "Surgery Packages": [
      "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=400&fit=crop"
    ],
    "Home Healthcare": [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1584467735871-8db9ac8d0288?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop"
    ],
    "Pathology": [
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1585435557343-3b092031d5ad?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop"
    ],
    "Health Insurance": [
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1554224154-260f84de7c43?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=400&fit=crop"
    ],
    "Corporate Health": [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551836026-d5c88ac5c4a0?w=800&h=400&fit=crop"
    ],
    "Pharmacy": [
      "https://images.unsplash.com/photo-1585435557343-3b092031d5ad?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1576671414121-aa0f3386a8e4?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1585435557343-3b092031d5ad?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=400&fit=crop"
    ]
  };

  return imageMap[categoryTitle] || [
    "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop"
  ];
};

// Unified Blue Color Theme for all categories
const getCategoryTheme = (categoryTitle) => {
  return {
    primary: "from-blue-500 to-blue-600",
    secondary: "blue",
    accent: "blue",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    cardGradient: "from-blue-50 to-blue-50",
    hoverGradient: "from-blue-100 to-blue-100"
  };
};

// Main Server Component
const INav = async ({ params }) => {
  const resolvedParams = await params;
  const id = resolvedParams.inav;
  const hspcategory = await db.HospitalsCategory.findMany({});
  const doctorcategory = await db.ExpertDoctorsCategory.findMany({});
  const diagnosticcentercategory = await db.DiagnosticCenterCategory.findMany(
    {}
  );
  const pharmacies = await db.pharmacy.findMany({
    select: { id: true, regname: true, email: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  const navlinkss = [
    {
      title: "Expert Doctor's",
      link: "/",
      icon: <Stethoscope className="w-6 h-6 text-blue-600" />,
      submenu: Array.isArray(doctorcategory)
        ? doctorcategory.map((category) => ({
            title: category.title,
            link: `/doctor/${category.id}`,
          }))
        : [],
    },
    {
      title: "Hospitals",
      link: "#",
      icon: <Hospital className="w-6 h-6 text-blue-600" />,
      submenu: Array.isArray(hspcategory)
        ? hspcategory.map((category) => ({
            title: category.title,
            link: `/hospital/${category.id}`,
          }))
        : [],
    },
    {
      title: "Diagnostic Center",
      link: "/",
      icon: <FlaskConical className="w-6 h-6 text-blue-600" />,
      submenu: Array.isArray(diagnosticcentercategory)
        ? diagnosticcentercategory.map((category) => ({
            title: category.title,
            link: `/diagnosticcenter/${category.id}`,
          }))
        : [],
    },
    {
      title: "Surgery Packages",
      link: "/",
      icon: <Activity className="w-6 h-6 text-blue-600" />,
      submenu: [
        { title: "Surgery Packages", link: "/surgerypackages" },
        { title: "Treatment Packages", link: "/surgerypackages" },
      ],
    },
    {
      title: "Home Healthcare",
      link: "/",
      icon: <HeartPulse className="w-6 h-6 text-blue-600" />,
      submenu: [
        { title: "ICU at Home", link: "/home-healthcare/ICU%20at%20Home" },
        { title: "General Nursing", link: "/home-healthcare/General%20Nursing" },
        { 
          title: "Neurological Care & Rehabilitation", 
          link: "/home-healthcare/Neurological%20Care%20%26%20Rehabilitation" 
        },
        { title: "Cancer Care on Bed", link: "/home-healthcare/Cancer%20Care%20on%20Bed" },
        { title: "Transplant & Post-Op Care", link: "/home-healthcare/Transplant%20%26%20Post-Op%20Care" },
        { title: "Pregnancy Care", link: "/home-healthcare/Pregnancy%20Care" },
        { title: "Mother & Child Care", link: "/home-healthcare/Mother%20%26%20Child%20Care" },
        { title: "Palliative Care", link: "/home-healthcare/Palliative%20Care" },
        { title: "Orthopaedic Care", link: "/home-healthcare/Orthopaedic%20Care" },
        { title: "Stroke Care", link: "/home-healthcare/Stroke%20Care" },
        { title: "Cardiac Care", link: "/home-healthcare/Cardiac%20Care" },
        { title: "Dialysis Care", link: "/home-healthcare/Dialysis%20Care" },
        { title: "Old Age Health Care", link: "/home-healthcare/Old%20Age%20Health%20Care" },
        { title: "COPD Care", link: "/home-healthcare/COPD%20Care" },
        { title: "Bed Sores Care", link: "/home-healthcare/Bed%20Sores%20Care" },
      ],
    },
    {
      title: "Pathology",
      link: "/",
      icon: <FlaskConical className="w-6 h-6 text-blue-600" />,
      submenu: [
        { title: "Lab Tests", link: "/pathology/category?letter=A" },
        { title: "Wellness Packages", link: "/pathology/wellness-packages" },
        { title: "NABL Accredited Lab", link: "/pathology/bloodbanks" },
        { title: "Blood Bank", link: "/pathology/bloodbanks" },
      ],
    },
    {
      title: "Health Insurance",
      link: "/",
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      submenu: [
        { title: "Govt Health Insurance", link: "#" },
        { title: "Private Health Insurance", link: "#" },
        { title: "TPA Health Insurance", link: "#" },
        { title: "TPA Administration Services", link: "#" },
      ],
    },
    {
      title: "Corporate Health",
      link: "/",
      icon: <Building2 className="w-6 h-6 text-blue-600" />,
      submenu: [
        { title: "Medical Personnel Manning", link: "#" },
        { title: "Companies Insurance", link: "#" },
        { title: "CSR Services", link: "#" },
        { title: "Health Talks & Seminars", link: "#" },
        { title: "Occupation Health Center", link: "#" },
        { title: "Corporate Health Check-ups", link: "#" },
        { title: "24/7 Ambulance Services", link: "#" },
        { title: "Equipped Mobile Medical Unit", link: "#" },
      ],
    },
    {
      title: "Pharmacy",
      link: "/",
      icon: <Pill className="w-6 h-6 text-blue-600" />,
      submenu: pharmacies.map((p) => ({
        title: p.regname || p.email || "Pharmacy",
        link: `/pharmacy/${p.id}`,
      })),
    },
  ];

  const selected = navlinkss[id];
  const categoryImages = getCategoryImages(selected?.title);
  const theme = getCategoryTheme(selected?.title);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/20 to-slate-100/30">
      {/* Modern Header Section */}
      <div className="bg-gradient-to-br from-[#5B6CF5] via-[#5169E8] to-[#4A5BD9] text-white py-4 md:py-6 lg:py-8 shadow-2xl relative overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
        
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
          <div className="text-center">
            {/* Category Icon with Animation */}
            <div className="flex justify-center mb-2 md:mb-3 lg:mb-4">
              <div className="p-2 md:p-3 lg:p-3.5 bg-white/20 backdrop-blur-sm rounded-2xl md:rounded-2xl shadow-xl md:shadow-2xl transform hover:scale-105 transition-transform duration-300 border border-white/20">
                {selected?.icon ? (
                  React.cloneElement(selected.icon, { 
                    className: "w-6 h-6 md:w-8 md:h-8 lg:w-9 lg:h-9 text-white" 
                  })
                ) : (
                  <Sparkles className="w-6 h-6 md:w-8 md:h-8 lg:w-9 lg:h-9 text-white" />
                )}
              </div>
            </div>
            
            {/* Title - Simplified for mobile */}
            <h1 className="font-poppins font-bold text-lg md:text-2xl lg:text-3xl mb-1.5 md:mb-2 text-white drop-shadow-lg tracking-tight">
              {selected?.title || "Healthcare Services"}
            </h1>
            
            {/* Subtitle - Enhanced */}
            <p className="text-white/95 text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed font-medium px-3 md:px-2 mb-2 md:mb-3 lg:mb-4">
              <span className="md:hidden">Trusted Healthcare Partners</span>
              <span className="hidden md:inline">
                Discover exceptional {selected?.title?.toLowerCase() || "healthcare services"} tailored to meet your unique needs with compassion and expertise
              </span>
            </p>
            
            {/* Stats Badge */}
            <div className="inline-flex items-center gap-2 md:gap-2.5 bg-white/20 backdrop-blur-lg px-3 md:px-4 lg:px-5 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-semibold border border-white/30 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
              <span className="md:hidden">{selected?.submenu?.length || 0} Services Available</span>
              <span className="hidden md:inline">{selected?.submenu?.length || 0} Specialized Services</span>
              <Award className="w-3.5 h-3.5 md:w-4 md:h-4 ml-1 md:ml-1.5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 sm:px-6 lg:px-8 pb-2 md:pb-0 mx-auto py-6 md:py-12">
        
        {/* Services Grid Section - Now at the top */}
        <div className="mb-8 md:mb-16">
          <div className="text-center mb-8 md:mb-12 relative">
            {/* Decorative elements */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>
            
            <h2 className="text-xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3 relative inline-block">
              <span className="relative">
                Our <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.primary}`}>Services</span>
                {/* Underline decoration */}
                <div className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-1 md:h-1.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {selected?.submenu?.length > 0 ? (
              selected.submenu.map((s) => {
                const titleParts = s.title.split(" ");
                return (
                  <div key={s.title} className="flex flex-col items-center group">
                    <Link
                      href={s.link}
                      className="font-poppins lg:text-[14px] md:text-[12px] text-[10px] text-gray-800 font-semibold mb-1 break-words text-center w-full block"
                    >
                      <Card className={`relative p-4 rounded-2xl border-0 bg-gradient-to-br ${theme.cardGradient} hover:from-blue-100 hover:to-blue-100 hover:shadow-2xl transition-all duration-300 ease-in-out flex items-center h-32 w-full shadow-lg cursor-pointer overflow-hidden group-hover:scale-105`}>
                        {/* Background decoration */}
                        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300`}></div>
                        <div className={`absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full translate-y-8 -translate-x-8 group-hover:scale-110 transition-transform duration-300`}></div>
                        
                        {/* Icon for category */}
                        <div className={`absolute top-3 right-3 p-2 ${theme.iconBg} backdrop-blur-sm rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                          {selected?.icon ? (
                            React.cloneElement(selected.icon, { 
                              className: `w-4 h-4 ${theme.iconColor}` 
                            })
                          ) : (
                            <User className={`w-4 h-4 ${theme.iconColor}`} />
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 text-center overflow-hidden relative z-10">
                          {titleParts.map((part, index) => (
                            <span
                              key={index}
                              className={
                                index === 0
                                  ? `${theme.iconColor} block font-bold truncate overflow-hidden whitespace-nowrap text-sm md:text-base drop-shadow-sm`
                                  : "text-gray-700 block truncate break-words text-xs md:text-sm"
                              }
                            >
                              {part}
                              {index === 0 && <br />}
                              {index < titleParts.length - 1 && " "}
                            </span>
                          ))}
                        </div>
                        
                        {/* Subtle border accent */}
                        <div className={`absolute inset-0 rounded-2xl border border-blue-200/50 group-hover:border-blue-300/70 transition-colors duration-300`}></div>
                      </Card>
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <div className="p-6 bg-gray-100 rounded-3xl mb-6">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">Services Coming Soon</h3>
                <p className="text-gray-500 text-center max-w-md text-lg">
                  We're currently expanding our services in this category. Stay tuned for updates!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Slideshow Section - Moved to bottom */}
        <div className="mb-12 md:mb-20">
          <div className="text-center mb-8 md:mb-12 relative">
            {/* Decorative elements */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>
            
            <h3 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3 relative inline-block">
              <span className="relative">
                Discover Our <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.primary}`}>Facilities</span>
                {/* Underline decoration */}
                <div className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-1 md:h-1.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
              </span>
            </h3>
          </div>
          
          {/* Slideshow */}
          <div className="max-w-6xl mx-auto">
            <ImageSlideshow 
              images={categoryImages} 
              title={selected?.title || "Healthcare Services"} 
            />
          </div>
          
          {/* Slideshow Stats */}
          <div className="flex justify-center mt-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center gap-8 text-sm text-gray-700">
                <div className="text-center">
                  <div className="font-bold text-2xl text-blue-600">{categoryImages.length}</div>
                  <div className="text-gray-500">Gallery Images</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="font-bold text-2xl text-blue-600">{selected?.submenu?.length || 0}</div>
                  <div className="text-gray-500">Available Services</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="font-bold text-2xl text-blue-600">24/7</div>
                  <div className="text-gray-500">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <CardFooter className="mt-12 md:mt-20 text-center px-0">
          <div className="w-full bg-gradient-to-r from-[#5B6CF5] to-[#4A5BD9] rounded-2xl md:rounded-3xl p-6 md:p-12 text-white shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-24 h-24 md:w-40 md:h-40 bg-white rounded-full -translate-x-12 -translate-y-12 md:-translate-x-20 md:-translate-y-20"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 md:w-40 md:h-40 bg-white rounded-full translate-x-12 translate-y-12 md:translate-x-20 md:translate-y-20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-60 md:h-60 bg-white rounded-full opacity-50"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Header with Heart */}
              <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-6">
                <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl">
                  <Heart className="w-6 h-6 md:w-10 md:h-10 fill-white stroke-none animate-pulse" />
                </div>
                <span className="font-bold text-lg md:text-3xl text-white">
                  Arogya-Dhan Care
                </span>
              </div>

              {/* Subtitle */}
              <p className="text-white/90 text-sm md:text-xl leading-relaxed max-w-3xl mx-auto mb-4 md:mb-8 font-light px-2">
                Your trusted partner in health and wellness, delivering exceptional care across all medical specialties with compassion and innovation.
              </p>

              {/* Additional Info */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-6 text-white/90 text-xs md:text-base">
                <div className="flex items-center gap-1.5 md:gap-3 bg-white/10 back
                drop-blur-sm px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl">
                  <ShieldCheck className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" />
                  <span>Certified Excellence</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-3 bg-white/10 backdrop-blur-sm px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl">
                  <HeartPulse className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" />
                  <span>24/7 Care</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-3 bg-white/10 backdrop-blur-sm px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl">
                  <Sparkles className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" />
                  <span>Premium Quality</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-3 bg-white/10 backdrop-blur-sm px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl">
                  <Users className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" />
                  <span>Expert Team</span>
                </div>
              </div>
            </div>
          </div>
        </CardFooter>
      </div>
    </div>
  );
};

export default INav;