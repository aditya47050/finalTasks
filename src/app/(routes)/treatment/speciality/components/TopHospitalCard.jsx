import { Card, CardContent } from "@/components/ui/card";
import { FaHospitalAlt } from "react-icons/fa";

export default function TopHospitalCard({ name, address, reviews, rating, onViewMore }) {
  return (
    <Card className="h-full md:min-h-[350px] xs:min-h-[200px] md:w-[200px] xs:w-[160px]  flex flex-col overflow-hidden border-0 shadow-lg bg-white rounded-3xl">
      <CardContent className="p-0 flex flex-col flex-grow justify-between items-center text-center">

        {/* Top Icon Section */}
        <div className="w-full overflow-hidden rounded-t-3xl">
          <div className="w-full md:h-32 xs:h-28 bg-gradient-to-br from-[#5271FF] to-[#8b5cf6] flex items-center justify-center rounded-t-3xl">
            <FaHospitalAlt className="text-white" size={28} />
          </div>
        </div>

        {/* Center Content */}
        <div className="flex flex-col xs:justify-evenly md:justify-start xs:space-y-1  md:gap-2 xs:p-2 md:p-4 text-center flex-grow w-full">
          {/* Rating */}
          <div className="text-yellow-500 text-sm">
            {"★".repeat(rating)}{"☆".repeat(5 - rating)}
          </div>

          <p className="xs:text-[10px] md:text-[12px] text-gray-600 mb-1">{reviews} Reviews</p>

          {/* Name */}
          <h3 className="text-[#FF6B35] font-bold xs:text-[10px] md:text-[14px] mb-1 line-clamp-2 truncate">
            {name}
          </h3>

          {/* Address */}
          <p className="text-sm font-semibold text-gray-700">Address:</p>
          <p className="text-[12px] text-gray-500">{address || "(contact)"}</p>
        </div>

        {/* Bottom Button (fixed height and width) */}
        <div className="w-full px-2 pb-2">
          <button
            onClick={onViewMore}
            className="w-full bg-[#4A90E2] text-white text-xs py-2 rounded-full shadow-md hover:bg-[#357ABD] transition"
          >
            View More Details
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
