"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TbMoodKid } from "react-icons/tb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  HeartPulse,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Users,
  Heart,
  Calendar,
  Bed,
  Ambulance,
  IndianRupee,
  Home,
  Activity,
  FileText,
  Shield,
  Camera,
  Stethoscope,
  Receipt,
  Award,
  AlertTriangle,
  Plus,
  CheckCircle,
  Car,
  TestTube,
  Scissors,
  Banknote,
  Award as IdCard,
  FileImage,
  Siren,
  ClipboardList,
  Wallet,
  CircleCheck,
  CircleX,
  CircleAlert,
  Info,
  Grid3X3,
  CalendarIcon,
  LinkIcon,
  UsersIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { UserSwitcher } from "./user-switcher"

// Define dashboardIcons here
const dashboardIcons = [
   {
    link: "/patient/dashboard/upcomingschedule",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/pron8ekjztafetxbardg.png",
    title: "Upcoming Schedule",
  },
  {
    link: "/patient/dashboard/appointment",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/bjb3vd2vejhecbrzbyoa.png",
    title: "Doctor Appointment",
  },
  {
    link: "/patient/dashboard/ambulancebooking",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/gwra62dsiyjwhfxgzems.png",
    title: "Ambulance Booking",
  },
  {
    link: "/patient/dashboard/bedbooking",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/siszcbws6ib8zwxlai8g.png",
    title: "Bed Booking",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/xumuxjuj8kqu9nqcuhkx.png",
    title: "AarogyaDhan",
    link: "/patient/dashboard/aarogyadhan",
  },
  {
    link: "/patient/dashboard/healthinsurance",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1727071977/Icons/pjnbjrvohsraoq7r8knc.png",
    title: "Health Insurance",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/wxwninf7d2dsel0mbpkh.png",
    title: "Hospital Services",
  },
  {
    link:"/patient/dashboard/pathology",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/p5yzmgxtrgdfqkronelr.png",
    title: "Pathology Services",
  },
  {
    link:"/patient/dashboard/wellness",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/cabnflawzbf171pi9ozs.png",
    title: "Wellness Services",
  },
  {
    link: "/patient/dashboard/diagnosticcenter",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/vk2cbpjzr6m1nvltxblk.png",
    title: "Diagnostic Centers",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/dlhbzaxsqjyxymrwa4py.png",
    title: "Pharmacy Services",
  },
  {
     link: "/patient/dashboard/bookhomehealthcare",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/qzf91el2p32zneudsaib.png",
    title: "Home Healthcare",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/gizyowaityhbmd8djvxh.png",
    title: "Health Records",
    link: "/patient/dashboard/prescription",
  },
  {
    link: "/patient/dashboard/paymenthistory",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/xumuxjuj8kqu9nqcuhkx.png",
    title: "Payment History",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/lmhxfdqozjotifg0sync.png",
    title: "Government Schemes",
  },
  {
    link:"/patient/dashboard/bloodbank",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/expy7mceucklcgb7aw7e.png",
    title: "Blood Banks",
  },
  {
    link:"/patient/dashboard/pharmacy-order",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/hpjawaahh7ksnsnh5iew.png",
    title: "Your Orders",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/pwb5zw4ykbh4yxusvknj.png",
    title: "Dashboard Settings",
  },
  {
    link: "/patient/dashboard/surgeryschedule",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119010/Surgery_Schedules_pcvzmr.png",
    title: "Surgery Schedules",
  },
  {
    link: "/patient/dashboard/treatmentschedule",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119011/Treatment_Schedules_eaktpi.png",
    title: "Treatment Schedules",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/ys75fhayggrgenmi6ssy.png",
    title: "Your Feedback",
  },
]

