"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"

// Import icons
import {
  Code,
  Palette,
  BarChart,
  Megaphone,
  Shield,
  Stethoscope,
  Building,
  Wrench,
  Book,
  Users,
  Briefcase,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

export function CategoriesSection() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/jobaadhar/job-categories")
        const data = await res.json()
        if (res.ok) {
          const transformed = data.map((cat) => ({
            id: cat.id,
            title: cat.name,
            count: cat.companies?.length || 0,
            growth: Math.floor(Math.random() * 50) + "%",
            icon: getIcon(cat.name),
            color: getColor(cat.name),
          }))
          setCategories(transformed)
        } else {
          setError(data.error || "Failed to fetch categories")
        }
      } catch (err) {
        setError("Network error")
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (error) return <p className="text-center py-8 text-red-500">{error}</p>

  // Split categories into slides of 8 cards (2 rows × 4 columns)
  const cardsPerSlide = 9
  const slides = []
  for (let i = 0; i < categories.length; i += cardsPerSlide) {
    slides.push(categories.slice(i, i + cardsPerSlide))
  }

  const handlePrev = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  const handleNext = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  return (
    <>
      <section className="w-full container hidden md:flex flex-col md:flex-row items-start justify-between py-10 px-6 md:px-12 bg-blue-50/30 rounded-2xl relative">
        {/* Left Section */}
        <div className="w-full md:w-2/5 text-left space-y-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-gray-100">
            Browse Companies by <span className="text-blue-500">Category</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Explore opportunities across diverse industries and find the perfect match for your expertise
          </p>
          <Image
            src="https://res.cloudinary.com/dorreici1/image/upload/v1760097677/2e4875bb-9229-49bf-8491-10c583b074a9.png"
            alt="Browse Categories"
            width={300}
            height={300}
            className="w-[450px] h-[450px] rounded-xl mx-auto md:mx-0"
          />
        </div>

        {/* Right Section */}
        <div className="w-full md:w-3/5 mt-10 md:mt-0 relative">
          {/* Prev Arrow */}
          <button
            onClick={handlePrev}
            className="absolute -left-10 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white dark:bg-neutral-800 shadow p-2 hover:bg-gray-100 dark:hover:bg-neutral-700"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            className="absolute -right-10 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white dark:bg-neutral-800 shadow p-2 hover:bg-gray-100 dark:hover:bg-neutral-700"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>

          {/* Slider */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {loading
                ? Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="min-w-full md:min-w-[33.33%] p-2">
                      <div className="animate-pulse bg-gray-200 dark:bg-neutral-700 rounded-xl h-40"></div>
                    </div>
                  ))
              :slides.map((slide, i) => (
                <div key={i} className="grid grid-cols-2 md:grid-cols-3 gap-4 min-w-full">
                  {slide.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <motion.div
                        key={category.title}
                        variants={cardVariants}
                        initial="hidden"
                        animate="show"
                        whileHover={{ scale: 1.05 }}
                        className="cursor-pointer"
                      >
                        <Link href={`/jobaadhar/category/${category.id}`}>
                          <Card className="p-6 hover:shadow-lg transition-all group bg-background/50 backdrop-blur">
                            <div className="space-y-4">
                              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${category.color}`}>
                                <IconComponent className="h-6 w-6" />
                              </div>
                              <div>
                                <h3 className="font-semibold group-hover:text-blue-600 transition-colors truncate">{category.title}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-2xl font-bold">{category.count}</span>
                                  <Badge className="text-xs text-white bg-blue-500 flex items-center gap-1 px-2 py-0.5">
                                    <TrendingUp className="h-3 w-3" />
                                    {category.growth}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-500">open positions</p>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="w-full container md:hidden flex flex-col md:flex-row items-start justify-between py-10 px-6 md:px-12 bg-blue-50/30 rounded-2xl relative">
        {/* Left Section */}
        <div className="w-full md:w-2/5 text-left space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Browse Companies by <span className="text-blue-500">Category</span>
          </h2>
          <p className="text-gray-600 text-xs dark:text-gray-400">
            Explore opportunities across diverse industries and find the perfect match for your expertise
          </p>
        </div>

        {/* Right Section */}
        <div className="grid grid-cols-2 gap-2">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="min-w-[33.33%] p-2">
                  <div className="animate-pulse bg-gray-200 dark:bg-neutral-700 rounded-xl h-40"></div>
                </div>
              ))
          :
              categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <motion.div
                    key={category.title}
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    whileHover={{ scale: 1.05 }}
                    className="cursor-pointer"
                  >
                    <Link href={`/jobaadhar/category/${category.id}`}>
                      <Card className="p-4 hover:shadow-lg transition-all group bg-background/50 backdrop-blur">
                        <div className="space-y-4">
                          <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${category.color}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-semibold group-hover:text-blue-600 text-xs transition-colors truncate">{category.title}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xl font-bold">{category.count}</span>
                              <Badge className="text-xs text-white bg-blue-500 flex items-center gap-1 px-2 py-0.5">
                                <TrendingUp className="h-3 w-3" />
                                {category.growth}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">open positions</p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                )
              })
          }
        </div>
      </section>
    </>

  )
}
// Map job category names to icons
function getIcon(name) {
  const mapping = {
    "Pharmaceutical / Biotech": Stethoscope,
    "Government / Public Sector": Users,
    "Real Estate / Architecture": Building,
    Manufacturing: Wrench,
    "Retail / E-commerce": Briefcase,
    "Hospitality / Travel": Globe,
    "Media / Entertainment": Megaphone,
    "Legal / Compliance": Shield,
    "Customer Support / BPO": Users,
    "Data Science & Analytics": BarChart,
    Engineering: Code,
    "Education & Training": Book,
    "Operations & Supply Chain": Briefcase,
    "Sales & Business Development": Megaphone,
    "Human Resources": Users,
    "Marketing & Advertising": Palette,
    "Finance & Accounting": BarChart,
    Healthcare: Stethoscope,
    "Information Technology": Code,
  }
  return mapping[name] || Code
}

// Map job category names to colors
function getColor(name) {
  const colors = {
    "Pharmaceutical / Biotech": "bg-red-500 text-white",
    "Government / Public Sector": "bg-gray-500 text-white",
    "Real Estate / Architecture": "bg-orange-500 text-white",
    Manufacturing: "bg-purple-500 text-white",
    "Retail / E-commerce": "bg-yellow-500 text-white",
    "Hospitality / Travel": "bg-teal-500 text-white",
    "Media / Entertainment": "bg-pink-500 text-white",
    "Legal / Compliance": "bg-gray-700 text-white",
    "Customer Support / BPO": "bg-blue-400 text-white",
    "Data Science & Analytics": "bg-green-500 text-white",
    Engineering: "bg-purple-400 text-white",
    "Education & Training": "bg-indigo-500 text-white",
    "Operations & Supply Chain": "bg-teal-400 text-white",
    "Sales & Business Development": "bg-yellow-600 text-white",
    "Human Resources": "bg-pink-400 text-white",
    "Marketing & Advertising": "bg-red-400 text-white",
    "Finance & Accounting": "bg-blue-500 text-white",
    Healthcare: "bg-red-500 text-white",
    "Information Technology": "bg-blue-600 text-white",
  }
  return colors[name] || "bg-blue-500 text-white"
}
