"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { useWishlist } from "./wishlist-context"
import { FiX } from "react-icons/fi"
import { Heart } from "lucide-react"
import { FaTrash } from "react-icons/fa"

export function WishlistPopup() {
  const { state, closeWishlist, removeItem, getWishlistTotalItems } = useWishlist()

  if (!state.isOpen) return null

  const totalItems = getWishlistTotalItems()

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={closeWishlist} />

      {/* Wishlist Popup */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            Wishlist ({totalItems})
          </h2>
          <Button variant="ghost" size="icon" onClick={closeWishlist}>
            <FiX className="h-5 w-5" />
          </Button>
        </div>

        {/* Wishlist Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Heart className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Your Wishlist is empty</h3>
              <p className="text-gray-500 mb-4">
                Add products you like to your wishlist
              </p>
              <Button onClick={closeWishlist}>Continue Shopping</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex gap-3 items-center">
                      {/* Product Image */}
                      <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 mb-1">{item.brand}</p>
                        <span className="font-semibold text-blue-500 text-sm">
                          ₹{item.price.toLocaleString()}
                        </span>
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
          <div className="border-t p-4 space-y-2">
            {/* <Link href="/aarogyamart/wishlist" onClick={closeWishlist}>
              <Button className="w-full">View Full Wishlist</Button>
            </Link> */}
            <Button
              className="w-full rounded-xl bg-blue-500 hover:bg-blue-500 text-white"
              onClick={closeWishlist}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
