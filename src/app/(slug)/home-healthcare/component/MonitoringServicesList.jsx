"use client";
import React from "react";
import { Activity, ShieldCheck, Clock } from "lucide-react";

const MonitoringServicesList = ({ onClose, homeHealthcareService }) => {
  const centerName =
    homeHealthcareService?.hospital?.hspInfo?.regname || "Our Healthcare Center";

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
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold tracking-wide">
              Live Patient Monitoring
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
        <div className="p-6 space-y-5 text-center">
          {/* GLOWING ECG LINE ANIMATION */}
          <div className="relative w-full h-16 flex items-center justify-center overflow-hidden">
            {/* Base line */}
            <div className="w-[90%] h-[2px] bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 relative overflow-hidden">
              {/* Glow overlay */}
              <div className="absolute inset-0 bg-blue-400/60 blur-sm animate-glowPulse"></div>

              {/* Moving bright segment */}
              <div className="absolute top-0 left-0 w-full h-full animate-ecgLine bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>

            {/* Moving Pulse Spike */}
            <div className="absolute h-[2px] w-[80%] flex items-center justify-center">
              <div className="w-10 h-[2px] relative animate-pulseWave">
                <div className="absolute left-0 top-0 w-[10px] h-[2px] bg-blue-500 rotate-[25deg] origin-left blur-[1px]"></div>
                <div className="absolute left-[8px] top-0 w-[10px] h-[2px] bg-blue-500 -rotate-[25deg] origin-left blur-[1px]"></div>
                <div className="absolute left-[15px] top-0 w-[15px] h-[2px] bg-blue-500 rotate-[20deg] origin-left blur-[1px]"></div>
              </div>
            </div>
          </div>

          {/* TITLE */}
          <h2 className="text-xl font-bold text-gray-900">
            Real-Time Health Monitoring
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
            {centerName} continuously tracks patient vitals and system data
            through live monitoring — ensuring timely alerts, secure insights,
            and precision care for every patient.
          </p>

          {/* HIGHLIGHTS */}
          <div className="grid grid-cols-3 gap-3 mt-4 text-center">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Activity className="w-6 h-6 mx-auto mb-1 text-blue-600" />
              <p className="text-xs font-semibold text-gray-900">Live Data</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <ShieldCheck className="w-6 h-6 mx-auto mb-1 text-green-600" />
              <p className="text-xs font-semibold text-gray-900">Secure Logs</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <Clock className="w-6 h-6 mx-auto mb-1 text-yellow-600" />
              <p className="text-xs font-semibold text-gray-900">24/7 Alerts</p>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-3">
            <p className="text-sm text-gray-500">Monitoring Status</p>
            <p className="text-base font-semibold text-[#3D85EF] flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS for ECG + Glow Animation */}
      <style jsx>{`
        @keyframes ecgLine {
          0% {
            transform: translateX(-100%);
            opacity: 0.7;
          }
          50% {
            transform: translateX(0%);
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0.7;
          }
        }
        .animate-ecgLine {
          animation: ecgLine 3s linear infinite;
        }

        @keyframes pulseWave {
          0% {
            transform: translateX(-150%);
            opacity: 0;
          }
          25% {
            transform: translateX(0%);
            opacity: 1;
          }
          100% {
            transform: translateX(150%);
            opacity: 0;
          }
        }
        .animate-pulseWave {
          animation: pulseWave 2.8s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-glowPulse {
          animation: glowPulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MonitoringServicesList;
