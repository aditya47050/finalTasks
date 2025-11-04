"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { FaArrowRight } from "react-icons/fa"

// Simple skeleton card for loading state
function ProductSkeleton() {
  return (
    <Card className="animate-pulse bg-gray-100 rounded-lg">
      <div className="h-48 bg-gray-200 rounded-t-lg" />
      <CardContent className="p-4 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </CardContent>
    </Card>
  )
}

export function RelatedProducts({ productId }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRelated() {
      try {
        setLoading(true)
        const res = await fetch(`/api/aarogyamart/products/related/${productId}`)
        const data = await res.json()
        setProducts(data.relatedProducts || [])
      } catch (err) {
        console.error("Failed to fetch related products", err)
      } finally {
        setLoading(false)
      }
    }
    if (productId) fetchRelated()
  }, [productId])

  return (
    <section className="py-6 bg-gray-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-blue-500 mb-2">Related Products</h2>
            <p className="text-gray-700">You might also be interested in these products</p>
          </div>
          <Link href="/aarogyamart/products">
            <Button className="hidden md:flex bg-blue-500 text-white rounded-xl hover:bg-blue-500">
              View All Products <FaArrowRight />
            </Button>
          </Link>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-600">No related products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white"
              >
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Link href={`/aarogyamart/product/${product.id}`}>
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </Link>

                    {product.badge && (
                      <Badge className="absolute top-2 left-2 bg-blue-500 text-gray-50">{product.badge}</Badge>
                    )}
                    {!product.inStock && (
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white">Out of Stock</Badge>
                    )}
                  </div>

                  <div className="p-4">
                    <Link href={`/aarogyamart/product/${product.id}`}>
                      <h3 className="font-semibold text-base mb-2 group-hover:text-blue-500 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-sm text-gray-500 mb-2">{product.brand}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {Number(product.rating).toFixed(1)} ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-blue-500">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
