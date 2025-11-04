import React, { useState, useRef, useEffect, forwardRef } from "react";
import { FaArrowCircleDown, FaArrowCircleUp } from "react-icons/fa";

const MobileDoctorFilter = forwardRef((_, ref) => {
  const [showFilters, setShowFilters] = useState(false);
  const toggleRef = useRef(null);
  const [topOffset, setTopOffset] = useState(0);

  useEffect(() => {
    if (toggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect();
      setTopOffset(rect.bottom + window.scrollY + 8);
    }
  }, [showFilters]);

  return (
    <>
      <div
        ref={toggleRef}
        className=" md:hidden w-full max-w-xs mx-auto mt-4 z-10 relative flex justify-center"
      >
        <button
          onClick={() => setShowFilters(!showFilters)}
          className=" bg-white text-[#5271FF] font-bold text-lg px-4 py-2 rounded-xl border border-[#5271FF] shadow-sm "
        >
          Top Doctors
          
        </button>
      </div>

      {showFilters && (
        <div
          ref={ref}
          className="absolute left-1/2 transform -translate-x-1/2 w-[60%] bg-[#e6e6e6] rounded-xl p-4 shadow-lg z-30 max-h-[70vh] overflow-y-auto transition-all duration-300"
          style={{ top: `${topOffset}px` }}
        >
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Enter Doctor Name"
              className="rounded-full px-4 py-2 text-white font-semibold bg-[#2F6FED] placeholder-white"
            />
            <input
              type="text"
              placeholder="Enter Hospital Name"
              className="rounded-full px-4 py-2 text-white font-semibold bg-[#2F6FED] placeholder-white"
            />
            {[
              "Hospital Type",
              "Doctor Experience",
              "Doctor Fee Range",
              "Distance Range",
              "Select State Name",
            ].map((label, idx) => (
              <div key={idx} className="relative">
                <button className="w-full rounded-full px-4 py-2 text-white font-semibold bg-[#2F6FED] flex justify-between items-center">
                  {label}
                  <FaArrowCircleDown className="text-white" />
                </button>
              </div>
            ))}
            <input
              type="text"
              placeholder="Enter City Name"
              className="rounded-full px-4 py-2 text-white font-semibold bg-[#2F6FED] placeholder-white"
            />
            <input
              type="text"
              placeholder="Enter Pin Code"
              className="rounded-full px-4 py-2 text-white font-semibold bg-[#2F6FED] placeholder-white"
            />
            <button className="bg-[#FF6B35] text-white font-bold py-2 px-4 rounded-full shadow-md mt-2">
              Search
            </button>
          </div>
        </div>
      )}
    </>
  );
});

MobileDoctorFilter.displayName = "MobileDoctorFilter";
export default MobileDoctorFilter;
