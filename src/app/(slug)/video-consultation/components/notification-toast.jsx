"use client"

import { useEffect, useState } from "react"

export default function NotificationToast({ message }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-auto">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3">
        <div className="w-2 h-2 bg-blue-600 rounded-full" />
        <p className="text-sm font-medium text-gray-700">{message}</p>
      </div>
    </div>
  )
}
