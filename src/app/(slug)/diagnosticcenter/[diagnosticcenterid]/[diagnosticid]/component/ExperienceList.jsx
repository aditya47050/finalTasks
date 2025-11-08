"use client";
import React from "react";
import { Award, Users, Briefcase, Clock, ShieldCheck, X } from "lucide-react";

const ExperienceList = ({ isOpen, onClose, centerName, experienceData }) => {
  if (!isOpen) return null;

  const experienceYears = experienceData?.years || "9+ Years";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-[#3D85EF] text-white py-4 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-white/20 rounded-lg">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold tracking-wide">
              Experience & Expertise
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
        <div className="p-6 bg-white space-y-5 text-center">
          {/* Hero Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-full">
              <Award className="w-10 h-10 text-[#3D85EF]" />
            </div>
          </div>

          {/* Title & Summary */}
          <h2 className="text-xl font-bold text-gray-900">
            {experienceYears} of Diagnostic Excellence
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
            {centerName} has consistently delivered trusted diagnostic services
            backed by years of professional experience and high-quality standards.
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-3 gap-3 text-center mt-4">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Users className="w-6 h-6 mx-auto mb-1 text-blue-600" />
              <p className="text-xs font-semibold text-gray-900">
                Skilled Team
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <ShieldCheck className="w-6 h-6 mx-auto mb-1 text-green-600" />
              <p className="text-xs font-semibold text-gray-900">
                Quality Focused
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <Clock className="w-6 h-6 mx-auto mb-1 text-yellow-600" />
              <p className="text-xs font-semibold text-gray-900">
                On-Time Results
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-xs text-gray-500">Years of Operation</p>
              <p className="text-base font-semibold text-[#3D85EF]">
                {experienceYears}
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-[#3D85EF] hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2 rounded-lg shadow-sm transition-all hover:scale-[1.03]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceList;
