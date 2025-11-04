"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DoctorCard({ doctor, onViewMore }) {
  return (
    <Card className="h-full md:min-h-[350px] xs:min-h-[200px] md:w-[200px] xs:w-[160px]  flex flex-col overflow-hidden border-0 shadow-lg bg-white rounded-3xl">
      <CardContent className="p-0 flex w-full flex-col flex-grow items-center text-center">

        {/* Top Section - Placeholder Image */}
        <div className="w-full md:h-32 xs:h-28 bg-gradient-to-br from-[#5271FF] to-[#8b5cf6] flex items-center justify-center rounded-t-3xl">
          <p className="text-white text-sm italic">Image Placeholder</p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col justify-evenly xs:gap-0 space-y-1 md:gap-2 flex-grow xs:p-2 md:p-4 pt-3 text-center">

          {/* Rating */}
          <div className="flex justify-center items-center gap-1 text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < doctor.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">
              {doctor.reviews} Reviews
            </span>
          </div>

          {/* Doctor Info */}
          <h3 className="text-[#FF6B35] font-bold text-[14px] line-clamp-2">{doctor.name}</h3>
          <p className="text-[12px] text-gray-500">Specialty: {doctor.specialty}</p>
          <p className="text-[12px] text-gray-500">Experience: {doctor.experience}</p>
          <p className="text-[12px] text-gray-500">(Contact No)</p>

          {/* Action Buttons */}
          <div className="flex justify-center gap-2 w-full mt-auto">
            <Button className="bg-red-500 hover:bg-red-600 text-white xs:text-[10px] md:text-xs px-3 py-1 rounded-full xs:h-6">
              Call Us
            </Button>
            <Button
              onClick={() => onViewMore(doctor.id)}
              className="bg-[#4A90E2] hover:bg-[#357ABD] text-white xs:text-[10px] md:text-xs px-3 py-1 rounded-full xs:h-6"
            >
              View More
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
