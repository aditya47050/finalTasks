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
  Home,
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
} from "lucide-react";

const HomeServicesList = ({ onClose, homeHealthcareService, serviceName }) => {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState(null);
  const [atHomeServices, setAtHomeServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch home healthcare services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/home-healthcare/service-types");
        const result = await response.json();

        if (result.success && result.data) {
          // Map API data to component structure
          const mappedServices = result.data.map((service, index) => ({
            id: index + 1,
            name: service.serviceName,
            icon: getServiceIcon(service.serviceName),
            description: getServiceDescription(service.serviceName),
            features: getServiceFeatures(service.serviceName),
            startingPrice: service.minPrice || "999",
            maxPrice: service.maxPrice,
            color: getServiceColor(index),
            available: service.totalProviders > 0,
            totalProviders: service.totalProviders,
            availableIn: service.availableIn,
            providers: service.providers,
          }));
          setAtHomeServices(mappedServices);
        } else {
          setError("Failed to load services");
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Helper function to get icon based on service name
  const getServiceIcon = (serviceName) => {
    const name = serviceName?.toLowerCase() || "";
    if (name.includes("nursing") || name.includes("nurse")) return <Stethoscope className="w-6 h-6" />;
    if (name.includes("physio")) return <Activity className="w-6 h-6" />;
    if (name.includes("doctor") || name.includes("physician")) return <Stethoscope className="w-6 h-6" />;
    if (name.includes("elder") || name.includes("elderly")) return <Heart className="w-6 h-6" />;
    if (name.includes("lab") || name.includes("test")) return <Activity className="w-6 h-6" />;
    if (name.includes("equipment") || name.includes("rental")) return <Shield className="w-6 h-6" />;
    if (name.includes("post") || name.includes("operative")) return <Shield className="w-6 h-6" />;
    if (name.includes("vaccination") || name.includes("vaccine")) return <Stethoscope className="w-6 h-6" />;
    return <Home className="w-6 h-6" />;
  };

  // Helper function to get description
  const getServiceDescription = (serviceName) => {
    return `Professional ${serviceName} services provided in the comfort of your home by qualified healthcare professionals.`;
  };

  // Helper function to get features
  const getServiceFeatures = (serviceName) => {
    return [
      "24/7 Availability",
      "Qualified Professionals",
      "Personalized Care",
      "Affordable Pricing",
    ];
  };

  // Helper function to get color
  const getServiceColor = (index) => {
    const colors = ["blue", "green", "purple", "red", "orange", "indigo", "cyan", "pink"];
    return colors[index % colors.length];
  };

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
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-600",
      hover: "hover:bg-red-100",
      gradient: "from-red-50 to-red-100",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-600",
      hover: "hover:bg-orange-100",
      gradient: "from-orange-50 to-orange-100",
    },
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-600",
      hover: "hover:bg-indigo-100",
      gradient: "from-indigo-50 to-indigo-100",
    },
    cyan: {
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      text: "text-cyan-600",
      hover: "hover:bg-cyan-100",
      gradient: "from-cyan-50 to-cyan-100",
    },
    pink: {
      bg: "bg-pink-50",
      border: "border-pink-200",
      text: "text-pink-600",
      hover: "hover:bg-pink-100",
      gradient: "from-pink-50 to-pink-100",
    },
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-t-xl shadow-lg p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Home className="w-7 h-7 text-blue-600" />
                    At Home Healthcare Services
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Professional healthcare services delivered to your doorstep
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Services Grid */}
          <div className="bg-gray-50 rounded-b-xl shadow-lg p-6">
            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600 text-lg">Loading services...</p>
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

            {/* Services List */}
            {!loading && !error && atHomeServices.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <Home className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No services available at the moment</p>
              </div>
            )}

            {!loading && !error && atHomeServices.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {atHomeServices.map((service) => {
                const colors = colorClasses[service.color];
                return (
                  <Card
                    key={service.id}
                    className={`border-2 ${colors.border} ${colors.hover} transition-all hover:shadow-xl cursor-pointer`}
                    onClick={() => setSelectedService(service)}
                  >
                    <CardContent className="p-5">
                      {/* Service Icon & Title */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`p-3 rounded-xl ${colors.bg} ${colors.text} flex-shrink-0`}>
                          {service.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {service.name}
                          </h3>
                          {service.available && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              Available
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {service.description}
                      </p>

                      {/* Provider Info */}
                      {service.totalProviders && (
                        <div className="flex items-center gap-4 mb-3 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>{service.totalProviders} Provider{service.totalProviders > 1 ? 's' : ''}</span>
                          </div>
                          {service.availableIn && service.availableIn.length > 0 && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{service.availableIn.length} Location{service.availableIn.length > 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Features */}
                      <div className="space-y-2 mb-4">
                        {service.features.slice(0, 2).map((feature, idx) => (
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
                            ₹{service.startingPrice}
                          </p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/home-healthcare/${encodeURIComponent(service.name)}`);
                          }}
                          className={`px-4 py-2 ${colors.bg} ${colors.text} rounded-lg font-semibold text-sm ${colors.hover} transition-all flex items-center gap-2`}
                        >
                          <Calendar className="w-4 h-4" />
                          View Providers
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              </div>
            )}

            {/* Provider Info Section */}
            {!loading && !error && homeHealthcareService && (
              <div className="mt-8">
                <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Service Provider Information
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

            {/* Why Choose At-Home Services */}
            {!loading && !error && (
            <div className="mt-8">
              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Why Choose At-Home Healthcare Services?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        icon: <Home className="w-5 h-5 text-blue-600" />,
                        title: "Comfort of Home",
                        desc: "Receive care in familiar surroundings",
                      },
                      {
                        icon: <Clock className="w-5 h-5 text-green-600" />,
                        title: "Convenient Timing",
                        desc: "Schedule as per your convenience",
                      },
                      {
                        icon: <Award className="w-5 h-5 text-purple-600" />,
                        title: "Qualified Professionals",
                        desc: "Experienced healthcare experts",
                      },
                      {
                        icon: <IndianRupee className="w-5 h-5 text-orange-600" />,
                        title: "Cost Effective",
                        desc: "Affordable and transparent pricing",
                      },
                    ].map((benefit, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 border-2 border-gray-200">
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
          </div>
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
              <h3 className="text-2xl font-bold text-gray-900">{selectedService.name}</h3>
              <button
                onClick={() => setSelectedService(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[selectedService.color].gradient} rounded-2xl flex items-center justify-center mb-4 ${colorClasses[selectedService.color].text}`}>
                {selectedService.icon}
              </div>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                {selectedService.description}
              </p>
              
              {/* Service Stats */}
              {selectedService.totalProviders && (
                <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-gray-700">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Available Providers</p>
                      <p className="font-bold text-gray-900">{selectedService.totalProviders} Provider{selectedService.totalProviders > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  {selectedService.availableIn && selectedService.availableIn.length > 0 && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Locations</p>
                        <p className="font-bold text-gray-900">{selectedService.availableIn.length} Cit{selectedService.availableIn.length > 1 ? 'ies' : 'y'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Available Locations */}
              {selectedService.availableIn && selectedService.availableIn.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-3 text-base">Available in:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.availableIn.slice(0, 10).map((city, idx) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-700 border border-blue-200">
                        {city}
                      </Badge>
                    ))}
                    {selectedService.availableIn.length > 10 && (
                      <Badge className="bg-gray-100 text-gray-700">
                        +{selectedService.availableIn.length - 10} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Key Features:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {selectedService.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg ${colorClasses[selectedService.color].bg} border ${colorClasses[selectedService.color].border}`}
                  >
                    <CheckCircle className={`w-5 h-5 ${colorClasses[selectedService.color].text} flex-shrink-0`} />
                    <span className="text-gray-900 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              <div className={`bg-gradient-to-br ${colorClasses[selectedService.color].gradient} p-6 rounded-xl border ${colorClasses[selectedService.color].border} mb-6`}>
                <p className="text-sm text-gray-600 mb-2">Starting Price</p>
                <p className={`text-4xl font-bold ${colorClasses[selectedService.color].text} mb-3`}>
                  ₹{selectedService.startingPrice}
                </p>
                <p className="text-sm text-gray-600">*Price may vary based on service duration and requirements</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    router.push(`/home-healthcare/${encodeURIComponent(selectedService.name)}`);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  View All Providers
                </button>
                <button 
                  onClick={() => setSelectedService(null)}
                  className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeServicesList;

