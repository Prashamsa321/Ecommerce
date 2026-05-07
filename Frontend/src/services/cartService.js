// src/services/cartService.js
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

// Add token to requests
const getAuthConfig = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

export const cartService = {
  // Get user's cart
  async getCart() {
    try {
      const response = await axios.get(`${API_URL}/cart`, getAuthConfig())
      return response.data
    } catch (error) {
      console.error('Get cart error:', error.response?.data || error.message)
      throw error
    }
  },

  // Add item to cart
  async addToCart(productId, quantity = 1) {
    try {
      const response = await axios.post(
        `${API_URL}/cart/addtocart`,
        { productId, quantity },
        getAuthConfig()
      )
      return response.data
    } catch (error) {
      console.error('Add to cart error:', error.response?.data || error.message)
      throw error
    }
  },

  // Update cart item quantity
  async updateCartItem(productId, quantity) {
    try {
      const response = await axios.put(
        `${API_URL}/cart/update`,
        { productId, quantity },
        getAuthConfig()
      )
      return response.data
    } catch (error) {
      console.error('Update cart error:', error.response?.data || error.message)
      throw error
    }
  },

  // Remove item from cart
  async removeFromCart(productId) {
    try {
      const response = await axios.delete(
        `${API_URL}/cart/remove/${productId}`,
        getAuthConfig()
      )
      return response.data
    } catch (error) {
      console.error('Remove from cart error:', error.response?.data || error.message)
      throw error
    }
  },

  // Clear cart
  async clearCart() {
    try {
      const response = await axios.delete(`${API_URL}/cart/clear`, getAuthConfig())
      return response.data
    } catch (error) {
      console.error('Clear cart error:', error.response?.data || error.message)
      throw error
    }
  }
}

export default cartService