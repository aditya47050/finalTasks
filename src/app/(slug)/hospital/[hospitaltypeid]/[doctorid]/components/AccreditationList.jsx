"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Award, CheckCircle, Shield, AlertCircle, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AccreditationList({ hospitalId, onClose }) {
  const [accreditation, setAccreditation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Unified hospital theme (same as other dialogs)
  const unified = {
    headerGradient: "from-[#1E3B90] to-[#3D85EF]",
    accentText: "text-[#1E3B90]",
    buttonGradient: "from-[#1E3B90] to-[#3D85EF]",
    lightBg: "bg-[#EEF3FF]",
    borderColor: "border-[#E1E8FF]",
  };

  useEffect(() => {
    if (!hospitalId) return;

    const fetchAccreditation = async () => {
      try {
        const res = await fetch(`/api/hospital/${hospitalId}/accreditation`);
        const data = await res.json();

        if (data.success && data.accreditation) {
          setAccreditation(data.accreditation);
        } else {
          setAccreditation(null);
        }
      } catch (err) {
        console.error("Error fetching NABH Accreditation data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccreditation();
  }, [hospitalId]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl max-h-[85vh] overflow-y-auto p-0 rounded-2xl shadow-2xl border-none"
        hideCloseButton
      >
        {/* Header */}
        <DialogHeader
          className={`sticky top-0 z-10 bg-gradient-to-r ${unified.headerGradient} text-white p-5 sm:p-6 rounded-t-2xl shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/25 rounded-xl backdrop-blur-sm shadow-inner">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white tracking-wide">
                  NABH Accreditation
                </DialogTitle>
                <p className="text-white/90 text-sm mt-1">
                  Recognized standards for hospital excellence and safety
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
              Loading NABH Accreditation details...
            </div>
          ) : accreditation ? (
            <Card
              className={`border ${unified.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden bg-white`}
            >
              <div className={`h-2 bg-gradient-to-r ${unified.buttonGradient}`} />
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-3 ${unified.lightBg} rounded-xl`}>
                    <Shield className={`w-7 h-7 ${unified.accentText}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {accreditation.accreditor || "NABH"}{" "}
                      {accreditation.level && `(${accreditation.level})`}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {accreditation.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <p className="font-semibold">Certification No:</p>
                    <p>{accreditation.certificationNumber}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Accredited By:</p>
                    <p>{accreditation.auditAgency || "QualityAudit Pvt Ltd"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Valid From:</p>
                    <p>{accreditation.validFrom}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Valid Till:</p>
                    <p>{accreditation.validTill}</p>
                  </div>
                </div>

                {accreditation.departmentsCovered && (
                  <div className="mt-6">
                    <p className="font-semibold text-gray-800 mb-2">
                      Departments Covered:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {accreditation.departmentsCovered.map((dept, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${unified.lightBg} ${unified.accentText} border ${unified.borderColor}`}
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`mt-8 p-5 ${unified.lightBg} ${unified.borderColor} border rounded-xl flex items-start gap-3 hover:opacity-95 transition-all`}
                >
                  <div className={`p-2 ${unified.lightBg} rounded-lg`}>
                    <CheckCircle className={`w-5 h-5 ${unified.accentText}`} />
                  </div>
                  <div className="text-sm text-gray-800 leading-relaxed">
                    <p className="font-semibold mb-1">Accredited Status:</p>
                    <p>
                      {accreditation.certified
                        ? "✅ This hospital is currently NABH accredited."
                        : "❌ Not accredited at the moment."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-gray-200 shadow-lg rounded-2xl bg-white text-center hover:shadow-xl transition-all duration-300">
              <CardContent className="p-10 sm:p-14">
                <div className="flex flex-col items-center justify-center space-y-5">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <Award className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    No Accreditation Data Available
                  </h3>
                  <p className="text-gray-600 max-w-md leading-relaxed">
                    NABH accreditation information is not currently available
                    for this hospital. Please contact the hospital for more
                    details.
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
                        You can reach out to the hospital administration for
                        accreditation certificate copies or verification
                        details.
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
