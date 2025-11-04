"use client";
import HeadingClientMain from "@/app/components/heading";
import React, { useState } from "react";

const Presscoverageclient = () => {
  const data = [
    { title: "News Channel 1", description: "Description for channel 1..." },
    { title: "News Channel 2", description: "Description for channel 2..." },
    { title: "News Channel 3", description: "Description for channel 3..." },
    { title: "News Channel 4", description: "Description for channel 4..." },
    { title: "News Channel 5", description: "Description for channel 5..." },
    { title: "News Channel 6", description: "Description for channel 6..." },
    { title: "News Channel 7", description: "Description for channel 7..." },
    { title: "News Channel 8", description: "Description for channel 8..." },
    { title: "News Channel 9", description: "Description for channel 9..." },
    { title: "News Channel 10", description: "Description for channel 10..." },
    { title: "News Channel 11", description: "Description for channel 11..." },
    { title: "News Channel 12", description: "Description for channel 12..." },
    { title: "News Channel 13", description: "Description for channel 13..." },
    { title: "News Channel 14", description: "Description for channel 14..." },
    { title: "News Channel 15", description: "Description for channel 15..." },
    { title: "News Channel 16", description: "Description for channel 16..." },
    { title: "News Channel 17", description: "Description for channel 17..." },
    { title: "News Channel 18", description: "Description for channel 18..." },
    { title: "News Channel 19", description: "Description for channel 19..." },
    { title: "News Channel 20", description: "Description for channel 20..." },
    { title: "News Channel 21", description: "Description for channel 21..." },
    { title: "News Channel 22", description: "Description for channel 22..." },
    { title: "News Channel 23", description: "Description for channel 23..." },
    { title: "News Channel 24", description: "Description for channel 24..." },
  ];

  const [visibleCount, setVisibleCount] = useState(12);

  const showMoreItems = () => {
    setVisibleCount((prevCount) => prevCount + 12);
  };

  return (
    <>
      <div className="md:mx-auto md:container">
        <HeadingClientMain main={"Press Coverage"} />
        <div className="grid md:py-6 font-poppins grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
          {data.slice(0, visibleCount).map((item, index) => (
            <div
              key={index}
              className="relative border border-[#5271ff] rounded-[15px] p-4 lg:p-2"
            >
              {/* First Button */}
              <button className="absolute text-[10px] whitespace-nowrap md:text-[12px] lg:text-[14px] rounded-[15px] top-[-12px] left-1/2 transform -translate-x-1/2 bg-[#5271ff] text-white px-3 py-2 items-center">
                {item.title}
              </button>

              {/* Content */}
              <p className="md:mt-8 mt-4 text-[10px] text-[#243460] h-16 lg:h-28 md:text-[12px] lg:text-[14px]">
                {item.description.length > 40
                  ? `${item.description.slice(0, 40)}...`
                  : item.description}
              </p>
              <div className="mt-3">
                {" "}
                {/* View More Button */}
                <button className="absolute rounded-xl text-[10px]  md:text-[12px]   lg:text-[14px]  bottom-1 right-1 bg-[#243460] text-white px-3 py-1">
                  View More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {visibleCount < data.length && (
          <div className="text-center my-2">
            <button
              onClick={showMoreItems}
              className="bg-[#5271ff] border-white border rounded-xl text-white px-4 py-2  text-sm"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Presscoverageclient;
