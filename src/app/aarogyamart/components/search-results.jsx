"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Heart, ShoppingCart, Filter, Grid, List, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function SearchResults({ query }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState("All Brands")
  const [priceRange, setPriceRange] = useState([0, 60000])
  const [sortBy, setSortBy] = useState("relevance")
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const productsPerPage = 8
  // Fetch products from backend
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setProducts([])
      return
    }

    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/aarogyamart/products/search?query=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setProducts(data?.products || [])
        } else {
          setProducts([])
        }
      } catch (err) {
        console.error("Error fetching products:", err)
        setProducts([])
      } finally {
        setLoading(false)
        setCurrentPage(1)
      }
    }

    const debounce = setTimeout(fetchProducts, 300)
    return () => clearTimeout(debounce)
  }, [query])

  // Filter products
  const filteredProducts = products.filter((product) => {
    const brandMatch = selectedBrand === "All Brands" || product.brand?.name === selectedBrand
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
    const stockMatch = !showInStockOnly || product.inStock
    return brandMatch && priceMatch && stockMatch
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt)
      case "relevance":
      default:
        const aMatch = a.name.toLowerCase().includes(query.toLowerCase()) ? 1 : 0
        const bMatch = b.name.toLowerCase().includes(query.toLowerCase()) ? 1 : 0
        return bMatch - aMatch
    }
  })

  // Paginate products
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage)

  // Extract brands dynamically
  const brands = ["All Brands", ...new Set(products.map((p) => p.brand?.name).filter(Boolean))]

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [query, selectedBrand, priceRange, showInStockOnly])
  const searchResults = products.filter((product) => { 
    if (!query) return true 
    const searchTerm = query.toLowerCase() 
    const matchesName = product.name.toLowerCase().includes(searchTerm) 
    const matchesDescription = product.description.toLowerCase().includes(searchTerm) 
    const matchesBrand = product.brand.name.toLowerCase().includes(searchTerm) 
    const matchesKeywords = Array.isArray(product.keywords) && product.keywords
      .map(k => k?.name)               // safely access name
      .filter(Boolean)                 // remove undefined/null
      .some(keyword => keyword.toLowerCase().includes(searchTerm))
        return matchesName || matchesDescription || matchesBrand || matchesKeywords })
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/aarogyamart" className="hover:text-blue-500">
          Home
        </Link>
        <span>/</span>
        <span>Search Results</span>
        {query && (
          <>
            <span>/</span>
            <span>`{query}`</span>
          </>
        )}
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-500 mb-2">
            {query ? `Search Results for "${query}"` : "All Products"}
          </h1>
          <p className="text-gray-500">
            {query && searchResults.length === 0
              ? "No products found for your search"
              : `Showing ${paginatedProducts.length} of ${filteredProducts.length} products`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most Relevant</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile Filter Toggle */}
          <Button variant="outline" className="md:hidden bg-transparent" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Search Suggestions */}
      {query && searchResults.length === 0 && (
        <div className="mb-8 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-3">Search Suggestions:</h3>
          <div className="flex flex-wrap gap-2">
            {["stethoscope", "blood pressure", "thermometer", "pulse oximeter", "wheelchair", "nebulizer"].map(
              (suggestion) => (
                <Link key={suggestion} href={`/search?q=${suggestion}`}>
                  <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                    {suggestion}
                  </Button>
                </Link>
              ),
            )}
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className={`w-full md:w-64 space-y-6 ${showFilters ? "block" : "hidden md:block"}`}>
          {/* Price Range */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Price Range</h3>
              <div className="space-y-4">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={60000}
                  min={0}
                  step={100}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Brand Filter */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Brand</h3>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Stock Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="inStock" checked={showInStockOnly} onCheckedChange={setShowInStockOnly} />
                <label htmlFor="inStock" className="text-sm font-medium">
                  In Stock Only
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Clear Filters */}
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => {
              setSelectedBrand("All Brands")
              setPriceRange([0, 60000])
              setShowInStockOnly(false)
            }}
          >
            Clear Filters
          </Button>
        </aside>

        {/* Products Grid/List */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(productsPerPage)].map((_, i) => (
                <Card key={i} className="animate-pulse bg-white">
                  <CardContent className="p-0">
                    {/* Image Skeleton */}
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg mb-2"></div>
                    {/* Text Skeleton */}
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded mt-2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white"
                    >
                      <CardContent className="p-0">
                        {/* Image Container */}
                        <div className="relative overflow-hidden rounded-t-lg">
                          <Link href={`/aarogyamart/product/${product.id}`}>
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              width={300}
                              height={300}
                              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </Link>

                          {/* Badge */}
                          {product.badge && (
                            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                              {product.badge}
                            </Badge>
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
                            <Badge className="absolute bottom-2 right-2 bg-red-500 text-white">
                              {product.discount}% OFF
                            </Badge>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <Link href={`/product/${product.id}`}>
                            <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                          </Link>

                          <p className="text-sm text-muted-foreground mb-2">{product.brand.name}</p>

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
                            <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
                            {product.originalPrice > product.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Add to Cart */}
                          <Button className="w-full rounded-full" size="sm" disabled={!product.inStock}>
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
                          <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
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
                              <Badge className="absolute top-1 left-1 text-xs bg-primary text-primary-foreground">
                                {product.badge}
                              </Badge>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <Link href={`/product/${product.id}`}>
                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                  {product.name}
                                </h3>
                              </Link>
                              <Button size="icon" variant="ghost" className="text-gray-600 hover:text-red-500">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>

                            <p className="text-muted-foreground mb-2">{product.brand.name}</p>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-3">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.floor(product.rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {product.rating} ({product.reviews} reviews)
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              {/* Price */}
                              <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-primary">
                                  ₹{product.price.toLocaleString()}
                                </span>
                                {product.originalPrice > product.price && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    ₹{product.originalPrice.toLocaleString()}
                                  </span>
                                )}
                                {product.discount > 0 && (
                                  <Badge className="bg-red-500 text-white">{product.discount}% OFF</Badge>
                                )}
                              </div>

                              {/* Add to Cart */}
                              <Button className="rounded-full px-6" disabled={!product.inStock}>
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
            </>
          ) : (
            /* No Results */
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {query ? `No results found for "${query}"` : "No products found"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {query ? "Try different keywords or check the spelling" : "Try adjusting your filters"}
              </p>
              {query && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Popular searches:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["stethoscope", "blood pressure", "thermometer", "pulse oximeter"].map((suggestion) => (
                        <Link key={suggestion} href={`/aarogyamart/search?q=${suggestion}`}>
                          <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                            {suggestion}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link href="/aarogyamart/products">
                    <Button>Browse All Products</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
