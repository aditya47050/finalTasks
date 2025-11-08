"use client";
import React from "react";
import { Phone, AlertTriangle, Ambulance, Clock, X } from "lucide-react";

const EmergencyServicesList = ({ onClose, homeHealthcareService }) => {
  const centerName =
    homeHealthcareService?.hospital?.hspInfo?.regname || "Our Healthcare Center";
  const contactNumber =
    homeHealthcareService?.hospital?.mobile ||
    homeHealthcareService?.hospital?.hspcontact?.receptioncontact1 ||
    "Not Available";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
      >
        {/* HEADER */}
        <div className="bg-[#3D85EF] text-white py-4 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold tracking-wide">
              Emergency Services
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6 text-center">
          {/* EMERGENCY ICON ANIMATION */}
          <div className="flex justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-ping"></div>
              <div className="relative w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                <Ambulance className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* TITLE */}
          <h2 className="text-xl font-bold text-gray-900">24/7 Emergency Support</h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
            {centerName} provides round-the-clock emergency response and
            ambulance assistance to ensure immediate medical care at any time of
            day or night.
          </p>

          {/* HIGHLIGHTS */}
          <div className="grid grid-cols-3 gap-3 mt-4 text-center">
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <Ambulance className="w-6 h-6 mx-auto mb-1 text-red-600" />
              <p className="text-xs font-semibold text-gray-900">Ambulance</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <Clock className="w-6 h-6 mx-auto mb-1 text-yellow-600" />
              <p className="text-xs font-semibold text-gray-900">24/7 Active</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <Phone className="w-6 h-6 mx-auto mb-1 text-green-600" />
              <p className="text-xs font-semibold text-gray-900">Call Support</p>
            </div>
          </div>

          {/* CONTACT */}
          <div className="mt-5 border-t border-gray-200 pt-3 text-center">
            <p className="text-sm text-gray-500 mb-1">Emergency Helpline</p>
            <a
              href={`tel:${contactNumber}`}
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-5 rounded-lg transition-all shadow-md"
            >
              <Phone className="w-5 h-5" />
              {contactNumber !== "Not Available" ? contactNumber : "Call Now"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyServicesList;
