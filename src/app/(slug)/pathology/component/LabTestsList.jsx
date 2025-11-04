"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  Phone,
  Shield,
  Star,
  Award,
  Users,
  Calendar,
  CheckCircle,
  IndianRupee,
  Activity,
  X,
  ArrowLeft,
  Loader2,
  Beaker,
  TestTube,
  Home,
  Sparkles,
  FlaskConical,
  Microscope,
  TrendingUp,
  FileCheck,
  Droplets,
  Timer,
} from "lucide-react";

const LabTestsList = ({ onClose, pathologyService, serviceName }) => {
  const router = useRouter();
  const [selectedTest, setSelectedTest] = useState(null);
  const [labTests, setLabTests] = useState([]);
  const [groupedTests, setGroupedTests] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grouped"); // 'grouped' or 'all'

  // Fetch lab tests from API
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/pathology/lab-tests");
        const result = await response.json();

        if (result.success) {
          setLabTests(result.data || []);
          setGroupedTests(result.grouped || []);
          setStatistics(result.statistics);
        } else {
          setError("Failed to load lab tests");
        }
      } catch (err) {
        console.error("Error fetching lab tests:", err);
        setError("Failed to load lab tests");
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
      hover: "hover:bg-blue-100",
      gradient: "from-blue-50 to-blue-100",
    },
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-600",
      hover: "hover:bg-indigo-100",
      gradient: "from-indigo-50 to-indigo-100",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-600",
      hover: "hover:bg-purple-100",
      gradient: "from-purple-50 to-purple-100",
    },
    cyan: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      text: "text-cyan-600",
      hover: "hover:bg-cyan-100",
      gradient: "from-cyan-50 to-cyan-100",
    },
    teal: {
      bg: "bg-teal-50",
      border: "border-teal-200",
      text: "text-teal-600",
      hover: "hover:bg-teal-100",
      gradient: "from-teal-50 to-teal-100",
    },
  };

  const getTestColor = (index) => {
    const colors = ["blue", "indigo", "purple", "cyan", "teal"];
    return colors[index % colors.length];
  };

  const getCategoryIcon = (category) => {
    if (!category) return <TestTube className="w-5 h-5" />;
    const cat = category.toLowerCase();
    
    if (cat.includes("blood") || cat.includes("haematology")) {
      return <Droplets className="w-5 h-5" />;
    }
    if (cat.includes("urine") || cat.includes("kidney")) {
      return <Beaker className="w-5 h-5" />;
    }
    if (cat.includes("diabetes") || cat.includes("sugar")) {
      return <Activity className="w-5 h-5" />;
    }
    if (cat.includes("thyroid") || cat.includes("hormone")) {
      return <FlaskConical className="w-5 h-5" />;
    }
    return <Microscope className="w-5 h-5" />;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl shadow-lg p-6 sticky top-0 z-10">
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
                    <TestTube className="w-8 h-8" />
                    Lab Tests & Diagnostics
                  </h2>
                  <p className="text-white/90 mt-1">
                    Comprehensive lab testing services with accurate results
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
                By Test Type
              </button>
              <button
                onClick={() => setViewMode("all")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "all"
                    ? "bg-white text-blue-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                All Providers
              </button>
            </div>
          </div>

          {/* Tests Content */}
          <div className="bg-gray-50 rounded-b-xl shadow-lg p-6">
            {/* Statistics Banner */}
            {statistics && !loading && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-2 border-blue-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TestTube className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalTests}</h4>
                    <p className="text-xs text-gray-600">Lab Tests Available</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-indigo-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalBookings}</h4>
                    <p className="text-xs text-gray-600">Tests Completed</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-purple-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.nablAccreditedTests}</h4>
                    <p className="text-xs text-gray-600">NABL Accredited</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-cyan-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-6 h-6 text-cyan-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.averageRating || 0}★</h4>
                    <p className="text-xs text-gray-600">Average Rating</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Lab Test Benefits Banner */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  icon: <Home className="w-6 h-6 text-blue-600" />,
                  title: "Home Collection",
                  desc: "Sample collection at home",
                },
                {
                  icon: <Shield className="w-6 h-6 text-indigo-600" />,
                  title: "NABL Certified",
                  desc: "Quality assured labs",
                },
                {
                  icon: <Timer className="w-6 h-6 text-purple-600" />,
                  title: "Quick Reports",
                  desc: "Fast turnaround time",
                },
                {
                  icon: <FileCheck className="w-6 h-6 text-cyan-600" />,
                  title: "Accurate Results",
                  desc: "Precise diagnostics",
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
                <p className="text-gray-600 text-lg">Loading lab tests...</p>
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
            {!loading && !error && labTests.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <TestTube className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No lab tests available at the moment</p>
              </div>
            )}

            {/* Grouped Tests View */}
            {!loading && !error && viewMode === "grouped" && groupedTests.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Available Lab Tests ({groupedTests.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedTests.map((test, index) => {
                    const color = getTestColor(index);
                    const colors = colorClasses[color];
                    const category = test.categories?.[0] || "General Test";
                    return (
                      <Card
                        key={index}
                        className={`border-2 ${colors.border} ${colors.hover} transition-all hover:shadow-xl cursor-pointer`}
                        onClick={() => router.push(`/pathology/category?test=${encodeURIComponent(test.testName)}`)}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3 mb-4">
                            <div className={`p-3 rounded-xl ${colors.bg} ${colors.text} flex-shrink-0`}>
                              {getCategoryIcon(category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {test.testName}
                              </h3>
                              <Badge className="bg-blue-100 text-blue-700 text-xs">
                                <Microscope className="w-3 h-3 mr-1" />
                                {category}
                              </Badge>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-4 mb-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              <span>{test.totalProviders} Lab{test.totalProviders > 1 ? "s" : ""}</span>
                            </div>
                            {test.totalBookings > 0 && (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>{test.totalBookings} Test{test.totalBookings > 1 ? "s" : ""}</span>
                              </div>
                            )}
                          </div>

                          {/* Locations */}
                          {test.availableIn && test.availableIn.length > 0 && (
                            <div className="flex items-center gap-1 mb-4 text-xs text-gray-600">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">
                                Available in {test.availableIn.slice(0, 2).join(", ")}
                                {test.availableIn.length > 2 && ` +${test.availableIn.length - 2} more`}
                              </span>
                            </div>
                          )}

                          {/* Features */}
                          <div className="space-y-2 mb-4">
                            {test.nablAccredited > 0 && (
                              <div className="flex items-center gap-2">
                                <CheckCircle className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
                                <span className="text-sm text-gray-700">NABL Accredited ({test.nablAccredited})</span>
                              </div>
                            )}
                            {test.homeCollectionAvailable > 0 && (
                              <div className="flex items-center gap-2">
                                <CheckCircle className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
                                <span className="text-sm text-gray-700">Home Collection Available</span>
                              </div>
                            )}
                          </div>

                          {/* Pricing & Action */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Starting from</p>
                              <p className={`text-2xl font-bold ${colors.text}`}>
                                ₹{test.minPrice}
                              </p>
                            </div>
                            <button className={`px-4 py-2 ${colors.bg} ${colors.text} rounded-lg font-semibold text-sm ${colors.hover} transition-all flex items-center gap-2`}>
                              <Calendar className="w-4 h-4" />
                              Book Test
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Providers View */}
            {!loading && !error && viewMode === "all" && labTests.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  All Diagnostic Centers ({labTests.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {labTests.map((test, index) => {
                    const color = getTestColor(index);
                    const colors = colorClasses[color];
                    return (
                      <Card
                        key={test.id}
                        className={`border-2 ${colors.border} hover:shadow-xl transition-all cursor-pointer`}
                        onClick={() => router.push(`/pathology/nabl/${test.id}`)}
                      >
                        <CardContent className="p-5">
                          {/* Hospital Logo & Name */}
                          <div className="flex items-start gap-3 mb-4">
                            {test.hospital.logo && (
                              <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                <Image
                                  src={test.hospital.logo}
                                  width={56}
                                  height={56}
                                  alt={test.hospital.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
                                {test.hospital.name}
                              </h3>
                              <div className="flex flex-wrap gap-1">
                                {test.nabl && (
                                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                                    <Shield className="w-3 h-3 mr-1" />
                                    NABL
                                  </Badge>
                                )}
                                {test.homeCollection && (
                                  <Badge className="bg-green-100 text-green-700 text-xs">
                                    <Home className="w-3 h-3 mr-1" />
                                    Home
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Test Name */}
                          <div className={`${colors.bg} ${colors.text} p-3 rounded-lg mb-3`}>
                            <p className="font-semibold text-sm">{test.testName}</p>
                            {test.testCategory && (
                              <p className="text-xs opacity-75 mt-1">{test.testCategory}</p>
                            )}
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{test.hospital.city}, {test.hospital.state}</span>
                          </div>

                          {/* Test Features */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2">
                              <Timer className={`w-4 h-4 ${colors.text}`} />
                              <span className="text-sm text-gray-700">Report in {test.reportTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Droplets className={`w-4 h-4 ${colors.text}`} />
                              <span className="text-sm text-gray-700">Sample: {test.sampleType}</span>
                            </div>
                          </div>

                          {/* Experience Badge */}
                          {test.hospital.experience && (
                            <div className="flex items-center gap-2 mb-4 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                              <Award className="w-4 h-4 text-blue-600" />
                              <span>{test.hospital.experience}+ years experience</span>
                            </div>
                          )}

                          {/* Pricing & Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Test Price</p>
                              <p className={`text-xl font-bold ${colors.text}`}>
                                ₹{test.finalPrice || test.price}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`tel:${test.hospital.mobile}`, '_self');
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
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Why Choose Lab Tests */}
            {!loading && !error && (
              <div className="mt-8">
                <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-blue-600" />
                      Why Choose Our Lab Testing Services?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          icon: <Shield className="w-5 h-5 text-blue-600" />,
                          title: "NABL Certified",
                          desc: "Quality assured diagnostic labs",
                        },
                        {
                          icon: <Home className="w-5 h-5 text-indigo-600" />,
                          title: "Home Collection",
                          desc: "Convenient sample collection at home",
                        },
                        {
                          icon: <Timer className="w-5 h-5 text-purple-600" />,
                          title: "Fast Reports",
                          desc: "Quick turnaround time for results",
                        },
                        {
                          icon: <FileCheck className="w-5 h-5 text-cyan-600" />,
                          title: "Accurate Results",
                          desc: "Precise and reliable diagnostics",
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
                            {pathologyService?.hospital?.hspInfo?.regname || "Diagnostic Center"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-semibold text-gray-900">
                            {pathologyService?.hospital?.hspcontact?.city}, {pathologyService?.hospital?.hspcontact?.state}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-purple-600" />
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

export default LabTestsList;

