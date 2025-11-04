"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Heart } from "lucide-react"

export default function SplashScreen({ children }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-blue-600 to-indigo-900 text-white px-4 py-8">
        {/* Splash screen content here */}
        {/* Logo */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-12 relative">
            <div className="absolute -inset-8 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
            <Image
              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1732897093/logo_with_tm_1_dovble.png"
              alt="Aarogya Aadhar Logo"
              width={250}
              height={120}
              className="drop-shadow-lg"
              priority
            />
          </div>

      
        </div>
        {/* Bottom right floating filled heart (no loading dots) */}
        <div className="fixed right-6 bottom-6 flex flex-col items-center z-50">
          <div className="relative w-24 h-24 mb-2">
            <Heart className="h-16 w-16 text-red-500 animate-pulse mx-auto fill-red-500" fill="currentColor" />
          </div>
        </div>
      
        {/* Made in India footer */}
        <div className="mt-auto pt-8 flex flex-col items-center">
          <div className="flex items-center mb-2">
  <div className="w-6 h-4 mr-2 overflow-hidden rounded-sm ">
  {/* Saffron */}
  <div className="h-1/3 bg-orange-600"></div>

  {/* White with Ashoka Chakra */}
  <div className="h-1/3 bg-white flex items-center justify-center">
    <svg
      viewBox="0 0 100 100"
      className="w-[8px] h-[8px] text-blue-800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="5" />
      {[...Array(24)].map((_, i) => {
        const angle = (i * 360) / 24;
        const x = 50 + 45 * Math.cos((angle * Math.PI) / 180);
        const y = 50 + 45 * Math.sin((angle * Math.PI) / 180);
        return (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={x}
            y2={y}
            stroke="currentColor"
            strokeWidth="1"
          />
        );
      })}
    </svg>
  </div>

  {/* Green */}
  <div className="h-1/3 bg-green-600"></div>
</div>



            <span className="text-white font-medium">Made in India</span>
          </div>
          <p className="text-blue-200/70 text-sm">
            &copy; {new Date().getFullYear()} Aarogya Aadhar. All Rights Reserved.
          </p>
        </div>


        {/* CSS styles */}
        <style jsx global>{`
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }

          .ecg-line {
            stroke-dasharray: 400;
            stroke-dashoffset: 400;
            animation: ecg-animation 2s linear infinite;
          }

          @keyframes ecg-animation {
            from {
              stroke-dashoffset: 400;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
        `}</style>
      </div>
    )
  }

  // ✅ Once loading is false, render the main app content
  return <>{children}</>
}
