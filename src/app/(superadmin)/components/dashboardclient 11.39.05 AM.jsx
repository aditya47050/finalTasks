import HeadingClientMain from "@/app/components/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Ambulance,
  Bed,
  Calendar,
  BadgeIcon as IdCard,
  User,
  ArrowRight,
  Plus,
  CalendarPlus,
  Stethoscope,
  Hospital,
  TestTube,
  Home,
  Activity,
  IndianRupee,
} from "lucide-react";
import { FaClinicMedical, FaHospitalAlt } from "react-icons/fa";
import { FaHouseMedicalCircleCheck, FaPeopleGroup } from "react-icons/fa6";
import { GiRadioactive, GiTestTubes } from "react-icons/gi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

export default function Dashboard({
  patientCount,
  bookfreeappointmentCount,
  bedbookingCount,
  emergencyambulanceCount,
  ambulancebookingCount,
  healthcarddataCount,
  doctordataCount,
  hospitaldataCount,
  clinicCount,
  homehealthcareCount,
  pathologyCount,
  diagnosticCenterCount,
}) {
  const metrics = [
    {
      href: "/superprofile/patient/overview",
      icon: <User className="w-6 h-6" />,
      title: "Patients",
      value: patientCount,
      change: "+40%",
      bgColor: "bg-blue-50",
      hoverBgColor: "hover:bg-blue-100",
      iconColor: "text-blue-500",
      textColor: "text-blue-500",
      borderColor: "hover:border-blue-200",
    },
    {
      href: "/superprofile/bookfreeappointment/overview",
      icon: <Calendar className="w-6 h-6" />,
      title: "Free Appointments",
      value: bookfreeappointmentCount,
      change: "+30%",
      bgColor: "bg-green-50",
      hoverBgColor: "hover:bg-green-100",
      iconColor: "text-green-500",
      textColor: "text-green-500",
      borderColor: "hover:border-green-200",
    },
    {
      href: "/superprofile/bedbooking/overview",
      icon: <Bed className="w-6 h-6" />,
      title: "Bed Bookings",
      value: bedbookingCount,
      change: "+25%",
      bgColor: "bg-purple-50",
      hoverBgColor: "hover:bg-purple-100",
      iconColor: "text-purple-500",
      textColor: "text-purple-500",
      borderColor: "hover:border-purple-200",
    },
    {
      href: "/superprofile/emergencyambulance/overview",
      icon: <Ambulance className="w-6 h-6" />,
      title: "Emergency",
      value: emergencyambulanceCount,
      change: "+15%",
      bgColor: "bg-red-50",
      hoverBgColor: "hover:bg-red-100",
      iconColor: "text-red-500",
      textColor: "text-red-500",
      borderColor: "hover:border-red-200",
    },
    {
      href: "/superprofile/bookambulance/overview",
      icon: <Ambulance className="w-6 h-6" />,
      title: "Ambulance Bookings",
      value: ambulancebookingCount,
      change: "+20%",
      bgColor: "bg-yellow-50",
      hoverBgColor: "hover:bg-yellow-100",
      iconColor: "text-yellow-500",
      textColor: "text-yellow-500",
      borderColor: "hover:border-yellow-200",
    },
    {
      href: "/superprofile/applyhealthcard/overview",
      icon: <IdCard className="w-6 h-6" />,
      title: "Health Cards",
      value: healthcarddataCount,
      change: "+10%",
      bgColor: "bg-teal-50",
      hoverBgColor: "hover:bg-teal-100",
      iconColor: "text-teal-500",
      textColor: "text-teal-500",
      borderColor: "hover:border-teal-200",
    },
    {
      href: "/superprofile/doctor/overview",
      icon: <Stethoscope className="w-6 h-6" />,
      title: "Doctors",
      value: doctordataCount,
      change: "+5%",
      bgColor: "bg-orange-50",
      hoverBgColor: "hover:bg-orange-100",
      iconColor: "text-orange-500",
      textColor: "text-orange-500",
      borderColor: "hover:border-orange-200",
    },
    {
      href: "/superprofile/hsp/Hospital/overview",
      icon: <FaHospitalAlt className="w-6 h-6" />,
      title: "Hospitals",
      value: hospitaldataCount,
      change: "+5%",
      bgColor: "bg-indigo-50",
      hoverBgColor: "hover:bg-indigo-100",
      iconColor: "text-indigo-500",
      textColor: "text-indigo-500",
      borderColor: "hover:border-indigo-200",
    },
    {
      href: "/superprofile/hsp/Clinic/overview",
      icon: <FaClinicMedical className="w-6 h-6" />,
      title: "Clinics",
      value: clinicCount,
      change: "+5%",
      bgColor: "bg-violet-50",
      hoverBgColor: "hover:bg-violet-100",
      iconColor: "text-violet-500",
      textColor: "text-violet-500",
      borderColor: "hover:border-violet-200",
    },
    {
      href: "/superprofile/hsp/Pathology/overview",
      icon: <GiTestTubes className="w-6 h-6" />,
      title: "Pathology",
      value: pathologyCount,
      change: "+5%",
      bgColor: "bg-pink-50",
      hoverBgColor: "hover:bg-pink-100",
      iconColor: "text-pink-500",
      textColor: "text-pink-500",
      borderColor: "hover:border-pink-200",
    },
    {
      href: "/superprofile/hsp/homehealthcare/overview",
      icon: <FaHouseMedicalCircleCheck className="w-6 h-6" />,
      title: "Home Healthcare",
      value: homehealthcareCount,
      change: "+5%",
      bgColor: "bg-emerald-50",
      hoverBgColor: "hover:bg-emerald-100",
      iconColor: "text-emerald-500",
      textColor: "text-emerald-500",
      borderColor: "hover:border-emerald-200",
    },
    {
      href: "/superprofile/hsp/DiagnosticCenter/overview",
      icon: <GiRadioactive className="w-6 h-6" />,
      title: "Diagnostic Centers",
      value: diagnosticCenterCount,
      change: "+5%",
      bgColor: "bg-fuchsia-50",
      hoverBgColor: "hover:bg-fuchsia-100",
      iconColor: "text-fuchsia-500",
      textColor: "text-fuchsia-500",
      borderColor: "hover:border-fuchsia-200",
    },
    {
      href: "/superprofile/#",
      icon: <GiRadioactive className="w-6 h-6" />,
      title: "Ambulances",
      value: diagnosticCenterCount,
      change: "+5%",
      bgColor: "bg-fuchsia-50",
      hoverBgColor: "hover:bg-fuchsia-100",
      iconColor: "text-fuchsia-500",
      textColor: "text-fuchsia-500",
      borderColor: "hover:border-fuchsia-200",
    },
   
    {
      href: "/superprofile/e-seva",
      icon: <FaPeopleGroup className="w-6 h-6" />,
      title: "E-seva",
      value: "100",
      change: "+5%",
      bgColor: "bg-fuchsia-50",
      hoverBgColor: "hover:bg-fuchsia-100",
      iconColor: "text-fuchsia-500",
      textColor: "text-fuchsia-500",
      borderColor: "hover:border-fuchsia-200",
    },
    {
      href: "/superprofile/e-seva",
      icon: <FaPeopleGroup className="w-6 h-6" />,
      title: "Asha Workers",
      value: "100",
      change: "+5%",
      bgColor: "bg-fuchsia-50",
      hoverBgColor: "hover:bg-fuchsia-100",
      iconColor: "text-fuchsia-500",
      textColor: "text-fuchsia-500",
      borderColor: "hover:border-fuchsia-200",
    },
    {
      href: "/superprofile/#",
      icon: <FaPeopleGroup className="w-6 h-6" />,
      title: "Pharmacy",
      value: "100",
      change: "+5%",
      bgColor: "bg-fuchsia-50",
      hoverBgColor: "hover:bg-fuchsia-100",
      iconColor: "text-fuchsia-500",
      textColor: "text-fuchsia-500",
      borderColor: "hover:border-fuchsia-200",
    },
    {
      href: "/superprofile/aarogyadhan",
      icon: <IndianRupee className="w-6 h-6" />,
      title: "Donations",
      value: "100",
      change: "+5%",
      bgColor: "bg-fuchsia-50",
      hoverBgColor: "hover:bg-fuchsia-100",
      iconColor: "text-fuchsia-500",
      textColor: "text-fuchsia-500",
      borderColor: "hover:border-fuchsia-200",
    },
  ];

  const chartData = [
    { name: "Patients", value: patientCount, color: "#3b82f6" },
    {
      name: "Free Appointments",
      value: bookfreeappointmentCount,
      color: "#22c55e",
    },
    { name: "Bed Bookings", value: bedbookingCount, color: "#a855f7" },
    { name: "Emergency", value: emergencyambulanceCount, color: "#ef4444" },
    { name: "Ambulance", value: ambulancebookingCount, color: "#f59e0b" },
    { name: "Health Cards", value: healthcarddataCount, color: "#14b8a6" },
    { name: "Doctors", value: doctordataCount, color: "#f97316" },
    { name: "Hospitals", value: hospitaldataCount, color: "#6366f1" },
    { name: "Clinics", value: clinicCount, color: "#8b5cf6" },
    { name: "Pathology", value: pathologyCount, color: "#ec4899" },
    { name: "Home Care", value: homehealthcareCount, color: "#10b981" },
    { name: "Diagnostic", value: diagnosticCenterCount, color: "#d946ef" },
  ];

  // const quickActions = [
  //   {
  //     icon: <Plus className="w-5 h-5" />,
  //     label: "Patients",
  //     bgColor: "hover:bg-blue-50",
  //     borderColor: "hover:border-blue-300",
  //     iconColor: "text-blue-500",
  //   },
  //   {
  //     icon: <CalendarPlus className="w-5 h-5" />,
  //     label: "Schedule",
  //     bgColor: "hover:bg-green-50",
  //     borderColor: "hover:border-green-300",
  //     iconColor: "text-green-500",
  //   },
  //   {
  //     icon: <Bed className="w-5 h-5" />,
  //     label: "Book Bed",
  //     bgColor: "hover:bg-purple-50",
  //     borderColor: "hover:border-purple-300",
  //     iconColor: "text-purple-500",
  //   },
  //   {
  //     icon: <Ambulance className="w-5 h-5" />,
  //     label: "Emergency",
  //     bgColor: "hover:bg-red-50",
  //     borderColor: "hover:border-red-300",
  //     iconColor: "text-red-500",
  //   },
  // ];

  return (
    <div className="w-full mx-auto md:container xs:px-4 ">
      <HeadingClientMain
        main={"            Healthcare Dashboard"}
        sub={"  Monitor and manage your healthcare services efficiently"}
      />

      {/* Main Metrics Grid */}
      <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 mb-8">
        {metrics.map((metric) => (
          <a
            key={metric.title}
            href={metric.href}
            className="group block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl"
          >
            <Card
              className={`transition-all duration-200 hover:shadow-md ${metric.borderColor} hover:-translate-y-1 cursor-pointer animate-fade-in border-gray-200 bg-white`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${metric.bgColor} ${metric.hoverBgColor}`}
                  >
                    <span className={metric.iconColor}>{metric.icon}</span>
                  </div>
                  <div className={`text-sm font-medium ${metric.textColor}`}>
                    {metric.change}
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-2xl md:text-2xl font-bold text-gray-900">
                    {metric.value.toLocaleString()}
                  </h3>
                  <p className="text-healthcare-slate text-sm mt-1">
                    {metric.title}
                  </p>
                </div>
                <div
                  className={`inline-flex items-center text-sm font-medium group-hover:underline ${metric.textColor}`}
                >
                  View All
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      {/* Chart Section */}
      <Card className="mb-8 animate-slide-up bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </CardTitle>
          <p className="text-healthcare-slate text-sm">
            Visual representation of all healthcare services
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64 md:h-80 lg:h-96 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
  dataKey="name"
  interval={0} // show all labels
  height={80} // extra space for multi-line text
  tick={({ x, y, payload }) => {
    const words = payload.value.split(" ");
    return (
      <text
        x={x}
        y={y + 10}
        textAnchor="middle"
        fill="#64748b"
        fontSize={12}
      >
        {words.map((word, index) => (
          <tspan
            key={index}
            x={x}
            dy={index === 0 ? 0 : 14} // stack each word 14px lower
          >
            {word}
          </tspan>
        ))}
      </text>
    );
  }}
/>

                <YAxis
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={{ stroke: "#e5e7eb" }}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "0.5rem",
                    color: "white",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Legend */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700 text-xs md:text-sm">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Section */}
      {/* <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`group flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 transition-all duration-200 ${action.borderColor} ${action.bgColor} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span
                    className={`transition-transform group-hover:scale-110 ${action.iconColor}`}
                  >
                    {action.icon}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card> */}
    </div>
  );
}
