"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  Filter,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Heart,
  Clock,
  CheckCircle,
  AlertCircle,
  Pill,
  Shield,
  Star,
} from "lucide-react"
import { FaArrowCircleDown } from "react-icons/fa"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const PharmacyProductsClient = ({ pharmacy, products, customer }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState("price")
  const [sortOrder, setSortOrder] = useState("desc")
  const [showInStock, setShowInStock] = useState(false)
  const [showPrescriptionRequired, setShowPrescriptionRequired] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])
  const [isOrderProcessing, setIsOrderProcessing] = useState(false)
  const [editingQuantity, setEditingQuantity] = useState(null)

  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedStockFilter, setSelectedStockFilter] = useState("")
  const [selectedPrescriptionFilter, setSelectedPrescriptionFilter] = useState("")

  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category).filter(Boolean))]
  }, [products])

  const brands = useMemo(() => {
    return [...new Set(products.map((p) => p.brand).filter(Boolean))]
  }, [products])

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.composition && product.composition.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = !selectedCategory || product.category === selectedCategory
      const matchesBrand = !selectedBrand || product.brand === selectedBrand

      const price = product.discountedPrice || product.price
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1]

      const matchesStock = selectedStockFilter !== "in-stock" || product.stock > 0
      const matchesPrescription = selectedPrescriptionFilter !== "prescription-required" || product.prescriptionRequired

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock && matchesPrescription
    })

    // Sort products
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case "price":
          aValue = a.discountedPrice || a.price
          bValue = b.discountedPrice || b.price
          break
        case "stock":
          aValue = a.stock
          bValue = b.stock
          break
        case "brand":
          aValue = a.brand || ""
          bValue = b.brand || ""
          break
        default:
          aValue = a.name
          bValue = b.name
      }

      if (typeof aValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    })

    return filtered
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedBrand,
    priceRange,
    sortBy,
    sortOrder,
    selectedStockFilter,
    selectedPrescriptionFilter,
  ])

  const addToCart = (product, quantity = 1) => {
    const existingProduct = cart.find((item) => item.id === product.id)
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) } : item,
        ),
      )
    } else {
      setCart([...cart, { ...product, quantity: Math.min(quantity, product.stock) }])
    }

    toast.success(`${product.name} has been added to your cart.`);
  }

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: Math.min(quantity, item.stock) } : item)))
  }

  const handleQuantityInputChange = (productId, value) => {
    // Allow empty input for better UX
    if (value === "") {
      setCart(cart.map((item) =>
        item.id === productId ? { ...item, quantity: "" } : item
      ))
      return
    }

    const quantity = parseInt(value)
    if (isNaN(quantity) || quantity < 0) return

    updateCartQuantity(productId, quantity)
  }

  const startEditingQuantity = (productId) => {
    setEditingQuantity(productId)
  }

  const finishEditingQuantity = (productId) => {
    setEditingQuantity(null)
    const cartItem = cart.find(item => item.id === productId)
    if (cartItem && (cartItem.quantity === "" || cartItem.quantity <= 0)) {
      removeFromCart(productId)
    }
  }

  const handleQuantityInputBlur = (productId) => {
    finishEditingQuantity(productId)
  }

  const handleQuantityInputKeyPress = (productId, e) => {
    if (e.key === 'Enter') {
      finishEditingQuantity(productId)
    }
  }

  const removeFromCart = (productId) => {
    const product = cart.find((item) => item.id === productId)
    setCart(cart.filter((item) => item.id !== productId))
    setEditingQuantity(null)
    if (product) {
      toast.success(`${product.name} has been removed from your cart.`);
    }
  }

  const toggleFavorite = (productId) => {
    const product = products.find((p) => p.id === productId)
    const isCurrentlyFavorite = favorites.includes(productId)

    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))

    if (product) {
      if (isCurrentlyFavorite) {
        toast.success(`${product.name} has been removed from your favorites.`);
      }
      else {
        toast.success(`${product.name} has been added to your favorites.`);
      }
    }
  }

  const calculatePrice = (product, quantity) => {
    const price = product.discountedPrice || product.price
    return price * quantity
  }

  const getTotalCartValue = () => {
    return cart.reduce((total, item) => total + calculatePrice(item, item.quantity), 0)
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSelectedBrand("")
    setSelectedStockFilter("")
    setSelectedPrescriptionFilter("")
    setPriceRange([0, 10000])
    setSortBy("price")
    setSortOrder("desc")

    toast({
      title: "Filters Cleared",
      description: "All filters have been reset.",
    })
  }

  const handleSaveOrder = async () => {
    if (!customer) {
      toast.error("Please log in to place an order.")
      return
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty. Add some products first.")
      return
    }

    setIsOrderProcessing(true)

    const orderDetails = {
      patientId: customer.id,
      paymentMethod: "ONLINE",
      totalAmount: getTotalCartValue(),
      items: cart.map((item) => ({
        productId: item.id,
        productName: item.name,
        unitLabel: item.unit,
        unitCountPerPack: 1,
        quantity: item.quantity,
        unitPrice: item.price,
        discountPercent: item.discountPercent || 0,
        discountedUnitPrice: item.discountedPrice || item.price,
        lineTotal: calculatePrice(item, item.quantity),
      })),
    }

    try {
      const response = await fetch(`/api/pharmacy/${pharmacy.id}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(`Error saving order: ${result.error || "Unknown error"}`)
        return
      }

      toast.success("Your order has been placed and will be processed soon.")

      setTimeout(() => setCart([]), 500)
    } catch (error) {
      console.error("Error saving order:", error)
      toast.error("Error placing order. Please try again.");
    } finally {
      setIsOrderProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-3 px-2 mt-2 lg:hidden w-full mb-4">
          <button
            className="group flex items-center justify-between text-[#5271FF] bg-white border border-[#5271FF] font-semibold px-2 py-1 rounded-[10px] shadow transition hover:bg-[#5271FF] hover:text-white"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span>All Filters</span>
            <span className="h-6 w-6 rounded-full flex justify-center items-center">
              <FaArrowCircleDown className="w-5 h-5 text-[#5271FF] transition group-hover:text-white" />
            </span>
          </button>
          <button className="group flex items-center justify-between bg-white border border-[#5271FF] text-[#5271FF] font-semibold px-2 py-1 rounded-[10px] shadow transition hover:bg-[#5271FF] hover:text-white">
            <span>Products</span>
            <span className="h-6 w-6 rounded-full flex justify-center items-center">
              <FaArrowCircleDown className="w-5 h-5 text-[#5271FF] transition group-hover:text-white" />
            </span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-[#D9D9D9] rounded-xl shadow-sm p-6 sticky top-6 animate-fade-in">
              <div className="flex justify-center gap-2 mb-4 relative">
                <p className="border-[#5271FF] rounded-xl border">
                  <span className="px-4 py-1 text-[#243460] font-semibold text-[12px] flex items-center">
                    All Filters
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {/* Search Input */}
                <div className="mb-2">
                  <input
                    type="text"
                    className="w-full md:h-10 h-9 p-2 border placeholder:md:text-[14px] placeholder:text-[12px] placeholder:text-white text-white bg-[#5271FF] rounded-full"
                    placeholder="Search medicines, brands..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Category Dropdown */}
                <div className="mb-2 relative">
                  <select
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="" className="bg-gray-50 text-[#453565]">
                      All Categories
                    </option>
                    {categories.map((category) => (
                      <option key={category} value={category} className="bg-gray-50 text-[#453565]">
                        {category}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                  </span>
                </div>

                {/* Brand Dropdown */}
                <div className="mb-2 relative">
                  <select
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  >
                    <option value="" className="bg-gray-50 text-[#453565]">
                      All Brands
                    </option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand} className="bg-gray-50 text-[#453565]">
                        {brand}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                  </span>
                </div>

                {/* Stock Filter Dropdown */}
                {/* <div className="mb-2 relative">
                  <select
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                    value={selectedStockFilter}
                    onChange={(e) => setSelectedStockFilter(e.target.value)}
                  >
                    <option value="" className="bg-gray-50 text-[#453565]">
                      All Stock Status
                    </option>
                    <option value="in-stock" className="bg-gray-50 text-[#453565]">
                      In Stock Only
                    </option>
                  </select>
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                  </span>
                </div> */}

                {/* Prescription Filter Dropdown */}
                {/* <div className="mb-2 relative">
                  <select
                    className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                    value={selectedPrescriptionFilter}
                    onChange={(e) => setSelectedPrescriptionFilter(e.target.value)}
                  >
                    <option value="" className="bg-gray-50 text-[#453565]">
                      All Prescription Types
                    </option>
                    <option value="prescription-required" className="bg-gray-50 text-[#453565]">
                      Prescription Required
                    </option>
                  </select>
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                  </span>
                </div> */}

                {/* Price Range */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#243460] mb-3">
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </label>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={10000} step={100} className="w-full" />
                </div>
              </div>

              <div className="flex text-center justify-center mt-2">
                <button
                  onClick={clearAllFilters}
                  className="bg-[#FF5E00] shadow-lg rounded-2xl text-white placeholder:md:text-[14px] text-[12px] font-medium border-2 px-4 p-2"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden border-[#5271FF] text-[#5271FF] hover:bg-[#5271FF] hover:text-white"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-40 border-[#5271FF] focus:border-[#5271FF] focus:ring-[#5271FF]/20">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="brand">Brand</SelectItem>
                      <SelectItem value="stock">Stock</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-full sm:w-32 border-[#5271FF] focus:border-[#5271FF] focus:ring-[#5271FF]/20">
                      <SelectValue placeholder="Order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Low to High</SelectItem>
                      <SelectItem value="desc">High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {filteredAndSortedProducts.map((product, index) => {
                const cartItem = cart.find((item) => item.id === product.id)
                const inCart = !!cartItem
                const isFavorite = favorites.includes(product.id)
                const isEditing = editingQuantity === product.id

                return (
                  <Card
                    key={product.id}
                    className="h-full min-h-[320px] flex flex-col overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white rounded-3xl animate-slide-in-up group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-0 flex flex-col flex-grow justify-between">
                      {/* Product Header with Gradient */}
                      <div className="relative w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#5271FF] to-[#8b5cf6] rounded-t-3xl py-6">
                        <div className="w-24 h-24 bg-white border-4 border-[#FF5E00] rounded-full flex items-center justify-center text-[#5271FF] font-bold text-lg">
                          {product.productImage ? (
                            <img
                              src={product.productImage}
                              alt={product.name}
                              className="h-8 w-8 object-cover rounded-md border"
                            />
                          ) : (
                            <div className="h-8 w-8 bg-gray-200 rounded-md border flex items-center justify-center text-gray-400">
                              📦
                            </div>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex flex-col items-center justify-center gap-2 mt-3">
                          <div className="flex shadow-lg rounded-xl items-center gap-1 p-1 bg-white">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < 4 ? "text-[#ffce38] fill-[#ffce38]" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <p className="text-[12px] font-medium text-white">Trusted Medicine</p>
                        </div>
                      </div>

                      {/* Product Content */}
                      <div className="flex flex-col items-center text-center px-4 pt-6 pb-4 flex-grow">
                        <div className="flex justify-between items-start mb-4 w-full">
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#FF5E00] text-lg leading-tight text-balance group-hover:text-[#5271FF] transition-colors">
                              {product.name}
                            </h4>
                            {product.brand && (
                              <p className="text-sm text-[#243460] mt-1 font-medium">{product.brand}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(product.id)}
                            className="p-1 h-8 w-8 hover:bg-[#5271FF]/10"
                          >
                            <Heart
                              className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-[#243460]"}`}
                            />
                          </Button>
                        </div>

                        {product.category && (
                          <Badge variant="outline" className="text-xs mb-3 border-[#5271FF] text-[#5271FF]">
                            {product.category}
                          </Badge>
                        )}

                        {product.composition && (
                          <p className="text-xs text-[#243460] mb-4 line-clamp-2 leading-relaxed">
                            {product.composition}
                          </p>
                        )}

                        {/* Price Display - Clear per unit pricing */}
                        <div className="flex flex-col items-center gap-2 mb-4 w-full">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-[#5271FF]">
                              ₹{(product.discountedPrice || product.price).toFixed(2)}
                            </span>
                            {product.discountedPrice && product.discountedPrice < product.price && (
                              <>
                                <span className="text-sm text-[#243460] line-through">₹{product.price.toFixed(2)}</span>
                                <Badge variant="destructive" className="text-xs bg-[#FF5E00] text-white">
                                  {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% OFF
                                </Badge>
                              </>
                            )}
                          </div>
                          {(product.category === "Tablets" || product.category === "Capsule") && (
                            <div className="text-xs text-[#243460] bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
                               {product.unit || 'unit'} Units
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mb-4 w-full">
                          <div className="flex items-center gap-2">
                            {product.stock > 0 ? (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">{product.stock} in stock</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-red-500">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">Out of stock</span>
                              </div>
                            )}
                          </div>
                          {product.prescriptionRequired && (
                            <Badge variant="secondary" className="text-xs bg-red-100 text-red-600 border-red-200">
                              <Shield className="h-3 w-3 mr-1" />
                              Rx Required
                            </Badge>
                          )}
                        </div>

                        {/* Cart Controls with Editable Quantity */}
                        {inCart ? (
                          <div className="flex items-center justify-between animate-scale-in w-full">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateCartQuantity(product.id, cartItem.quantity - 1)}
                                className="h-8 w-8 p-0 border-[#5271FF] hover:bg-[#5271FF] hover:text-white"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>

                              {/* Editable Quantity Input */}
                              {isEditing ? (
                                <input
                                  type="number"
                                  min="1"
                                  max={product.stock}
                                  value={cartItem.quantity}
                                  onChange={(e) => handleQuantityInputChange(product.id, e.target.value)}
                                  onBlur={() => handleQuantityInputBlur(product.id)}
                                  onKeyPress={(e) => handleQuantityInputKeyPress(product.id, e)}
                                  className="w-16 h-8 text-center border-2 border-[#5271FF] rounded-lg font-semibold text-[#5271FF] focus:outline-none focus:ring-2 focus:ring-[#5271FF]/20"
                                  autoFocus
                                />
                              ) : (
                                <div
                                  className="w-16 h-8 px-3 py-1 bg-[#5271FF]/10 rounded text-[#5271FF] font-semibold text-center cursor-pointer border-2 border-transparent hover:border-[#5271FF] transition-colors"
                                  onClick={() => startEditingQuantity(product.id)}
                                >
                                  {cartItem.quantity}
                                </div>
                              )}

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateCartQuantity(product.id, cartItem.quantity + 1)}
                                disabled={cartItem.quantity >= product.stock}
                                className="h-8 w-8 p-0 border-[#5271FF] hover:bg-[#5271FF] hover:text-white disabled:opacity-50"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromCart(product.id)}
                              className="text-[#243460] hover:text-red-500 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => addToCart(product, 1)}
                            disabled={product.stock === 0}
                            className="w-full bg-[#5271FF] hover:bg-[#5271FF]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-16 animate-fade-in">
                <div className="p-4 bg-muted/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search criteria or clearing filters</p>
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  className="border-border hover:bg-muted bg-transparent"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-[#5271FF]/20 shadow-lg p-4 z-50 animate-slide-in-up">
            <div className="container mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[#5271FF]/10 rounded-full">
                    <ShoppingCart className="h-5 w-5 text-[#5271FF]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#243460] text-lg">
                      {cart.length} items • ₹{getTotalCartValue().toFixed(2)}
                    </p>
                    <p className="text-sm text-[#243460]">
                      {cart.reduce((total, item) => total + item.quantity, 0)} total units
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleSaveOrder}
                  size="lg"
                  disabled={isOrderProcessing}
                  className="bg-[#FF5E00] hover:bg-[#FF5E00]/90 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50 rounded-xl"
                >
                  {isOrderProcessing ? (
                    <>
                      <Clock className="h-5 w-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PharmacyProductsClient