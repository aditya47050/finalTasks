import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
      {/* Generate 7 Skeleton Cards */}
      {[...Array(7)].map((_, index) => (
        <div
          key={index}
          className="p-6 bg-white rounded-xl shadow-md animate-pulse flex items-center"
        >
          {/* Icon Placeholder */}
          <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
          {/* Text Placeholder */}
          <div className="flex-1">
            <div className="w-32 h-4 bg-gray-300 rounded mb-2"></div>
            <div className="w-16 h-6 bg-gray-400 rounded"></div>
          </div>
        </div>
      ))}
      
      {/* Loading Chart */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-6 rounded-xl shadow-md animate-pulse">
        <div className="w-48 h-6 bg-gray-300 rounded mb-4"></div>
        <div className="w-full h-48 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
