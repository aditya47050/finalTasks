"use client"


import { FaArrowCircleDown } from "react-icons/fa"

export default function DropdownColumn({ title, items, isOpen, onToggle, bgColor, textColor }) {
  return (
    <div className="space-y-2">
      {/* Header with dropdown icon */}
      <div
        className={`${bgColor} p-3 rounded-lg cursor-pointer flex items-center justify-between hover:shadow-md transition-shadow duration-200`}
        onClick={onToggle}
      >
        <p className={`font-semibold ${textColor}`}>{title}</p>
        <FaArrowCircleDown/>
      </div>

      {/* Dropdown content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className={`${bgColor} p-2 rounded-lg text-center hover:shadow-sm cursor-pointer transition-all duration-200`}
            >
              <p className={`font-medium ${textColor} text-sm`}>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
