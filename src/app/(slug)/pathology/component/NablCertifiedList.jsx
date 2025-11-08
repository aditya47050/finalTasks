"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Beaker, CheckCircle, AlertCircle, X, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HospitalNablPathologyList({ hospitalId, onClose }) {
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
        const res = await fetch(`/api/pathology/nabl-certified?hospitalId=${hospitalId}`);
        const result = await res.json();
        if (result.success && result.nablPathology) {
          setData(result.nablPathology);
        }
      } catch (err) {
        console.error("Error fetching NABL Pathology:", err);
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
        <DialogHeader
          className={`sticky top-0 bg-gradient-to-r ${unified.headerGradient} text-white p-5 sm:p-6 rounded-t-2xl`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/25 rounded-xl">
                <Beaker className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  NABL Pathology Certification
                </DialogTitle>
                <p className="text-white/90 text-sm mt-1">
                  Accreditation details and certified diagnostic services
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

        <div className="p-6 sm:p-8 bg-white">
          {loading ? (
            <p className="text-gray-500 text-center">Loading NABL details...</p>
          ) : data ? (
            <div className="space-y-6">
              {/* NABL Certificate Info */}
              <Card className={`border ${unified.borderColor} shadow-md rounded-2xl`}>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Certified Laboratory</span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900">
                    {data.labname || "Pathology Laboratory"}
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-3 mt-3 text-sm">
                    <p className="text-gray-700">
                      <strong>Certificate No:</strong>{" "}
                      {data.certificationNumber || "Not Available"}
                    </p>
                    <p className="text-gray-700">
                      <strong>Valid Till:</strong>{" "}
                      {data.validTill || "Not Specified"}
                    </p>
                    <p className="text-gray-700">
                      <strong>Accreditation Level:</strong>{" "}
                      {data.level || "NABL Level 3"}
                    </p>
                    <p className="text-gray-700">
                      <strong>Issued By:</strong>{" "}
                      {data.issuedBy || "NABL, India"}
                    </p>
                  </div>

                  {data.description && (
                    <p className="text-gray-700 mt-3 leading-relaxed">
                      {data.description}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Certified Services */}
              <div>
                <h4 className={`text-lg font-semibold mb-3 ${unified.accentText}`}>
                  Certified Services
                </h4>

                {data.services && data.services.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {data.services.map((s, i) => (
                      <Card
                        key={i}
                        className={`border ${unified.borderColor} hover:shadow-md transition-all rounded-2xl`}
                      >
                        <CardContent className="p-5 space-y-2">
                          <h4 className="font-semibold text-gray-800">{s.title}</h4>
                          <p className="text-gray-600 text-sm">{s.detail}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className={`border ${unified.borderColor} p-6 text-center`}>
                    <CardContent>
                      <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 text-sm">
                        No specific test details available.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <Card className="p-10 text-center text-gray-600 border">
              <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-4" />
              <p>No NABL certification data found for this hospital.</p>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
