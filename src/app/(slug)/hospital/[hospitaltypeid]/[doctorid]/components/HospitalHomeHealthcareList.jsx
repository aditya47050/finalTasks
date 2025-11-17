"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // <-- Added for routing
import {
  Home,
  HeartHandshake,
  Loader2,
  AlertTriangle,
  CheckCircle,
  X,
  Stethoscope,
  Calendar,
  Building2,
  Wallet,
  MapPin,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HospitalHomeHealthcareList({ onClose, hospitalService }) {
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter(); // <-- For navigation

  useEffect(() => {
    const hospitalId = hospitalService?.id || hospitalService?._id;
    if (!hospitalId) return;

    const fetchLinkedCenters = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/hospital/${hospitalId}/inhouse-homehealthcare`);
        if (res.data.success && res.data.linkedCenters) {
          const servicesWithCenter = res.data.linkedCenters.flatMap((link) => {
            const center = link.homeHealthcare;
            const centerInfo = {
              centerId: center.id,
              centerName: center.hspInfo?.regname || "Unknown Center",
              address: center.hspcontact?.address || "",
              city: center.hspcontact?.city || "",
              pincode: center.hspcontact?.pincode || "",
            };

            return (center.HomeHealthcare || []).map((svc) => ({
              ...svc,
              ...centerInfo,
            }));
          });
          setAllServices(servicesWithCenter);
        } else {
          setError("No linked centers found.");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchLinkedCenters();
  }, [hospitalService?.id, hospitalService?._id]);

  // Generate correct URL
  const generateServiceUrl = (serviceName, serviceId) => {
    const encodedName = encodeURIComponent(serviceName.trim());
    return `/home-healthcare/${encodedName}/${serviceId}`;
  };

  // Handle Book Click
  const handleBook = (svc) => {
    const url = generateServiceUrl(svc.serviceName, svc.id);
    router.push(url);
  };

  // Handle Details Click
  const handleDetails = (svc) => {
    const url = generateServiceUrl(svc.serviceName, svc.id);
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full h-full overflow-y-auto">
        <Card className="w-full max-w-[95vw] lg:max-w-none mx-auto min-h-screen bg-white rounded-none border-0 shadow-none">
          {/* Header */}
          <CardHeader className="border-b bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white sticky top-0 z-10 shadow-md">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                  <HeartHandshake className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl lg:text-3xl font-bold">
                    Home Healthcare Services
                  </CardTitle>
                  <p className="text-sm text-blue-100 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {allServices.length} service{allServices.length !== 1 ? "s" : ""} available
                    </span>
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 h-10 w-10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="p-6 lg:px-8 lg:py-8 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
              {loading ? (
                <div className="text-center py-16">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading services...</p>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600">{error}</p>
                  <Button onClick={() => window.location.reload()} className="mt-4">
                    Retry
                  </Button>
                </div>
              ) : allServices.length === 0 ? (
                <div className="text-center py-16">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No services found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allServices.map((svc, index) => (
                    <Card
                      key={`${svc.centerId}-${svc.id}-${index}`}
                      className="h-full min-h-[320px] flex flex-col overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl hover:translate-y-[-4px] cursor-pointer"
                      onClick={() => handleDetails(svc)} // Optional: click card to view details
                    >
                      <CardContent className="p-0 flex flex-col flex-grow">
                        {/* Service + Center Header */}
                        <div className="bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 p-5 rounded-t-2xl">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1E3B90] to-[#3D85EF] flex items-center justify-center border-4 border-white shadow-md">
                              <Home className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-gray-800 truncate">
                                {svc.serviceName}
                              </h3>
                              <p className="text-xs text-[#1E3B90] font-medium truncate">
                                {svc.centerName}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Center Address */}
                        <div className="px-5 pt-3 pb-2 text-xs text-gray-600">
                          <div className="flex items-start gap-1">
                            <MapPin className="w-3 h-3 text-[#1E3B90] mt-0.5 flex-shrink-0" />
                            <span className="truncate">
                              {svc.city}
                              {svc.pincode && ` - ${svc.pincode}`}
                            </span>
                          </div>
                        </div>

                        {/* Price Info */}
                        <div className="p-5 space-y-2 flex-grow text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Starting Price</span>
                            <span className="font-bold">₹{svc.startingPrice}</span>
                          </div>

                          {svc.minPrice && svc.maxPrice && (
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-500">Range</span>
                              <span>₹{svc.minPrice} – ₹{svc.maxPrice}</span>
                            </div>
                          )}

                          {svc.finalprice && (
                            <div className="flex justify-between items-center font-bold text-green-600">
                              <span>Final Price</span>
                              <span>₹{svc.finalprice}</span>
                            </div>
                          )}

                          {svc.discount && (
                            <div className="flex items-center justify-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full w-fit mx-auto">
                              <CheckCircle className="w-3 h-3" />
                              <span>{svc.discount} OFF</span>
                            </div>
                          )}
                        </div>

                        {/* Footer Buttons */}
                        <div className="px-5 pb-5">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card click
                                handleBook(svc);
                              }}
                              className="bg-gradient-to-r from-[#1E3B90] to-[#1E3B90] text-white font-medium py-2 px-3 rounded-xl shadow-md hover:scale-105 transition-all flex items-center justify-center gap-1 text-xs"
                            >
                              <Calendar className="h-3.5 w-3.5" />
                              Book
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDetails(svc);
                              }}
                              className="bg-gradient-to-r from-[#3D85EF] to-[#3D85EF] text-white font-medium py-2 px-3 rounded-xl shadow-sm hover:scale-105 transition-all flex items-center justify-center gap-1 text-xs"
                            >
                              <Stethoscope className="h-3.5 w-3.5" />
                              Details
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}