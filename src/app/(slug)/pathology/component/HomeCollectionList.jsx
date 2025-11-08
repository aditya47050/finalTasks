"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Home, CheckCircle, AlertCircle, X, Phone, Mail, Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HomeCollectionList({ hospitalId, onClose }) {
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
        const res = await fetch(`/api/pathology/home-collection?hospitalId=${hospitalId}`);
        const result = await res.json();
        if (result.success && result.homeCollection) {
          setData(result.homeCollection);
        }
      } catch (err) {
        console.error("🔥 Error fetching home collection:", err);
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
                <Home className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  Home Collection Services
                </DialogTitle>
                <p className="text-white/90 text-sm mt-1">
                  Convenient doorstep sample collection by certified technicians
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
            <p className="text-gray-500 text-center">Loading home collection details...</p>
          ) : data ? (
            <div className="space-y-6">
              {/* Main Details Card */}
              <Card className={`border ${unified.borderColor} shadow-md rounded-2xl`}>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Available</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {data.title || "Home Sample Collection"}
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-3 mt-3 text-sm">
                    <p className="text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <strong>Timings:</strong>{" "}
                      {`${data.availableFrom || "7:00 AM"} - ${data.availableTill || "9:00 PM"}`}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <strong>Days:</strong> {(data.days || []).join(", ")}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <strong>Contact:</strong> {data.contactNumber || "N/A"}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <strong>Email:</strong> {data.email || "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Highlights */}
              <div>
                <h4 className={`text-lg font-semibold mb-3 ${unified.accentText}`}>
                  Service Highlights
                </h4>

                {data.serviceHighlights && data.serviceHighlights.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {data.serviceHighlights.map((s, i) => (
                      <Card
                        key={i}
                        className={`border ${unified.borderColor} rounded-2xl hover:shadow-md transition-all`}
                      >
                        <CardContent className="p-5 space-y-2">
                          <h4 className="font-semibold text-gray-800">{s.title}</h4>
                          <p className="text-gray-600 text-sm">{s.detail}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-10 text-center text-gray-600 border">
                    <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                    No specific highlights available.
                  </Card>
                )}
              </div>

              {/* Instructions */}
              {data.instructions && (
                <div>
                  <h4 className={`text-lg font-semibold mb-3 ${unified.accentText}`}>
                    Preparation Instructions
                  </h4>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
                    {data.instructions.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Card className="p-10 text-center text-gray-600 border">
              <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-4" />
              No home collection data found for this hospital.
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
