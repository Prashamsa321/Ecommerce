import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const categoryService = {
  // Get all categories
  async getAllCategories() {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      console.log('Categories response:', response.data);
      return response.data.categories || [];
    } catch (error) {
      console.error('Get categories error:', error);
      return [];
    }
  },

  // Create category (admin only)
  async createCategory(categoryData) {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/categories`,
      categoryData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Update category (admin only)
  async updateCategory(id, categoryData) {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/categories/${id}`,
      categoryData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Delete category (admin only)
  async deleteCategory(id) {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      `${API_URL}/categories/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};

export default categoryService;