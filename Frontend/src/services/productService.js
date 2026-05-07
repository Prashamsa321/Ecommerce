// src/services/productService.js
import api from './api'

export const productService = {
  async getAllProducts() {
    const response = await api.get('/products/getproduct')
    return response.data
  },

  async getProductById(id) {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  async createProduct(productData) {
    const response = await api.post('/products/createproduct', productData)
    return response.data
  },

  async updateProduct(id, productData) {
    const response = await api.put(`/products/update/${id}`, productData)
    return response.data
  },

  async deleteProduct(id) {
    const response = await api.delete(`/products/delete/${id}`)
    return response.data
  },
}