// Professional Medical Navigation Component
const NavigationSidebar = ({ activeSection, onSectionChange }) => {
  const navigationItems = [
    {
      id: "overview",
      icon: Grid3X3,
      label: "Overview",
      color: "bg-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      id: "profile",
      icon: User,
      label: "Profile",
      color: "bg-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      id: "medical",
      icon: Heart,
      label: "Medical",
      color: "bg-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      id: "services",
      icon: Shield,
      label: "Services",
      color: "bg-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      id: "bookings",
      icon: CalendarIcon,
      label: "Bookings",
      color: "bg-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      id: "documents",
      icon: FileText,
      label: "Documents",
      color: "bg-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
  ]

  return (
    <div className="fixed bottom-20 right-6 z-50 hidden lg:block">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
        <div className="flex flex-col space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? `${item.color} text-white shadow-md`
                    : `text-gray-600 hover:${item.bgColor} hover:${item.textColor}`
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const Dashboardclient = () => {
  return (
    <div className="md:mt-4 lg:mt-0 lg:mb-20 md:pb-0 px-4 md:container h-auto xl:h-[580px] rounded-xl">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 p-8 shadow-lg"
      >
        {/* Background Accent */}
        <div className="absolute top-0 right-0 opacity-20 text-white text-[120px] font-extrabold select-none">+</div>

        <div className="relative z-10 text-center text-white font-poppins">
          <div className="flex justify-center gap-3 mb-4">
            <HeartPulse className="w-8 h-8 text-white drop-shadow-md" />
            <Stethoscope className="w-8 h-8 text-white drop-shadow-md" />
            <Activity className="w-8 h-8 text-white drop-shadow-md" />
          </div>
          <h1 className="text-[28px] md:text-[34px] font-extrabold tracking-wide drop-shadow-sm">
            Healthcare Services
          </h1>
          <p className="mt-2 text-[14px] md:text-[16px] font-medium opacity-90">Yours Personalized Health Hub</p>
        </div>
      </motion.div>

      {/* Grid Section */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 justify-center">
        {dashboardIcons.map((item, index) => (
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            key={index}
            className="flex flex-col items-center text-center"
          >
            <Link href={item.link || "#"}>
              <div className="group flex flex-col items-center">
                {/* Icon Box */}
                <div className="h-20 w-20 xl:h-24 xl:w-24 bg-gradient-to-tr from-[#243460] to-[#2b73f1] p-3 rounded-2xl shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:from-[#2b73f1] group-hover:to-[#243460]">
                  <Image
                    src={item.img || "/placeholder.svg"}
                    width={80}
                    height={80}
                    alt={item.title}
                    className="object-contain w-full h-full"
                  />
                </div>

                {/* Title */}
                <p className="mt-2 text-[11px] sm:text-[12px] md:text-[13px] font-poppins font-semibold leading-tight">
                  <span className="text-[#2b73ec] block">{item.title.split(" ")[0]}</span>
                  <span className="text-[#243460]">{item.title.split(" ").slice(1).join(" ")}</span>
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const PatientDashboardOverview = ({ 
  userdata,
  activeUser,
  onSwitchUser,
  isLinking,
  hasKidsProfile, 
}) => {
  const [activeSection, setActiveSection] = useState("overview")
  const [showMissingDialog, setShowMissingDialog] = useState(false)

  // Handle section navigation
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["overview", "profile", "medical", "services", "bookings", "documents"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const formatText = (text) => {
    if (!text) return "N/A"
    return text
      .toString()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const formatDate = (date) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    if (!amount) return "₹0"
    return `₹${Number.parseFloat(amount).toLocaleString("en-IN")}`
  }

  // Analyze medical history from JSON data
  const analyzeMedicalHistory = () => {
    if (!userdata?.medicalhistory?.length) return null

    const medicalData = userdata.medicalhistory[0] // Get first medical history record
    const conditions = []

    // Check boolean conditions
    const booleanConditions = [
      { key: "diabetes", label: "Diabetes", severity: "high" },
      { key: "highBloodPressure", label: "High Blood Pressure", severity: "high" },
      { key: "heartAttack", label: "Heart Attack", severity: "critical" },
      { key: "asthma", label: "Asthma", severity: "medium" },
      { key: "cancer", label: "Cancer", severity: "critical" },
      { key: "tuberculosis", label: "Tuberculosis", severity: "high" },
      { key: "thyroid", label: "Thyroid", severity: "medium" },
      { key: "cholesterol", label: "High Cholesterol", severity: "medium" },
      { key: "arthritis", label: "Arthritis", severity: "low" },
      { key: "allergies", label: "Allergies", severity: "low" },
      { key: "depression", label: "Depression", severity: "medium" },
      { key: "anxietyOrPanicDisorders", label: "Anxiety/Panic Disorders", severity: "medium" },
      { key: "kidneyProblems", label: "Kidney Problems", severity: "high" },
      { key: "liverGallbladderProblems", label: "Liver/Gallbladder Problems", severity: "high" },
      { key: "osteoporosis", label: "Osteoporosis", severity: "medium" },
      { key: "smoking", label: "Smoking", severity: "high" },
    ]

    booleanConditions.forEach((condition) => {
      if (medicalData?.[condition.key]) {
        conditions.push({
          name: condition.label,
          severity: condition.severity,
          value: true,
        })
      }
    })

    // Check value-based conditions
    const valueConditions = [
      { key: "bpvalue", label: "Blood Pressure", unit: "mmHg" },
      { key: "diabetesvalue", label: "Diabetes Level", unit: "mg/dL" },
      { key: "cholesterolvalue", label: "Cholesterol Level", unit: "mg/dL" },
      { key: "thyroidvalue", label: "Thyroid Level", unit: "mIU/L" },
      { key: "weight", label: "Weight", unit: "kg" },
      { key: "pulseRate", label: "Pulse Rate", unit: "bpm" },
    ]

    valueConditions.forEach((condition) => {
      if (medicalData?.[condition.key]) {
        conditions.push({
          name: condition.label,
          value: medicalData[condition.key],
          unit: condition.unit,
          severity: "info",
        })
      }
    })

    return conditions
  }

  const medicalConditions = analyzeMedicalHistory()

  // Enhanced profile completion calculation
  const calculateProfileCompletion = () => {
    const sections = {
      basicInfo: {
        fields: [
          userdata?.firstName,
          userdata?.lastName,
          userdata?.dateOfBirth,
          userdata?.gender,
          userdata?.mobile,
          userdata?.email,
        ],
        weight: 25,
      },
      addressInfo: {
        fields: [
          userdata?.presentAddress,
          userdata?.city,
          userdata?.state,
          userdata?.pincode,
          userdata?.district,
          userdata?.taluka,
        ],
        weight: 15,
      },
      identityDocs: {
        fields: [
          userdata?.aadharCardNumber,
          userdata?.aadharCardFront,
          userdata?.aadharCardBack,
          userdata?.passportPhoto,
        ],
        weight: 20,
      },
      medicalInfo: {
        fields: [
          userdata?.bloodgroup,
          userdata?.medicalhistory?.length > 0,
          userdata?.contactPersonName,
          userdata?.contactPersonRelation,
        ],
        weight: 20,
      },
      financialInfo: {
        fields: [userdata?.bankName, userdata?.accountNumber, userdata?.ifscCode, userdata?.accountType],
        weight: 10,
      },
      healthServices: {
        fields: [userdata?.abhacard, userdata?.healthInsurance, userdata?.ayushmancard, userdata?.rationcard],
        weight: 10,
      },
    }

    let totalCompletion = 0
    Object.values(sections).forEach((section) => {
      const completedFields = section.fields.filter((field) =>
        typeof field === "string" ? field.trim() !== "" : !!field,
      ).length
      const sectionCompletion = (completedFields / section.fields.length) * section.weight
      totalCompletion += sectionCompletion
    })

    return Math.round(totalCompletion)
  }

  const profileCompletion = calculateProfileCompletion()

  const getMissingProfileFields = () => {
    const missing = []

    // Basic Info
    if (!userdata?.firstName) missing.push("First Name")
    if (!userdata?.lastName) missing.push("Last Name")
    if (!userdata?.dateOfBirth) missing.push("Date of Birth")
    if (!userdata?.gender) missing.push("Gender")
    if (!userdata?.mobile) missing.push("Mobile Number")
    if (!userdata?.email) missing.push("Email")

    // Address Info
    if (!userdata?.presentAddress) missing.push("Present Address")
    if (!userdata?.city) missing.push("City")
    if (!userdata?.state) missing.push("State")
    if (!userdata?.pincode) missing.push("PIN Code")
    if (!userdata?.district) missing.push("District")
    if (!userdata?.taluka) missing.push("Taluka")

    // Identity Docs
    if (!userdata?.aadharCardNumber) missing.push("Aadhar Card Number")
    if (!userdata?.aadharCardFront) missing.push("Aadhar Card Front")
    if (!userdata?.aadharCardBack) missing.push("Aadhar Card Back")
    if (!userdata?.passportPhoto) missing.push("Profile Photograph")

    // Medical Info
    if (!userdata?.bloodgroup) missing.push("Blood Group")
    if (!(userdata?.medicalhistory?.length > 0)) missing.push("Medical History")
    if (!userdata?.contactPersonName) missing.push("Emergency Contact Name")
    if (!userdata?.contactPersonRelation) missing.push("Emergency Contact Relation")

    // Financial Info
    if (!userdata?.bankName) missing.push("Bank Name")
    if (!userdata?.accountNumber) missing.push("Account Number")
    if (!userdata?.ifscCode) missing.push("IFSC Code")
    if (!userdata?.accountType) missing.push("Account Type")

    // Health Services
    if (!userdata?.abhacard) missing.push("ABHA Card")
    if (!userdata?.healthInsurance) missing.push("Health Insurance")
    if (!userdata?.ayushmancard) missing.push("Ayushman Card")
    if (!userdata?.rationcard) missing.push("Ration Card")

    return missing
  }

  const missingFields = getMissingProfileFields()

  // Calculate statistics
  const stats = {
    familyMembers: userdata?.familymembers?.length || 0,
    appointments: userdata?.bookFreeAppointment?.length || 0,
    healthCards: userdata?.healthcard?.length || 0,
    bedBookings: userdata?.bedbooking?.length || 0,
    ambulanceBookings: (userdata?.bookambulance?.length || 0) + (userdata?.emergencyambulance?.length || 0),
    diagnosticServices: userdata?.BookDiagnosticService?.length || 0,
    surgeryTreatments: userdata?.BookSurgeryTreatment?.length || 0,
    homeHealthcare: userdata?.BookHomeHealthcare?.length || 0,
    totalPayments: userdata?.Payment?.reduce((sum, payment) => sum + Number.parseFloat(payment.amount || 0), 0) || 0,
    healthInsurances: userdata?.HealthInsurance?.length || 0,
    reviews: userdata?.reviews?.length || 0,
  }

  const InfoCard = ({ title, children, icon: Icon, className = "", gradient = "" }) => (
    <Card
      className={`h-full rounded-xl border-0 shadow-md hover:shadow-lg transition-shadow duration-200 ${gradient} ${className}`}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-800">
          {Icon && <Icon className="w-5 h-5 text-blue-600" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )

  const StatCard = ({ title, value, icon: Icon, color, bgColor, textColor, subtitle }) => (
    <Card className={`rounded-xl border-0 shadow-md hover:shadow-lg transition-shadow duration-200 ${bgColor}`}>
      <CardContent className="xs:p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const StatusIndicator = ({ label, status, type = "boolean", description }) => {
    const getStatusColor = () => {
      if (type === "boolean") {
        return status ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
      }
      switch (status?.toLowerCase()) {
        case "approved":
        case "completed":
        case "active":
        case "success":
          return "bg-green-100 text-green-800 border-green-200"
        case "pending":
        case "submitted":
          return "bg-yellow-100 text-yellow-800 border-yellow-200"
        case "rejected":
        case "cancelled":
        case "failed":
          return "bg-red-100 text-red-800 border-red-200"
        default:
          return "bg-gray-100 text-gray-800 border-gray-200"
      }
    }

    const getStatusText = () => {
      if (type === "boolean") {
        return status ? "Complete" : "Missing"
      }
      return formatText(status)
    }

    const getStatusIcon = () => {
      if (type === "boolean") {
        return status ? <CircleCheck className="w-4 h-4" /> : <CircleX className="w-4 h-4" />
      }
      switch (status?.toLowerCase()) {
        case "approved":
        case "completed":
        case "active":
        case "success":
          return <CircleCheck className="w-4 h-4" />
        case "pending":
        case "submitted":
          return <CircleAlert className="w-4 h-4" />
        case "rejected":
        case "cancelled":
        case "failed":
          return <CircleX className="w-4 h-4" />
        default:
          return <Info className="w-4 h-4" />
      }
    }

    return (
      <div className="flex items-center justify-between p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors duration-200">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            {getStatusIcon()}
          </div>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        <Badge className={`rounded-xl ${getStatusColor()}`}>{getStatusText()}</Badge>
      </div>
    )
  }

  const ProfileCompletionCard = ({ icon: Icon, title, description, iconColorClass }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors duration-200 ${iconColorClass}`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-gray-700 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-xs text-gray-600 group-hover:text-gray-500 transition-colors duration-200">
            {description}
          </p>
        </div>
      </div>
    </div>
  )

  const DashboardActionCard = ({ item, count }) => {
    const CardContent = (
      <div className="p-6 rounded-xl border-2 border-dashed border-blue-300 hover:bg-blue-50 transition-colors duration-200 cursor-pointer group relative">
        {count !== undefined && count > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {count}
          </Badge>
        )}
        <div className="text-center">
          <div className="inline-flex p-4 rounded-xl bg-blue-100 mb-4 group-hover:scale-105 transition-transform duration-200">
            <Image src={item.img || "/placeholder.svg"} alt={item.title} width={32} height={32} className="w-8 h-8" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
        </div>
      </div>
    )

    if (item.link) {
      return <Link href={item.link}>{CardContent}</Link>
    }

    return <div>{CardContent}</div>
  }
  return (
    <div className="bg-gray-50 min-h-screen font-sans relative">
      {/* Navigation Sidebar */}
      <NavigationSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />

      <div className="w-full max-w-7xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Updated Profile Header with User Switcher */}
        <div className="relative bg-white rounded-2xl mx-2 sm:mx-4 mt-4 overflow-hidden shadow-lg border border-gray-100">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
          <div className="absolute top-0 right-0 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full -translate-y-16 sm:-translate-y-24 lg:-translate-y-32 translate-x-16 sm:translate-x-24 lg:translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-24 sm:w-36 lg:w-48 h-24 sm:h-36 lg:h-48 bg-gradient-to-tr from-purple-100/30 to-transparent rounded-full translate-y-12 sm:translate-y-18 lg:translate-y-24 -translate-x-12 sm:-translate-x-18 lg:-translate-x-24"></div>

          <div className="relative z-10 p-4 sm:p-6 lg:p-8">

            {/* Profile Header Content */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-start">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center lg:items-start">
                <div className="relative">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden">
                    {userdata?.passportPhoto ? (
                      <Image
                        className="w-full h-full object-cover"
                        src={userdata.passportPhoto || "/placeholder.svg"}
                        alt="User Profile"
                        width={128}
                        height={128}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <User className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                      </div>
                    )}
                  </div>
                  {/* Status Indicator */}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Profile Completion */}
                <div className="mt-4 text-center lg:text-left">
                  <div className="text-sm text-gray-600 mb-2">Profile Completion</div>
                  <div className="flex items-center gap-2 mb-3">
                    <Progress value={profileCompletion} className="flex-1 h-2" />
                    <span className="text-sm font-semibold text-gray-700">{profileCompletion}%</span>
                    {profileCompletion < 100 && (
                      <button
                        onClick={() => setShowMissingDialog(true)}
                        className="ml-2 p-1 rounded-full bg-orange-100 hover:bg-orange-200 border border-orange-300"
                        title="Show missing profile fields"
                        type="button"
                      >
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                      </button>
                    )}
                  </div>
                  {!userdata?.isKidsMode && (
                    <Link href="/patient/dashboard/profile">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                        <Plus className="w-4 h-4 mr-1" />
                        Complete Profile
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Profile Information */}
              <div className="flex-1 pr-20 sm:pr-24 lg:pr-0">
                <div className="mb-6">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {formatText(userdata?.firstName)} {formatText(userdata?.lastName)}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4 flex items-center gap-2">
                    {userdata?.isKidsMode ? (
                      <>
                        <TbMoodKid className="text-blue-500" />
                        Kids Profile Dashboard
                      </>
                    ) : (
                      "Patient Dashboard"
                    )}
                  </p>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/50">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Phone className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Phone</div>
                        <div className="text-sm font-medium text-gray-900">{userdata?.mobile || "N/A"}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/50">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Mail className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Email</div>
                        <div className="text-sm font-medium text-gray-900 truncate">{userdata?.email || "N/A"}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/50">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <MapPin className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Location</div>
                        <div className="text-sm font-medium text-gray-900">
                          {userdata?.city || "N/A"}, {userdata?.state || "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/50">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Heart className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Blood Group</div>
                        <div className="text-sm font-medium text-gray-900">{userdata?.bloodgroup || "Not Set"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-3">
                  {!userdata?.isKidsMode && (
                    <>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 rounded-lg px-3 py-1">
                        Member since {formatDate(userdata?.createdAt)}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 border-green-200 rounded-lg px-3 py-1">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {userdata?.profileComplete ? "Verified Profile" : "Profile Incomplete"}
                      </Badge>
                    </>
                  )}
                  {hasKidsProfile && (
                    <Badge
                      className={`rounded-lg px-3 py-1 ${userdata?.isKidsMode ? "bg-purple-100 text-purple-800 border-purple-200" : "bg-gray-100 text-gray-800 border-gray-200"}`}
                    >
                      <TbMoodKid /> Kids Profile Available
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Modern Stats Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-blue-100">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Health Overview
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.familyMembers}</div>
                    <div className="text-sm text-gray-600">Family Members</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.appointments + stats.bedBookings + stats.ambulanceBookings}
                    </div>
                    <div className="text-sm text-gray-600">Total Bookings</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.healthCards + stats.diagnosticServices + stats.surgeryTreatments + stats.homeHealthcare}
                    </div>
                    <div className="text-sm text-gray-600">Health Services</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <IndianRupee className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalPayments)}</div>
                    <div className="text-sm text-gray-600">Total Payments</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Information Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
              <div className="bg-gray-50 px-2 sm:px-4 py-6">
                <TabsList className={`grid w-full grid-cols-3 ${hasKidsProfile ? "lg:grid-cols-7" : "lg:grid-cols-6"} bg-transparent h-auto p-0 gap-1`}>
                  <TabsTrigger
                    value="overview"
                    className="flex flex-col items-center gap-1 px-1 sm:px-2 py-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 rounded-lg text-xs font-medium transition-all duration-200 min-h-[60px] justify-center"
                  >
                    <Grid3X3 className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs leading-tight text-center">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="profile"
                    className="flex flex-col items-center gap-1 px-1 sm:px-2 py-3 data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 rounded-lg text-xs font-medium transition-all duration-200 min-h-[60px] justify-center"
                  >
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs leading-tight text-center">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="medical"
                    className="flex flex-col items-center gap-1 px-1 sm:px-2 py-3 data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 rounded-lg text-xs font-medium transition-all duration-200 min-h-[60px] justify-center"
                  >
                    <Heart className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs leading-tight text-center">Medical</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="services"
                    className="flex flex-col items-center gap-1 px-1 sm:px-2 py-3 data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 rounded-lg text-xs font-medium transition-all duration-200 min-h-[60px] justify-center"
                  >
                    <Shield className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs leading-tight text-center">Services</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="bookings"
                    className="flex flex-col items-center gap-1 px-1 sm:px-2 py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 rounded-lg text-xs font-medium transition-all duration-200 min-h-[60px] justify-center"
                  >
                    <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs leading-tight text-center">Bookings</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    className="flex flex-col items-center gap-1 px-1 sm:px-2 py-3 data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 rounded-lg text-xs font-medium transition-all duration-200 min-h-[60px] justify-center"
                  >
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs leading-tight text-center">Documents</span>
                  </TabsTrigger>
                  {hasKidsProfile && <TabsTrigger
                    value="linked-accounts"
                    className="flex flex-col items-center gap-1 px-1 sm:px-2 py-3 data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 rounded-lg text-xs font-medium transition-all duration-200 min-h-[60px] justify-center"
                  >
                    <LinkIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs leading-tight text-center">Linked Accounts</span>
                  </TabsTrigger>}
                </TabsList>
              </div>

              <TabsContent value="overview" id="overview" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Recent Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Recent Appointments */}
                  <InfoCard
                    title="Recent Appointments"
                    icon={Calendar}
                    gradient="bg-gradient-to-br from-green-50 to-emerald-50"
                  >
                    {userdata?.bookFreeAppointment?.length > 0 ? (
                      <div className="space-y-4">
                        {userdata.bookFreeAppointment.slice(0, 3).map((appointment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-white rounded-xl border hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <Stethoscope className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {appointment.doctor?.firstName || "Doctor"} {appointment.doctor?.lastName || ""}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {appointment.category?.title || "General Consultation"}
                                </p>
                                <p className="text-xs text-gray-500">{formatDate(appointment.preferredDate)}</p>
                              </div>
                            </div>
                            <Badge
                              className={`rounded-xl ${
                                appointment.status === "APPROVED"
                                  ? "bg-green-100 text-green-800"
                                  : appointment.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {formatText(appointment.status)}
                            </Badge>
                          </div>
                        ))}
                        <Button variant="outline" className="w-full rounded-xl bg-transparent">
                          <Calendar className="w-4 h-4 mr-2" />
                          View All Appointments ({stats.appointments})
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500 mb-4">No appointments yet</p>
                        <Button className="rounded-xl">
                          <Plus className="w-4 h-4 mr-2" />
                          Book Appointment
                        </Button>
                      </div>
                    )}
                  </InfoCard>

                  {/* Health Services Summary */}
                  <InfoCard
                    title="Health Services Summary"
                    icon={Shield}
                    gradient="bg-gradient-to-br from-purple-50 to-pink-50"
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-white rounded-xl border">
                          <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                          <p className="text-2xl font-bold text-purple-600">{stats.healthCards}</p>
                          <p className="text-sm text-gray-600">Health Cards</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl border">
                          <TestTube className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                          <p className="text-2xl font-bold text-blue-600">{stats.diagnosticServices}</p>
                          <p className="text-sm text-gray-600">Diagnostic Tests</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl border">
                          <Scissors className="w-8 h-8 mx-auto mb-2 text-red-600" />
                          <p className="text-2xl font-bold text-red-600">{stats.surgeryTreatments}</p>
                          <p className="text-sm text-gray-600">Surgery Bookings</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl border">
                          <Home className="w-8 h-8 mx-auto mb-2 text-green-600" />
                          <p className="text-2xl font-bold text-green-600">{stats.homeHealthcare}</p>
                          <p className="text-sm text-gray-600">Home Healthcare</p>
                        </div>
                      </div>
                    </div>
                  </InfoCard>
                </div>

                {/* Quick Actions */}
              </TabsContent>

              <TabsContent value="profile" id="profile" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Basic Information Status */}
                  <InfoCard
                    title="Basic Information"
                    icon={User}
                    gradient="bg-gradient-to-br from-blue-50 to-indigo-50"
                  >
                    <div className="space-y-3">
                      <StatusIndicator
                        label="First Name"
                        status={userdata?.firstName}
                        description="Your first name as per official documents"
                      />
                      <StatusIndicator
                        label="Last Name"
                        status={userdata?.lastName}
                        description="Your last name as per official documents"
                      />
                      <StatusIndicator
                        label="Date of Birth"
                        status={userdata?.dateOfBirth}
                        description="Required for age verification and medical records"
                      />
                      <StatusIndicator
                        label="Gender"
                        status={userdata?.gender}
                        description="Important for medical consultations"
                      />
                      <StatusIndicator
                        label="Marital Status"
                        status={userdata?.maritalStatus}
                        description="Optional demographic information"
                      />
                      <StatusIndicator
                        label="Blood Group"
                        status={userdata?.bloodgroup}
                        description="Critical for emergency medical situations"
                      />
                    </div>
                  </InfoCard>

                  {/* Contact Information Status */}
                  <InfoCard
                    title="Contact Information"
                    icon={Phone}
                    gradient="bg-gradient-to-br from-green-50 to-emerald-50"
                  >
                    <div className="space-y-3">
                      <StatusIndicator
                        label="Mobile Number"
                        status={userdata?.mobile}
                        description="Primary contact for appointments and notifications"
                      />
                      <StatusIndicator
                        label="Email Address"
                        status={userdata?.email}
                        description="For digital communications and reports"
                      />
                      <StatusIndicator
                        label="Alternate Mobile"
                        status={userdata?.alternateMobile}
                        description="Backup contact number"
                      />
                      <StatusIndicator
                        label="Present Address"
                        status={userdata?.presentAddress}
                        description="Current residential address"
                      />
                      <StatusIndicator label="City" status={userdata?.city} description="City of residence" />
                      <StatusIndicator label="State" status={userdata?.state} description="State of residence" />
                      <StatusIndicator
                        label="PIN Code"
                        status={userdata?.pincode}
                        description="Postal code for location services"
                      />
                    </div>
                  </InfoCard>
                </div>
              </TabsContent>

              <TabsContent value="medical" id="medical" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Medical History Status */}
                  <InfoCard title="Medical History" icon={Heart} gradient="bg-gradient-to-br from-red-50 to-pink-50">
                    <div className="space-y-3">
                      <StatusIndicator
                        label="Medical History Records"
                        status={userdata?.medicalhistory?.length > 0}
                        description={`${userdata?.medicalhistory?.length || 0} medical history entries`}
                      />
                      <StatusIndicator
                        label="Emergency Contact"
                        status={userdata?.contactPersonName}
                        description="Emergency contact person details"
                      />
                      <StatusIndicator
                        label="Contact Relation"
                        status={userdata?.contactPersonRelation}
                        description="Relationship with emergency contact"
                      />
                      <StatusIndicator
                        label="Organ Donation"
                        status={userdata?.organDonation}
                        description="Organ donation consent status"
                      />
                      <StatusIndicator
                        label="Family Members"
                        status={userdata?.familymembers?.length > 0}
                        description={`${stats.familyMembers} family members registered`}
                      />
                    </div>
                  </InfoCard>

                  {/* Health Insurance & Cards */}
                  <InfoCard
                    title="Health Insurance & Cards"
                    icon={Shield}
                    gradient="bg-gradient-to-br from-purple-50 to-indigo-50"
                  >
                    <div className="space-y-3">
                      <StatusIndicator
                        label="Health Insurance"
                        status={userdata?.healthInsurance}
                        description={`${stats.healthInsurances} insurance policies`}
                      />
                      <StatusIndicator
                        label="ABHA Card"
                        status={userdata?.abhacard}
                        description="Ayushman Bharat Health Account"
                      />
                      <StatusIndicator
                        label="Ayushman Card"
                        status={userdata?.ayushmancard}
                        description="Ayushman Bharat Pradhan Mantri Jan Arogya Yojana"
                      />
                      <StatusIndicator
                        label="Ration Card"
                        status={userdata?.rationcard}
                        description="Government ration card for subsidies"
                      />
                      <StatusIndicator
                        label="Health Card Applications"
                        status={userdata?.healthcard?.length > 0}
                        description={`${stats.healthCards} health card applications`}
                      />
                    </div>
                  </InfoCard>
                </div>

                {medicalConditions && medicalConditions.length > 0 && (
                  <InfoCard
                    title="Current Medical Conditions"
                    icon={Activity}
                    gradient="bg-gradient-to-br from-orange-50 to-red-50"
                  >
                    <div className="space-y-3">
                      {medicalConditions.map((condition, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                condition.severity === "critical"
                                  ? "bg-red-500"
                                  : condition.severity === "high"
                                    ? "bg-orange-500"
                                    : condition.severity === "medium"
                                      ? "bg-yellow-500"
                                      : condition.severity === "low"
                                        ? "bg-green-500"
                                        : "bg-blue-500"
                              }`}
                            ></div>
                            <span className="font-medium text-gray-700">{condition.name}</span>
                          </div>
                          <div className="text-right">
                            {condition.value === true ? (
                              <Badge className="bg-red-100 text-red-800 rounded-xl">Active</Badge>
                            ) : condition.value && condition.unit ? (
                              <span className="text-sm font-semibold text-gray-600">
                                {condition.value} {condition.unit}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ))}
                      <Link href="/patient/dashboard/medical-history">
                        <Button variant="outline" className="w-full rounded-xl bg-transparent">
                          <FileText className="w-4 h-4 mr-2" />
                          View Complete Medical History
                        </Button>
                      </Link>
                    </div>
                  </InfoCard>
                )}
              </TabsContent>

              <TabsContent value="services" id="services" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 min-[1100px]:grid-cols-3 gap-6">
                  {/* Diagnostic Services */}
                  <InfoCard
                    title="Diagnostic Services"
                    icon={TestTube}
                    gradient="bg-gradient-to-br from-blue-50 to-cyan-50"
                  >
                    <div className="text-center py-4">
                      <TestTube className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                      <p className="text-3xl font-bold text-blue-600 mb-2">{stats.diagnosticServices}</p>
                      <p className="text-gray-600 mb-4">Diagnostic tests booked</p>
                      <Button size="sm" className="w-full rounded-xl">
                        <Plus className="w-4 h-4 mr-2" />
                        Book Diagnostic Test
                      </Button>
                    </div>
                  </InfoCard>

                  {/* Surgery Treatments */}
                  <InfoCard
                    title="Surgery & Treatments"
                    icon={Scissors}
                    gradient="bg-gradient-to-br from-red-50 to-orange-50"
                  >
                    <div className="text-center py-4">
                      <Scissors className="w-16 h-16 mx-auto mb-4 text-red-600" />
                      <p className="text-3xl font-bold text-red-600 mb-2">{stats.surgeryTreatments}</p>
                      <p className="text-gray-600 mb-4">Surgery bookings</p>
                      <Button size="sm" className="w-full rounded-xl">
                        <Plus className="w-4 h-4 mr-2" />
                        Book Surgery
                      </Button>
                    </div>
                  </InfoCard>

                  {/* Home Healthcare */}
                  <InfoCard title="Home Healthcare" icon={Home} gradient="bg-gradient-to-br from-green-50 to-teal-50">
                    <div className="text-center py-4">
                      <Home className="w-16 h-16 mx-auto mb-4 text-green-600" />
                      <p className="text-3xl font-bold text-green-600 mb-2">{stats.homeHealthcare}</p>
                      <p className="text-gray-600 mb-4">Home healthcare bookings</p>
                      <Button size="sm" className="w-full rounded-xl">
                        <Plus className="w-4 h-4 mr-2" />
                        Book Home Care
                      </Button>
                    </div>
                  </InfoCard>
                </div>

                {/* Recent Service Bookings */}
                <InfoCard
                  title="Recent Service Bookings"
                  icon={ClipboardList}
                  gradient="bg-gradient-to-br from-gray-50 to-slate-50"
                >
                  <div className="space-y-4">
                    {/* Show recent bookings from all services */}
                    {userdata?.BookDiagnosticService?.slice(0, 2).map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border">
                        <div className="flex items-center gap-3">
                          <TestTube className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-semibold">Diagnostic Service</p>
                            <p className="text-sm text-gray-600">{formatDate(service.bookingDate)}</p>
                          </div>
                        </div>
                        <Badge
                          className={`rounded-xl ${
                            service.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : service.status === "CONFIRMED"
                                ? "bg-blue-100 text-blue-800"
                                : service.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {formatText(service.status)}
                        </Badge>
                      </div>
                    ))}

                    {userdata?.BookSurgeryTreatment?.slice(0, 2).map((surgery, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border">
                        <div className="flex items-center gap-3">
                          <Scissors className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="font-semibold">Surgery Treatment</p>
                            <p className="text-sm text-gray-600">{formatDate(surgery.bookingDate)}</p>
                          </div>
                        </div>
                        <Badge
                          className={`rounded-xl ${
                            surgery.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : surgery.status === "CONFIRMED"
                                ? "bg-blue-100 text-blue-800"
                                : surgery.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {formatText(surgery.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </InfoCard>
              </TabsContent>

              <TabsContent value="bookings" id="bookings" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Bed Bookings */}
                  <InfoCard title="Bed Bookings" icon={Bed} gradient="bg-gradient-to-br from-indigo-50 to-purple-50">
                    {userdata?.bedbooking?.length > 0 ? (
                      <div className="space-y-4">
                        {userdata.bedbooking.slice(0, 3).map((booking, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border">
                            <div className="flex items-center gap-3">
                              <Bed className="w-5 h-5 text-indigo-600" />
                              <div>
                                <p className="font-semibold">{booking.hospitalName || "Hospital"}</p>
                                <p className="text-sm text-gray-600">{booking.bedCategory || "General Ward"}</p>
                                <p className="text-xs text-gray-500">{formatDate(booking.Bookingdate)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button variant="outline" className="w-full rounded-xl bg-transparent">
                          <Bed className="w-4 h-4 mr-2" />
                          View All Bed Bookings ({stats.bedBookings})
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Bed className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500 mb-4">No bed bookings yet</p>
                        <Button className="rounded-xl">
                          <Plus className="w-4 h-4 mr-2" />
                          Book Hospital Bed
                        </Button>
                      </div>
                    )}
                  </InfoCard>

                  {/* Ambulance Bookings */}
                  <InfoCard
                    title="Ambulance Services"
                    icon={Ambulance}
                    gradient="bg-gradient-to-br from-red-50 to-orange-50"
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 min-[1000px]:p-2 min-[1000px]:py-4 min-[1100px]:p-4 bg-white rounded-xl border">
                          <Car className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                          <p className="text-2xl font-bold text-blue-600">{userdata?.bookambulance?.length || 0}</p>
                          <p className="text-sm text-gray-600">Regular Bookings</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl border">
                          <Siren className="w-8 h-8 mx-auto mb-2 text-red-600" />
                          <p className="text-2xl font-bold text-red-600">{userdata?.emergencyambulance?.length || 0}</p>
                          <p className="text-sm text-gray-600">Emergency Calls</p>
                        </div>
                      </div>

                      {stats.ambulanceBookings > 0 ? (
                        <Button variant="outline" className="w-full rounded-xl bg-transparent">
                          <Ambulance className="w-4 h-4 mr-2" />
                          View All Ambulance Bookings
                        </Button>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500 mb-4">No ambulance bookings yet</p>
                          <div className="grid grid-cols-2 gap-2">
                            <Button size="sm" className="rounded-xl">
                              <Car className="w-4 h-4 mr-1" />
                              Book Ambulance
                            </Button>
                            <Button size="sm" variant="destructive" className="rounded-xl">
                              <Siren className="w-4 h-4 mr-1" />
                              Emergency
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </InfoCard>
                </div>

                {/* Payment History */}
                <InfoCard
                  title="Payment History"
                  icon={Wallet}
                  gradient="bg-gradient-to-br from-green-50 to-emerald-50"
                >
                  {userdata?.Payment?.length > 0 ? (
                    <div className="space-y-4">
                      {userdata.Payment.slice(0, 5).map((payment, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Banknote className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                              <p className="text-sm text-gray-600">{payment.forwhat || "Healthcare Service"}</p>
                              <p className="text-xs text-gray-500">{formatDate(payment.createdAt)}</p>
                            </div>
                          </div>
                          <Badge
                            className={`rounded-xl ${
                              payment.paymentStatus === "SUCCESS"
                                ? "bg-green-100 text-green-800"
                                : payment.paymentStatus === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {formatText(payment.paymentStatus)}
                          </Badge>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full rounded-xl bg-transparent">
                        <Receipt className="w-4 h-4 mr-2" />
                        View All Payments ({userdata.Payment.length})
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500">No payment history available</p>
                    </div>
                  )}
                </InfoCard>
              </TabsContent>

              <TabsContent value="documents" id="documents" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Identity Documents */}
                  <InfoCard
                    title="Identity Documents"
                    icon={IdCard}
                    gradient="bg-gradient-to-br from-blue-50 to-indigo-50"
                  >
                    <div className="space-y-3">
                      <StatusIndicator
                        label="Aadhar Card Number"
                        status={userdata?.aadharCardNumber}
                        description="Government issued identity proof"
                      />
                      <StatusIndicator
                        label="Aadhar Card Front"
                        status={userdata?.aadharCardFront}
                        description="Front side image of Aadhar card"
                      />
                      <StatusIndicator
                        label="Aadhar Card Back"
                        status={userdata?.aadharCardBack}
                        description="Back side image of Aadhar card"
                      />
                      <StatusIndicator
                        label="PAN Card"
                        status={userdata?.hasPanCard}
                        description="Permanent Account Number card"
                      />
                      <StatusIndicator
                        label="Passport Photo"
                        status={userdata?.passportPhoto}
                        description="Profile photograph for identification"
                      />
                    </div>
                  </InfoCard>

                  {/* Financial Documents */}
                  <InfoCard
                    title="Financial Documents"
                    icon={CreditCard}
                    gradient="bg-gradient-to-br from-green-50 to-emerald-50"
                  >
                    <div className="space-y-3">
                      <StatusIndicator
                        label="Bank Account Details"
                        status={userdata?.bankName && userdata?.accountNumber}
                        description="Bank account for refunds and payments"
                      />
                      <StatusIndicator
                        label="IFSC Code"
                        status={userdata?.ifscCode}
                        description="Bank branch identification code"
                      />
                      <StatusIndicator
                        label="Cancelled Cheque"
                        status={userdata?.cancelledCheque}
                        description="Bank account verification document"
                      />
                      <StatusIndicator
                        label="Income Certificate"
                        status={userdata?.income}
                        description="Income proof for government schemes"
                      />
                      <StatusIndicator
                        label="PAN Card Document"
                        status={userdata?.panCard}
                        description="PAN card image for tax purposes"
                      />
                    </div>
                  </InfoCard>
                </div>

                {/* Document Upload Actions */}
                <InfoCard
                  title="Document Upload Center"
                  icon={FileImage}
                  gradient="bg-gradient-to-br from-purple-50 to-pink-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/patient/dashboard/profile">
                      <Button variant="outline" className="p-6 h-auto flex-col rounded-xl w-full bg-transparent">
                        <IdCard className="w-8 h-8 mb-2 text-blue-600" />
                        <span className="font-semibold">Upload Aadhar</span>
                        <span className="text-xs text-gray-500">Front & Back</span>
                      </Button>
                    </Link>

                    <Link href="/patient/dashboard/profile">
                      <Button variant="outline" className="p-6 h-auto flex-col rounded-xl w-full bg-transparent">
                        <CreditCard className="w-8 h-8 mb-2 text-green-600" />
                        <span className="font-semibold">Upload PAN</span>
                        <span className="text-xs text-gray-500">Tax Document</span>
                      </Button>
                    </Link>

                    <Link href="/patient/dashboard/profile">
                      <Button variant="outline" className="p-6 h-auto flex-col rounded-xl w-full bg-transparent">
                        <Camera className="w-8 h-8 mb-2 text-purple-600" />
                        <span className="font-semibold">Update Photo</span>
                        <span className="text-xs text-gray-500">Profile Picture</span>
                      </Button>
                    </Link>
                  </div>
                </InfoCard>
              </TabsContent>

              <TabsContent value="linked-accounts" id="linked-accounts" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="space-y-6">
                  {/* Main Account Card */}
                  <InfoCard title="Main Account" icon={User} gradient="bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="space-y-4">
                      {/* Main User Card */}
                      <div className="relative overflow-hidden rounded-xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 hover:shadow-lg transition-shadow duration-200">
                        {/* Badge */}
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-blue-600 text-white rounded-full px-3 py-1 text-xs font-semibold">
                            Primary Account
                          </Badge>
                        </div>

                        {/* Account Content */}
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            <div className="w-16 h-16 rounded-xl border-3 border-blue-300 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden shadow-md">
                              {userdata?.passportPhoto ? (
                                <Image
                                  src={userdata.passportPhoto || "/placeholder.svg"}
                                  alt="Main User"
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-8 h-8 text-white" />
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          </div>

                          {/* User Info */}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {formatText(userdata?.firstName)} {formatText(userdata?.lastName)}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                              <Mail className="w-4 h-4 text-blue-600" />
                              {userdata?.email || "No email"}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge className="bg-blue-100 text-blue-800 rounded-lg text-xs">
                                <Phone className="w-3 h-3 mr-1" />
                                {userdata?.mobile || "No phone"}
                              </Badge>
                              <Badge className="bg-green-100 text-green-800 rounded-lg text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                {userdata?.city || "No city"}
                              </Badge>
                              <Badge className="bg-purple-100 text-purple-800 rounded-lg text-xs">
                                <Heart className="w-3 h-3 mr-1" />
                                {userdata?.bloodgroup || "Not set"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Account Status */}
                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div>
                              <p className="text-2xl font-bold text-blue-600">{stats.appointments}</p>
                              <p className="text-xs text-gray-600">Appointments</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-green-600">{stats.familyMembers}</p>
                              <p className="text-xs text-gray-600">Family Members</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-purple-600">{stats.healthCards}</p>
                              <p className="text-xs text-gray-600">Health Cards</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </InfoCard>

                  {/* Linked Family Members */}
                  {userdata?.familymembers && userdata.familymembers.length > 0 ? (
                    <InfoCard
                      title="Linked Family Members"
                      icon={UsersIcon}
                      gradient="bg-gradient-to-br from-purple-50 to-pink-50"
                    >
                      <div className="space-y-4">
                        {userdata.familymembers.map((member, index) => {
                          const memberAge = member.age || 0
                          const isKidsAccount = memberAge <= 16
                          const memberInitials =
                            `${member.firstName?.[0] || ""}${member.lastName?.[0] || ""}`.toUpperCase()

                          return (
                            <div
                              key={index}
                              className={`relative overflow-hidden rounded-xl border-2 p-6 hover:shadow-lg transition-shadow duration-200 ${
                                isKidsAccount
                                  ? "border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50"
                                  : "border-green-300 bg-gradient-to-br from-green-50 to-emerald-50"
                              }`}
                            >
                              {/* Badge */}
                              <div className="absolute top-4 right-4">
                                <Badge
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    isKidsAccount ? "bg-purple-600 text-white" : "bg-green-600 text-white"
                                  }`}
                                >
                                  {isKidsAccount ? 
                                    <>
                                      <TbMoodKid /> 
                                      Kids Account"  
                                    </>
                                    :
                                  "👤 Family Account"}
                                </Badge>
                              </div>

                              {/* Account Content */}
                              <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                  <div
                                    className={`w-14 h-14 rounded-xl border-3 flex items-center justify-center font-bold text-white text-lg shadow-md ${
                                      isKidsAccount
                                        ? "border-purple-300 bg-gradient-to-br from-purple-500 to-pink-600"
                                        : "border-green-300 bg-gradient-to-br from-green-500 to-emerald-600"
                                    }`}
                                  >
                                    {member.passportPhoto ? (
                                      <Image
                                        src={member.passportPhoto || "/placeholder.svg"}
                                        alt={`${member.firstName} ${member.lastName}`}
                                        width={56}
                                        height={56}
                                        className="w-full h-full object-cover rounded-[10px]"
                                      />
                                    ) : (
                                      memberInitials
                                    )}
                                  </div>
                                  <div
                                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                                      isKidsAccount ? "bg-purple-500" : "bg-green-500"
                                    }`}
                                  >
                                    <CheckCircle className="w-3 h-3 text-white" />
                                  </div>
                                </div>

                                {/* User Info */}
                                <div className="flex-1">
                                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    {formatText(member.firstName)} {formatText(member.lastName)}
                                  </h3>
                                  <p className="text-sm text-gray-600 mb-2">{member.email || "No email provided"}</p>
                                  <div className="flex flex-wrap gap-2">
                                    <Badge
                                      className={`rounded-lg text-xs ${
                                        isKidsAccount ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                                      }`}
                                    >
                                      <User className="w-3 h-3 mr-1" />
                                      Age: {memberAge} years
                                    </Badge>
                                    <Badge
                                      className={`rounded-lg text-xs ${
                                        isKidsAccount ? "bg-pink-100 text-pink-800" : "bg-emerald-100 text-emerald-800"
                                      }`}
                                    >
                                      <Heart className="w-3 h-3 mr-1" />
                                      {member.bloodgroup || "Not set"}
                                    </Badge>
                                    {member.mobile && (
                                      <Badge
                                        className={`rounded-lg text-xs ${
                                          isKidsAccount
                                            ? "bg-purple-100 text-purple-800"
                                            : "bg-green-100 text-green-800"
                                        }`}
                                      >
                                        <Phone className="w-3 h-3 mr-1" />
                                        {member.mobile}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Relationship Info */}
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-700">
                                  <span className="font-semibold">Relationship:</span>{" "}
                                  {member.relation || "Family Member"}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </InfoCard>
                  ) : (
                    <InfoCard
                      title="Linked Family Members"
                      icon={UsersIcon}
                      gradient="bg-gradient-to-br from-purple-50 to-pink-50"
                    >
                      <div className="text-center py-12">
                        <UsersIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 mb-4 text-lg">No family members linked yet</p>
                        <p className="text-gray-400 text-sm mb-6">
                          Add family members to link their accounts and manage their health records
                        </p>
                        <Link href="/patient/dashboard/family">
                          <Button className="rounded-xl bg-purple-600 hover:bg-purple-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Family Member
                          </Button>
                        </Link>
                      </div>
                    </InfoCard>
                  )}

                  {/* Account Linking Info */}
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-cyan-100 rounded-lg flex-shrink-0">
                        <LinkIcon className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">How Account Linking Works</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong>Main Account:</strong> Your primary healthcare account with full access to all
                              services
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong>Kids Accounts:</strong> Automatically created for family members aged 16 or below
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong>Family Accounts:</strong> For adult family members with independent access
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong>Easy Switching:</strong> Use the switcher button to quickly toggle between
                              accounts
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Clean Profile Completion Section */}
          {profileCompletion < 100 && (
            <div className="relative">
              {/* Clean Main Container Card */}
              <div className="bg-white rounded-xl shadow-lg border border-orange-200 overflow-hidden">
                {/* Clean Header Section */}
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-24 bg-blue-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${profileCompletion}%` }}
                        />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900">
                        <span className="text-orange-600">Action Required</span> - Complete Your Profile (
                        {100 - profileCompletion}% remaining)
                      </h2>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 ml-11">
                    Complete your profile to access all healthcare benefits and services.
                  </p>
                </div>

                {/* Clean Cards Grid */}
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ProfileCompletionCard
                      icon={User}
                      title="Complete your name information"
                      description="Add your full legal name for identification."
                      iconColorClass="text-blue-600"
                    />
                    <ProfileCompletionCard
                      icon={Heart}
                      title="Add your blood group"
                      description="Important for emergency medical situations."
                      iconColorClass="text-red-600"
                    />
                    <ProfileCompletionCard
                      icon={FileText}
                      title="Upload Aadhar card details"
                      description="Required for identity verification."
                      iconColorClass="text-green-600"
                    />
                    <ProfileCompletionCard
                      icon={Camera}
                      title="Upload profile photograph"
                      description="Help staff identify you during visits."
                      iconColorClass="text-orange-500"
                    />
                    <ProfileCompletionCard
                      icon={Users}
                      title="Add family members for emergency contact"
                      description="Ensure we can reach someone in emergencies."
                      iconColorClass="text-purple-600"
                    />
                    <ProfileCompletionCard
                      icon={Shield}
                      title="Add emergency contact person"
                      description="Primary contact for medical emergencies."
                      iconColorClass="text-yellow-600"
                    />
                    <ProfileCompletionCard
                      icon={CreditCard}
                      title="Add bank account details"
                      description="For insurance claims and refunds."
                      iconColorClass="text-blue-600"
                    />
                  </div>
                </div>

                {/* Clean Orange Footer Bar */}
                <div className="bg-orange-500 px-4 py-3 flex items-center justify-center">
                  <Link
                    href="/patient/dashboard/profile"
                    className="flex items-center gap-2 hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span className="text-white font-medium text-sm">
                      Complete Profile Now - Get {100 - profileCompletion}% More Benefits
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="py-4">
        <Dashboardclient />
      </div>
      {showMissingDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
            <button
              onClick={() => setShowMissingDialog(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              title="Close"
              type="button"
            >
              <CircleX className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Fill the following things in Profile</h3>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
              {missingFields.map((field, idx) => (
                <li key={idx}>{field}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientDashboardOverview
