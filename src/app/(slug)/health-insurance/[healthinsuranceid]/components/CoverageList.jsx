"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { X, Shield, Info, CheckCircle, Building2 } from "lucide-react";

const CoverageList = ({ onClose, insuranceService, serviceName }) => {
  const [coverageData, setCoverageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoverage = async () => {
      try {
        const res = await fetch(`/api/health-insurance/coverage?insuranceId=${insuranceService?.id}`);
        const data = await res.json();
        if (data.success) setCoverageData(data.data);
      } catch (err) {
        console.error("❌ Error fetching coverage data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (insuranceService?.id) fetchCoverage();
  }, [insuranceService?.id]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 text-center shadow-lg">
          <p className="text-blue-600 font-semibold">Loading Coverage Details...</p>
        </div>
      </div>
    );
  }

  if (!coverageData) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 text-center shadow-lg">
          <p className="text-gray-600 font-semibold">No coverage data found.</p>
          <button
            onClick={onClose}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 sm:px-4">
      <Card className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden relative animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 sm:p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <Shield className="w-10 h-10 mx-auto mb-2 text-white/90" />
          <h2 className="text-2xl font-bold">{coverageData.companyName || "Insurance Coverage"}</h2>
          <p className="text-blue-100 text-sm mt-1">
            {coverageData.category ? coverageData.category.toUpperCase() + " POLICY" : "Health Insurance Plan"}
          </p>
        </div>

        {/* Content */}
        <CardContent className="p-5 sm:p-6 overflow-y-auto max-h-[75vh] space-y-4">
          <div className="text-center mb-2">
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              {coverageData.description ||
                "Explore all coverage benefits offered under this policy."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {coverageData.coverageDetails?.map((item, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-all flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-gray-800 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
            <Info className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-900 text-sm">
                Need help or have queries?
              </p>
              <p className="text-gray-700 text-sm">
                Call: <span className="font-semibold">{coverageData.contactNumber || "1800-425-2255"}</span> |
                Email: <span className="font-semibold">{coverageData.email || "support@starhealth.com"}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoverageList;
