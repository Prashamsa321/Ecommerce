import axios from 'axios'

const KHALTI_BASE_URL = process.env.KHALTI_BASE_URL || 'https://dev.khalti.com/api/v2'
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || ''
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',')[0].trim()

const khaltiHeaders = () => ({
  Authorization: `Key ${KHALTI_SECRET_KEY}`,
  'Content-Type': 'application/json',
})

const toPaisa = (amount) => Math.round(Number(amount) * 100)

export const initiateKhaltiPayment = async (req, res) => {
  try {
    if (!KHALTI_SECRET_KEY) {
      return res.status(500).json({
        status: 'error',
        message: 'Khalti is not configured. Set KHALTI_SECRET_KEY in Backend/.env',
      })
    }

    const { amount, productId, redirectLink, purchaseOrderName } = req.body
    const user = req.user

    if (!amount || !productId) {
      return res.status(400).json({ status: 'error', message: 'amount and productId are required' })
    }

    const amountPaisa = toPaisa(amount)
    if (amountPaisa < 1000) {
      return res.status(400).json({ status: 'error', message: 'Minimum Khalti amount is Rs. 10 (1000 paisa)' })
    }

    const returnUrl = redirectLink || `${FRONTEND_URL}/paymentsuccess`

    const payload = {
      return_url: returnUrl,
      website_url: FRONTEND_URL,
      amount: amountPaisa,
      purchase_order_id: `${productId}-${Date.now()}`,
      purchase_order_name: purchaseOrderName || `Order ${productId}`,
      customer_info: {
        name: user?.name || 'Customer',
        email: user?.email || 'customer@merogadget.com',
        phone: user?.phone || '9800000000',
      },
    }

    const response = await axios.post(`${KHALTI_BASE_URL}/epayment/initiate/`, payload, {
      headers: khaltiHeaders(),
    })

    return res.json({
      status: 'success',
      ...response.data,
    })
  } catch (error) {
    console.error('Khalti initiate error:', error.response?.data || error.message)
    return res.status(error.response?.status || 500).json({
      status: 'error',
      message: error.response?.data?.detail || error.response?.data?.error_key || error.message,
    })
  }
}

export const verifyKhaltiPayment = async (req, res) => {
  try {
    if (!KHALTI_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Khalti is not configured. Set KHALTI_SECRET_KEY in Backend/.env',
      })
    }

    const { pidx } = req.body

    if (!pidx) {
      return res.status(400).json({ success: false, message: 'pidx is required' })
    }

    const response = await axios.post(
      `${KHALTI_BASE_URL}/epayment/lookup/`,
      { pidx },
      { headers: khaltiHeaders() }
    )

    const result = response.data

    if (result.status === 'Completed') {
      return res.json({
        success: true,
        message: 'Payment verified',
        data: result,
      })
    }

    return res.json({
      success: false,
      message: 'Payment not completed',
      data: result,
    })
  } catch (error) {
    console.error('Khalti verify error:', error.response?.data || error.message)
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.detail || error.response?.data?.error_key || error.message,
    })
  }
}
