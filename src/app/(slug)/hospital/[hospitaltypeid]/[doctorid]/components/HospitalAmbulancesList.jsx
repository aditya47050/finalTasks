"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Phone,
  MapPin,
  Clock,
  Truck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HospitalAmbulancesList({ onClose, hospitalService }) {
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const hospitalId = hospitalService?.id || hospitalService?._id;
    if (!hospitalId) return;

    const fetchAmbulances = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/hospital/${hospitalId}/ambulances`);
        if (res.data.success) {
          setAmbulances(res.data.ambulances || []);
        } else {
          setError("Failed to load ambulances.");
        }
      } catch (err) {
        console.error("🔥 Error fetching ambulances:", err);
        setError("Error fetching ambulance data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAmbulances();
  }, [hospitalService?.id, hospitalService?._id]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full h-full overflow-y-auto">
        <Card className="w-full max-w-[95vw] lg:max-w-none mx-auto min-h-screen bg-white rounded-none border-0 shadow-none">
          {/* Header */}
          <CardHeader className="border-b bg-gradient-to-r from-[#1E3B90] to-[#3D85EF] text-white sticky top-0 z-10 shadow-md">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl lg:text-3xl font-bold">
                    Ambulance Services
                  </CardTitle>
                  <p className="text-sm text-blue-100 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {ambulances.length} ambulance
                      {ambulances.length !== 1 ? "s" : ""} available
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
          <CardContent className="relative z-0 p-6 lg:px-8 lg:py-8 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
              {loading ? (
                <div className="text-center py-16">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Loading Ambulance Services
                  </h3>
                  <p className="text-gray-600">Please wait...</p>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Error Loading Ambulances
                  </h3>
                  <p className="text-red-600 mb-6">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Try Again
                  </Button>
                </div>
              ) : ambulances.length === 0 ? (
                <div className="text-center py-16">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    No Ambulances Found
                  </h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ambulances.map((a, index) => (
                    <Card
                      key={`${a.id}-${index}`}
                      className="h-full min-h-[300px] flex flex-col overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl hover:translate-y-[-4px]"
                    >
                      <CardContent className="p-0 flex flex-col flex-grow">
                        {/* Header */}
                        <div className="bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10 p-6 rounded-t-2xl">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1E3B90] to-[#3D85EF] flex items-center justify-center border-4 border-white shadow-lg">
                              <Truck className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
                                {a.ambulance?.driverName
                                  ? a.ambulance.driverName
                                  : "Ambulance Driver"}
                              </h3>
                              <p className="text-[#1E3B90] text-sm font-semibold mb-1">
                                {a.ambulance?.type || "General Type"}
                              </p>
                              <span
                                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${
                                  a.status === "APPROVED"
                                    ? "bg-green-100 text-green-700 border-green-300"
                                    : "bg-yellow-100 text-yellow-700 border-yellow-300"
                                }`}
                              >
                                {a.status || "Pending"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-3 flex-grow text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#1E3B90]" />
                            <span>
                              Hospital ID:{" "}
                              <span className="font-medium">{a.hospitalId}</span>
                            </span>
                          </div>

                          {a.ambulance ? (
                            <>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-[#1E3B90]" />
                                <span>
                                  Contact:{" "}
                                  <span className="font-medium">
                                    {a.ambulance.phone || "Not Available"}
                                  </span>
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-gray-500 text-xs">
                                <Clock className="h-3 w-3 text-[#1E3B90]" />
                                <span>
                                  Added on{" "}
                                  {new Date(a.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </>
                          ) : (
                            <p className="text-gray-500 italic">
                              Ambulance details not available
                            </p>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 pb-6 pt-2">
                          <div className="flex gap-3">
                            <button className="flex-1 bg-gradient-to-r from-[#1E3B90] to-[#1E3B90] text-white font-medium py-2.5 px-3 rounded-xl shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm">
                              <Phone className="h-4 w-4" />
                              Contact Driver
                            </button>
                            <button className="flex-1 bg-gradient-to-r from-[#3D85EF] to-[#3D85EF] text-white font-medium py-2.5 px-3 rounded-xl shadow-sm hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4" />
                              View Details
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
