"use client"

import { ChevronDown, LayoutGrid } from "lucide-react"
import { FaArrowCircleDown } from "react-icons/fa"
import {
  FaUserMd,
  FaHospital,
  FaProcedures,
  FaStethoscope,
} from "react-icons/fa";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
export default function SpecialityTabs({ activeTab, setActiveTab, activeDropdowns, toggleDropdown, data }) {
  const tabs = [
    {
      name: "Sub Categories",
      items: data?.subCategories || [],
    },
    {
      name: "Top Surgeries",
      items: data?.surgeries?.map((item) => item.name) || [],
    },
    {
      name: "Top Treatment",
      items: data?.treatments?.map((item) => item.name) || [],
    },
    {
      name: "Top Hospitals",
      items: data?.hospitals?.map((item) => item.name) || [],
    },
    {
      name: "Top Doctors",
      items: data?.doctors?.map((item) => item.name) || [],
    },
  ]

  return (
    <>
      <div className="hidden lg:flex justify-end container gap-4 flex-nowrap mb-6">
        {tabs.map((tab) => (
          <div key={tab.name} className="relative">
            <button
              onClick={() => setActiveTab(tab.name)}
              className="flex items-center justify-between gap-2 min-[1100px]:gap-4 pl-2 pr-1 py-1 border rounded-full border-blue-600 text-blue-600"
            >
              <span>{tab.name}</span>
              {tab.items.length > 0 && (
                <FaArrowCircleDown
                  className="w-5 h-5 text-blue-600 transition-transform duration-200"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent button click event
                    toggleDropdown(tab.name);
                  }}
                />
              )}
            </button>
            {/* Dropdown */}
            {/* {activeDropdowns[tab.name] && tab.items.length > 0 && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border z-20 min-w-[200px] max-h-60 overflow-y-auto">
                {tab.items.map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm border-b last:border-b-0"
                    onClick={() => {
                      // Handle item click
                      console.log(`Clicked on ${item}`)
                      toggleDropdown(tab.name) // Close dropdown after selection
                    }}
                  >
                    {typeof item === "string" ? item : item}
                  </div>
                ))}
              </div>
            )} */}
          </div>
        ))}
      </div>
      <Carousel className="lg:hidden w-full overflow-hidden px-0">
  <CarouselContent className="!ml-8 mr-8  pl-[60px] flex items-center gap-4  justify-center">
    {[
      { label: "Top Doctors", icon: <FaUserMd className="w-5 h-5 text-[#1c2c4c]" /> },
      { label: "Top Hospitals", icon: <FaHospital className="w-5 h-5 text-[#1c2c4c]" /> },
      { label: "Top Surgeries", icon: <FaProcedures className="w-5 h-5 text-[#1c2c4c]" /> },
      { label: "Top Treatment", icon: <FaStethoscope className="w-5 h-5 text-[#1c2c4c]" /> },
      { label: "Sub Categories", icon: <LayoutGrid className="w-5 h-5 text-[#1c2c4c]" /> },
    ].map((item) => (
      <CarouselItem
        key={item.label}
        className="basis-[25%] md:basis-1/5 flex flex-col gap-1 justify-center items-center"
      >
        <div
          onClick={() => 
            setActiveTab(item.label)
          
          }
          className="w-[60px] h-[60px] rounded-xl bg-[#f2f6ff] shadow-md flex flex-col justify-center items-center gap-2 p-2 cursor-pointer transition hover:scale-105"
        >
          {item.icon}
        </div>
          <p className="text-[12px] font-semibold text-[#1c2c4c] text-center leading-tight">
            {item.label}
          </p>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious className="left-0 " />
  <CarouselNext className="right-0" />
</Carousel>

    </>
  )
}
