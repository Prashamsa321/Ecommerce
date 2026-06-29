import axios from 'axios'

const LOW_STOCK_THRESHOLD = 10

const getApiBase = () => import.meta.env.VITE_API_URL || '/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const getLastMonths = (count = 6) => {
  const months = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleString('en-US', { month: 'short' }),
      start: new Date(d.getFullYear(), d.getMonth(), 1),
      end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999),
    })
  }
  return months
}

const countInRange = (items, start, end, dateField = 'createdAt') =>
  items.filter((item) => {
    const date = new Date(item[dateField])
    return date >= start && date <= end
  }).length

const sumInRange = (items, start, end, valueField = 'totalAmount', dateField = 'createdAt') =>
  items
    .filter((item) => {
      const date = new Date(item[dateField])
      return date >= start && date <= end
    })
    .reduce((sum, item) => sum + (item[valueField] || 0), 0)

const buildReportsFromLegacyEndpoints = async () => {
  const API = getApiBase()
  const headers = getAuthHeaders()

  const [productsRes, usersRes, orderStatsRes, ordersRes, contactStatsRes] = await Promise.all([
    axios.get(`${API}/products/getproduct?limit=100&page=1`, { headers }),
    axios.get(`${API}/auth/users`, { headers }),
    axios.get(`${API}/orders/admin/stats`, { headers }),
    axios.get(`${API}/orders/admin/all?limit=200&page=1`, { headers }).catch(() => ({ data: { orders: [] } })),
    axios.get(`${API}/contact/stats`, { headers }).catch(() => ({ data: { stats: { total: 0, pending: 0, read: 0, replied: 0 } } })),
  ])

  const products = productsRes.data.products || []
  const users = (usersRes.data.users || []).filter((u) => u.role !== 'admin')
  const orderStats = orderStatsRes.data.stats || {}
  const orders = ordersRes.data.orders || []
  const contactStats = contactStatsRes.data.stats || { total: 0, pending: 0, read: 0, replied: 0 }

  const months = getLastMonths(6)
  const nonCancelledOrders = orders.filter((o) => o.orderStatus !== 'cancelled')

  const revenueGrowth = months.map((m) => ({
    month: m.label,
    revenue: sumInRange(nonCancelledOrders, m.start, m.end),
    orders: countInRange(orders, m.start, m.end),
  }))

  const userGrowth = months.map((m) => ({
    month: m.label,
    users: countInRange(users, m.start, m.end),
  }))

  const orderStatusCounts = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: orders.filter((o) => o.orderStatus === status).length || orderStats[status] || 0,
    status,
  }))

  const paymentMethodCounts = ['COD', 'esewa', 'khalti'].map((method) => ({
    name: method,
    value: orders.filter((o) => (o.paymentMethod || 'COD').toLowerCase() === method.toLowerCase()).length,
  }))

  const categoryMap = products.reduce((acc, product) => {
    const cat = product.category || 'Uncategorized'
    if (!acc[cat]) acc[cat] = { category: cat, products: 0, stock: 0 }
    acc[cat].products += 1
    acc[cat].stock += product.stock || 0
    return acc
  }, {})

  const productsByCategory = Object.values(categoryMap)
    .sort((a, b) => b.products - a.products)
    .slice(0, 8)

  const lowStockProducts = products
    .filter((p) => (p.stock ?? 0) <= LOW_STOCK_THRESHOLD)
    .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
    .slice(0, 15)
    .map((p) => ({
      _id: p._id,
      name: p.name,
      category: p.category,
      stock: p.stock ?? 0,
      price: p.price,
      image: p.images?.[0] || null,
    }))

  const outOfStockCount = products.filter((p) => (p.stock ?? 0) === 0).length
  const totalRevenue = orderStats.totalRevenue ?? 0
  const totalOrders = orderStats.totalOrders ?? orders.length
  const deliveredOrders = orderStats.delivered ?? 0
  const fulfillmentRate = totalOrders ? Math.round((deliveredOrders / totalOrders) * 100) : 0
  const avgOrderValue = nonCancelledOrders.length
    ? Math.round(totalRevenue / Math.max(nonCancelledOrders.length, 1))
    : totalOrders
      ? Math.round(totalRevenue / totalOrders)
      : 0

  const inventoryValue = products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0)

  const recentOrders = orders.slice(0, 8).map((o) => ({
    _id: o._id,
    orderNumber: o.orderNumber,
    customer: o.user?.name || 'Guest',
    email: o.user?.email || o.shippingAddress?.email || '',
    totalAmount: o.totalAmount,
    orderStatus: o.orderStatus,
    paymentMethod: o.paymentMethod,
    createdAt: o.createdAt,
    itemsCount: o.items?.length || 0,
  }))

  return {
    overview: {
      totalProducts: productsRes.data.total ?? products.length,
      totalOrders,
      totalUsers: users.length,
      totalRevenue,
      avgOrderValue,
      fulfillmentRate,
      inventoryValue,
      lowStockCount: lowStockProducts.length,
      outOfStockCount,
      totalContacts: contactStats.total,
    },
    revenueGrowth,
    userGrowth,
    orderStatusCounts,
    paymentMethodCounts,
    productsByCategory,
    lowStockProducts,
    contactStats,
    recentOrders,
    orderStats: {
      pending: orderStats.pending ?? 0,
      processing: orderStats.processing ?? 0,
      shipped: orderStats.shipped ?? 0,
      delivered: deliveredOrders,
      cancelled: orderStats.cancelled ?? 0,
    },
  }
}

export const fetchAdminReports = async () => {
  const API = getApiBase()
  const headers = getAuthHeaders()

  try {
    const { data } = await axios.get(`${API}/admin/reports`, { headers })
    if (data?.reports) return data.reports
  } catch (error) {
    const status = error.response?.status
    if (status && status !== 404 && status !== 502 && status !== 503) {
      // Try legacy endpoints before failing (e.g. stale backend without /admin/reports)
      if (status !== 401 && status !== 403) {
        throw error
      }
    }
  }

  try {
    return await buildReportsFromLegacyEndpoints()
  } catch (fallbackError) {
    throw fallbackError
  }
}
