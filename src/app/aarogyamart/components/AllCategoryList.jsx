"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AllCategoryList() {
  const [categories, setCategories] = useState([])
  const gradients = [
    "from-blue-400 to-blue-600",
    "from-green-400 to-green-600",
    "from-pink-400 to-pink-600",
    "from-indigo-400 to-indigo-600",
    "from-purple-400 to-purple-600",
    "from-yellow-400 to-yellow-500",
    "from-red-400 to-red-600",
  ]

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/aarogyamart/categories/countwithdata")
      const data = await res.json()
      // Add random gradient to each category
      const categoriesWithGradients = data.map((cat) => ({
        ...cat,
        gradient: gradients[Math.floor(Math.random() * gradients.length)],
      }))
      setCategories(categoriesWithGradients)
    } catch (err) {
      console.error("Failed to fetch categories:", err)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])
  if (categories.length === 0) {
    // Number of skeleton cards to show while loading
    const skeletons = Array.from({ length: 6 })

    return (
      <section className="my-6">
        <div className="container mx-auto p-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-black mb-4">
              Shop by <span className="text-blue-500">Category</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Discover our comprehensive range of medical equipment and hospital supplies
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 min-[1100px]:grid-cols-6 gap-4 md:gap-6">
            {skeletons.map((_, index) => (
              <div
                key={index}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="rounded-t-xl overflow-hidden relative animate-pulse bg-gray-200 h-40" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-6">
      <div className="container mx-auto p-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black mb-4">
            Shop by <span className="text-blue-500">Category</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Discover our comprehensive range of medical equipment and hospital supplies
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 min-[1100px]:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/aarogyamart/category/${category.name.toLowerCase()}`}>
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0 text-center">
                  <div className="relative overflow-hidden rounded-t-xl group">
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-tr ${category.gradient}`} />

                    {/* Image */}
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={200}
                      height={200}
                      className="relative w-full h-40 object-contain p-6 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm md:text-base mb-1 group-hover:text-blue-500 transition-colors truncate">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500">{category.products.length !== 0 ? category.products.length : "55" }+ Products</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
