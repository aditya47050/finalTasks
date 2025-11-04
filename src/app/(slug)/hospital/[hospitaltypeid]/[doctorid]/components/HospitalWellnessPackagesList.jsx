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
  Sparkles,
  TrendingUp,
  Building2,
  Heart,
  Home,
  Package,
  Calendar,
  IndianRupee,
  Activity,
  TestTube,
  Stethoscope,
} from "lucide-react";

const HospitalWellnessPackagesList = ({ onClose, hospitalService, serviceName }) => {
  const router = useRouter();
  const [packages, setPackages] = useState([]);
  const [groupedByHospital, setGroupedByHospital] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grouped"); // 'grouped' or 'all'

  // Fetch wellness packages from API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/hospital/wellness-packages");
        const result = await response.json();

        if (result.success) {
          setPackages(result.data || []);
          setGroupedByHospital(result.grouped || []);
          setStatistics(result.statistics);
        } else {
          setError("Failed to load wellness packages");
        }
      } catch (err) {
        console.error("Error fetching wellness packages:", err);
        setError("Failed to load wellness packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const colorClasses = {
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-600",
      hover: "hover:bg-green-100",
      gradient: "from-green-50 to-green-100",
    },
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-600",
      hover: "hover:bg-emerald-100",
      gradient: "from-emerald-50 to-emerald-100",
    },
    teal: {
      bg: "bg-teal-50",
      border: "border-teal-200",
      text: "text-teal-600",
      hover: "hover:bg-teal-100",
      gradient: "from-teal-50 to-teal-100",
    },
    cyan: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      text: "text-cyan-600",
      hover: "hover:bg-cyan-100",
      gradient: "from-cyan-50 to-cyan-100",
    },
    lime: {
      bg: "bg-lime-50",
      border: "border-lime-200",
      text: "text-lime-600",
      hover: "hover:bg-lime-100",
      gradient: "from-lime-50 to-lime-100",
    },
  };

  const getPackageColor = (index) => {
    const colors = ["green", "emerald", "teal", "cyan", "lime"];
    return colors[index % colors.length];
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-xl shadow-lg p-6 sticky top-0 z-10">
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
                    <Heart className="w-8 h-8" />
                    Wellness Packages & Health Checkups
                  </h2>
                  <p className="text-white/90 mt-1">
                    Comprehensive health checkup packages for preventive care
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
                    ? "bg-white text-green-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                By Hospital
              </button>
              <button
                onClick={() => setViewMode("all")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "all"
                    ? "bg-white text-green-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                All Packages
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-50 rounded-b-xl shadow-lg p-6">
            {/* Statistics Banner */}
            {statistics && !loading && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-2 border-green-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Package className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalPackages}</h4>
                    <p className="text-xs text-gray-600">Wellness Packages</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-emerald-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Building2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalHospitals}</h4>
                    <p className="text-xs text-gray-600">Hospitals</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-teal-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-6 h-6 text-teal-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalBookings}</h4>
                    <p className="text-xs text-gray-600">Checkups Done</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-cyan-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Home className="w-6 h-6 text-cyan-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.homeVisitPackages}</h4>
                    <p className="text-xs text-gray-600">Home Visit Available</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Wellness Benefits Banner */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  icon: <Activity className="w-6 h-6 text-green-600" />,
                  title: "Preventive Care",
                  desc: "Early detection of health issues",
                },
                {
                  icon: <TestTube className="w-6 h-6 text-emerald-600" />,
                  title: "Complete Tests",
                  desc: "Comprehensive health screening",
                },
                {
                  icon: <Home className="w-6 h-6 text-teal-600" />,
                  title: "Home Visit",
                  desc: "Sample collection at home",
                },
                {
                  icon: <Stethoscope className="w-6 h-6 text-cyan-600" />,
                  title: "Doctor Consultation",
                  desc: "Expert medical guidance",
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
                <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
                <p className="text-gray-600 text-lg">Loading wellness packages...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <X className="w-12 h-12 text-red-600 mb-4" />
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && packages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <Package className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-600 text-xl font-semibold mb-2">No Wellness Packages Available</p>
                <p className="text-gray-500 text-sm">Wellness packages will appear here once hospitals add them</p>
                <div className="mt-6 text-left bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
                  <p className="text-sm text-blue-900 mb-2 font-semibold">💡 What are Wellness Packages?</p>
                  <p className="text-xs text-blue-700">
                    Wellness packages are comprehensive health checkup bundles that include multiple tests 
                    at discounted rates for preventive healthcare.
                  </p>
                </div>
              </div>
            )}

            {/* Grouped By Hospital View */}
            {!loading && !error && viewMode === "grouped" && groupedByHospital.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Wellness Packages by Hospital ({groupedByHospital.length})
                </h3>
                <div className="space-y-6">
                  {groupedByHospital.map((hospitalGroup, index) => {
                    const color = getPackageColor(index);
                    const colors = colorClasses[color];
                    return (
                      <Card
                        key={hospitalGroup.hospital.id}
                        className={`border-2 ${colors.border} transition-all hover:shadow-xl`}
                      >
                        <CardContent className="p-6">
                          {/* Hospital Header */}
                          <div className="flex items-start gap-4 mb-6 pb-4 border-b">
                            {hospitalGroup.hospital.logo && (
                              <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                <Image
                                  src={hospitalGroup.hospital.logo}
                                  width={64}
                                  height={64}
                                  alt={hospitalGroup.hospital.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {hospitalGroup.hospital.name}
                              </h3>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge className={`${colors.bg} ${colors.text} text-xs`}>
                                  <Package className="w-3 h-3 mr-1" />
                                  {hospitalGroup.totalPackages} Package{hospitalGroup.totalPackages > 1 ? "s" : ""}
                                </Badge>
                                {hospitalGroup.hospital.nabl && (
                                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                                    <Shield className="w-3 h-3 mr-1" />
                                    NABL
                                  </Badge>
                                )}
                                <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  {hospitalGroup.hospital.avgRating}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{hospitalGroup.hospital.city}, {hospitalGroup.hospital.state}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Award className="w-4 h-4" />
                                  <span>{hospitalGroup.hospital.experience}+ years</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Packages Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {hospitalGroup.packages.map((pkg) => (
                              <div
                                key={pkg.id}
                                className={`${colors.bg} p-4 rounded-lg border ${colors.border} hover:shadow-md transition-all`}
                              >
                                <div className="mb-3">
                                  <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                                    {pkg.packageName}
                                  </h4>
                                  {pkg.discount && parseInt(pkg.discount) > 0 && (
                                    <Badge className="bg-red-500 text-white text-xs">
                                      {pkg.discount}% OFF
                                    </Badge>
                                  )}
                                </div>

                                {pkg.includesTest && (
                                  <div className="mb-3">
                                    <p className="text-xs text-gray-600 mb-1 font-semibold">Includes:</p>
                                    <p className="text-xs text-gray-700 line-clamp-3">{pkg.includesTest}</p>
                                  </div>
                                )}

                                <div className="space-y-1 mb-3">
                                  {pkg.homeVisit && (
                                    <div className="flex items-center gap-1">
                                      <CheckCircle className={`w-3 h-3 ${colors.text}`} />
                                      <span className="text-xs text-gray-700">Home Visit Available</span>
                                    </div>
                                  )}
                                  {pkg.totalBookings > 0 && (
                                    <div className="flex items-center gap-1">
                                      <TrendingUp className={`w-3 h-3 ${colors.text}`} />
                                      <span className="text-xs text-gray-700">{pkg.totalBookings} bookings</span>
                                    </div>
                                  )}
                                </div>

                                <div className="bg-white rounded-lg p-2">
                                  {pkg.discount && parseInt(pkg.discount) > 0 && (
                                    <p className="text-xs text-gray-400 line-through">₹{pkg.originalPrice}</p>
                                  )}
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-xs text-gray-600">Price</p>
                                      <p className={`text-lg font-bold ${colors.text}`}>₹{pkg.finalPrice}</p>
                                    </div>
                                    <button className={`px-3 py-1.5 ${colors.bg} ${colors.text} rounded-lg font-semibold text-xs ${colors.hover} transition-all border ${colors.border}`}>
                                      Book Now
                                    </button>
                                  </div>
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

            {/* All Packages View */}
            {!loading && !error && viewMode === "all" && packages.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  All Wellness Packages ({packages.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map((pkg, index) => {
                    const color = getPackageColor(index);
                    const colors = colorClasses[color];
                    return (
                      <Card
                        key={pkg.id}
                        className={`border-2 ${colors.border} hover:shadow-xl transition-all cursor-pointer`}
                        onClick={() => router.push(`/pathology/wellness-packages`)}
                      >
                        <CardContent className="p-5">
                          {/* Hospital Info */}
                          <div className="flex items-start gap-3 mb-4 pb-3 border-b">
                            {pkg.hospital.logo ? (
                              <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                <Image
                                  src={pkg.hospital.logo}
                                  width={48}
                                  height={48}
                                  alt={pkg.hospital.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className={`w-12 h-12 rounded-lg ${colors.bg} border-2 ${colors.border} flex items-center justify-center flex-shrink-0`}>
                                <Building2 className={`w-6 h-6 ${colors.text}`} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-600 mb-1">Provider</p>
                              <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                                {pkg.hospital.name}
                              </h4>
                            </div>
                          </div>

                          {/* Package Details */}
                          <div className={`${colors.bg} p-3 rounded-lg mb-3`}>
                            <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
                              {pkg.packageName}
                            </h3>
                            {pkg.discount && parseInt(pkg.discount) > 0 && (
                              <Badge className="bg-red-500 text-white text-xs mt-1">
                                {pkg.discount}% OFF
                              </Badge>
                            )}
                          </div>

                          {/* Includes */}
                          {pkg.includesTest && (
                            <div className="mb-3">
                              <p className="text-xs text-gray-600 mb-1 font-semibold">Tests Included:</p>
                              <p className="text-xs text-gray-700 line-clamp-3">{pkg.includesTest}</p>
                            </div>
                          )}

                          {/* Location */}
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{pkg.hospital.city}, {pkg.hospital.state}</span>
                          </div>

                          {/* Features */}
                          <div className="space-y-2 mb-4">
                            {pkg.homeVisit && (
                              <div className="flex items-center gap-2">
                                <Home className={`w-4 h-4 ${colors.text}`} />
                                <span className="text-sm text-gray-700">Home Visit Available</span>
                              </div>
                            )}
                            {pkg.hospital.nabl && (
                              <div className="flex items-center gap-2">
                                <Shield className={`w-4 h-4 ${colors.text}`} />
                                <span className="text-sm text-gray-700">NABL Accredited Lab</span>
                              </div>
                            )}
                          </div>

                          {/* Pricing & Actions */}
                          <div className="bg-white rounded-lg p-3">
                            {pkg.discount && parseInt(pkg.discount) > 0 && (
                              <p className="text-sm text-gray-400 line-through mb-1">₹{pkg.originalPrice}</p>
                            )}
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-500">Package Price</p>
                                <p className={`text-xl font-bold ${colors.text}`}>
                                  ₹{pkg.finalPrice}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`tel:${pkg.hospital.mobile}`, '_self');
                                  }}
                                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                                >
                                  <Phone className="w-4 h-4" />
                                </button>
                                <button className={`px-3 py-2 ${colors.bg} ${colors.text} rounded-lg font-semibold text-xs ${colors.hover} transition-all`}>
                                  Book
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Why Choose Wellness Packages */}
            {!loading && !error && (
              <div className="mt-8">
                <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-green-600" />
                      Benefits of Wellness Packages
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          icon: <Activity className="w-5 h-5 text-green-600" />,
                          title: "Early Detection",
                          desc: "Identify health issues before they become serious",
                        },
                        {
                          icon: <TestTube className="w-5 h-5 text-emerald-600" />,
                          title: "Comprehensive Tests",
                          desc: "Complete health screening in one package",
                        },
                        {
                          icon: <IndianRupee className="w-5 h-5 text-teal-600" />,
                          title: "Cost Effective",
                          desc: "Save money with bundled packages",
                        },
                        {
                          icon: <Stethoscope className="w-5 h-5 text-cyan-600" />,
                          title: "Expert Consultation",
                          desc: "Doctor consultation included",
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
            {!loading && !error && hospitalService && (
              <div className="mt-6">
                <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Current Hospital Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hospital</p>
                          <p className="font-semibold text-gray-900">
                            {hospitalService?.hspInfo?.regname || "Hospital"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-semibold text-gray-900">
                            {hospitalService?.hspcontact?.city}, {hospitalService?.hspcontact?.state}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Contact</p>
                          <p className="font-semibold text-gray-900">
                            {hospitalService?.mobile || "Contact Hospital"}
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

export default HospitalWellnessPackagesList;

