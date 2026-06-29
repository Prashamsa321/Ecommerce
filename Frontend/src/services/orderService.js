import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const getAuthConfig = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
}

export const orderService = {
  async createOrder({ shippingAddress, paymentMethod, notes }) {
    const response = await axios.post(
      `${API_URL}/orders/create`,
      { shippingAddress, paymentMethod, notes },
      getAuthConfig()
    )
    return response.data
  },

  async getMyOrders() {
    const response = await axios.get(`${API_URL}/orders/my-orders`, getAuthConfig())
    return response.data?.orders || []
  },

  async getAllOrders({ status, page = 1, limit = 100 } = {}) {
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', String(limit))
    if (status) params.set('status', status)

    const response = await axios.get(
      `${API_URL}/orders/admin/all?${params.toString()}`,
      getAuthConfig()
    )
    return {
      orders: response.data?.orders || [],
      totalOrders: response.data?.totalOrders || 0,
      currentPage: response.data?.currentPage || 1,
      totalPages: response.data?.totalPages || 1,
    }
  },

  async getOrderStats() {
    const response = await axios.get(`${API_URL}/orders/admin/stats`, getAuthConfig())
    return response.data?.stats || null
  },

  async updateOrderStatus(id, { orderStatus, comment, trackingNumber, estimatedDelivery }) {
    const response = await axios.put(
      `${API_URL}/orders/admin/${id}/status`,
      { orderStatus, comment, trackingNumber, estimatedDelivery },
      getAuthConfig()
    )
    return response.data?.order
  },
}

export default orderService
