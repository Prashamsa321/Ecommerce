import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { cartService } from '../services/cartService'
import { useAuth } from './AuthContext'

export const CartContext = createContext(null)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user, isAuthenticated } = useAuth()

  // Fetch cart function
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setCartItems([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await cartService.getCart()
      setCartItems(data.items || [])
    } catch (error) {
      console.error('Failed to fetch cart:', error)
      setError(error.response?.data?.message || 'Failed to fetch cart')
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  // Add to cart function
  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!isAuthenticated || !user) {
      setError('Please login to add items to cart')
      return false
    }

    if (!productId) {
      setError('Invalid product')
      return false
    }

    try {
      setLoading(true)
      setError(null)
      const data = await cartService.addToCart(productId, quantity)
      setCartItems(data.items || [])
      return true
    } catch (error) {
      console.error('Failed to add to cart:', error)
      setError(error.response?.data?.message || 'Failed to add to cart')
      return false
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  // Update cart item quantity
  const updateQuantity = useCallback(async (productId, quantity) => {
    if (!isAuthenticated || !user) return

    try {
      setLoading(true)
      setError(null)
      const data = await cartService.updateCartItem(productId, quantity)
      setCartItems(data.items || [])
    } catch (error) {
      console.error('Failed to update quantity:', error)
      setError(error.response?.data?.message || 'Failed to update quantity')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  // Remove from cart
  const removeFromCart = useCallback(async (productId) => {
    if (!isAuthenticated || !user) return

    try {
      setLoading(true)
      setError(null)
      const data = await cartService.removeFromCart(productId)
      setCartItems(data.items || [])
    } catch (error) {
      console.error('Failed to remove from cart:', error)
      setError(error.response?.data?.message || 'Failed to remove from cart')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  // Clear cart
  const clearCart = useCallback(async () => {
    if (!isAuthenticated || !user) return

    try {
      setLoading(true)
      setError(null)
      const data = await cartService.clearCart()
      setCartItems(data.items || [])
    } catch (error) {
      console.error('Failed to clear cart:', error)
      setError(error.response?.data?.message || 'Failed to clear cart')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  // Get total items count
  const getCartCount = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0)
  }, [cartItems])

  // Get cart total
  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0)
  }, [cartItems])

  // Fetch cart when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCart()
    } else {
      setCartItems([])
    }
  }, [isAuthenticated, user, fetchCart])

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCart,
    getCartCount,
    getCartTotal
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}