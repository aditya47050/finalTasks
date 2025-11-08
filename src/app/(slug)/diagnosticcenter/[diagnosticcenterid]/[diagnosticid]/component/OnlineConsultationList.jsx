"use client";
import React from "react";
import { Video, ShieldCheck, Clock, User, Calendar, X } from "lucide-react";

const OnlineConsultationList = ({ isOpen, onClose, centerName }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-[#3D85EF] text-white py-5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold tracking-wide">
              Online Consultation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="p-8 bg-white space-y-6 text-center">
          {/* Hero Icon */}
          <div className="flex justify-center">
            <div className="p-5 bg-blue-50 border border-blue-200 rounded-full">
              <Video className="w-12 h-12 text-[#3D85EF]" />
            </div>
          </div>

          {/* Title & Description */}
          <h2 className="text-2xl font-bold text-gray-900">
            Consult Specialists Instantly
          </h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto">
            {centerName} offers secure and fast video consultations with certified
            doctors. Connect from your home for expert advice, prescriptions, and reports.
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-center">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold text-gray-900 text-base">
                Quick Access
              </h4>
              <p className="text-gray-600 text-sm mt-1">
                Book and consult within minutes
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-semibold text-gray-900 text-base">
                Secure Platform
              </h4>
              <p className="text-gray-600 text-sm mt-1">
                Private and encrypted video calls
              </p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <User className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <h4 className="font-semibold text-gray-900 text-base">
                Expert Doctors
              </h4>
              <p className="text-gray-600 text-sm mt-1">
                Specialists across all fields
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mt-6"></div>

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
            <div className="text-left sm:text-left">
              <p className="text-sm text-gray-500">Consultation Hours</p>
              <p className="text-lg font-semibold text-[#3D85EF]">
                Monday – Saturday, 9:00 AM – 6:00 PM
              </p>
            </div>
            <button
              onClick={() =>
                alert("Online consultation booking feature coming soon!")
              }
              className="bg-[#3D85EF] hover:bg-blue-700 text-white font-semibold text-base px-6 py-3 rounded-xl shadow-md transition-all hover:scale-[1.03]"
            >
              Book Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineConsultationList;
