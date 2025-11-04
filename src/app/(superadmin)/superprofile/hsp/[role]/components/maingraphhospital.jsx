"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Hospital,
  Users,
  MapPin,
  Award,
  Stethoscope,
  Building2,
  TrendingUp,
  Activity,
  Shield,
  Bed,
  Ambulance,
  Heart,
} from "lucide-react";
import { applyHospitalFilters, processFilteredData } from "../lib/filters";

import HeadingClientMain from "@/app/components/heading";
import HospitalFilters from "./hospitalfilter";

// Vibrant color palette
const COLORS = [
  "#3498db",
  "#e74c3c",
  "#2ecc71",
  "#f39c12",
  "#9b59b6",
  "#1abc9c",
  "#e67e22",
  "#34495e",
  "#f1c40f",
  "#e91e63",
  "#00bcd4",
  "#ff5722",
];

export default function ComprehensiveHospitalDashboard({
  data,
  states,
  districts,
  talukas,
  specialities,
  bedCategories,
}) {
  const [filters, setFilters] = useState({
    email: "",
    mobile: "",
    pincode: "",
    role: "all",
    createdAtFrom: "",
    createdAtTo: "",
    updatedAtFrom: "",
    updatedAtTo: "",
    regname: "",
    onlineconsultation: "all",
    homehealthcare: "all",
    pharmacy: "all",
    pathology: "all",
    diagnosticservices: "all",
    cashlessservices: "all",
    governmentschemes: "all",
    inhousecanteen: "all",
    nabhnablapproved: "all",
    isoapproved: "all",
    city: "",
    state: "all",
    dist: "all",
    taluka: "all",
    speciality: "all",
    doctorFirstName: "",
    doctorLastName: "",
    ambulanceCategory: "",
    bankName: "",
    bedCategory: "all",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Apply filters to the data
  const filteredData = useMemo(() => {
    if (!data?.hospitals) return data;

    const filteredHospitals = applyHospitalFilters(data.hospitals, filters);
    return processFilteredData(filteredHospitals, data);
  }, [data, filters]);

  if (!filteredData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-black">Loading hospital analytics...</p>
        </div>
      </div>
    );
  }

  const {
    totalHospitals,
    totalPatients,
    totalDoctors,
    totalAmbulances,
    hospitals,
    stateChartData,
    cityChartData,
    serviceAdoptionData,
    bedStatusData,
    bedCategoryChartData,
    totalBeds,
    specialtyData,
    ambulanceTypeData,
    ambulanceCategoryData,
    registrationTrends,
    hospitalRoleData,
    certificationData,
  } = filteredData;

  // Calculate additional metrics
  const avgBedsPerHospital =
    totalHospitals > 0 ? Math.round(totalBeds / totalHospitals) : 0;
  const avgDoctorsPerHospital =
    totalHospitals > 0 ? Math.round(totalDoctors / totalHospitals) : 0;
  const qualityScore =
    totalHospitals > 0
      ? (
          ((certificationData.nabhnablApproved +
            certificationData.isoApproved) /
            (totalHospitals * 2)) *
          100
        ).toFixed(1)
      : 0;

  // Process bed occupancy
  const occupiedBeds =
    bedStatusData?.find((b) => b.status === "OCCUPIED")?.count || 0;
  const capacityUtilization =
    totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0;

  // Process service coverage
  const avgServiceAdoption =
    serviceAdoptionData?.length > 0
      ? (
          serviceAdoptionData.reduce(
            (sum, s) => sum + Number.parseFloat(s.adoption),
            0
          ) / serviceAdoptionData.length
        ).toFixed(1)
      : 0;

  // Create certification chart data
  const certificationChartData = [
    {
      status: "NABH/NABL Certified",
      count: certificationData.nabhnablApproved,
      color: COLORS[2],
    },
    {
      status: "ISO Certified",
      count: certificationData.isoApproved,
      color: COLORS[0],
    },
    {
      status: "Both Certified",
      count:
        hospitals?.filter(
          (h) =>
            (h.hspdetails?.nabhnablapproved === "true" ||
              h.hspdetails?.nabhnablapproved === true) &&
            (h.hspdetails?.isoapproved === "true" ||
              h.hspdetails?.isoapproved === true)
        ).length || 0,
      color: COLORS[4],
    },
    {
      status: "Not Certified",
      count:
        hospitals?.filter(
          (h) =>
            h.hspdetails?.nabhnablapproved !== "true" &&
            h.hspdetails?.nabhnablapproved !== true &&
            h.hspdetails?.isoapproved !== "true" &&
            h.hspdetails?.isoapproved !== true
        ).length || 0,
      color: COLORS[1],
    },
  ].filter((item) => item.count > 0);

  return (
    <div className="min-h-screen md:p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <HeadingClientMain main={"Hospital Analytics"} />
        {/* Filters */}
        <HospitalFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          states={states}
          districts={districts}
          talukas={talukas}
          specialities={specialities}
          bedCategories={bedCategories}
        />

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 min-[1000px]:grid-cols-2 min-[1100px]:grid-cols-4 gap-6 xs:p-4 md:p-0">
          <Card className="bg-gradient-to-r from-blue-100 to-blue-200 border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">
                Filtered Hospitals
              </CardTitle>
              <Hospital className="h-6 w-6 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">
                {totalHospitals}
              </div>
              <p className="text-xs text-black opacity-70">
                {data?.hospitals?.length
                  ? `of ${data.hospitals.length} total`
                  : "Registered facilities"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-100 to-green-200 border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">
                Total Beds
              </CardTitle>
              <Bed className="h-6 w-6 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">
                {data.totalBeds?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-black opacity-70">
                Avg: {avgBedsPerHospital} per hospital
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-100 to-purple-200 border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">
                Total Doctors
              </CardTitle>
              <Stethoscope className="h-6 w-6 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">
                {totalDoctors}
              </div>
              <p className="text-xs text-black opacity-70">
                Avg: {avgDoctorsPerHospital} per hospital
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-100 to-orange-200 border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">
                Total Ambulances
              </CardTitle>
              <Ambulance className="h-6 w-6 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">
                {totalAmbulances}
              </div>
              <p className="text-xs text-black opacity-70">
                Emergency vehicles
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full xs:grid-cols-3 xs:gap-4 md:grid-cols-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="geographic"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Geographic
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              Services
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Resources
            </TabsTrigger>
            <TabsTrigger
              value="quality"
              className="data-[state=active]:bg-pink-500 data-[state=active]:text-white"
            >
              Quality
            </TabsTrigger>
            <TabsTrigger
              value="trends"
              className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
            >
              Trends
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 justify-center gap-6">
              <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Hospital Types Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={hospitalRoleData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="count"
                          nameKey="role"
                          label={({ role, percentage }) =>
                            `${role}: ${percentage}%`
                          }
                        >
                          {hospitalRoleData?.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "2px solid #f39c12",
                            borderRadius: "12px",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Bed className="h-5 w-5 text-green-600" />
                    Bed Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={bedStatusData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1c40f"
                          strokeOpacity={0.3}
                        />
                        <XAxis
                          dataKey="status"
                          tick={{ fill: "black", fontWeight: "bold" }}
                          axisLine={{ stroke: "#9b59b6", strokeWidth: 2 }}
                        />
                        <YAxis
                          tick={{ fill: "black", fontWeight: "bold" }}
                          axisLine={{ stroke: "#9b59b6", strokeWidth: 2 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "2px solid #f39c12",
                            borderRadius: "12px",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {bedStatusData?.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Geographic Tab */}
          <TabsContent value="geographic" className="space-y-6">
            <div className="grid grid-cols-1 justify-center gap-6">
              <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <MapPin className="h-5 w-5 text-red-600" />
                    Geographic Distribution by State
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stateChartData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1c40f"
                          strokeOpacity={0.3}
                        />
                        <XAxis
                          dataKey="state"
                          tick={{ fill: "black", fontWeight: "bold" }}
                          axisLine={{ stroke: "#9b59b6", strokeWidth: 2 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis
                          tick={{ fill: "black", fontWeight: "bold" }}
                          axisLine={{ stroke: "#9b59b6", strokeWidth: 2 }}
                          label={{
                            value: "Number of Hospitals",
                            angle: -90,
                            position: "insideLeft",
                            style: {
                              textAnchor: "middle",
                              fill: "black",
                              fontWeight: "bold",
                            },
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "2px solid #f39c12",
                            borderRadius: "12px",
                            color: "black",
                            fontWeight: "bold",
                          }}
                          formatter={(value, name) => [
                            `${value} hospitals`,
                            "Count",
                          ]}
                        />
                        <Bar
                          dataKey="count"
                          fill={COLORS[0]}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Building2 className="h-5 w-5 text-emerald-600" />
                    Top Cities by Hospital Count
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={cityChartData}
                        layout="horizontal"
                        margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1c40f"
                          strokeOpacity={0.3}
                        />
                        <XAxis
                          type="number"
                          tick={{ fill: "black", fontWeight: "bold" }}
                        />
                        <YAxis
                          dataKey="city"
                          type="category"
                          width={90}
                          fontSize={11}
                          tick={{ fill: "black", fontWeight: "bold" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "2px solid #f39c12",
                            borderRadius: "12px",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                          {cityChartData?.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Service Adoption Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={serviceAdoptionData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f1c40f"
                        strokeOpacity={0.3}
                      />
                      <XAxis
                        dataKey="service"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        tick={{
                          fill: "black",
                          fontWeight: "bold",
                          fontSize: 10,
                        }}
                        axisLine={{ stroke: "#9b59b6", strokeWidth: 2 }}
                      />
                      <YAxis
                        yAxisId="left"
                        tick={{ fill: "black", fontWeight: "bold" }}
                        axisLine={{ stroke: "#9b59b6", strokeWidth: 2 }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fill: "black", fontWeight: "bold" }}
                        axisLine={{ stroke: "#9b59b6", strokeWidth: 2 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "2px solid #f39c12",
                          borderRadius: "12px",
                          color: "black",
                          fontWeight: "bold",
                        }}
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="adoption"
                        fill={COLORS[2]}
                        radius={[4, 4, 0, 0]}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="hospitals"
                        stroke={COLORS[1]}
                        strokeWidth={3}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 justify-center gap-6">
              <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Stethoscope className="h-5 w-5 text-blue-600" />
                    Doctor Specialties Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={specialtyData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1c40f"
                          strokeOpacity={0.3}
                        />
                        <XAxis
                          dataKey="specialty"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          tick={{
                            fill: "black",
                            fontWeight: "bold",
                            fontSize: 10,
                          }}
                          axisLine={{ stroke: "#9b59b6", strokeWidth: 2 }}
                        />
                        <YAxis
                          tick={{ fill: "black", fontWeight: "bold" }}
                          axisLine={{ stroke: "#9b59b6", strokeWidth: 2 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "2px solid #f39c12",
                            borderRadius: "12px",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke={COLORS[4]}
                          fill={COLORS[4]}
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Ambulance className="h-5 w-5 text-red-600" />
                    Ambulance Services Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={ambulanceTypeData}>
                        <PolarGrid stroke={COLORS[5]} />
                        <PolarAngleAxis
                          dataKey="type"
                          tick={{
                            fill: "black",
                            fontWeight: "bold",
                            fontSize: 10,
                          }}
                        />
                        <PolarRadiusAxis
                          tick={{ fill: "black", fontWeight: "bold" }}
                        />
                        <Radar
                          name="Count"
                          dataKey="count"
                          stroke={COLORS[1]}
                          fill={COLORS[1]}
                          fillOpacity={0.4}
                          strokeWidth={2}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "2px solid #f39c12",
                            borderRadius: "12px",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Bed className="h-5 w-5 text-green-600" />
                    Bed Categories Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={bedCategoryChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="count"
                          nameKey="category"
                          label={({ category, count }) =>
                            `${category}: ${count}`
                          }
                        >
                          {bedCategoryChartData?.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "2px solid #f39c12",
                            borderRadius: "12px",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Users className="h-5 w-5 text-purple-600" />
                    Resource Utilization Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            resource: "Beds",
                            total: data.totalBeds,
                          },
                          {
                            resource: "Doctors",
                            total: totalDoctors,
                          },
                          {
                            resource: "Ambulances",
                            total: totalAmbulances,
                          },
                        ]}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1c40f"
                          strokeOpacity={0.3}
                        />
                        <XAxis
                          dataKey="resource"
                          tick={{ fill: "black", fontWeight: "bold" }}
                          axisLine={{ stroke: "#9b59b6", strokeWidth: 2 }}
                        />
                        <YAxis
                          tick={{ fill: "black", fontWeight: "bold" }}
                          axisLine={{ stroke: "#9b59b6", strokeWidth: 2 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "2px solid #f39c12",
                            borderRadius: "12px",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="total"
                          fill={COLORS[0]}
                          name="Total Available"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="utilized"
                          fill={COLORS[2]}
                          name="Currently Utilized"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Quality Tab */}
          <TabsContent value="quality" className="space-y-6">
            <div className="grid grid-cols-1 justify-center gap-6">
              <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Shield className="h-5 w-5 text-green-600" />
                    Quality Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={certificationChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          dataKey="count"
                          nameKey="status"
                          label={({ status, count }) => `${status}: ${count}`}
                        >
                          {certificationChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "2px solid #f39c12",
                            borderRadius: "12px",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Award className="h-5 w-5 text-blue-600" />
                    Quality Metrics Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            metric: "NABH/NABL",
                            certified: certificationData.nabhnablApproved,
                            notCertified:
                              totalHospitals -
                              certificationData.nabhnablApproved,
                          },
                          {
                            metric: "ISO",
                            certified: certificationData.isoApproved,
                            notCertified:
                              totalHospitals - certificationData.isoApproved,
                          },
                        ]}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1c40f"
                          strokeOpacity={0.3}
                        />
                        <XAxis
                          dataKey="metric"
                          tick={{ fill: "black", fontWeight: "bold" }}
                          axisLine={{ stroke: "#9b59b6", strokeWidth: 2 }}
                        />
                        <YAxis
                          tick={{ fill: "black", fontWeight: "bold" }}
                          axisLine={{ stroke: "#9b59b6", strokeWidth: 2 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "2px solid #f39c12",
                            borderRadius: "12px",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="certified"
                          stackId="a"
                          fill={COLORS[2]}
                          name="Certified"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="notCertified"
                          stackId="a"
                          fill={COLORS[1]}
                          name="Not Certified"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <TrendingUp className="h-5 w-5 text-cyan-600" />
                    Registration Trends Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={registrationTrends}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1c40f"
                          strokeOpacity={0.3}
                        />
                        <XAxis
                          dataKey="month"
                          tick={{ fill: "black", fontWeight: "bold" }}
                          axisLine={{ stroke: "#9b59b6", strokeWidth: 2 }}
                        />
                        <YAxis
                          tick={{ fill: "black", fontWeight: "bold" }}
                          axisLine={{ stroke: "#9b59b6", strokeWidth: 2 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "2px solid #f39c12",
                            borderRadius: "12px",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="hospitals"
                          stroke={COLORS[0]}
                          strokeWidth={3}
                          name="Hospitals"
                        />
                        <Line
                          type="monotone"
                          dataKey="doctors"
                          stroke={COLORS[2]}
                          strokeWidth={3}
                          name="Doctors"
                        />
                        <Line
                          type="monotone"
                          dataKey="patients"
                          stroke={COLORS[1]}
                          strokeWidth={3}
                          name="Patients"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-black">
                      <Activity className="h-5 w-5 text-green-600" />
                      Growth Rate Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={registrationTrends?.map((item, index) => ({
                            ...item,
                            growthRate:
                              index > 0
                                ? (
                                    ((item.hospitals -
                                      registrationTrends[index - 1].hospitals) /
                                      registrationTrends[index - 1].hospitals) *
                                    100
                                  ).toFixed(1)
                                : 0,
                          }))}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f1c40f"
                            strokeOpacity={0.3}
                          />
                          <XAxis
                            dataKey="month"
                            tick={{ fill: "black", fontWeight: "bold" }}
                            axisLine={{ stroke: "#9b59b6", strokeWidth: 2 }}
                          />
                          <YAxis
                            tick={{ fill: "black", fontWeight: "bold" }}
                            axisLine={{ stroke: "#9b59b6", strokeWidth: 2 }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "2px solid #f39c12",
                              borderRadius: "12px",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="growthRate"
                            stroke={COLORS[3]}
                            fill={COLORS[3]}
                            fillOpacity={0.6}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-black">
                      <Heart className="h-5 w-5 text-pink-600" />
                      Service Adoption Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={serviceAdoptionData}>
                          <PolarGrid stroke={COLORS[5]} />
                          <PolarAngleAxis
                            dataKey="service"
                            tick={{
                              fill: "black",
                              fontWeight: "bold",
                              fontSize: 8,
                            }}
                          />
                          <PolarRadiusAxis
                            tick={{ fill: "black", fontWeight: "bold" }}
                          />
                          <Radar
                            name="Adoption %"
                            dataKey="adoption"
                            stroke={COLORS[4]}
                            fill={COLORS[4]}
                            fillOpacity={0.4}
                            strokeWidth={2}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "2px solid #f39c12",
                              borderRadius: "12px",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-emerald-100 to-emerald-200 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Award className="h-5 w-5 text-emerald-600" />
                Quality Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">
                {qualityScore}%
              </div>
              <p className="text-sm text-black opacity-70">
                Average certification rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-violet-100 to-violet-200 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Users className="h-5 w-5 text-violet-600" />
                Capacity Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">
                {capacityUtilization}%
              </div>
              <p className="text-sm text-black opacity-70">
                Current bed occupancy
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-rose-100 to-rose-200 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Heart className="h-5 w-5 text-rose-600" />
                Service Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">
                {avgServiceAdoption}%
              </div>
              <p className="text-sm text-black opacity-70">
                Average service adoption
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
