"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  FileText,
  Building2,
  User,
  HeartPulse,
  Medal,
  Loader2,
  AlertCircle,
  X,
  Landmark,
} from "lucide-react";

export default function GovtSchemesList({ hospitalId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const theme = {
    headerGradient: "from-[#1E3B90] to-[#3D85EF]",
    accentText: "text-[#1E3B90]",
    borderColor: "border-[#E1E8FF]",
    lightBg: "bg-[#EEF3FF]",
  };

  useEffect(() => {
    if (!hospitalId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/pathology/govt-schemes?hospitalId=${hospitalId}`);
        const result = await res.json();

        if (result.success && result.data) setData(result.data);
      } catch (err) {
        console.error("🔥 Error fetching Govt Schemes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hospitalId]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="max-w-5xl max-h-[85vh] overflow-y-auto p-0 rounded-2xl shadow-2xl border-none"
        hideCloseButton
      >
        {/* Header */}
        <DialogHeader
          className={`sticky top-0 bg-gradient-to-r ${theme.headerGradient} text-white p-5 sm:p-6 rounded-t-2xl z-10`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/25 rounded-xl">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  Government Health Schemes
                </DialogTitle>
                <p className="text-white/90 text-sm mt-1">
                  Authorized diagnostic and pathology benefits under government programs
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
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-[#1E3B90] animate-spin mb-3" />
              <p className="text-gray-600 text-lg">Loading Govt Schemes...</p>
            </div>
          ) : !data ? (
            <Card className="p-10 text-center text-gray-600 border">
              <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-4" />
              No Govt Schemes data found for this hospital.
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Overview */}
              <Card className={`border ${theme.borderColor} shadow-md rounded-2xl`}>
                <CardContent className="p-6 space-y-3">
                  <h2 className="text-2xl font-bold text-gray-900">{data.title}</h2>
                  {data.subtitle && (
                    <p className="text-gray-700 text-base">{data.subtitle}</p>
                  )}
                  {data.description && (
                    <p className="text-gray-600 text-sm">{data.description}</p>
                  )}
                </CardContent>
              </Card>

              {/* Schemes */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {data.schemes?.map((scheme, index) => {
                  const IconComponent =
                    {
                      ShieldCheck,
                      FileText,
                      Building2,
                      User,
                      HeartPulse,
                      Medal,
                    }[scheme.icon] || ShieldCheck;

                  return (
                    <Card
                      key={index}
                      className={`border ${theme.borderColor} hover:shadow-lg transition-all rounded-2xl`}
                    >
                      <CardContent className="p-6 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-[#1E3B90]/10 to-[#3D85EF]/10">
                            <IconComponent className="w-5 h-5 text-[#1E3B90]" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {scheme.name}
                          </h3>
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed">
                          {scheme.detail}
                        </p>

                        <div className="text-[#1E3B90] text-sm font-medium bg-[#EEF3FF] px-3 py-2 rounded-lg inline-flex items-center">
                          {scheme.highlight}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
