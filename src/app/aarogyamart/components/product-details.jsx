"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Minus, Plus, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { useCart } from "./cart-context"
import Image from "next/image"
import Link from "next/link"
import { MdOutlineVerified } from "react-icons/md"
import { useWishlist } from "./wishlist-context"
import {  Copy, Mail, MessageCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export function ProductDetails({ productId }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [open, setOpen] = useState(false)
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success("Product link copied!")
    } catch {
      toast.error("Failed to copy link")
    }
  }

  const handleShareEmail = () => {
    const subject = encodeURIComponent("Check out this product on AarogyaMart!")
    const body = encodeURIComponent(`Hey! I found this product you might like:\n\n${shareUrl}`)
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank")
  }

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(`Check out this product on AarogyaMart: ${shareUrl}`)
    window.open(`https://wa.me/?text=${message}`, "_blank")
  }
  
  const { addItem } = useCart()
  const { state: wishlistState, addItem: addToWishlist, removeItem: removeFromWishlist, getWishlistTotalItems } = useWishlist() // ✅ get wishlist

  const isWishlisted = product ? wishlistState.items.some((i) => i.id === product.id) : false // ✅ check if product is already wishlisted
  // Fetch product details from API
const calculateAverageRating = (reviews = []) => {
  if (!reviews.length) return 0
  const total = reviews.reduce((sum, r) => sum + r.rating, 0)
  return Number((total / reviews.length).toFixed(1))  // ✅ rounded to 1 decimal
}


