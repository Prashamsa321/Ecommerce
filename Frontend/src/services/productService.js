import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const productService = {
  // Get all products
  async getAllProducts() {
    try {
      const response = await axios.get(`${API_URL}/products/getproduct`);
      console.log('Product service response:', response.data);
      
      // Return the products array from the response
      if (response.data && response.data.products && Array.isArray(response.data.products)) {
        return response.data.products;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.error('Unexpected response format:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Get products error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get single product
  async getProductById(id) {
    try {
      const response = await axios.get(`${API_URL}/products/getproduct/${id}`);
      return response.data.product || response.data;
    } catch (error) {
      console.error('Get product error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Create product (admin only)
  async createProduct(productData) {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/products/createproduct`,
      productData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Update product (admin only)
  async updateProduct(id, productData) {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/products/updateproduct/${id}`,
      productData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Delete product (admin only)
  async deleteProduct(id) {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      `${API_URL}/products/deleteproduct/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};

export default productService;