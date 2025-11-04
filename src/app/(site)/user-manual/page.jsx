"use client"

import { useState } from "react"
import { FileText, Users, Settings, ChevronRight } from "lucide-react"

export default function UserManualPage() {
  const [activeManual, setActiveManual] = useState("patient")

  const manuals = [
    {
      id: "patient",
      title: "Patient Manual",
      description: "Complete guide for patient registration and management",
      icon: Users,
      url: "https://drive.google.com/file/d/1xfOgL_zKaOHyh2VYcRwLN72nI0UV3M8b/preview",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "e-seva",
      title: "E-Seva Manual",
      description: "Complete guide for E-Seva registration and management",
      icon: Settings,
      url: "https://drive.google.com/file/d/1qxG0MY3sKq3BQexSyUngJ47mISybXFNe/preview", // Replace with actual e-seva manual URL
      color: "from-blue-400 to-blue-500",
    },
  ]

  const currentManual = manuals.find((manual) => manual.id === activeManual)

  return (
    <div className="min-h-screen  p-4 md:p-6 lg:container lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="md:text-[25px] text-xl text-[#5271FF] font-extrabold">User Manuals</h1>
          <p className="text-[#5271FF] text-[12px] lg:text-[15px] ">
            Access comprehensive guides and documentation for all our services
          </p>
        </div>

        {/* Manual Navigation Cards */}
        <div className="grid xs:grid-cols-2 xs:gap-8 md:gap-16 mb-8">
          {manuals.map((manual) => {
            const IconComponent = manual.icon
            const isActive = activeManual === manual.id

            return (
              <div
                key={manual.id}
                onClick={() => setActiveManual(manual.id)}
                className={`
                  relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl scale-105"
                      : "bg-white text-gray-700 shadow-lg hover:shadow-xl border border-gray-100"
                  }
                `}
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`
                      p-3 rounded-xl transition-colors duration-300
                      ${isActive ? "bg-white/20" : "bg-blue-50"}
                    `}
                    >
                      <IconComponent
                        className={`
                        w-8 h-8 transition-colors duration-300
                        ${isActive ? "text-white" : "text-blue-500"}
                      `}
                      />
                    </div>
                    <ChevronRight
                      className={`
                      w-6 h-6 transition-all duration-300
                      ${isActive ? "text-white rotate-90" : "text-gray-400 group-hover:text-blue-500"}
                    `}
                    />
                  </div>

                  <h3 className="text-2xl font-bold mb-2 transition-colors duration-300">{manual.title}</h3>
                  <p
                    className={`
                    hidden md:block transition-colors duration-300
                    ${isActive ? "text-blue-100" : "text-gray-600"}
                  `}
                  >
                    {manual.description}
                  </p>
                </div>

                {/* Animated background effect */}
                <div
                  className={`
                  absolute inset-0 opacity-0 transition-opacity duration-300
                  ${isActive ? "opacity-10" : "hover:opacity-5"}
                  bg-gradient-to-r ${manual.color}
                `}
                />
              </div>
            )
          })}
        </div>

        {/* Active Manual Display */}
        {currentManual && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-slide-up">
            {/* Manual Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <currentManual.icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{currentManual.title}</h2>
                  <p className="text-blue-100">{currentManual.description}</p>
                </div>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="relative">
              <div className="h-[70vh] md:h-[80vh] bg-gray-50">
                <iframe
                  src={currentManual.url}
                  className="w-full h-full transition-opacity duration-500"
                  style={{ border: "none" }}
                  title={`${currentManual.title} PDF Viewer`}
                />
                {/* Overlay to block top toolbar clicks */}
                <div className="absolute top-0 left-0 w-full h-12 bg-transparent z-10" />
              </div>

              {/* Loading overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white flex items-center justify-center opacity-0 transition-opacity duration-300 pointer-events-none">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-blue-600 font-medium">Loading manual...</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
