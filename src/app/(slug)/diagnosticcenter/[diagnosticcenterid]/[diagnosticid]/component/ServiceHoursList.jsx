"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, Calendar, CheckCircle, AlertCircle, Phone, MapPin, Loader2, RefreshCw, Building2 } from "lucide-react";

const ServiceHoursList = ({ open, onOpenChange, diagnosticCenterData = {} }) => {
  const [serviceHours, setServiceHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [centerInfo, setCenterInfo] = useState(null);

  // Fetch service hours data
  useEffect(() => {
    if (open && diagnosticCenterData?.id) {
      fetchServiceHours();
    }
  }, [open, diagnosticCenterData?.id]);

  const fetchServiceHours = async () => {
    try {
      setLoading(true);
      setError(null);

      const hospitalId = diagnosticCenterData?.id;
      if (!hospitalId) {
        setError("Diagnostic center ID not found");
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/diagnostic-centers/service-hours?hospitalId=${hospitalId}`);
      const result = await response.json();

      if (result.success) {
        setServiceHours(result.data || []);
        setStats(result.stats || null);
        setCenterInfo(result.centerInfo || null);
        console.log("✅ Service hours loaded:", result.data?.length);
        console.log("✅ Center info:", result.centerInfo);
      } else {
        setError(result.error || "Failed to load service hours");
        console.error("❌ API Error:", result.error);
      }
    } catch (err) {
      setError("Failed to load service hours. Please try again.");
      console.error("❌ Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      green: {
        bg: "from-green-50 to-green-100",
        border: "border-green-200",
        icon: "bg-green-100 text-green-600",
        badge: "bg-green-100 text-green-800 border-green-300",
      },
      blue: {
        bg: "from-blue-50 to-blue-100",
        border: "border-blue-200",
        icon: "bg-blue-100 text-blue-600",
        badge: "bg-blue-100 text-blue-800 border-blue-300",
      },
      purple: {
        bg: "from-purple-50 to-purple-100",
        border: "border-purple-200",
        icon: "bg-purple-100 text-purple-600",
        badge: "bg-purple-100 text-purple-800 border-purple-300",
      },
      orange: {
        bg: "from-orange-50 to-orange-100",
        border: "border-orange-200",
        icon: "bg-orange-100 text-orange-600",
        badge: "bg-orange-100 text-orange-800 border-orange-300",
      },
      cyan: {
        bg: "from-cyan-50 to-cyan-100",
        border: "border-cyan-200",
        icon: "bg-cyan-100 text-cyan-600",
        badge: "bg-cyan-100 text-cyan-800 border-cyan-300",
      },
      indigo: {
        bg: "from-indigo-50 to-indigo-100",
        border: "border-indigo-200",
        icon: "bg-indigo-100 text-indigo-600",
        badge: "bg-indigo-100 text-indigo-800 border-indigo-300",
      },
    };
    return colors[color] || colors.blue;
  };

  const getServiceIcon = (serviceName) => {
    const iconMap = {
      "Diagnostic Services": <Clock className="w-5 h-5" />,
      "Sample Collection Center": <Calendar className="w-5 h-5" />,
      "Report Collection": <CheckCircle className="w-5 h-5" />,
      "Home Sample Collection": <MapPin className="w-5 h-5" />,
      "Customer Support": <Phone className="w-5 h-5" />,
      "Online Consultation": <AlertCircle className="w-5 h-5" />,
    };
    return iconMap[serviceName] || <Clock className="w-5 h-5" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-orange-50 to-amber-50">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-orange-600" />
            Service Hours
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Operating hours for all diagnostic centers
          </DialogDescription>
        </DialogHeader>

        {/* Service Hours List - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
          <div className="space-y-4">
            {/* Center Information Banner */}
            {centerInfo && !loading && (
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl p-5 text-white shadow-lg mb-4">
                <div className="flex items-center gap-4">
                  {centerInfo.logo && (
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={centerInfo.logo}
                        alt={centerInfo.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{centerInfo.name}</h3>
                    {centerInfo.location && (
                      <div className="flex items-center gap-2 text-orange-100 text-sm mb-1">
                        <MapPin className="w-4 h-4" />
                        <span>{centerInfo.location}</span>
                      </div>
                    )}
                    {centerInfo.contact && (
                      <div className="flex items-center gap-2 text-orange-100 text-sm">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${centerInfo.contact}`} className="hover:text-white">
                          {centerInfo.contact}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Statistics Cards */}
            {stats && !loading && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl p-4 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-5 h-5" />
                    <span className="text-xs font-medium">Service Hours</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalServices}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-4 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-xs font-medium">Tests Available</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalTests}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-5 h-5" />
                    <span className="text-xs font-medium">Total Bookings</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalBookings || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-xs font-medium">Experience</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.experience ? `${stats.experience}+ Yrs` : 'N/A'}</p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Loading service hours...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                <p className="text-red-800 font-semibold mb-2">{error}</p>
                <Button
                  onClick={fetchServiceHours}
                  variant="outline"
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </Button>
              </div>
            )}

            {/* Service Hours Cards */}
            {!loading && !error && serviceHours.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {serviceHours.map((service) => {
                  const colorClasses = getColorClasses(service.color);
                  const isAvailable = service.status === "Available";

                  return (
                    <Card
                      key={service.id}
                      className={`hover:shadow-lg transition-all duration-300 border ${colorClasses.border} bg-white overflow-hidden`}
                    >
                      <CardContent className="p-5">
                        {/* Service Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2 rounded-lg ${colorClasses.icon}`}>
                              {getServiceIcon(service.serviceName)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-base mb-1 leading-tight">
                                {service.serviceName}
                              </h4>
                              <Badge className={`text-xs ${colorClasses.badge}`}>
                                {service.type}
                              </Badge>
                            </div>
                          </div>
                          <Badge
                            className={`${
                              isAvailable
                                ? "bg-green-100 text-green-800 border-green-300"
                                : "bg-red-100 text-red-800 border-red-300"
                            } text-xs whitespace-nowrap ml-2`}
                          >
                            {service.status}
                          </Badge>
                        </div>

                        {/* Service Details */}
                        <div className={`bg-gradient-to-br ${colorClasses.bg} rounded-lg p-4 border ${colorClasses.border} space-y-2 mb-3`}>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <div>
                              <p className="text-xs text-gray-600 font-medium">Days</p>
                              <p className="text-sm font-bold text-gray-900">{service.days}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <div>
                              <p className="text-xs text-gray-600 font-medium">Hours</p>
                              <p className="text-sm font-bold text-gray-900">{service.hours}</p>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-700 leading-relaxed">
                            {service.description}
                          </p>
                          {service.totalTests > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-300">
                              <p className="text-xs text-gray-600">
                                <span className="font-semibold text-orange-600">{service.totalTests}</span> tests available
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && serviceHours.length === 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  No Service Hours Available
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Service hours information is currently not available.
                </p>
                <Button
                  onClick={fetchServiceHours}
                  variant="outline"
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
            )}

            {/* Additional Information */}
            {!loading && !error && serviceHours.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Important Information
                </h4>
                <ul className="text-sm text-blue-800 space-y-1 ml-7">
                  <li>• Emergency diagnostic services are available 24/7</li>
                  <li>• Home collection requires advance booking (minimum 2 hours notice)</li>
                  <li>• Certain specialized tests may have specific collection timings</li>
                  <li>• Fasting tests are recommended to be done in the morning</li>
                  <li>• Online reports are available within 24-48 hours of sample collection</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            For urgent queries or to book a service, please contact us{centerInfo?.contact && (
              <span> at <a href={`tel:${centerInfo.contact}`} className="font-semibold text-orange-600 hover:text-orange-700">{centerInfo.contact}</a></span>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceHoursList;
