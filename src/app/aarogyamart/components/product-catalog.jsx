"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Heart, ShoppingCart, Filter, Grid, List } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "./cart-context"
import { useWishlist } from "./wishlist-context"

// Hoisted function declaration
function calculateAverageRating(reviews = []) {
  if (!Array.isArray(reviews) || reviews.length === 0) return 0
  const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0)
  return sum / reviews.length
}


export function ProductCatalog() {
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 0])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [minDiscount, setMinDiscount] = useState(0)
  const productsPerPage = 12
  const {
    state: wishlistState,
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    getWishlistTotalItems,
  } = useWishlist() // ✅ get wishlist

  // Fetch categories, brands, and products
  const fetchData = async () => {
    setLoading(true)
    try {
      const [catRes, brandRes, prodRes] = await Promise.all([
        fetch("/api/aarogyamart/categories/countwithdata"),
        fetch("/api/aarogyamart/brands"),
        fetch("/api/aarogyamart/products"),
      ])
      const [catData, brandData, prodData] = await Promise.all([catRes.json(), brandRes.json(), prodRes.json()])

      setCategories(catData)
      // Normalize brands
      const normalizedBrands = [
        { label: "All Brands", value: "all" },
        ...(brandData?.data?.map((brand) => ({
          label: brand.name,
          value: brand.id, // use id or name, not the full object
        })) || []),
      ]

      setBrands(normalizedBrands)
      setProducts(prodData?.data)
    } catch (err) {
      console.error("Failed to fetch catalog data:", err)
    } finally {
      setLoading(false)
    }
  }
  const quantity = 1
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
  useEffect(() => {
  if (products.length > 0) {
    const maxPrice = Math.max(...products.map((p) => p.price || 0))
    setPriceRange([0, maxPrice])
  }
}, [products])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, selectedBrand, priceRange, showInStockOnly, minRating, minDiscount, sortBy])

  // Filter products