useEffect(() => {
  async function fetchProduct() {
    try {
      const res = await fetch(`/api/aarogyamart/products/${productId}`)
      if (!res.ok) throw new Error("Failed to fetch product")
      const data = await res.json()

      const reviewRes = await fetch(`/api/aarogyamart/products/${productId}/review`)
      const reviewData = await reviewRes.json()

      const avgRating = calculateAverageRating(reviewData.reviews)

      setProduct({
        ...data.data,
        reviews: reviewData.reviews,
        rating: avgRating, // ✅ set average
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  fetchProduct()
}, [productId])



  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
        <span>/</span>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
        <span>/</span>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="w-full aspect-square bg-gray-200 rounded-xl"></div>
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          {/* Brand + Title */}
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-8 w-3/4 bg-gray-200 rounded"></div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-5 w-5 bg-gray-200 rounded-full"></div>
            ))}
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <div className="h-6 w-24 bg-gray-200 rounded"></div>
            <div className="h-5 w-16 bg-gray-200 rounded"></div>
          </div>

          {/* Stock */}
          <div className="h-4 w-40 bg-gray-200 rounded"></div>

          {/* Description */}
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-3 w-full bg-gray-200 rounded"></div>
            ))}
          </div>

          {/* Quantity + Buttons */}
          <div className="flex gap-4">
            <div className="h-10 w-24 bg-gray-200 rounded-xl"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-xl"></div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-3 w-2/3 bg-gray-200 rounded"></div>
            ))}
          </div>

          {/* Shipping/Warranty */}
          <div className="grid grid-cols-3 gap-4 pt-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div>
        <div className="flex gap-4 border-b">
          {["Specifications", "Reviews", "Shipping"].map((tab, i) => (
            <div key={i} className="h-8 w-28 bg-gray-200 rounded"></div>
          ))}
        </div>
        <Card className="mt-6">
          <CardContent className="p-6 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 w-full bg-gray-200 rounded"></div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-6">The product you`re looking for doesn`t exist.</p>
        <Link href="/aarogyamart/products">
          <Button>Browse All Products</Button>
        </Link>
      </div>
    )
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stockCount) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      brand: product.brand.name,
      inStock: product.inStock,
      quantity,
    })
  }
   const handleWishlistClick = () => {
    if (!product) return
    if (isWishlisted) {
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

  const handleSubmitReview = async () => {
    if (!newReview.comment.trim()) return

    try {
      const res = await fetch(`/api/aarogyamart/products/${productId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      })
      if (!res.ok) throw new Error("Failed to submit review")

      const data = await res.json()

      // Update product reviews locally
      setProduct((prev) => ({
        ...prev,
        reviews: [data.review, ...prev.reviews],
        rating: (
          (prev.rating * prev.reviews.length + data.review.rating) /
          (prev.reviews.length + 1)
        ),
      }))

      // Reset review form
      setNewReview({ rating: 5, comment: "" })
    } catch (err) {
      console.error(err)
      alert("Failed to submit review")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/aarogyamart" className="hover:text-blue-500">
          Home
        </Link>
        <span>/</span>
        <Link href="/aarogyamart/products" className="hover:text-blue-500">
          Products
        </Link>
        <span>/</span>
        <Link href={`/aarogyamart/category/${product.category.id}`} className="hover:text-blue-500">
          {product.category.name}
        </Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      {/* Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl border-[1px]">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.badge && (
              <Badge className="absolute top-4 left-4 bg-blue-500 text-gray-50">{product.badge}</Badge>
            )}
            {product.discount > 0 && (
              <Badge className="absolute top-4 right-4 bg-red-500 text-white">{product.discount}% OFF</Badge>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                  selectedImage === index ? "border-blue-500" : "border-border hover:border-blue-500/50"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-500">{product.brand.name}</span>
              {!product.inStock && <Badge variant="destructive">Out of Stock</Badge>}
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-medium">{product.rating}</span>
              <span className="text-gray-500">({product.reviews.length} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-blue-500">₹{product.originalPrice.toLocaleString()}</span>
              {product.price > product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
              {product.discount > 0 && (
                <Badge className="bg-green-500 text-white">
                  Save ₹{(product.price - product.originalPrice).toLocaleString()}
                </Badge>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
            <span className={product.inStock ? "text-green-600" : "text-red-600"}>
              {product.inStock ? `In Stock (${product.stockCount} available)` : "Out of Stock"}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-500 leading-relaxed">{product.description}</p>

          {/* Quantity & Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border-[1px] border-gray-400 rounded-xl">
                <Button variant="ghost" size="sm" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stockCount}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button size="lg" className="flex-1 rounded-xl bg-blue-500 text-white hover:bg-blue-500" onClick={handleAddToCart} disabled={!product.inStock}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button
                variant={isWishlisted ? "destructive" : "outline"}
                size="lg"
                onClick={handleWishlistClick}
                className="rounded-xl"
              >
                <Heart className={`h-8 w-8 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>
               <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="rounded-xl bg-transparent border-gray-300 hover:bg-blue-50 hover:border-blue-200 transition flex items-center justify-center"
        >
          <Share2 className="h-8 w-8 text-blue-600" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-44 rounded-xl bg-white shadow-lg border p-1 animate-in fade-in slide-in-from-top-1 duration-200"
      >
        <DropdownMenuItem onClick={handleCopyLink} className="flex items-center gap-2 cursor-pointer">
          <Copy className="h-4 w-4 text-gray-600" />
          <span>Copy Link</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleShareEmail} className="flex items-center gap-2 cursor-pointer">
          <Mail className="h-4 w-4 text-gray-600" />
          <span>Email</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleShareWhatsApp} className="flex items-center gap-2 cursor-pointer">
          <MessageCircle className="h-4 w-4 text-green-600" />
          <span>WhatsApp</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-3">Key Features:</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Shipping/Warranty Icons */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <Truck className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-sm font-medium">Free Shipping</p>
              <p className="text-xs text-gray-500">On orders above ₹2,000</p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-sm font-medium">Warranty</p>
              <p className="text-xs text-gray-500">{product.Warranty}</p>
            </div>
            <div className="text-center">
              <RotateCcw className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-sm font-medium">Easy Returns</p>
              <p className="text-xs text-gray-500">7-day return policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="specifications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
        </TabsList>

        {/* Specifications Tab */}
        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                { product?.specifications &&
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium">{key}:</span>
                      <span className="text-gray-500">{value}</span>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start  gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-500 mb-2">{Number(product.rating.toFixed(1))}</div>
                    <div className="flex items-center justify-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">{product.reviews.length} reviews</div>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = product.reviews.filter((r) => Math.floor(r.rating) === stars).length
                      const percentage = (count / product.reviews.length) * 100
                      return (
                        <div key={stars} className="flex items-center gap-2 mb-2">
                          <span className="text-base w-10">{stars}★</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-3">
                            <div className="bg-yellow-400 h-3 rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-base text-gray-500 w-8">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                    <div className="flex-1">
                    <h4 className="font-semibold mb-2">Write a Review</h4>
                    <div className="space-y-2">
                        <div>
                        <label className="text-sm font-medium mb-2 block">Rating</label>
                        <Select
                            value={newReview.rating.toString()}
                            onValueChange={(value) => setNewReview({ ...newReview, rating: Number.parseInt(value) })}
                        >
                            <SelectTrigger className="w-32">
                            <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <SelectItem key={rating} value={rating.toString()}>
                                {rating} Star{rating !== 1 ? "s" : ""}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        </div>
                        <div>
                        <label className="text-sm font-medium mb-2 block">Your Review</label>
                        <Textarea
                            placeholder="Share your experience with this product..."
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            rows={4}
                        />
                        </div>
                        <Button className="bg-blue-500 hover:bg-blue-500 text-white rounded-xl  " onClick={handleSubmitReview} disabled={!newReview.comment.trim()}>
                        Submit Review
                        </Button>
                    </div>
                    </div>
                </div>

              </CardContent>
            </Card>

            <div className="space-y-4">
              {product.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="font-medium">{review.userEmail}</span>
                          {review.verified && (
                            <Badge  className="text-blue-700 bg-white text-sm">
                              <MdOutlineVerified size={20}/>
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-500 leading-relaxed">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Shipping Information</h3>
                  <ul className="space-y-2 text-gray-500">
                    <li>• Free shipping on orders above ₹2,000</li>
                    <li>• Standard delivery: 3-5 business days</li>
                    <li>• Express delivery: 1-2 business days (additional charges apply)</li>
                    <li>• Cash on delivery available</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Return Policy</h3>
                  <ul className="space-y-2 text-gray-500">
                    <li>• 7-day return policy from date of delivery</li>
                    <li>• Items must be in original condition and packaging</li>
                    <li>• Free return pickup for defective items</li>
                    <li>• Refund processed within 5-7 business days</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Warranty</h3>
                  <ul className="space-y-2 text-gray-500">
                    <li>• {product.Warranty} manufacturer warranty</li>
                    <li>• Warranty covers manufacturing defects</li>
                    <li>• Service centers available across India</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
