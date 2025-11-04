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
  Stethoscope,
  Activity,
  Heart,
  X,
  ArrowLeft,
  Loader2,
  GraduationCap,
  Briefcase,
  UserCheck,
  FileText,
  BadgeCheck,
  TrendingUp,
  Home,
  Sparkles,
} from "lucide-react";

const ProfessionalsServicesList = ({ onClose, homeHealthcareService, serviceName }) => {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState(null);
  const [professionalServices, setProfessionalServices] = useState([]);
  const [groupedServices, setGroupedServices] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grouped"); // 'grouped' or 'all'

  // Fetch professional services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/home-healthcare/professional-services");
        const result = await response.json();

        if (result.success) {
          setProfessionalServices(result.data || []);
          setGroupedServices(result.grouped || []);
          setStatistics(result.statistics);
        } else {
          setError("Failed to load professional services");
        }
      } catch (err) {
        console.error("Error fetching professional services:", err);
        setError("Failed to load professional services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const colorClasses = {
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-600",
      hover: "hover:bg-purple-100",
      gradient: "from-purple-50 to-purple-100",
    },
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-600",
      hover: "hover:bg-indigo-100",
      gradient: "from-indigo-50 to-indigo-100",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
      hover: "hover:bg-blue-100",
      gradient: "from-blue-50 to-blue-100",
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
  };

  const getServiceColor = (index) => {
    const colors = ["purple", "indigo", "blue", "teal", "cyan"];
    return colors[index % colors.length];
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-xl shadow-lg p-6 sticky top-0 z-10">
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
                    <Stethoscope className="w-8 h-8" />
                    Qualified Healthcare Professionals
                  </h2>
                  <p className="text-white/90 mt-1">
                    Expert doctors, nurses, and healthcare staff ready to serve you
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
                    ? "bg-white text-purple-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                By Service Type
              </button>
              <button
                onClick={() => setViewMode("all")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "all"
                    ? "bg-white text-purple-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                All Providers
              </button>
            </div>
          </div>

          {/* Services Content */}
          <div className="bg-gray-50 rounded-b-xl shadow-lg p-6">
            {/* Statistics Banner */}
            {statistics && !loading && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-2 border-purple-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalProfessionals}</h4>
                    <p className="text-xs text-gray-600">Total Professionals</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-indigo-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Stethoscope className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalDoctors}</h4>
                    <p className="text-xs text-gray-600">Qualified Doctors</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-blue-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.totalStaff}</h4>
                    <p className="text-xs text-gray-600">Healthcare Staff</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-teal-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <GraduationCap className="w-6 h-6 text-teal-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-2xl mb-1">{statistics.averageProfessionalsPerService}</h4>
                    <p className="text-xs text-gray-600">Avg per Service</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Professional Benefits Banner */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  icon: <GraduationCap className="w-6 h-6 text-purple-600" />,
                  title: "Qualified Experts",
                  desc: "Certified professionals",
                },
                {
                  icon: <BadgeCheck className="w-6 h-6 text-indigo-600" />,
                  title: "Verified Credentials",
                  desc: "Licensed & registered",
                },
                {
                  icon: <Award className="w-6 h-6 text-blue-600" />,
                  title: "Experienced Team",
                  desc: "Years of expertise",
                },
                {
                  icon: <UserCheck className="w-6 h-6 text-teal-600" />,
                  title: "Patient-Focused",
                  desc: "Compassionate care",
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
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                <p className="text-gray-600 text-lg">Loading professional services...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <X className="w-12 h-12 text-red-600 mb-4" />
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && professionalServices.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <Stethoscope className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No professional services available at the moment</p>
              </div>
            )}

            {/* Grouped Services View */}
            {!loading && !error && viewMode === "grouped" && groupedServices.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Services with Qualified Professionals ({groupedServices.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedServices.map((service, index) => {
                    const color = getServiceColor(index);
                    const colors = colorClasses[color];
                    return (
                      <Card
                        key={index}
                        className={`border-2 ${colors.border} ${colors.hover} transition-all hover:shadow-xl cursor-pointer`}
                        onClick={() => router.push(`/home-healthcare/${encodeURIComponent(service.serviceName)}`)}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3 mb-4">
                            <div className={`p-3 rounded-xl ${colors.bg} ${colors.text} flex-shrink-0`}>
                              <Stethoscope className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {service.serviceName}
                              </h3>
                              <Badge className="bg-purple-100 text-purple-700 text-xs">
                                <UserCheck className="w-3 h-3 mr-1" />
                                Qualified Staff
                              </Badge>
                            </div>
                          </div>

                          {/* Professional Stats */}
                          <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              <span>{service.totalProfessionals} Professional{service.totalProfessionals > 1 ? "s" : ""}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Stethoscope className="w-3.5 h-3.5" />
                              <span>{service.totalDoctors} Doctor{service.totalDoctors > 1 ? "s" : ""}</span>
                            </div>
                            {service.totalStaff > 0 && (
                              <div className="flex items-center gap-1">
                                <Briefcase className="w-3.5 h-3.5" />
                                <span>{service.totalStaff} Staff</span>
                              </div>
                            )}
                          </div>

                          {/* Provider Count */}
                          <div className="flex items-center gap-1 mb-4 text-xs text-gray-600">
                            <Shield className="w-3.5 h-3.5" />
                            <span>{service.totalProviders} Provider{service.totalProviders > 1 ? "s" : ""} Available</span>
                          </div>

                          {/* Locations */}
                          {service.availableIn && service.availableIn.length > 0 && (
                            <div className="flex items-center gap-1 mb-4 text-xs text-gray-600">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">
                                Available in {service.availableIn.slice(0, 2).join(", ")}
                                {service.availableIn.length > 2 && ` +${service.availableIn.length - 2} more`}
                              </span>
                            </div>
                          )}

                          {/* Features */}
                          <div className="space-y-2 mb-4">
                            {["Verified Professionals", "Qualified Doctors"].map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <CheckCircle className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
                                <span className="text-sm text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>

                          {/* Pricing & Action */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Starting from</p>
                              <p className={`text-2xl font-bold ${colors.text}`}>
                                ₹{service.minPrice}
                              </p>
                            </div>
                            <button className={`px-4 py-2 ${colors.bg} ${colors.text} rounded-lg font-semibold text-sm ${colors.hover} transition-all flex items-center gap-2`}>
                              <Calendar className="w-4 h-4" />
                              View
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
            {!loading && !error && viewMode === "all" && professionalServices.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  All Providers with Qualified Professionals ({professionalServices.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {professionalServices.map((service, index) => {
                    const color = getServiceColor(index);
                    const colors = colorClasses[color];
                    return (
                      <Card
                        key={service.id}
                        className={`border-2 ${colors.border} hover:shadow-xl transition-all cursor-pointer`}
                        onClick={() => router.push(`/home-healthcare/${encodeURIComponent(service.serviceName)}/${service.hospital.id}`)}
                      >
                        <CardContent className="p-5">
                          {/* Hospital Logo & Name */}
                          <div className="flex items-start gap-3 mb-4">
                            {service.hospital.logo && (
                              <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                <Image
                                  src={service.hospital.logo}
                                  width={56}
                                  height={56}
                                  alt={service.hospital.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
                                {service.hospital.name}
                              </h3>
                              <div className="flex flex-wrap gap-1">
                                <Badge className="bg-purple-100 text-purple-700 text-xs">
                                  <UserCheck className="w-3 h-3 mr-1" />
                                  Qualified
                                </Badge>
                                {service.professionals.totalCount > 0 && (
                                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                                    {service.professionals.totalCount} Professionals
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Service Name */}
                          <div className={`${colors.bg} ${colors.text} p-3 rounded-lg mb-3`}>
                            <p className="font-semibold text-sm">{service.serviceName}</p>
                          </div>

                          {/* Professional Count */}
                          <div className="flex flex-wrap gap-2 mb-3 text-xs">
                            {service.professionals.doctorCount > 0 && (
                              <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                <Stethoscope className="w-3 h-3" />
                                <span>{service.professionals.doctorCount} Doctor{service.professionals.doctorCount > 1 ? "s" : ""}</span>
                              </div>
                            )}
                            {service.professionals.staffCount > 0 && (
                              <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                <Briefcase className="w-3 h-3" />
                                <span>{service.professionals.staffCount} Staff</span>
                              </div>
                            )}
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{service.hospital.city}, {service.hospital.state}</span>
                          </div>

                          {/* Features */}
                          <div className="space-y-2 mb-4">
                            {[
                              { icon: <GraduationCap className="w-4 h-4" />, text: "Qualified Professionals" },
                              { icon: <BadgeCheck className="w-4 h-4" />, text: "Verified Credentials" },
                            ].map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className={colors.text}>{feature.icon}</div>
                                <span className="text-sm text-gray-700">{feature.text}</span>
                              </div>
                            ))}
                          </div>

                          {/* Experience Badge */}
                          {service.hospital.experience && (
                            <div className="flex items-center gap-2 mb-4 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                              <Award className="w-4 h-4 text-purple-600" />
                              <span>{service.hospital.experience}+ years experience</span>
                            </div>
                          )}

                          {/* Pricing & Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Starting from</p>
                              <p className={`text-xl font-bold ${colors.text}`}>
                                ₹{service.minPrice}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`tel:${service.hospital.mobile}`, '_self');
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

            {/* Why Choose Professional Services */}
            {!loading && !error && (
              <div className="mt-8">
                <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-purple-600" />
                      Why Choose Our Qualified Professionals?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          icon: <GraduationCap className="w-5 h-5 text-purple-600" />,
                          title: "Highly Qualified",
                          desc: "Certified and registered professionals",
                        },
                        {
                          icon: <Award className="w-5 h-5 text-indigo-600" />,
                          title: "Experienced Team",
                          desc: "Years of medical expertise",
                        },
                        {
                          icon: <UserCheck className="w-5 h-5 text-blue-600" />,
                          title: "Patient-Focused",
                          desc: "Compassionate care approach",
                        },
                        {
                          icon: <BadgeCheck className="w-5 h-5 text-teal-600" />,
                          title: "Verified Credentials",
                          desc: "All licenses and certifications verified",
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
            {!loading && !error && homeHealthcareService && (
              <div className="mt-6">
                <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
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
                            {homeHealthcareService?.hospital?.hspInfo?.regname || "Healthcare Provider"}
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
                            {homeHealthcareService?.hospital?.hspcontact?.city}, {homeHealthcareService?.hospital?.hspcontact?.state}
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
                            {homeHealthcareService?.hospital?.mobile || "Contact Provider"}
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

export default ProfessionalsServicesList;