const filteredProducts = products.filter((product) => {
  const categoryId = product?.categoryId ?? product?.category?.id ?? product?.category;
  const brandId = product?.brandId ?? product?.brand?.id ?? product?.brand?.name;
  const avgRating = calculateAverageRating(product?.reviews || []);
  const discount = product?.discount ?? 0;
  const price = product?.price ?? 0;

  const categoryMatch = selectedCategory === "all" || String(categoryId) === String(selectedCategory);
  const brandMatch = selectedBrand === "all" || String(brandId) === String(selectedBrand);
  const priceMatch = price >= priceRange[0] && price <= priceRange[1];
  const stockMatch = !showInStockOnly || Boolean(product.inStock);
  const ratingMatch = minRating === 0 || avgRating >= minRating;
  const discountMatch = minDiscount === 0 || discount >= minDiscount;

  if (!(categoryMatch && brandMatch && priceMatch && stockMatch && ratingMatch && discountMatch)) {
    console.log("Filtered out:", product.name, {
      categoryMatch,
      brandMatch,
      priceMatch,
      stockMatch,
      ratingMatch,
      discountMatch,
      discount,
      minDiscount,
      price: product.price,
    });
  }

  return categoryMatch && brandMatch && priceMatch && stockMatch && ratingMatch && discountMatch;
});



  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return calculateAverageRating(b.reviews || []) - calculateAverageRating(a.reviews || [])
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt)
      default:
        return 0
    }
  })

  // Check if a product is in wishlist
  const isProductWishlisted = (productId) => {
    return wishlistState.items.some((item) => item.id === productId)
  }

  // Handle wishlist click per product
  const handleWishlistClick = (product) => {
    if (!product) return
    if (isProductWishlisted(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
      })
    }
  }

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage)
  console.log(products);
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/aarogyamart" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <span>Products</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Medical Equipment</h1>
          <p className="text-muted-foreground">
            Showing {paginatedProducts.length} of {filteredProducts.length} products
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
              <SelectItem value="featured">Featured</SelectItem>
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

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className={`w-full md:w-64 space-y-6 ${showFilters ? "block" : "hidden md:block"}`}>
          {/* Categories */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "ghost"}
                  className="w-full justify-between text-left"
                  onClick={() => setSelectedCategory("all")}
                >
                  <span>All</span>
                  <span className="text-xs">({products.length})</span>
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={String(selectedCategory) === String(category.id) ? "default" : "ghost"}
                    className="w-full justify-between text-left"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs">({category.products.length})</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

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
              <Select
                value={selectedBrand}
                className="text-black placeholder:text-black"
                onValueChange={setSelectedBrand}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.value} value={brand.value}>
                      {brand.label}
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
                <Checkbox
                  id="inStock"
                  checked={showInStockOnly}
                  onCheckedChange={(v) => setShowInStockOnly(Boolean(v))}
                />
                <label htmlFor="inStock" className="text-sm font-medium">
                  In Stock Only
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Customer Rating Filter */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Customer Rating</h3>
              <Select value={String(minRating)} onValueChange={(v) => setMinRating(Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any</SelectItem>
                  <SelectItem value="4">4★ & above</SelectItem>
                  <SelectItem value="3">3★ & above</SelectItem>
                  <SelectItem value="2">2★ & above</SelectItem>
                  <SelectItem value="1">1★ & above</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Discount Filter */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Discount</h3>
              <Select value={String(minDiscount)} onValueChange={(v) => setMinDiscount(Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any discount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any</SelectItem>
                  <SelectItem value="10">10% or more</SelectItem>
                  <SelectItem value="20">20% or more</SelectItem>
                  <SelectItem value="30">30% or more</SelectItem>
                  <SelectItem value="40">40% or more</SelectItem>
                  <SelectItem value="50">50% or more</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </aside>

        {/* Products Grid/List */}
        <div className="flex-1">
          {loading ? (
            // Only show loading skeleton on first load
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="bg-white rounded-lg shadow p-4">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                    <div className="h-8 w-10 bg-gray-200 rounded"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            // Show "No products found" when filters return empty
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
              <Button
                onClick={() => {
                  setSelectedCategory("all")
                  setSelectedBrand("all")
                  setPriceRange([0, 60000])
                  setShowInStockOnly(false)
                  setMinRating(0)
                  setMinDiscount(0)
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : viewMode === "grid" ? (
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
                          className="w-full h-48 object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                      </Link>

                      {product.badge && (
                        <Badge className="absolute top-2 left-2 bg-blue-500 text-gray-50">{product.badge}</Badge>
                      )}
                      {!product.inStock && (
                        <Badge className="absolute top-2 right-2 bg-red-500 text-white">Out of Stock</Badge>
                      )}

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleWishlistClick(product)} // ✅ pass product
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <Heart
                          className={`h-8 w-8 ${isProductWishlisted(product.id) ? "fill-red-500 text-red-500" : ""}`}
                        />
                      </Button>

                      {product.discount > 0 && (
                        <Badge className="absolute bottom-2 right-2 bg-red-500 text-white">
                          {product.discount}% OFF
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <Link href={`/aarogyamart/product/${product.id}`}>
                        <h3 className="font-semibold text-base mb-2 group-hover:text-blue-500 transition-colors line-clamp-2 truncate">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-sm text-gray-500 mb-2">{product.brand.name}</p>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => {
                            const averageRating = calculateAverageRating(product.reviews || [])
                            return (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            )
                          })}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {product.reviews.length > 0
                            ? `${calculateAverageRating(product.reviews || [])} (${product.reviews.length})`
                            : "No ratings yet"}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        {product.originalPrice > 0 && (<span className="text-lg font-bold text-blue-500">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>)}
                        {product.price > product.originalPrice && (
                          <span className={`text-sm text-muted-foreground ${product.originalPrice > 0 ? "line-through" : ""}`}>
                            ₹{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <Button
                        className="w-full rounded-xl bg-blue-500 hover:bg-blue-500 text-white"
                        size="sm"
                        onClick={() => handleAddToCart(product)} // ✅ wrap in arrow function
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

                        <p className="text-gray-500 mb-2">{product.brand.name}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => {
                              const averageRating = calculateAverageRating(product.reviews || [])
                              return (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              )
                            })}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {product.reviews.length > 0
                              ? `${calculateAverageRating(product.reviews || [])} (${product.reviews.length})`
                              : "No ratings yet"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          {/* Price */}
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
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
                          <Button
                            className="rounded-xl px-6"
                            disabled={!product.inStock}
                            onClick={() => handleAddToCart(product)}
                          >
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
        </div>
      </div>

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

export default ProductCatalog
