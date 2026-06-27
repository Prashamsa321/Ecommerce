import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const getAuthConfig = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
}

const parseProductsResponse = (data) => ({
  products: Array.isArray(data?.products) ? data.products : [],
  pagination: {
    page: data?.page || 1,
    limit: data?.limit || 12,
    total: data?.total ?? data?.products?.length ?? 0,
    totalPages: data?.totalPages || 1,
  },
})

export const productService = {
  async getProducts({ page = 1, limit = 12, search = '', category = '' } = {}) {
    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', String(limit))
      if (search) params.set('search', search)
      if (category) params.set('category', category)

      const response = await axios.get(`${API_URL}/products/getproduct?${params.toString()}`)
      return parseProductsResponse(response.data)
    } catch (error) {
      console.error('Get products error:', error.response?.data || error.message)
      throw error
    }
  },

  // Backward-compatible helper — fetches one page only
  async getAllProducts(options = {}) {
    const { products } = await this.getProducts(options)
    return products
  },

  async getProductById(id) {
    try {
      const response = await axios.get(`${API_URL}/products/getproduct/${id}`)
      return response.data.product || response.data
    } catch (error) {
      console.error('Get product error:', error.response?.data || error.message)
      throw error
    }
  },

  async createProduct(productData) {
    try {
      const response = await axios.post(
        `${API_URL}/products/createproduct`,
        productData,
        getAuthConfig()
      )
      return response.data
    } catch (error) {
      console.error('Create product error:', error.response?.data || error.message)
      throw error
    }
  },

  async updateProduct(id, productData) {
    try {
      const response = await axios.put(
        `${API_URL}/products/updateproduct/${id}`,
        productData,
        getAuthConfig()
      )
      return response.data
    } catch (error) {
      console.error('Update product error:', error.response?.data || error.message)
      throw error
    }
  },

  async deleteProduct(id) {
    try {
      const response = await axios.delete(
        `${API_URL}/products/deleteproduct/${id}`,
        getAuthConfig()
      )
      return response.data
    } catch (error) {
      console.error('Delete product error:', error.response?.data || error.message)
      throw error
    }
  }
}

export default productService
