"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Shield,
  Star,
  Award,
  Users,
  CheckCircle,
  X,
  ArrowLeft,
  Loader2,
  Video,
  Sparkles,
  TrendingUp,
  Building2,
  BadgeCheck,
  Mail,
  Smartphone,
  Download,
  FileText,
  Globe,
  Bell,
  Cloud,
  Monitor,
  Zap,
} from "lucide-react";

const OnlineReportsList = ({ onClose, pathologyService, serviceName }) => {
  const router = useRouter();
  const [hospitals, setHospitals] = useState([]);
  const [groupedByCity, setGroupedByCity] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grouped"); // 'grouped' or 'all'

  // Fetch online reports services from API
  useEffect(() => {
    const fetchOnlineReports = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/pathology/online-reports");
        const result = await response.json();

        if (result.success) {
          setHospitals(result.data || []);
          setGroupedByCity(result.grouped || []);
          setStatistics(result.statistics);
        } else {
          setError("Failed to load online reports services");
        }
      } catch (err) {
        console.error("Error fetching online reports:", err);
        setError("Failed to load online reports services");
      } finally {
        setLoading(false);
      }
    };

    fetchOnlineReports();
  }, []);

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
      hover: "hover:bg-blue-100",
      gradient: "from-blue-50 to-blue-100",
    },
    sky: {
      bg: "bg-sky-50",
      border: "border-sky-200",
      text: "text-sky-600",
      hover: "hover:bg-sky-100",
      gradient: "from-sky-50 to-sky-100",
    },
    cyan: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      text: "text-cyan-600",
      hover: "hover:bg-cyan-100",
      gradient: "from-cyan-50 to-cyan-100",
    },
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-600",
      hover: "hover:bg-indigo-100",
      gradient: "from-indigo-50 to-indigo-100",
    },
    violet: {
      bg: "bg-violet-50",
      border: "border-violet-200",
      text: "text-violet-600",
      hover: "hover:bg-violet-100",
      gradient: "from-violet-50 to-violet-100",
    },
  };

  const getReportColor = (index) => {
    const colors = ["blue", "sky", "cyan", "indigo", "violet"];
    return colors[index % colors.length];
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-xl shadow-lg p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Video className="w-8 h-8" />
                    Online Reports & Digital Services
                  </h2>
                  <p className="text-white/90 mt-1">
                    Access your lab reports anytime, anywhere with digital delivery
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setViewMode("grouped")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "grouped"
                    ? "bg-white text-blue-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                By Location
              </button>
              <button
                onClick={() => setViewMode("all")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "all"
                    ? "bg-white text-blue-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                All Labs
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-50 rounded-b-xl shadow-lg p-6">
            {/* Statistics Banner */}
            {statistics && !loading && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-2 border-blue-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Video className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalHospitals}</h4>
                    <p className="text-xs text-gray-600">Labs with Online Reports</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-sky-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-6 h-6 text-sky-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalTests}</h4>
                    <p className="text-xs text-gray-600">Available Tests</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-cyan-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MapPin className="w-6 h-6 text-cyan-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalCities}</h4>
                    <p className="text-xs text-gray-600">Cities Covered</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-indigo-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.averageRating || 0}★</h4>
                    <p className="text-xs text-gray-600">Average Rating</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Online Report Features Banner */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  icon: <Mail className="w-6 h-6 text-blue-600" />,
                  title: "Email Delivery",
                  desc: "Reports sent to your email",
                },
                {
                  icon: <Bell className="w-6 h-6 text-sky-600" />,
                  title: "SMS Alerts",
                  desc: "Instant notification when ready",
                },
                {
                  icon: <Download className="w-6 h-6 text-cyan-600" />,
                  title: "Download PDF",
                  desc: "Download and print anytime",
                },
                {
                  icon: <Cloud className="w-6 h-6 text-indigo-600" />,
                  title: "Cloud Storage",
                  desc: "Secure digital archive",
                },
              ].map((feature, idx) => (
                <Card key={idx} className="border-2 border-gray-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      {feature.icon}
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{feature.title}</h4>
                    <p className="text-xs text-gray-600">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600 text-lg">Loading online reports services...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <X className="w-12 h-12 text-red-600 mb-4" />
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && hospitals.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <Video className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No online reports services available at the moment</p>
              </div>
            )}

            {/* Grouped By City View */}
            {!loading && !error && viewMode === "grouped" && groupedByCity.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Online Reports Available by Location ({groupedByCity.length} Cities)
                </h3>
                <div className="space-y-6">
                  {groupedByCity.map((cityGroup, index) => {
                    const color = getReportColor(index);
                    const colors = colorClasses[color];
                    return (
                      <Card
                        key={index}
                        className={`border-2 ${colors.border} transition-all hover:shadow-xl`}
                      >
                        <CardContent className="p-6">
                          {/* City Header */}
                          <div className="flex items-start gap-4 mb-6 pb-4 border-b">
                            <div className={`p-4 rounded-xl ${colors.bg} ${colors.text} flex-shrink-0`}>
                              <MapPin className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {cityGroup.cityName}, {cityGroup.state}
                              </h3>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge className={`${colors.bg} ${colors.text} text-xs`}>
                                  <Building2 className="w-3 h-3 mr-1" />
                                  {cityGroup.totalProviders} Lab{cityGroup.totalProviders > 1 ? "s" : ""}
                                </Badge>
                                <Badge className="bg-green-100 text-green-700 text-xs">
                                  <BadgeCheck className="w-3 h-3 mr-1" />
                                  Online Reports Available
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Labs Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {cityGroup.hospitals.map((hospital) => (
                              <div
                                key={hospital.id}
                                className={`${colors.bg} p-4 rounded-lg border ${colors.border} hover:shadow-md transition-all cursor-pointer`}
                                onClick={() => router.push(`/pathology/hospital/${hospital.id}`)}
                              >
                                <div className="flex items-start gap-2 mb-3">
                                  {hospital.logo ? (
                                    <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                      <Image
                                        src={hospital.logo}
                                        width={48}
                                        height={48}
                                        alt={hospital.hospitalName}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className={`w-12 h-12 rounded-lg ${colors.bg} border-2 ${colors.border} flex items-center justify-center flex-shrink-0`}>
                                      <Building2 className={`w-6 h-6 ${colors.text}`} />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                                      {hospital.hospitalName}
                                    </h4>
                                    <div className="flex flex-wrap gap-1">
                                      {hospital.nabl && (
                                        <Badge className="bg-green-100 text-green-700 text-xs">
                                          <Shield className="w-2.5 h-2.5 mr-0.5" />
                                          NABL
                                        </Badge>
                                      )}
                                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                                        <Star className="w-2.5 h-2.5 mr-0.5" />
                                        {hospital.avgRating}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2 text-xs mb-3">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-3.5 h-3.5 text-gray-500" />
                                    <span className="text-gray-700">{hospital.totalTests} Tests Available</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5 text-gray-500" />
                                    <span className="text-gray-700">{hospital.mobile}</span>
                                  </div>
                                  {hospital.experience && (
                                    <div className="flex items-center gap-2">
                                      <Award className="w-3.5 h-3.5 text-gray-500" />
                                      <span className="text-gray-700">{hospital.experience}+ years exp</span>
                                    </div>
                                  )}
                                </div>

                                {/* Online Features */}
                                <div className="space-y-1">
                                  {[
                                    { icon: <Mail className="w-3 h-3" />, text: "Email Delivery" },
                                    { icon: <Bell className="w-3 h-3" />, text: "SMS Alerts" },
                                  ].map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-1">
                                      <CheckCircle className={`w-3 h-3 ${colors.text} flex-shrink-0`} />
                                      <span className="text-xs text-gray-700">{feature.text}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Labs View */}
            {!loading && !error && viewMode === "all" && hospitals.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  All Labs with Online Reports ({hospitals.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hospitals.map((hospital, index) => {
                    const color = getReportColor(index);
                    const colors = colorClasses[color];
                    return (
                      <Card
                        key={hospital.id}
                        className={`border-2 ${colors.border} hover:shadow-xl transition-all cursor-pointer`}
                        onClick={() => router.push(`/pathology/hospital/${hospital.id}`)}
                      >
                        <CardContent className="p-5">
                          {/* Hospital Header */}
                          <div className="flex items-start gap-3 mb-4">
                            {hospital.logo ? (
                              <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                <Image
                                  src={hospital.logo}
                                  width={56}
                                  height={56}
                                  alt={hospital.hospitalName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className={`w-14 h-14 rounded-lg ${colors.bg} border-2 ${colors.border} flex items-center justify-center flex-shrink-0`}>
                                <Building2 className={`w-7 h-7 ${colors.text}`} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
                                {hospital.hospitalName}
                              </h3>
                              <div className="flex flex-wrap gap-1">
                                <Badge className={`${colors.bg} ${colors.text} text-xs`}>
                                  <Video className="w-3 h-3 mr-1" />
                                  Online Reports
                                </Badge>
                                {hospital.nabl && (
                                  <Badge className="bg-green-100 text-green-700 text-xs">
                                    <Shield className="w-3 h-3 mr-1" />
                                    NABL
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Location & Contact */}
                          <div className="space-y-2 mb-4 text-sm">
                            <div className="flex items-start gap-2">
                              <MapPin className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                              <span className="text-gray-700 line-clamp-2">{hospital.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <Phone className={`w-3.5 h-3.5 ${colors.text}`} />
                              <span className="text-gray-700">{hospital.mobile}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <FileText className={`w-3.5 h-3.5 ${colors.text}`} />
                              <span className="text-gray-700">{hospital.totalTests} Tests Available</span>
                            </div>
                          </div>

                          {/* Online Features */}
                          <div className={`${colors.bg} p-3 rounded-lg mb-3`}>
                            <p className="text-xs text-gray-600 mb-2 font-semibold">Digital Features</p>
                            <div className="space-y-1">
                              {[
                                { icon: <Mail className="w-3 h-3" />, text: "Email Delivery" },
                                { icon: <Bell className="w-3 h-3" />, text: "SMS Alerts" },
                                { icon: <Download className="w-3 h-3" />, text: "PDF Download" },
                                { icon: <Cloud className="w-3 h-3" />, text: "Cloud Archive" },
                              ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                  <CheckCircle className={`w-3 h-3 ${colors.text} flex-shrink-0`} />
                                  <span className="text-xs text-gray-700">{feature.text}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Experience Badge */}
                          {hospital.experience && (
                            <div className="flex items-center gap-2 mb-4 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                              <Award className="w-4 h-4 text-blue-600" />
                              <span>{hospital.experience}+ years experience</span>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`tel:${hospital.mobile}`, '_self');
                              }}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                            >
                              <Phone className="w-4 h-4" />
                            </button>
                            <button className={`flex-1 px-3 py-2 ${colors.bg} ${colors.text} rounded-lg font-semibold text-xs ${colors.hover} transition-all`}>
                              View Details
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Why Choose Online Reports */}
            {!loading && !error && (
              <div className="mt-8">
                <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-blue-600" />
                      Benefits of Online Reports
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          icon: <Zap className="w-5 h-5 text-blue-600" />,
                          title: "Instant Access",
                          desc: "Get reports immediately when ready",
                        },
                        {
                          icon: <Mail className="w-5 h-5 text-sky-600" />,
                          title: "Email Delivery",
                          desc: "Reports delivered to your inbox",
                        },
                        {
                          icon: <Download className="w-5 h-5 text-cyan-600" />,
                          title: "Downloadable",
                          desc: "Save and share PDF reports easily",
                        },
                        {
                          icon: <Cloud className="w-5 h-5 text-indigo-600" />,
                          title: "Secure Storage",
                          desc: "Access your history anytime",
                        },
                      ].map((benefit, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 border-2 border-gray-200">
                            {benefit.icon}
                          </div>
                          <h4 className="font-bold text-gray-900 mb-1">{benefit.title}</h4>
                          <p className="text-sm text-gray-600">{benefit.desc}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Provider Info Section */}
            {!loading && !error && pathologyService && (
              <div className="mt-6">
                <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Current Service Provider Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Provider</p>
                          <p className="font-semibold text-gray-900">
                            {pathologyService?.hospital?.hspInfo?.regname || "Pathology Lab"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-sky-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-semibold text-gray-900">
                            {pathologyService?.hospital?.hspcontact?.city}, {pathologyService?.hospital?.hspcontact?.state}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Contact</p>
                          <p className="font-semibold text-gray-900">
                            {pathologyService?.hospital?.mobile || "Contact Provider"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineReportsList;

