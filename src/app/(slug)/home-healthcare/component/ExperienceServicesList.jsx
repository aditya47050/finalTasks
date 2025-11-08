"use client";
import React from "react";
import { Award, Users, ShieldCheck, Clock, X } from "lucide-react";

const ExperienceServicesList = ({ onClose, homeHealthcareService }) => {
  const experienceYears =
    homeHealthcareService?.hospital?.hspInfo?.experience || "8+";

  const centerName =
    homeHealthcareService?.hospital?.hspInfo?.regname ||
    "Our Healthcare Center";

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
              <Award className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold tracking-wide">Experience</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4 text-center">
          {/* Hero Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-full">
              <Award className="w-10 h-10 text-[#3D85EF]" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900">
            {experienceYears}+ Years of Trusted Home Healthcare
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
            {centerName} has been providing exceptional home healthcare
            solutions with a dedicated team of experienced professionals
            ensuring safe, reliable, and compassionate medical care.
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-3 gap-3 mt-4 text-center">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Users className="w-6 h-6 mx-auto mb-1 text-blue-600" />
              <p className="text-xs font-semibold text-gray-900">
                Skilled Staff
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <ShieldCheck className="w-6 h-6 mx-auto mb-1 text-green-600" />
              <p className="text-xs font-semibold text-gray-900">
                Quality Service
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <Clock className="w-6 h-6 mx-auto mb-1 text-yellow-600" />
              <p className="text-xs font-semibold text-gray-900">
                On-Time Care
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-3">
            <p className="text-sm text-gray-500">Years of Expertise</p>
            <p className="text-base font-semibold text-[#3D85EF]">
              {experienceYears}+ Years
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceServicesList;
