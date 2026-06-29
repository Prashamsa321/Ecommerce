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

export const paymentService = {
  async initiateKhalti({ amount, productId, redirectLink, purchaseOrderName }) {
    const { data } = await axios.post(
      `${API_URL}/payment/khalti/initiate`,
      { amount, productId, redirectLink, purchaseOrderName },
      getAuthConfig()
    )
    return data
  },

  async verifyKhalti(pidx) {
    const { data } = await axios.post(
      `${API_URL}/payment/khalti/verify`,
      { pidx },
      getAuthConfig()
    )
    return data
  },
}

export default paymentService
