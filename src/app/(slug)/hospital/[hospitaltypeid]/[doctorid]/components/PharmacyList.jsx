"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pill, Building2, AlertCircle, X, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HospitalPharmacyList({ hospitalId, onClose }) {
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🩺 Unified hospital theme
  const unified = {
    headerGradient: "from-[#1E3B90] to-[#3D85EF]",
    accentText: "text-[#1E3B90]",
    lightBg: "bg-[#EEF3FF]",
    borderColor: "border-[#E1E8FF]",
    buttonGradient: "from-[#1E3B90] to-[#3D85EF]",
  };

  useEffect(() => {
    if (!hospitalId) return;

    const fetchPharmacy = async () => {
      try {
        const res = await fetch(`/api/hospital/${hospitalId}/pharmacy`);
        const data = await res.json();

        if (data.success && data.pharmacy) {
          setPharmacy(data.pharmacy);
        } else {
          setPharmacy(null);
        }
      } catch (err) {
        console.error("Error fetching hospital pharmacy:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacy();
  }, [hospitalId]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[85vh] overflow-y-auto p-0 rounded-2xl shadow-2xl border-none"
        hideCloseButton
      >
        {/* Header */}
        <DialogHeader
          className={`sticky top-0 z-10 bg-gradient-to-r ${unified.headerGradient} text-white p-5 sm:p-6 rounded-t-2xl shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/25 rounded-xl backdrop-blur-sm shadow-inner">
                <Pill className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white tracking-wide">
                  Hospital Pharmacy
                </DialogTitle>
                <p className="text-white/90 text-sm mt-1">
                  In-house medical store & emergency drug support
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 transition-all p-2 rounded-lg backdrop-blur-sm focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Main Content */}
        <div className="p-6 sm:p-8 bg-white">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading pharmacy details...
            </div>
          ) : pharmacy ? (
            <Card
              className={`border ${unified.borderColor} shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white`}
            >
              <div className={`h-1.5 bg-gradient-to-r ${unified.buttonGradient}`} />
              <CardContent className="p-6 sm:p-8 space-y-4">
                {/* Title */}
                <div className="flex items-center gap-3">
                  <ShieldCheck className={`w-6 h-6 ${unified.accentText}`} />
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {pharmacy.name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed">
                  {pharmacy.description}
                </p>

                {/* Info Section */}
                <div
                  className={`mt-5 p-5 ${unified.lightBg} rounded-xl border ${unified.borderColor} space-y-2`}
                >
                  <p className="text-gray-800 text-sm">
                    <strong>📍 Location:</strong> {pharmacy.location}
                  </p>
                  <p className="text-gray-800 text-sm">
                    <strong>📞 Contact:</strong> {pharmacy.contactNumber}
                  </p>
                  <p className="text-gray-800 text-sm">
                    <strong>Status:</strong>{" "}
                    {pharmacy.available ? (
                      <span className="text-green-600 font-medium">
                        Available 24/7
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        Currently Closed
                      </span>
                    )}
                  </p>
                </div>

                {/* Facilities / Features */}
                {pharmacy.facilities && pharmacy.facilities.length > 0 && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {pharmacy.facilities.map((f, i) => (
                      <Card
                        key={i}
                        className={`border ${unified.borderColor} p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300`}
                      >
                        <div className="flex items-start gap-3">
                          <Pill className={`w-5 h-5 ${unified.accentText}`} />
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {f.title}
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {f.detail}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            // ❌ No data fallback
            <Card className="border border-gray-200 shadow-lg rounded-2xl bg-white text-center hover:shadow-xl transition-all duration-300">
              <CardContent className="p-10 sm:p-14">
                <div className="flex flex-col items-center justify-center space-y-5">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    No Pharmacy Data Available
                  </h3>
                  <p className="text-gray-600 max-w-md leading-relaxed">
                    The hospital pharmacy details are currently unavailable.
                    Please contact the hospital for more information or updates.
                  </p>

                  <div
                    className={`mt-6 p-5 ${unified.lightBg} rounded-xl ${unified.borderColor} border max-w-lg text-left`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 ${unified.lightBg} rounded-lg`}>
                        <AlertCircle
                          className={`w-5 h-5 ${unified.accentText}`}
                        />
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        You can reach out to the hospital reception for pharmacy
                        information or upcoming updates.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
