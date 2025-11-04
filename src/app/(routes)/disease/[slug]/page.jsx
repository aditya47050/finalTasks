'use client';

import { Suspense } from "react";
import DieseaseDetailsClient from "./components/DieseaseDetailsClient";
import DiseaseSidebar from './../components/DiseaseSidebar';
import DiseaseDropdown from "../components/DiseaseDropdown";
import { useParams } from "next/navigation";
import { Diseasesclient } from "../../diseases/components/diseasesclient";
export default function DiseaseDetailPage() {
  const { slug } = useParams();
  return (
    <>
      <div className="lg:container mt-4 lg:mt-4  mx-auto lg:pl-[50px] lg:pr-[32px] xl:px-[60px] ">
        <Diseasesclient />
      {/* <h1 className="text-2xl sm:text-3xl text-center font-bold text-[#5271FF] mb-2">
        {(slug || "")
          .replace(/[-_]/g, " ")
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </h1> */}
      </div>
      <div className="lg:container flex flex-col lg:flex-row lg:gap-6 mt-4 lg:mt-4 mx-auto lg:pl-[50px] lg:pr-[32px] xl:px-[60px] ">
        <div className="hidden lg:block w-full lg:w-1/4">
          <DiseaseSidebar />
        </div>

        {/* Main disease content on the right */}
        <div className="w-full lg:w-3/4 max-[1100px]:overflow-hidden">
          <Suspense fallback={<div>Loading Disease Details...</div>}>
            <DieseaseDetailsClient />
          </Suspense>
        </div>
      </div>
    
    </>
  );
}
