"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Monitor,
  CheckCircle,
  AlertCircle,
  X,
  Mail,
  Download,
  Cloud,
  MessageSquare,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function OnlineReportsList({ hospitalId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const unified = {
    headerGradient: "from-[#1E3B90] to-[#3D85EF]",
    accentText: "text-[#1E3B90]",
    borderColor: "border-[#E1E8FF]",
    lightBg: "bg-[#EEF3FF]",
  };

  useEffect(() => {
    if (!hospitalId) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/pathology/online-reports?hospitalId=${hospitalId}`);
        const result = await res.json();
        if (result.success && result.onlineReports) {
          setData(result.onlineReports);
        }
      } catch (err) {
        console.error("🔥 Error fetching Online Reports data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hospitalId]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[85vh] overflow-y-auto p-0 rounded-2xl shadow-2xl border-none"
        hideCloseButton
      >
        {/* Header */}
        <DialogHeader
          className={`sticky top-0 bg-gradient-to-r ${unified.headerGradient} text-white p-5 sm:p-6 rounded-t-2xl`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/25 rounded-xl">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  Online Reports & Digital Services
                </DialogTitle>
                <p className="text-white/90 text-sm mt-1">
                  Access your lab reports anytime, anywhere with digital delivery
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 transition-all p-2 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 sm:p-8 bg-white">
          {loading ? (
            <p className="text-gray-500 text-center">Loading digital services...</p>
          ) : data ? (
            <div className="space-y-6">
              {/* Main Details */}
              <Card className={`border ${unified.borderColor} shadow-md rounded-2xl`}>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Active</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {data.title || "Online Reports & Digital Services"}
                  </h3>
                  <p className="text-gray-700">{data.tagline}</p>

                  <div className="grid sm:grid-cols-2 gap-3 mt-3 text-sm">
                    <p className="text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <strong>Support Email:</strong> {data.contactEmail || "N/A"}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <strong>Contact Number:</strong> {data.supportNumber || "N/A"}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <Cloud className="w-4 h-4 text-blue-600" />
                      <strong>Available:</strong> {data.availability || "24/7"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Feature Categories */}
              <div>
                <h4 className={`text-lg font-semibold mb-3 ${unified.accentText}`}>
                  Digital Features
                </h4>

                {data.features && data.features.length > 0 ? (
                  <div className="space-y-6">
                    {data.features.map((feature, i) => (
                      <div key={i}>
                        <h5 className="text-gray-800 font-semibold mb-2 flex items-center gap-2">
                          {feature.category === "By Location" && (
                            <MapPin className="w-4 h-4 text-[#1E3B90]" />
                          )}
                          {feature.category === "Email Delivery" && (
                            <Mail className="w-4 h-4 text-[#1E3B90]" />
                          )}
                          {feature.category === "SMS Alerts" && (
                            <MessageSquare className="w-4 h-4 text-[#1E3B90]" />
                          )}
                          {feature.category === "Download PDF" && (
                            <Download className="w-4 h-4 text-[#1E3B90]" />
                          )}
                          {feature.category === "Cloud Storage" && (
                            <Cloud className="w-4 h-4 text-[#1E3B90]" />
                          )}
                          {feature.category}
                        </h5>

                        <div className="grid sm:grid-cols-2 gap-4">
                          {feature.options.map((opt, j) => (
                            <Card
                              key={j}
                              className={`border ${unified.borderColor} rounded-2xl hover:shadow-md transition-all`}
                            >
                              <CardContent className="p-5 space-y-2">
                                <h4 className="font-semibold text-gray-800">
                                  {opt.title}
                                </h4>
                                <p className="text-gray-600 text-sm">{opt.detail}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card className="p-10 text-center text-gray-600 border">
                    <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                    No digital report services available for this hospital.
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <Card className="p-10 text-center text-gray-600 border">
              <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-4" />
              No online report data found for this hospital.
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
