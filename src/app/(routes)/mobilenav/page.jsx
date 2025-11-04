"use client";
import { db } from "@/lib/db";
import Link from "next/link";
import React, { useState } from "react";

const MobileNav = ({ categories }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const navlinkss = [
    {
      title: "Expert Doctor's",
      link: "/doctors",
      submenu: Array.isArray(categories.doctorcategory)
        ? categories.doctorcategory.map((category) => ({
            title: category.title,
            link: `/doctor/${category.id}`,
          }))
        : [],
    },
    {
      title: "Hospitals",
      link: "/hospitals",
      submenu:
        categories.hspcategory && Array.isArray(categories.hspcategory)
          ? categories.hspcategory.map((category) => ({
              title: category.title,
              link: `/hospital/${category.id}`,
            }))
          : [],
    },
    {
      title: "Diagnostic Center",
      link: "/diagnosticcenters",
      submenu:
        categories.diagnosticcentercategory && Array.isArray(categories.diagnosticcentercategory)
          ? categories.diagnosticcentercategory.map((category) => ({
              title: category.title,
              link: `/diagnosticcenter/${category.id}`,
            }))
          : [],
    },
    {
      title: "Surgery Packages",
      link: "/surgery-packages",
      submenu: [
        { title: "All Surgery Packages", link: "/surgery-packages/all" },
        { title: "Treatment Packages", link: "/treatment-packages" },
      ],
    },
    {
      title: "Home Healthcare",
      link: "/home-healthcare",
      submenu: [
        { title: "ICU at Home", link: "/home-healthcare/icu-at-home" },
        { title: "General Nursing", link: "/home-healthcare/general-nursing" },
        { title: "Neurological Care & Rehabilitation", link: "/home-healthcare/neurological-care" },
        { title: "On Bed Cancer", link: "/home-healthcare/on-bed-cancer" },
        { title: "Transplant & Post-Op Care", link: "/home-healthcare/transplant-post-op-care" },
        { title: "Pregnancy Care", link: "/home-healthcare/pregnancy-care" },
        { title: "Mother & Child Care", link: "/home-healthcare/mother-child-care" },
        { title: "Palliative Care", link: "/home-healthcare/palliative-care" },
        { title: "Orthopaedic Care", link: "/home-healthcare/orthopaedic-care" },
        { title: "Stroke Care", link: "/home-healthcare/stroke-care" },
        { title: "Cardiac Care", link: "/home-healthcare/cardiac-care" },
        { title: "Dialysis Care", link: "/home-healthcare/dialysis-care" },
        { title: "Old Age Health Care", link: "/home-healthcare/old-age-health-care" },
        { title: "COPD Care", link: "/home-healthcare/copd-care" },
        { title: "Bed Sores Care", link: "/home-healthcare/bed-sores-care" },
      ],
    },
    {
      title: "Pathology",
      link: "/pathology",
      submenu: [
        { title: "Lab Tests", link: "/pathology/category?letter=A" },
        { title: "Wellness Packages", link: "/pathology/wellness-packages" },
        { title: "NABL Accredited Lab", link: "/pathology/nabl-accredited" },
        { title: "Blood Bank", link: "/pathology/blood-bank" },
      ],
    },
    {
      title: "Health Insurance",
      link: "/health-insurance",
      submenu: [
        { title: "Govt Health Insurance", link: "/health-insurance/govt" },
        { title: "Private Health Insurance", link: "/health-insurance/private" },
        { title: "TPA Health Insurance", link: "/health-insurance/tpa" },
        { title: "TPA Administration Services", link: "/health-insurance/tpa-admin" },
      ],
    },
    {
      title: "Corporate Health",
      link: "/corporate-health",
      submenu: [
        { title: "Medical Personnel Manning", link: "/corporate-health/medical-personnel" },
        { title: "Companies Insurance", link: "/corporate-health/companies-insurance" },
        { title: "CSR Services", link: "/corporate-health/csr-services" },
        { title: "Health Talks & Seminars", link: "/corporate-health/health-talks" },
        { title: "Occupation Health Center", link: "/corporate-health/occupation-health" },
        { title: "Corporate Health Check-ups", link: "/corporate-health/checkups" },
        { title: "24/7 Ambulance Services", link: "/corporate-health/ambulance" },
        { title: "Equipped Mobile Medical Unit", link: "/corporate-health/mobile-medical-unit" },
      ],
    },
    {
      title: "Pharmacy",
      link: "/pharmacies",
      submenu: categories.pharmacies.map((p) => ({
        title: p.regname || p.email || "Pharmacy",
        link: `/pharmacy/${p.id}`,
      })),
    },
  ];

  const toggleMenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  const handleSubmenuClick = () => {
    // Close the dropdown immediately when any submenu item is clicked
    setActiveMenu(null);
  };

  return (
    <div className="w-full bg-white shadow-lg border-b border-gray-200 sticky top-0 z-[10000]">
      {/* Mobile Navigation */}
      <div className="px-3 py-2">
        {/* Mobile-first horizontal scrollable navigation */}
        <div className="flex overflow-x-auto gap-2 pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {navlinkss.map((item, index) => (
            <div key={index} className="relative flex-shrink-0">
              {item.submenu && item.submenu.length > 0 ? (
                <button
                  onClick={() => toggleMenu(index)}
                  className={`px-3 py-2 rounded-full font-medium text-xs sm:text-sm transition-all duration-200 whitespace-nowrap active:scale-95 min-w-[100px] sm:min-w-[120px] ${
                    activeMenu === index
                      ? 'bg-blue-700 text-white shadow-lg transform scale-105'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <span className="truncate">{item.title}</span>
                  <span className={`ml-1 inline-block transition-transform duration-200 text-xs ${
                    activeMenu === index ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </span>
                </button>
              ) : (
                <Link
                  href={item.link}
                  className="flex-shrink-0 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium text-xs sm:text-sm transition-all duration-200 whitespace-nowrap active:scale-95 min-w-[100px] sm:min-w-[120px] text-center"
                >
                  <span className="truncate">{item.title}</span>
                </Link>
              )}

              {/* Mobile-optimized submenu dropdown */}
              {activeMenu === index && item.submenu && item.submenu.length > 0 && (
                <div className="fixed top-16 left-2 right-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-[9999] max-h-[75vh] overflow-y-auto md:absolute md:top-full md:left-0 md:right-auto md:mt-2 md:min-w-[180px] md:max-h-[300px]">
                  <div className="p-3">
                    <div className="text-xs text-gray-500 mb-3 px-2 font-medium border-b border-gray-100 pb-2">Choose a service:</div>
                    {item.submenu.map((subitem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subitem.link}
                        className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-150 text-sm active:bg-blue-100 rounded-lg mb-1 last:mb-0 border border-gray-100 hover:border-blue-200"
                        onClick={handleSubmenuClick}
                      >
                        <span className="truncate">{subitem.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Mobile scroll indicator */}
        <div className="text-center mt-1">
          <div className="inline-flex items-center gap-1 text-xs text-gray-500">
            <span>←</span>
            <span>Scroll to see more</span>
            <span>→</span>
          </div>
        </div>
      </div>

      {/* Mobile overlay to close menu when clicking outside */}
      {activeMenu !== null && (
        <div
          className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-sm"
          onClick={() => setActiveMenu(null)}
        >
          <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
            <span className="text-gray-600 text-sm">Tap outside to close</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Server component wrapper
const MobileNavWrapper = async () => {
  const hspcategory = await db.HospitalsCategory.findMany({});
  const doctorcategory = await db.ExpertDoctorsCategory.findMany({});
  const diagnosticcentercategory = await db.DiagnosticCenterCategory.findMany({});
  const pharmacies = await db.pharmacy.findMany({
    select: { id: true, regname: true, email: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <MobileNav
      categories={{
        hspcategory,
        doctorcategory,
        diagnosticcentercategory,
        pharmacies,
      }}
    />
  );
};

export default MobileNavWrapper;
