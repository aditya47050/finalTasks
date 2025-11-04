"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Grid, List } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "./cart-context"

export function CategoryProducts({ categorySlug }) {
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 8
  const { addItem } = useCart()
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const quantity = 1;
  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      brand: product.brand.name,
      inStock: product.inStock,
      quantity: quantity,
    })
  }
  const fetchCategory = async (id) => {
    try {
      const res = await fetch(`/api/aarogyamart/categories/${id}`)
      if (!res.ok) throw new Error("Failed to fetch category")
      const data = await res.json()
      setCategory(data?.data)
    } catch (err) {
      console.error("Error fetching category:", err)
      setCategory(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (categorySlug) fetchCategory(categorySlug)
  }, [categorySlug])

  // 🔹 Show loader while fetching
  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <span className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></span>
      </div>
    )
  }

  // 🔹 Handle missing category
  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <Link href="/aarogyamart/products">
          <Button>Browse All Products</Button>
        </Link>
      </div>
    )
  } 

  // 🔹 Sort products
  const sortedProducts = category.products
    ? [...category.products].sort((a, b) => {
        switch (sortBy) {
          case "price-low": return a.price - b.price
          case "price-high": return b.price - a.price
          case "rating": return b.rating - a.rating
          case "newest": return b.id - a.id
          default: return 0
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
        <Link href="/aarogyamart" className="hover:text-blue-500">Home</Link>
        <span>/</span>
        <Link href="/aarogyamart/products" className="hover:text-blue-500">Products</Link>
        <span>/</span>
        <span>{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-700 mb-4">{category.name}</h1>
        <p className="text-gray-500 text-lg mb-4">{category.description}</p>
        <p className="text-sm text-gray-500">
          Showing {paginatedProducts.length} of {category.products.length} products
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-xl p-1">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
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

      {/* Products Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <Card
              key={product.id}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white"
            >
              <CardContent className="p-0">
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-t-xl">
                  <Link href={`/aarogyamart/product/${product.id}`}>
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-48 object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </Link>

                  {/* Badge */}
                  {product.badge && (
                    <Badge className="absolute top-2 left-2 bg-blue-500 text-gray-50">{product.badge}</Badge>
                  )}

                  {/* Stock Status */}
                  {!product.inStock && (
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white">Out of Stock</Badge>
                  )}

                  {/* Wishlist */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>

                  {/* Discount */}
                  {product.discount > 0 && (
                    <Badge className="absolute bottom-2 right-2 bg-red-500 text-white">{product.discount}% OFF</Badge>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-semibold text-base mb-2 group-hover:text-blue-500 transition-colors line-clamp-2 truncate">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-500 mb-2">{product.brand.name}</p>

                  {/* Rating */}
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

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-blue-500">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart */}
                  <Button className="w-full rounded-xl bg-blue-500 hover:bg-blue-500 text-white"
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                   disabled={!product.inStock}>
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
          {paginatedProducts.map((product) => (
            <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-xl">
                    <Link href={`/aarogyamart/product/${product.id}`}>
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </Link>
                    {product.badge && (
                      <Badge className="absolute top-1 left-1 text-xs bg-blue-500 text-gray-50">
                        {product.badge}
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-semibold text-lg group-hover:text-blue-500 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <Button size="icon" variant="ghost" className="text-gray-600 hover:text-red-500">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-gray-500 mb-2">{product.brand.name}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-blue-500">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                        {product.discount > 0 && (
                          <Badge className="bg-red-500 text-white">{product.discount}% OFF</Badge>
                        )}
                      </div>

                      {/* Add to Cart */}
                      <Button className="rounded-xl px-6" disabled={!product.inStock}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
