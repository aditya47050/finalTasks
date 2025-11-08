"use client";
import React from "react";
import { Clock, ShieldCheck, Calendar, Building2 } from "lucide-react";

const ServiceHoursList = ({ open, onOpenChange, diagnosticCenterData }) => {
  if (!open) return null;

  const serviceHours =
    diagnosticCenterData?.hspInfo?.servicehours ||
    "24/7 Diagnostic & Consultation Services";

  const collectionTimings =
    diagnosticCenterData?.hspInfo?.collectioncenterhours ||
    "Mon – Sat: 8:00 AM – 8:00 PM";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white text-gray-900 rounded-2xl w-[92%] max-w-xl shadow-2xl overflow-hidden border border-gray-100"
      >
        {/* HEADER */}
        <div className="bg-[#3D85EF] text-white py-5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold tracking-wide">
              Service Hours
            </h3>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-white/80 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="p-8 bg-white space-y-6">
          {/* Icon Hero */}
          <div className="flex items-center justify-center">
            <div className="p-4 bg-blue-50 rounded-full border border-blue-200">
              <Clock className="w-12 h-12 text-[#3D85EF]" />
            </div>
          </div>

          {/* Text */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {serviceHours}
            </h2>
            <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto">
              Our diagnostic center is open to serve patients with flexible
              hours, ensuring convenience and accessibility for all your testing
              needs.
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="p-5 rounded-lg bg-blue-50 border border-blue-200 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold text-gray-900 text-base">
                Regular Hours
              </h4>
              <p className="text-gray-700 text-sm mt-1">{collectionTimings}</p>
            </div>
            <div className="p-5 rounded-lg bg-green-50 border border-green-200 text-center">
              <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-semibold text-gray-900 text-base">
                Emergency Services
              </h4>
              <p className="text-gray-700 text-sm mt-1">Available 24/7</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mt-8"></div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
            <div>
              <p className="text-sm text-gray-500">Facility</p>
              <p className="text-lg font-semibold text-[#3D85EF]">
                {diagnosticCenterData?.hspInfo?.regname || "Diagnostic Center"}
              </p>
            </div>
            <button
              onClick={() => alert("Appointment booking coming soon!")}
              className="bg-[#3D85EF] hover:bg-blue-700 text-white font-semibold text-base px-6 py-3 rounded-xl shadow-md transition-all hover:scale-[1.03]"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceHoursList;
