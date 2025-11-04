"use client"

import React, { createContext, useContext, useReducer, useEffect } from "react"

const WishlistContext = createContext(null)

const WishlistReducer = (state, action) => {
  switch (action.type) {
    case "SET_WISHLIST":
      return { ...state, items: action.payload }
    case "OPEN_WISHLIST":
      return { ...state, isOpen: true }
    case "CLOSE_WISHLIST":
      return { ...state, isOpen: false }
    case "TOGGLE_WISHLIST":
      return { ...state, isOpen: !state.isOpen }
    default:
      return state
  }
}

export function WishlistProvider({ children, userId }) {
  const [state, dispatch] = useReducer(WishlistReducer, {
    items: [],
    isOpen: false,
  })

  // Fetch Wishlist from API
  useEffect(() => {
    if (!userId) return
    fetch(`/api/aarogyamart/wishlist/${userId}`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: "SET_WISHLIST", payload: data.items || [] }))
      .catch((err) => console.error("Fetch wishlist error:", err))
  }, [userId])

  // Add item
  const addItem = async (item) => {
    try {
      const res = await fetch(`/api/aarogyamart/wishlist/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      })
      const newItem = await res.json()
      dispatch({ type: "SET_WISHLIST", payload: [...state.items, newItem] })
      dispatch({ type: "OPEN_WISHLIST" })
    } catch (err) {
      console.error("Add to wishlist error:", err)
    }
  }

  // Remove item
  const removeItem = async (id) => {
    try {
      await fetch(`/api/aarogyamart/wishlist/${userId}?itemId=${id}`, { method: "DELETE" })
      dispatch({ type: "SET_WISHLIST", payload: state.items.filter((i) => i.id !== id) })
    } catch (err) {
      console.error("Remove wishlist error:", err)
    }
  }

  // Count wishlist items
  const getWishlistTotalItems = () => state.items.length

  // ✅ Calculate total price
  const getTotalPrice = () =>
    state.items.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0)

  const toggleWishlist = () => dispatch({ type: "TOGGLE_WISHLIST" })
  const openWishlist = () => dispatch({ type: "OPEN_WISHLIST" })
  const closeWishlist = () => dispatch({ type: "CLOSE_WISHLIST" })

  return (
    <WishlistContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        getWishlistTotalItems,
        getTotalPrice, // ✅ added here
        toggleWishlist,
        openWishlist,
        closeWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider")
  return context
}
