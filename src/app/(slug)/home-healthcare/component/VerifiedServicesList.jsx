"use client";
import React from "react";
import { ShieldCheck, FileText, CheckCircle, Award, X } from "lucide-react";

const VerifiedServicesList = ({ onClose, homeHealthcareService }) => {
  const providerName =
    homeHealthcareService?.hospital?.hspInfo?.regname || "Healthcare Provider";
  const regCertificate =
    homeHealthcareService?.hospital?.hspdetails?.hspregcertificate;
  const nabhCert =
    homeHealthcareService?.hospital?.hspdetails?.nabhnablcertificate;
  const verifiedSince =
    homeHealthcareService?.hospital?.createdAt
      ? new Date(homeHealthcareService.hospital.createdAt).getFullYear()
      : "N/A";

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
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold tracking-wide">Verified Provider</h3>
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
          {/* VERIFICATION ICON */}
          <div className="flex justify-center mb-3">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping"></div>
              <div className="relative w-16 h-16 bg-[#3D85EF] rounded-full flex items-center justify-center shadow-md">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* TITLE */}
          <h2 className="text-xl font-bold text-gray-900">Trusted & Verified Healthcare Partner</h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
            {providerName} is officially verified and recognized for providing
            authentic, high-quality home healthcare services meeting NABL/NABH standards.
          </p>

          {/* VERIFICATION DETAILS */}
          <div className="grid grid-cols-2 gap-3 mt-4 text-center">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <FileText className="w-6 h-6 mx-auto mb-1 text-blue-600" />
              <p className="text-xs font-semibold text-gray-900">Registration Year</p>
              <p className="text-sm font-bold text-[#3D85EF]">{verifiedSince}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <Award className="w-6 h-6 mx-auto mb-1 text-green-600" />
              <p className="text-xs font-semibold text-gray-900">Quality Standard</p>
              <p className="text-sm font-bold text-green-600">NABL/NABH Certified</p>
            </div>
          </div>

          {/* CERTIFICATES SECTION */}
          {(regCertificate || nabhCert) && (
            <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                Verification Documents
              </h4>
              <div className="flex flex-wrap justify-center gap-3">
                {regCertificate && (
                  <a
                    href={regCertificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#3D85EF] font-medium hover:underline"
                  >
                    View Registration Certificate
                  </a>
                )}
                {nabhCert && (
                  <a
                    href={nabhCert}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#3D85EF] font-medium hover:underline"
                  >
                    View NABL/NABH Certificate
                  </a>
                )}
              </div>
            </div>
          )}

          {/* STATUS FOOTER */}
          <div className="mt-5 border-t border-gray-200 pt-3 flex items-center justify-between">
            <p className="text-sm text-gray-500">Verification Status</p>
            <p className="text-base font-semibold text-green-600 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Verified
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifiedServicesList;
