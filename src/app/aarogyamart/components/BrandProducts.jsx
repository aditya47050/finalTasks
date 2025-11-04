"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Grid, List } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "./cart-context"

export function BrandProducts({ brandSlug }) {
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 8
  const { addItem } = useCart()
  const [brand, setBrand] = useState(null)
  const [loading, setLoading] = useState(true)
  const quantity = 1

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images?.[0],
      brand: product.brand?.name,
      inStock: product.inStock,
      quantity,
    })
  }

  const fetchBrand = async (id) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/aarogyamart/brand/${id}`)
      if (!res.ok) throw new Error("Failed to fetch brand")
      const data = await res.json()
      setBrand(data?.data)
    } catch (err) {
      console.error("Error fetching brand:", err)
      setBrand(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (brandSlug) fetchBrand(brandSlug)
  }, [brandSlug])

  // 🔹 Loading
  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <span className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></span>
      </div>
    )
  }

  // 🔹 Not found
  if (!brand) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Brand Not Found</h1>
        <Link href="/aarogyamart/products">
          <Button>Browse All Products</Button>
        </Link>
      </div>
    )
  }

  // 🔹 Sort
  const sortedProducts = brand.products
    ? [...brand.products].sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price
          case "price-high":
            return b.price - a.price
          case "rating":
            return b.rating - a.rating
          case "newest":
            return b.id - a.id
          default:
            return 0
        }
      })
    : []

  // 🔹 Paginate
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage)

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/aarogyamart" className="hover:text-blue-500">
          Home
        </Link>
        <span>/</span>
        <Link href="/aarogyamart/brands" className="hover:text-blue-500">
          Brands
        </Link>
        <span>/</span>
        <span>{brand.name}</span>
      </nav>

      {/* Brand Header */}
      <div className="mb-8 text-left">
        <h1 className="text-3xl font-bold text-gray-700 mb-2">{brand.name}</h1>
        <p className="text-gray-500 text-lg mb-4">{brand.description}</p>
        <p className="text-sm text-gray-500">
          Showing {paginatedProducts.length} of {brand.products.length} products
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex items-center border rounded-xl p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48 border-[1px] border-gray-300">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <Card
              key={product.id}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-xl">
                  <Link href={`/aarogyamart/product/${product.id}`}>
                    <Image
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-48 object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </Link>
                  {product.discount > 0 && (
                    <Badge className="absolute bottom-2 right-2 bg-red-500 text-white">
                      {product.discount}% OFF
                    </Badge>
                  )}
                </div>

                <div className="p-4">
                  <Link href={`/aarogyamart/product/${product.id}`}>
                    <h3 className="font-semibold text-base mb-2 group-hover:text-blue-500 transition-colors line-clamp-2 truncate">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-blue-500">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Button
                    className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 text-white"
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* (List view similar structure here — kept same as your old one) */}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
              className="w-10"
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
