"use client"

import React, { createContext, useContext, useReducer, useEffect } from "react"

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return { ...state, items: action.payload.items || [] }

    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item
          ),
          isOpen: true,
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
        isOpen: true,
      }
    }

    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      }

    case "CLEAR_CART":
      return { ...state, items: [] }

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen }

    case "OPEN_CART":
      return { ...state, isOpen: true }

    case "CLOSE_CART":
      return { ...state, isOpen: false }

    default:
      return state
  }
}

const CartContext = createContext(null)

export function CartProvider({ children, userId }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })

  // Fetch cart on mount
  useEffect(() => {
    if (!userId) return
    const fetchCart = async () => {
      try {
        const res = await fetch(`/api/aarogyamart/cart/${userId}`)
        const data = await res.json()
        if (data.success) {
          dispatch({ type: "SET_CART", payload: data.data })
        }
      } catch (err) {
        console.error("Failed to load cart:", err)
      }
    }
    fetchCart()
  }, [userId])

  // API Actions
  const addItem = async (product) => {
    try {
      const res = await fetch(`/api/aarogyamart/cart/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      })
      const data = await res.json()
      if (data.success) {
        dispatch({ type: "SET_CART", payload: data.data }) // full updated cart
      }
    } catch (err) {
      console.error("Add to cart failed:", err)
    }
  }

  const removeItem = async (id) => {
    try {
      await fetch(`/api/aarogyamart/cart/${userId}/item/${id}`, { method: "DELETE" })
      dispatch({ type: "REMOVE_ITEM", payload: id })
    } catch (err) {
      console.error("Remove item failed:", err)
    }
  }

  const updateQuantity = async (id, quantity) => {
    try {
      await fetch(`/api/aarogyamart/cart/${userId}/item/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      })
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
    } catch (err) {
      console.error("Update quantity failed:", err)
    }
  }

  const clearCart = async () => {
    try {
      await fetch(`/api/aarogyamart/cart/${userId}/clear`, { method: "DELETE" })
      dispatch({ type: "CLEAR_CART" })
    } catch (err) {
      console.error("Clear cart failed:", err)
    }
  }

  const toggleCart = () => dispatch({ type: "TOGGLE_CART" })
  const openCart = () => dispatch({ type: "OPEN_CART" })
  const closeCart = () => dispatch({ type: "CLOSE_CART" })

  const getTotalItems = () => state.items.reduce((t, i) => t + i.quantity, 0)
  const getTotalPrice = () => state.items.reduce((t, i) => t + i.product.originalPrice * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}
