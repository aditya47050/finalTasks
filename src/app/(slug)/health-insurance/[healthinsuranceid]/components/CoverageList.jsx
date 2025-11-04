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
  Ambulance,
  Baby,
  Activity,
  Home,
  FileCheck,
  CreditCard,
  UserCheck,
  AlertCircle,
  Stethoscope,
  Pill,
} from "lucide-react";

const CoverageList = ({ onClose, insuranceService, serviceName }) => {
  const router = useRouter();
  const [insurancePlans, setInsurancePlans] = useState([]);
  const [groupedByCategory, setGroupedByCategory] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grouped"); // 'grouped' or 'all'

  // Fetch insurance coverage from API
  useEffect(() => {
    const fetchCoverage = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/health-insurance/coverage");
        const result = await response.json();

        if (result.success) {
          setInsurancePlans(result.data || []);
          setGroupedByCategory(result.grouped || []);
          setStatistics(result.statistics);
        } else {
          setError("Failed to load insurance coverage");
        }
      } catch (err) {
        console.error("Error fetching coverage:", err);
        setError("Failed to load insurance coverage");
      } finally {
        setLoading(false);
      }
    };

    fetchCoverage();
  }, []);

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
      hover: "hover:bg-blue-100",
      gradient: "from-blue-50 to-blue-100",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-600",
      hover: "hover:bg-green-100",
      gradient: "from-green-50 to-green-100",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-600",
      hover: "hover:bg-purple-100",
      gradient: "from-purple-50 to-purple-100",
    },
  };

  const getCategoryColor = (category) => {
    if (category === 'government') return colorClasses.green;
    if (category === 'private') return colorClasses.blue;
    if (category === 'tpa') return colorClasses.purple;
    return colorClasses.blue;
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
                    <Shield className="w-8 h-8" />
                    Insurance Coverage Plans
                  </h2>
                  <p className="text-white/90 mt-1">
                    Comprehensive health insurance coverage for all your medical needs
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
                By Category
              </button>
              <button
                onClick={() => setViewMode("all")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "all"
                    ? "bg-white text-blue-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                All Plans
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
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalPlans}</h4>
                    <p className="text-xs text-gray-600">Insurance Plans</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-green-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Building2 className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.governmentPlans}</h4>
                    <p className="text-xs text-gray-600">Government Plans</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-purple-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.privatePlans}</h4>
                    <p className="text-xs text-gray-600">Private Plans</p>
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

            {/* Coverage Benefits Banner */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  icon: <Stethoscope className="w-6 h-6 text-blue-600" />,
                  title: "Hospitalization",
                  desc: statistics?.coverageTypes?.hospitalization ? `${statistics.coverageTypes.hospitalization} plans` : "Covered",
                },
                {
                  icon: <Heart className="w-6 h-6 text-green-600" />,
                  title: "Pre-existing",
                  desc: statistics?.coverageTypes?.preExisting ? `${statistics.coverageTypes.preExisting} plans` : "Available",
                },
                {
                  icon: <Baby className="w-6 h-6 text-purple-600" />,
                  title: "Maternity",
                  desc: statistics?.coverageTypes?.maternity ? `${statistics.coverageTypes.maternity} plans` : "Covered",
                },
                {
                  icon: <Activity className="w-6 h-6 text-indigo-600" />,
                  title: "Critical Illness",
                  desc: statistics?.coverageTypes?.critical ? `${statistics.coverageTypes.critical} plans` : "Included",
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
                <p className="text-gray-600 text-lg">Loading insurance coverage...</p>
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
            {!loading && !error && insurancePlans.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <Shield className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No insurance plans available at the moment</p>
              </div>
            )}

            {/* Grouped By Category View */}
            {!loading && !error && viewMode === "grouped" && groupedByCategory.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Insurance Plans by Category ({groupedByCategory.length})
                </h3>
                <div className="space-y-6">
                  {groupedByCategory.map((categoryGroup, index) => {
                    const colors = getCategoryColor(categoryGroup.category);
                    return (
                      <Card
                        key={index}
                        className={`border-2 ${colors.border} transition-all hover:shadow-xl`}
                      >
                        <CardContent className="p-6">
                          {/* Category Header */}
                          <div className="flex items-start gap-4 mb-6 pb-4 border-b">
                            <div className={`p-4 rounded-xl ${colors.bg} ${colors.text} flex-shrink-0`}>
                              <Shield className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {categoryGroup.categoryLabel}
                              </h3>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge className={`${colors.bg} ${colors.text} text-xs`}>
                                  <FileCheck className="w-3 h-3 mr-1" />
                                  {categoryGroup.totalPlans} Plan{categoryGroup.totalPlans > 1 ? "s" : ""}
                                </Badge>
                                <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  {categoryGroup.avgRating} Rating
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Plans Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categoryGroup.plans.map((plan) => (
                              <div
                                key={plan.id}
                                className={`${colors.bg} p-4 rounded-lg border ${colors.border} hover:shadow-md transition-all cursor-pointer`}
                                onClick={() => router.push(`/health-insurance/${plan.id}?category=${plan.category}`)}
                              >
                                <div className="flex items-start gap-2 mb-3">
                                  {plan.logo ? (
                                    <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                      <Image
                                        src={plan.logo}
                                        width={48}
                                        height={48}
                                        alt={plan.companyName}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className={`w-12 h-12 rounded-lg ${colors.bg} border-2 ${colors.border} flex items-center justify-center flex-shrink-0`}>
                                      <Shield className={`w-6 h-6 ${colors.text}`} />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                                      {plan.companyName}
                                    </h4>
                                    <Badge className="bg-blue-100 text-blue-700 text-xs">
                                      <Star className="w-2.5 h-2.5 mr-0.5" />
                                      {plan.avgRating}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Coverage Details */}
                                <div className="space-y-2 text-xs mb-3">
                                  {plan.coverage && (
                                    <div className="flex items-start gap-2">
                                      <Shield className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
                                      <span className="text-gray-700 line-clamp-2">{plan.coverage}</span>
                                    </div>
                                  )}
                                  {plan.coverAmount && (
                                    <div className="flex items-center gap-2">
                                      <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                                      <span className="text-gray-700">₹{plan.coverAmount} coverage</span>
                                    </div>
                                  )}
                                </div>

                                {/* Coverage Features */}
                                <div className="grid grid-cols-2 gap-1 mb-3">
                                  {plan.coverageFeatures.hospitalization && (
                                    <div className="flex items-center gap-1">
                                      <CheckCircle className={`w-3 h-3 ${colors.text}`} />
                                      <span className="text-xs text-gray-700">Hospital</span>
                                    </div>
                                  )}
                                  {plan.coverageFeatures.preExisting && (
                                    <div className="flex items-center gap-1">
                                      <CheckCircle className={`w-3 h-3 ${colors.text}`} />
                                      <span className="text-xs text-gray-700">Pre-existing</span>
                                    </div>
                                  )}
                                  {plan.coverageFeatures.maternity && (
                                    <div className="flex items-center gap-1">
                                      <CheckCircle className={`w-3 h-3 ${colors.text}`} />
                                      <span className="text-xs text-gray-700">Maternity</span>
                                    </div>
                                  )}
                                  {plan.coverageFeatures.ambulance && (
                                    <div className="flex items-center gap-1">
                                      <CheckCircle className={`w-3 h-3 ${colors.text}`} />
                                      <span className="text-xs text-gray-700">Ambulance</span>
                                    </div>
                                  )}
                                </div>

                                {/* Premium */}
                                {plan.startingAmount && (
                                  <div className="bg-white rounded-lg p-2 text-center">
                                    <p className="text-xs text-gray-600">Starting from</p>
                                    <p className={`text-lg font-bold ${colors.text}`}>₹{plan.startingAmount}</p>
                                  </div>
                                )}
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

            {/* All Plans View */}
            {!loading && !error && viewMode === "all" && insurancePlans.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  All Insurance Coverage Plans ({insurancePlans.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {insurancePlans.map((plan, index) => {
                    const colors = getCategoryColor(plan.category);
                    return (
                      <Card
                        key={plan.id}
                        className={`border-2 ${colors.border} hover:shadow-xl transition-all cursor-pointer`}
                        onClick={() => router.push(`/health-insurance/${plan.id}?category=${plan.category}`)}
                      >
                        <CardContent className="p-5">
                          {/* Insurance Header */}
                          <div className="flex items-start gap-3 mb-4">
                            {plan.logo ? (
                              <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                <Image
                                  src={plan.logo}
                                  width={56}
                                  height={56}
                                  alt={plan.companyName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className={`w-14 h-14 rounded-lg ${colors.bg} border-2 ${colors.border} flex items-center justify-center flex-shrink-0`}>
                                <Shield className={`w-7 h-7 ${colors.text}`} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
                                {plan.companyName}
                              </h3>
                              <div className="flex flex-wrap gap-1">
                                <Badge className={`${colors.bg} ${colors.text} text-xs`}>
                                  {plan.category === 'government' ? 'Government' : 
                                   plan.category === 'private' ? 'Private' : 
                                   plan.category === 'tpa' ? 'TPA' : 'Insurance'}
                                </Badge>
                                <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  {plan.avgRating}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Coverage Info */}
                          {plan.coverage && (
                            <div className={`${colors.bg} p-3 rounded-lg mb-3`}>
                              <p className="text-xs text-gray-700 line-clamp-3">{plan.coverage}</p>
                            </div>
                          )}

                          {/* Coverage Features */}
                          <div className="space-y-2 mb-4">
                            {plan.coverageFeatures.hospitalization && (
                              <div className="flex items-center gap-2">
                                <Stethoscope className={`w-4 h-4 ${colors.text}`} />
                                <span className="text-sm text-gray-700">Hospitalization</span>
                              </div>
                            )}
                            {plan.coverageFeatures.cashless && (
                              <div className="flex items-center gap-2">
                                <CreditCard className={`w-4 h-4 ${colors.text}`} />
                                <span className="text-sm text-gray-700">Cashless Network</span>
                              </div>
                            )}
                            {plan.coverageFeatures.familyFloater && (
                              <div className="flex items-center gap-2">
                                <Users className={`w-4 h-4 ${colors.text}`} />
                                <span className="text-sm text-gray-700">Family Floater</span>
                              </div>
                            )}
                          </div>

                          {/* Pricing */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Starting from</p>
                              <p className={`text-xl font-bold ${colors.text}`}>
                                ₹{plan.startingAmount}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`tel:${plan.contactNumber || '108'}`, '_self');
                                }}
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                              >
                                <Phone className="w-4 h-4" />
                              </button>
                              <button className={`px-3 py-2 ${colors.bg} ${colors.text} rounded-lg font-semibold text-xs ${colors.hover} transition-all`}>
                                Quote
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

            {/* Why Choose Health Insurance Coverage */}
            {!loading && !error && (
              <div className="mt-8">
                <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-blue-600" />
                      Why Choose Our Insurance Coverage?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          icon: <Shield className="w-5 h-5 text-blue-600" />,
                          title: "Comprehensive Coverage",
                          desc: "All medical expenses covered",
                        },
                        {
                          icon: <CreditCard className="w-5 h-5 text-green-600" />,
                          title: "Cashless Facility",
                          desc: "Network hospitals for cashless treatment",
                        },
                        {
                          icon: <Users className="w-5 h-5 text-purple-600" />,
                          title: "Family Protection",
                          desc: "Cover your entire family",
                        },
                        {
                          icon: <Award className="w-5 h-5 text-indigo-600" />,
                          title: "No Claim Bonus",
                          desc: "Rewards for staying healthy",
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
            {!loading && !error && insuranceService && (
              <div className="mt-6">
                <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Current Insurance Provider Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Provider</p>
                          <p className="font-semibold text-gray-900">
                            {insuranceService?.companyName || "Insurance Company"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-lg">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Award className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Category</p>
                          <p className="font-semibold text-gray-900">
                            {insuranceService?.category === 'government' ? 'Government' : 
                             insuranceService?.category === 'private' ? 'Private' : 
                             insuranceService?.category === 'tpa' ? 'TPA' : 'Insurance'}
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
                            {insuranceService?.contactNumber || "108"}
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

export default CoverageList;

