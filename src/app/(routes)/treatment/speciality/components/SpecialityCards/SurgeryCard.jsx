import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FaSyringe } from "react-icons/fa";
export default function SurgeryCard({ name, price, location, onViewMore, type = "surgery" }) {
  const isSurgery = type.toLowerCase() === "surgery";
  return (
    <Card className="h-full md:min-h-[350px] xs:min-h-[200px] md:w-[200px] xs:w-[160px]  flex flex-col overflow-hidden border-0 shadow-lg bg-white rounded-3xl z-0">
  <CardContent className="p-0 flex flex-col flex-grow z-0 items-center text-center ">
    <div className="relative w-full  overflow-hidden rounded-t-3xl z-0 pb-3">
    
      <div className="w-full h-32 sm:h-28 bg-gradient-to-br from-[#5271FF] to-[#8b5cf6] flex items-center justify-center rounded-t-3xl z-0" >
        <FaSyringe className="text-white" size={28}/>
      </div>

      {/* Compare Button repositioned */}
      <button className="absolute bottom-0 left-1/2 transform -translate-x-1/2 xs:text-[10px] md:text-xs bg-blue-500 text-white py-1 px-3 rounded-full shadow-md z-10"
      onClick={onViewMore}
      >
        Compare
      </button>
    </div>
    {/* Content Area */}
    <div className="flex flex-col xs:justify-evenly md:justify-start xs:space-y-1  md:gap-2 xs:p-2 md:p-4 text-center flex-grow w-full z-0">

        {/* Title */}
        <h3 className="text-[14px] font-bold text-[#FF6B35] mb-2">
          {isSurgery ? "Surgery Name" : "Treatment Name"}
        </h3>

        {/* Price */}
        <p className="text-[11px] text-[#5271FF] font-medium leading-snug">
          Starting {isSurgery ? "Surgery" : "Treatment"} Amount
          <br />
          <span className="text-black">{price}</span>
        </p>

        {/* Location */}
        <p className="text-[10px] text-gray-500 mt-1">{location}</p>

        {/* Buttons */}
        <div className="mt-4 flex justify-center gap-3">
          <button className="bg-red-500 hover:bg-red-600 text-white xs:text-[10px] md:text-xs py-1 px-4 rounded-full">
            Call Us
          </button>
          <button

            className="bg-[#5271FF] hover:bg-blue-700 text-white xs:text-[10px] md:text-xs py-1 xs:px-2 md:px-4 rounded-full"
          >
            View More
          </button>
        </div>
    </div>
  </CardContent>
</Card>

  );
}
