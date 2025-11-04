"use client";
import Link from 'next/link';
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export const INSURANCE_CATEGORIES = [
  { value: "government", label: "Government Health Insurance" },
  { value: "private", label: "Private Health Insurance" },
  { value: "tpa", label: "TPA Health Insurance" },
  { value: "tpa_admin", label: "TPA Administration Services" },
];

const HealthInsuranceCategoryMain = ({ insurances, category }) => {
  // Find label from category value
  const categoryLabel = INSURANCE_CATEGORIES.find(c => c.value === category || c.value === insurances.category)?.label || "Unknown Category";

  return (
    <div className="font-poppins my-4 md:container xl:px-16">
      <h1 className="md:text-[25px] text-[20px] text-center text-[#5271FF] font-extrabold">
        Health Insurance
      </h1>
      <p className="md:text-[20px] text-lg text-center text-[#5271FF] font-extrabold">
        {categoryLabel}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-4">
        {insurances.map((test) => (
          <Link key={test.id} href={`/health-insurance/${test.id}?category=${test.category}`}>
            <Card className="border-none">
              <CardContent className="w-full h-32 p-6 flex flex-col justify-center items-center bg-[#D9D9D9] rounded-[15px] shadow-md hover:shadow-lg text-center">
                <p className="font-semibold text-[14px] lg:text-[16px] text-blue-500">
                  {test.companyName}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HealthInsuranceCategoryMain;
