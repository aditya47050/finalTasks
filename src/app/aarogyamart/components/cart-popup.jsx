"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { useCart } from './cart-context';
import { FiX } from "react-icons/fi";
import { RiShoppingBag4Line } from "react-icons/ri";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa"



export function CartPopup() {
  const { state, closeCart, updateQuantity, removeItem, getTotalItems, getTotalPrice } = useCart()

  if (!state.isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={closeCart} />

      {/* Cart Popup */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Shopping Cart ({getTotalItems()})</h2>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <FiX className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <RiShoppingBag4Line className="h-16 w-16 text-blue-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-4">Add some products to get started</p>
              <Button onClick={closeCart} className="bg-blue-500 hover:bg-blue-500 text-white rounded-xl ">Continue Shopping</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl">
                        <Image src={item.product.images[0] || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">{item.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">{item.brand}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-blue-500">₹{item.product.originalPrice.toLocaleString()}</span>
                            {item.product.price > item.product.originalPrice && (
                              <span className="text-xs text-gray-500 line-through">
                                ₹{item.product.price.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 rounded-xl border border-blue-500 p-1">
                            <Button
                              size="icon"
                              className="h-6 w-6 bg-blue-500 hover:bg-blue-500 text-white rounded-[10px]"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <FaMinus className="h-3 w-3" />
                            </Button>
                            <span className="text-base font-medium text-blue-500 w-8 text-center">{item.quantity}</span>
                            <Button
                              size="icon"
                              className="h-6 w-6 bg-blue-500 hover:bg-blue-500 text-white rounded-[10px]"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <FaPlus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeItem(item.id)}
                      >
                        <FaTrash className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total:</span>
              <span className="text-blue-500">₹{getTotalPrice().toLocaleString()}</span>
            </div>

            {/* Free Shipping Indicator */}
            {getTotalPrice() < 2000 && (
              <div className="text-center">
                <Badge className="text-sm w-full flex justify-center text-blue-800 !rounded-xl p-1 bg-blue-100">
                  Add ₹{(2000 - getTotalPrice()).toLocaleString()} more for free shipping
                </Badge>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link href="/aarogyamart/cart" onClick={closeCart}>
                <Button className="w-full bg-blue-800 hover:bg-blue-800 text-white rounded-xl">
                  View Cart
                </Button>
              </Link>
              <Link href="/aarogyamart/checkout" onClick={closeCart}>
                <Button className="w-full bg-gray-500 hover:bg-gray-500 rounded-xl text-white mt-2">Checkout</Button>
              </Link>
              <Link href="/aarogyamart" onClick={closeCart}>
                <Button className="w-full bg-blue-500 mt-2 hover:bg-blue-500 text-white rounded-xl">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
