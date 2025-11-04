"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import  Link  from 'next/link';

export function BannerCarousel() {
  const [banners, setBanners] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)

  // Fetch banners from backend
  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/aarogyamart/banners")
      const data = await res.json()
      setBanners(data)
    } catch (err) {
      console.error("Failed to fetch banners:", err)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  // Auto-slide
  useEffect(() => {
    if (banners.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  const goToSlide = (index) => setCurrentSlide(index)

  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden bg-gray-200 animate-pulse">
        {/* Simulated content blocks */}
        <div className="absolute top-1/4 left-8 w-3/4 h-8 bg-gray-300 rounded mb-2"></div>
        <div className="absolute top-1/2 left-8 w-1/2 h-6 bg-gray-300 rounded mb-2"></div>
        <div className="absolute top-2/3 left-8 w-32 h-10 bg-gray-300 rounded"></div>
        {/* Optional placeholder for image */}
        <div className="hidden md:block absolute right-8 top-1/4 w-72 h-48 bg-gray-300 rounded-xl"></div>
      </div>
    )
  }

  return (
    <>
      <div className="hidden md:block relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-xl">
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`min-w-full h-full relative flex items-center bg-gradient-to-r from-blue-600 to-blue-800`}
            >
              <div className="container mx-auto pr-20 pl-20 flex items-center justify-between">
                {/* Content */}
                <div className="text-white z-10 max-w-lg">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">{banner.title}</h2>
                  <p className="text-lg md:text-xl mb-6 opacity-90">{banner.subtitle}</p>
                  {banner.cta && (
                    <Link href={`/aarogyamart/product/${banner.link}`}>
                      <Button size="lg" className="rounded-xl px-8 border border-white">
                          {banner.cta}
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Image */}
                <div className="hidden md:block">
                  <Image
                    src={banner.image || "/placeholder.svg"}
                    alt={banner.title}
                    width={300}
                    height={200}
                    className="rounded-xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full"
          onClick={prevSlide}
        >
          <FaChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full"
          onClick={nextSlide}
        >
          <FaChevronRight className="h-6 w-6" />
        </Button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 w-full max-w-sm justify-center">
          {banners.map((_, index) => (
            <div
              key={index}
              onClick={() => goToSlide(index)}
              className="h-1 w-12 bg-white/40 rounded-full overflow-hidden cursor-pointer"
            >
              <div
                className={`h-full bg-white transition-all duration-500 ease-in-out ${
                  index === currentSlide ? "animate-progress" : "w-0"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Mobile Carousel */}
      <div className="md:hidden relative w-full h-[300px] overflow-hidden rounded-xl">
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="min-w-full h-full relative flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 text-white"
            >
              {/* Image as background */}
              <div className="absolute inset-0">
                <Image
                  src={banner.image || "/placeholder.svg"}
                  alt={banner.title}
                  fill
                  className="object-cover opacity-60"
                />
              </div>

              {/* Content overlay */}
              <div className="relative z-10 flex flex-col items-center text-center px-4">
                <h2 className="text-2xl font-bold mb-2">{banner.title}</h2>
                <p className="text-sm mb-4 opacity-90">{banner.subtitle}</p>
                {banner.cta && (
                  <Link href={`/aarogyamart/product/${banner.link}`}>
                    <Button size="md" className="rounded-xl px-6 py-2 border border-white">
                      {banner.cta}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Dots Indicator (same as desktop) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 w-full max-w-sm justify-center">
          {banners.map((_, index) => (
            <div
              key={index}
              onClick={() => goToSlide(index)}
              className="h-1 w-12 bg-white/40 rounded-full overflow-hidden cursor-pointer"
            >
              <div
                className={`h-full bg-white transition-all duration-500 ease-in-out ${
                  index === currentSlide ? "animate-progress" : "w-0"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
