"use client";

import { useRouter, useParams } from "next/navigation";
import { diseaseData } from "./diseaseData"; 
import { FaArrowCircleDown } from 'react-icons/fa';

export default function DiseaseDropdown() {
  const router = useRouter();
  const { slug } = useParams();

  // Flatten the diseaseData into an array of { slug, title }
  const allDiseases = Object.keys(diseaseData).flatMap(letter =>
    Object.keys(diseaseData[letter]).map(key => ({
      slug: key,
      title: diseaseData[letter][key].title
    }))
  );

  const handleChange = (e) => {
    const selectedSlug = e.target.value;
    if (selectedSlug) {
      router.push(`/disease/${selectedSlug}`);
    }
  };

  return (
    <>
        <div className="mb-4 relative px-2 w-full md:px-36   lg:hidden mt-4 overflow-hidden">
            <select
                value={slug || ""}
                onChange={handleChange}
                className="
                w-full 
                h-11 
                pl-4 pr-10 
                text-[20px]      rounded-full
                bg-[#5271FF] 
                text-white 
                font-medium
                shadow-md
                border-none
                focus:ring-2 focus:ring-[#3451CC]
                appearance-none
                cursor-pointer
                md:mt-6
                "
            >
                <option value="" className="bg-white text-[#453565] overflow-hidden text-sm">
                Select a disease
                </option>
                {allDiseases.map((disease) => (
                <option
                    key={disease.slug}
                    value={disease.slug}
                    className="bg-white text-[#453565] text-sm"
                >
                    {(disease.slug).replace(/[-_]/g, " ")
                    .split(" ")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </option>
                ))}
            </select>

            {/* Dropdown icon */}
            <span className="absolute xs:right-4 md:right-[9.5rem] md:mt-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <FaArrowCircleDown className="h-8 w-8 text-white" />
            </span>
        </div>
        <div className="mb-4 relative px-[3rem] ml-auto w-[80%]  mt-2  hidden lg:flex justify-end overflow-hidden">
            <select
                value={slug || ""}
                onChange={handleChange}
                className="group flex items-center justify-end bg-white border border-blue-500 text-blue-500 font-semibold px-2 py-1 rounded-xl shadow transition  ml-8"
            >
                <option value="" className="bg-white text-[#453565] overflow-hidden text-sm">
                Select a disease
                </option>
                {allDiseases.map((disease) => (
                <option
                    key={disease.slug}
                    value={disease.slug}
                    className="bg-white text-[#453565] text-sm"
                >
                    {(disease.slug)
                    .replace(/[-_]/g, " ")
                    .split(" ")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </option>
                ))}
            </select>

            {/* Dropdown icon */}
            <span className="absolute right-[3.5rem] top-1/2 -translate-y-1/2 pointer-events-none">
                <FaArrowCircleDown className="h-6 w-6 text-blue-600 hover:text-white" />
            </span>
        </div>
    </>

  );
}
