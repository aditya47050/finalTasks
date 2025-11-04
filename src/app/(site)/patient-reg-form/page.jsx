"use client"

import { useState } from "react"
import { FileText, Users, Download } from "lucide-react"

export default function UserManualPage() {
  const [activeManual, setActiveManual] = useState("patient")

  const manuals = [
    {
      id: "patient",
      title: "Patient Registration Form",
      description: "",
      icon: Users,
      url: "https://drive.google.com/file/d/1M0mxIr6aQ5lzNLjNsNtHqc5Q40OLqf81/preview",
      downloadUrl: "https://drive.google.com/uc?export=download&id=1M0mxIr6aQ5lzNLjNsNtHqc5Q40OLqf81",
      color: "from-blue-500 to-blue-600",
    },
  ]

  const currentManual = manuals.find((manual) => manual.id === activeManual)

  return (
    <div className="min-h-screen p-4 md:p-6 lg:container lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="md:text-[25px] text-xl text-[#5271FF] font-extrabold">
            {currentManual?.title}
          </h1>
          <p className="text-[#5271FF] text-[12px] lg:text-[15px]">
            {currentManual?.description}
          </p>
        </div>

        {/* Active Manual Display */}
        {currentManual && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-slide-up">
            {/* Manual Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex flex-col xs:gap-4 md:flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <currentManual.icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className=" text-2xl font-bold">{currentManual.title}</h2>
                  <p className="text-blue-100">{currentManual.description}</p>
                </div>
              </div>

              {/* Download Button */}
              <a
                href={currentManual.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white text-blue-600 font-semibold px-4 py-2 rounded-xl shadow hover:bg-gray-100 transition"
              >
                <Download className="w-5 h-5" />
                Download
              </a>
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
