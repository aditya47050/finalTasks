import { Card, CardContent } from "@/components/ui/card";
import { FaHospitalAlt } from "react-icons/fa";
export default function HospitalCard({ name, address, reviews, surgeryName, price }) {
  return (
    <Card className="h-full md:min-h-[350px] xs:min-h-[200px] md:w-[200px] xs:w-[160px]  flex flex-col overflow-hidden border-0 shadow-lg bg-white rounded-3xl">
  <CardContent className="p-0 flex flex-col flex-grow items-center text-center">

    {/* Top Icon/Image Area */}
    <div className="relative w-full overflow-hidden rounded-t-3xl pb-6">
      <div className="w-full h-32 sm:h-28 bg-gradient-to-br from-[#5271FF] to-[#8b5cf6] flex items-center justify-center rounded-t-3xl">
        <FaHospitalAlt className="text-white" size={28} />
      </div>

      {/* Book Now Button */}
      <button className="absolute bottom-3 left-1/2 transform -translate-x-1/2 xs:text-[10px] md:text-xs bg-blue-500 text-white py-1 px-3 rounded-full shadow-md z-10">
        Book Now
      </button>
    </div>

    {/* Content Area */}
    <div className="flex flex-col xs:justify-evenly md:justify-start xs:space-y-1  md:gap-2 xs:p-2 md:p-4 text-center flex-grow w-full">

      {/* Hospital Name */}
      <h3 className="text-[14px] font-bold text-[#FF6B35] mb-1 truncate">
        {name}
      </h3>

      {/* Surgery Name (Optional) */}
      {surgeryName && (
        <p className="text-[12px] text-[#5271FF] font-medium leading-tight">
          {surgeryName}
        </p>
      )}

      {/* Price (Optional) */}
      {price && (
        <p className="text-[11px] font-medium mt-1">
          Starting Amount<br />
          <span className="text-black">{price}</span>
        </p>
      )}

      {/* Address */}
      <p className="text-[10px] text-gray-500 mt-1">
        {address}
      </p>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-center gap-3">
        <button className="bg-red-500 hover:bg-red-600 text-white xs:text-[10px] md:text-xs py-1 xs:px-2 md:px-4 rounded-full">
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
