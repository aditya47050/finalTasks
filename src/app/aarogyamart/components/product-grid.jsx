"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart } from 'lucide-react'
import { Star } from 'lucide-react'
import { FaArrowRight } from "react-icons/fa"

export function ProductGrid() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/aarogyamart/products")
      const data = await res.json()

      // Shuffle data to show random products
      const shuffled = data?.data?.sort(() => 0.5 - Math.random())
      setProducts(shuffled)
    } catch (err) {
      console.error("Failed to fetch products:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Show loading skeletons
  if (loading) {
    const skeletons = Array.from({ length: 6 })
    return (
      <section className="py-6">
        <div className="container mx-auto p-4 bg-gray-500/20 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-blue-500 mb-2">Featured Products</h2>
              <p className="text-gray-700">Top-rated medical equipment and supplies</p>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto py-4">
            {skeletons.map((_, index) => (
              <div
                key={index}
                className="bg-white min-w-[220px] max-w-[220px] rounded-xl shadow p-4 animate-pulse"
              >
                <div className="h-44 bg-gray-300 rounded-xl mb-4" />
                <div className="h-4 bg-gray-300 rounded mb-2 w-3/4" />
                <div className="h-3 bg-gray-300 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-6">
      <div className="container mx-auto p-4 bg-gray-500/20 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-blue-500 mb-2">Featured Products</h2>
            <p className="text-gray-700">Top-rated medical equipment and supplies</p>
          </div>
          <Link href={"/aarogyamart/products"}>
            <Button className="hidden md:flex bg-blue-500 text-white rounded-xl hover:bg-blue-600">
              View All Products <FaArrowRight />
            </Button>
          </Link>
        </div>

        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {products.map((product) => (
            <Link key={product.id} href={`/aarogyamart/product/${product.id}`}>
              <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white min-w-[220px] max-w-[220px] snap-start">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-xl">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-44 object-contain rounded-xl group-hover:scale-110 transition-transform duration-500"
                    />
                    {product?.badge && (
                      <Badge className="absolute top-2 left-2 bg-blue-500 text-gray-50">
                        {product.badge}
                      </Badge>
                    )}
                    {/* <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-2 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <Heart className="h-4 w-4" />
                    </Button> */}
                    {product.discount > 0 && (
                      <Badge className="absolute bottom-2 right-2 bg-red-500 text-white">
                        {product.discount}% OFF
                      </Badge>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-base mb-2 group-hover:text-blue-500 transition-colors line-clamp-2 truncate">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => {
                          const averageRating =
                            product.reviews.length > 0
                              ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
                              : 0;
                          return (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          );
                        })}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {product.reviews.length > 0
                          ? `${(
                              product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
                            ).toFixed(1)} (${product.reviews.length})`
                          : "No ratings yet"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-blue-500">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      {product.price  && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href={"/aarogyamart/products"}>
            <Button className="bg-blue-500 text-white rounded-xl hover:bg-blue-600">
              View All Products <FaArrowRight />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
