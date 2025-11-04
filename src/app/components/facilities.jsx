"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { ArrowBigUpDash } from "lucide-react";
  

const Facilities = () => {
  const [buttonStates, setButtonStates] = useState(null);
  const handleClick = (buttonId) => {
    setButtonStates(buttonId);
  };
  const navlinks = [
    {
      title: "Expert Doctors",
      link: "/",
      submenu: [{ title: "General Physician ", link: "#" },
	  { title: "Emergency Medicine", link: "#" },
	  { title: "Internal Medicine", link: "/f1" },
	  { title: "Occupation Medicine", link: "/f1" },
	  { title: "Chest Physician", link: "/f1" },
	  { title: "Pediatricians", link: "/f1" },
	  { title: "Otorhinolaryngologist", link: "/f1" },
	  { title: "Obstetricians/Oynecolgists ", link: "/f1" },
	  { title: "IVF Consultant", link: "/f1" },
	  { title: "Oral & Maxillofacial surgeon", link: "/f1" },
	  { title: "Otolaryngologists/ENT", link: "/f1" },
	  { title: "Vascular Surgeon", link: "/f1" },
	  { title: "Ophthalmologists/Eye Specialist", link: "/f1" },
	  { title: "Cardiologists", link: "/f1" },
	  { title: "Nephrologists", link: "/f1" },
	  { title: "General Surgeon", link: "/f1" },
	  { title: "Proctologist", link: "/f1" },
	  { title: "Orthopedics", link: "/f1" },
	  { title: "Joint Replacement Surgeon", link: "/f1" },
	  { title: "Physiotherapist", link: "/f1" },
	  { title: "Oncologists/Cancer", link: "/f1" },
	  { title: "Radiation Oncologist", link: "/f1" },
	  { title: "Nuclear Medicine", link: "/f1" },
	  { title: "Colorectal Surgeon", link: "/f1" },
	  { title: "Radiologists", link: "/f1" },
	  { title: "Urologists", link: "/f1" },
	  { title: "Dermatologists", link: "/f1" },
	  { title: "Plastic Surgeon", link: "/f1" },
	  { title: "Pathologist", link: "/f1" },
	  { title: "Neurologists", link: "/f1" },
	  { title: "Psychiatrists", link: "/f1" },
	  { title: "Dentist", link: "/f1" },
	  { title: "Dietitian", link: "/f1" },
	  { title: "Sexologist", link: "/f1" },
	  { title: "Gastroenterologists", link: "/f1" },
	  { title: "Geriatric Medicine", link: "/f1" },
	  { title: "Allergists", link: "/f1" },
	  { title: "Endocrinologists", link: "/f1" },
	  { title: "Cardiac Surgeon", link: "/f1" },
	  { title: "Rheumatologists", link: "/f1" },
	  { title: "Pulmonologists", link: "/f1" },
	  { title: "Anesthesiologists", link: "/f1" },
	  { title: "Ayurvedic", link: "/f1" },
	  { title: "Homeopathy", link: "/f1" },
	  { title: "Chiropractor", link: "/f1" },
	  ],
    },
    {
      title: " Hospitals ",
      link: "#",
      submenu: [{ title: "Goverment Hospitals", link: "#" },
	  { title: "Private Hospitals", link: "#" },
	  { title: "NABH Hospitals", link: "#" },
	  { title: "MJPJAY Hospitals", link: "#" },
	  { title: "ESIC Hospitals", link: "#" },
	  { title: "CGHS Hospitals", link: "#" },
	  { title: "Truma Care Hospitals", link: "#" },
	  { title: "Cardiac Care Hospitals", link: "#" },
	  { title: "Mother & Child Hospitals", link: "#" },
	  { title: "Speciality Hospitals", link: "#" },
	  { title: "Multispeciality Hospitals", link: "#" },
	  { title: "Super-Speciality Hospitals", link: "#" },
	  { title: "Cancer Hospitals", link: "#" },
	  { title: "Eye Hospitals", link: "#" },
	  { title: "IVF Centers", link: "#" },
	  { title: "Dialysis Centers", link: "#" },
	  { title: "Dental Clinics", link: "#" },
	  { title: "Small Clinics", link: "#" },
	  ],
    },
    {
      title: " Diagnostic Center ",
      link: "/",
      submenu: [{ title: "ECG", link: "#" },
	  { title: "X-Ray Center", link: "#" },
	  { title: "CT Scan Center", link: "#" },
	  { title: "MRI Center", link: "#" },
	  { title: "Sonography Center", link: "#" },
	  { title: "Mammography Center", link: "#" },
	  { title: "Dental X-Ray Center", link: "#" },
	  { title: "Pet Scan", link: "#" },
	  { title: "Fluoroscopy", link: "#" },
	  { title: "Inerventional Radiology", link: "#" },
	  { title: "Nuclear Medicine", link: "#" },
	  ],
    },
	{
      title: " Surgery Packages ",
      link: "/",
      submenu: [{ title: "Surgery Packages", link: "#" },
	  { title: "Treatment Packages", link: "#" },
	  ],
    },
	{
      title: " Home Healthcare",
      link: "/",
      submenu: [{ title: "ICU at Home", link: "#" },
	  { title: "General Nursing", link: "#" },
	  { title: "Neurological Care & Rehabilitation", link: "#" },
	  { title: "Cancer Care on Bed", link: "#" },
	  { title: "Transplant & Post-Op Care", link: "#" },
	  { title: "COPD Care", link: "#" },
	  { title: "Cardiac Care", link: "#" },
	  { title: "Palliative Care", link: "#" },
	  { title: "Orthopaedic Care", link: "#" },
	  { title: "Stroke Care", link: "#" },
	  { title: "Bed Sores Care", link: "#" },
	  ],
    },
	{
      title: " Pathology",
      link: "/",
      submenu: [{ title: "Lab Tests", link: "#" },
	  { title: "Wellness Packages", link: "#" },
	  { title: "NABL Accredited Lab", link: "#" },
	  { title: "Blood Bank", link: "#" },
	  
	  ],
    },
	{
      title: " Health Insurance",
      link: "/",
      submenu: [{ title: "Govt Health Insurance", link: "#" },
	  { title: "Private Health Insurance", link: "#" },
	  { title: "TPA Health Insurance", link: "#" },
	  { title: "TPA Administration Services", link: "#" },
	  
	  ],
    },
	{
      title: " Corporate Health",
      link: "/",
      submenu: [{ title: "Medical Personanel Manning", link: "#" },
	  { title: "Companies Insurance", link: "#" },
	  { title: "CSR Services", link: "#" },
	  { title: "Health Talks & Seminars", link: "#" },
	  { title: "Occupation Health Center", link: "#" },
	  { title: "Corporate Health Check-ups", link: "#" },
	  { title: "24/7 Ambulance Services", link: "#" },
	  { title: "Equipped Mobile Medical Unit", link: "#" },
	  ],
    },
	{
      title: " Pharmacy",
      link: "/",
      submenu: [{ title: "Pharmacy1", link: "#" },
	  { title: "Pharmacy2", link: "#" },
	  
	  ],
    },
  ];


  const handleButtonClick = (buttonId) => {
    setActiveButton((prevActiveButton) =>
      prevActiveButton === buttonId ? null : buttonId
    );
  };

  return (
    <div className="mx-auto container">
    <div className="hidden space-x-6 rtl:space-x-reverse md:order-2 md:flex md:space-x-4">
      {navlinks.map((nav, index) => {
        // Split the submenu items into three columns
        const firstColumnItems = nav.submenu.slice(0, 8); // First 8 items
        const secondColumnItems = nav.submenu.slice(8, 16); // Next 8 items
        const thirdColumnItems = nav.submenu.slice(16); // Remaining items
  
        return (
          <DropdownMenu key={nav.title}>
            <DropdownMenuTrigger asChild>
              <div className="relative">
                <Button
                  className={cn("border border-white p-1 rounded-full")}
                  style={{ backgroundColor: buttonStates === index ? '#B1C9EB' : '' }}
                  onClick={() => handleClick(index)}
                >
                  <span className="text-white font-bold px-2">
                    {nav.title}
                  </span>
                </Button>
                <DropdownMenuContent
                  className="relative mt-1 w-full bg-[#E9E8E9] grid grid-cols-3 gap-4 p-4"
                  style={{ minWidth: '200px' }}
                >
                  <span className="text-center col-span-3">
                    <ArrowBigUpDash color="#243561" />
                  </span>
  
                  {/* First Column */}
                  <div className="col-start-1">
                    {firstColumnItems.map((item) => (
                      <DropdownMenuItem key={item.link}>
                        <Link href={item.link}>
                          <span className="text-blue-950 font-bold">
                            {item.title}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
  
                  {/* Second Column */}
                  {secondColumnItems.length > 0 && (
                    <div className="col-start-2">
                      {secondColumnItems.map((item) => (
                        <DropdownMenuItem key={item.link}>
                          <Link href={item.link}>
                            <span className="text-blue-950 font-bold">
                              {item.title}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  )}
  
                  {/* Third Column */}
                  {thirdColumnItems.length > 0 && (
                    <div className="col-start-3">
                      {thirdColumnItems.map((item) => (
                        <DropdownMenuItem key={item.link}>
                          <Link href={item.link}>
                            <span className="text-blue-950 font-bold">
                              {item.title}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  )}
  
                  <DropdownMenuSeparator className="col-span-3" />
                </DropdownMenuContent>
              </div>
            </DropdownMenuTrigger>
          </DropdownMenu>
        );
      })}
    </div>
  </div>
  
  
    
  );
};

export default Facilities;
