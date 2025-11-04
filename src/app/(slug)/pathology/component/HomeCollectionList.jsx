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
  X,
  ArrowLeft,
  Loader2,
  Home,
  Sparkles,
  TrendingUp,
  UserCheck,
  Truck,
  Package,
  HeartPulse,
  Syringe,
  BadgeCheck,
  Timer,
  Droplets,
} from "lucide-react";

const HomeCollectionList = ({ onClose, pathologyService, serviceName }) => {
  const router = useRouter();
  const [selectedTest, setSelectedTest] = useState(null);
  const [homeCollectionTests, setHomeCollectionTests] = useState([]);
  const [groupedTests, setGroupedTests] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grouped"); // 'grouped' or 'all'

  // Fetch home collection tests from API
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/pathology/home-collection");
        const result = await response.json();

        if (result.success) {
          setHomeCollectionTests(result.data || []);
          setGroupedTests(result.grouped || []);
          setStatistics(result.statistics);
        } else {
          setError("Failed to load home collection services");
        }
      } catch (err) {
        console.error("Error fetching home collection tests:", err);
        setError("Failed to load home collection services");
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const colorClasses = {
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-600",
      hover: "hover:bg-emerald-100",
      gradient: "from-emerald-50 to-emerald-100",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-600",
      hover: "hover:bg-green-100",
      gradient: "from-green-50 to-green-100",
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

  const getTestColor = (index) => {
    const colors = ["emerald", "green", "teal", "cyan", "lime"];
    return colors[index % colors.length];
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-t-xl shadow-lg p-6 sticky top-0 z-10">
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
                    <Home className="w-8 h-8" />
                    Home Collection Services
                  </h2>
                  <p className="text-white/90 mt-1">
                    Safe and convenient sample collection at your doorstep
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
                    ? "bg-white text-emerald-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                By Test Type
              </button>
              <button
                onClick={() => setViewMode("all")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "all"
                    ? "bg-white text-emerald-600"
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
                <Card className="border-2 border-emerald-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Home className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalTests}</h4>
                    <p className="text-xs text-gray-600">Home Collection Tests</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-green-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalBookings}</h4>
                    <p className="text-xs text-gray-600">Collections Done</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-teal-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <BadgeCheck className="w-6 h-6 text-teal-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.freeHomeCollection}</h4>
                    <p className="text-xs text-gray-600">Free Collection</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-cyan-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-6 h-6 text-cyan-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.averageRating || 0}★</h4>
                    <p className="text-xs text-gray-600">Service Rating</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Home Collection Benefits Banner */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  icon: <Home className="w-6 h-6 text-emerald-600" />,
                  title: "Doorstep Service",
                  desc: "Sample collection at home",
                },
                {
                  icon: <UserCheck className="w-6 h-6 text-green-600" />,
                  title: "Trained Staff",
                  desc: "Professional phlebotomists",
                },
                {
                  icon: <Shield className="w-6 h-6 text-teal-600" />,
                  title: "Safe & Hygienic",
                  desc: "Sterile equipment used",
                },
                {
                  icon: <Timer className="w-6 h-6 text-cyan-600" />,
                  title: "Quick Results",
                  desc: "Fast report delivery",
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
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
                <p className="text-gray-600 text-lg">Loading home collection services...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <X className="w-12 h-12 text-red-600 mb-4" />
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && homeCollectionTests.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <Home className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No home collection services available at the moment</p>
              </div>
            )}

            {/* Grouped Tests View */}
            {!loading && !error && viewMode === "grouped" && groupedTests.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Available Home Collection Tests ({groupedTests.length})
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
                              <Home className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {test.testName}
                              </h3>
                              <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                                <Syringe className="w-3 h-3 mr-1" />
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
                                <span>{test.totalBookings} Done</span>
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
                            {test.freeHomeCollection > 0 && (
                              <div className="flex items-center gap-2">
                                <CheckCircle className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
                                <span className="text-sm text-gray-700">Free Home Collection ({test.freeHomeCollection})</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <CheckCircle className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
                              <span className="text-sm text-gray-700">Trained Phlebotomist</span>
                            </div>
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
                              Book
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
            {!loading && !error && viewMode === "all" && homeCollectionTests.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  All Home Collection Providers ({homeCollectionTests.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {homeCollectionTests.map((test, index) => {
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
                                <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                                  <Home className="w-3 h-3 mr-1" />
                                  Home Collection
                                </Badge>
                                {test.homeCollectionCharge === "Free" && (
                                  <Badge className="bg-green-100 text-green-700 text-xs">
                                    Free
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

                          {/* Collection Features */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2">
                              <UserCheck className={`w-4 h-4 ${colors.text}`} />
                              <span className="text-sm text-gray-700">Trained Phlebotomist</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Shield className={`w-4 h-4 ${colors.text}`} />
                              <span className="text-sm text-gray-700">Sterile Equipment</span>
                            </div>
                          </div>

                          {/* Experience Badge */}
                          {test.hospital.experience && (
                            <div className="flex items-center gap-2 mb-4 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                              <Award className="w-4 h-4 text-emerald-600" />
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
                              {test.homeCollectionCharge && test.homeCollectionCharge !== "Free" && (
                                <p className="text-xs text-gray-500">+₹{test.homeCollectionCharge} collection</p>
                              )}
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

            {/* Why Choose Home Collection */}
            {!loading && !error && (
              <div className="mt-8">
                <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-emerald-600" />
                      Why Choose Home Collection Services?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          icon: <Home className="w-5 h-5 text-emerald-600" />,
                          title: "Convenience",
                          desc: "Sample collection at your doorstep",
                        },
                        {
                          icon: <UserCheck className="w-5 h-5 text-green-600" />,
                          title: "Professional Staff",
                          desc: "Trained and certified phlebotomists",
                        },
                        {
                          icon: <Shield className="w-5 h-5 text-teal-600" />,
                          title: "Safety First",
                          desc: "Sterile equipment and hygiene protocols",
                        },
                        {
                          icon: <Timer className="w-5 h-5 text-cyan-600" />,
                          title: "Time Saving",
                          desc: "No waiting, scheduled at your time",
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
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Shield className="w-5 h-5 text-emerald-600" />
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
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-teal-600" />
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

export default HomeCollectionList;

