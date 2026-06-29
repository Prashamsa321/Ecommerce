import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import FaIcon from '../../components/common/FaIcon'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { fetchAdminReports } from '../../services/adminReportService'
import { formatNpr } from '../../utils/helpers'
import AdminChartCard from '../../components/admin/charts/AdminChartCard'
import { CHART, STATUS_COLORS } from '../../components/admin/charts/chartTheme'

const statusBadge = (status) => {
  const colors = {
    pending: 'bg-amber-50 text-amber-700',
    processing: 'bg-blue-50 text-blue-700',
    shipped: 'bg-purple-50 text-purple-700',
    delivered: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-red-50 text-red-600',
  }
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${colors[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

const AdminDashboard = () => {
  const { user } = useAuth()
  const { error: toastError } = useToast()
  const [reports, setReports] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await fetchAdminReports()
      setReports(data)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      toastError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-24 rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-64 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!reports) return null

  const { overview, revenueGrowth, userGrowth, orderStatusCounts, productsByCategory, lowStockProducts, contactStats, recentOrders } = reports
  const orderStatusChart = orderStatusCounts.filter((s) => s.value > 0)

  const statsCards = [
    { title: 'Total Products', value: overview.totalProducts, icon: 'box', iconBg: 'bg-brand-light', iconColor: 'text-brand-orange', link: '/admin/products' },
    { title: 'Total Orders', value: overview.totalOrders, icon: 'cart-shopping', iconBg: 'bg-orange-50', iconColor: 'text-brand-orange-dark', link: '/admin/orders' },
    { title: 'Store Users', value: overview.totalUsers, icon: 'users', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', link: '/admin/users' },
    { title: 'Total Revenue', value: formatNpr(overview.totalRevenue), icon: 'wallet', iconBg: 'bg-amber-50', iconColor: 'text-brand-amber', link: '/admin/orders', isFormatted: true },
    { title: 'Low Stock', value: overview.lowStockCount, icon: 'triangle-exclamation', iconBg: 'bg-red-50', iconColor: 'text-red-500', link: '/admin/reports' },
    { title: 'Fulfillment', value: `${overview.fulfillmentRate}%`, icon: 'bullseye', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', link: '/admin/reports', isFormatted: true },
  ]

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* 1. Welcome */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="admin-card overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-cta text-white shadow-glow-orange">
              <FaIcon icon="hand-sparkles" size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary sm:text-2xl">Welcome back, {user?.name}!</h2>
              <p className="mt-1 text-sm text-text-muted sm:text-base">MeroGadget store overview — sales, inventory, and growth at a glance.</p>
            </div>
          </div>
          <Link to="/admin/reports" className="inline-flex items-center gap-2 rounded-xl bg-gradient-cta px-4 py-2.5 text-sm font-semibold text-white shadow-glow-orange transition-opacity hover:opacity-95">
            <FaIcon icon="chart-column" size={16} />
            Full Reports
          </Link>
        </div>
      </motion.div>

      {/* 2. KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 sm:gap-5">
        {statsCards.map((stat, index) => (
            <motion.div key={stat.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Link to={stat.link} className="group admin-stat-card block">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-text-muted sm:text-sm">{stat.title}</p>
                    <p className="mt-2 text-xl font-bold tabular-nums text-text-primary sm:text-2xl">
                      {stat.isFormatted ? stat.value : stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.iconBg} transition-transform group-hover:scale-110`}>
                    <FaIcon icon={stat.icon} size={20} className={stat.iconColor} />
                  </div>
                </div>
                <span className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-orange opacity-0 transition-opacity group-hover:opacity-100">
                  View <FaIcon icon="arrow-up-right-from-square" size={12} />
                </span>
              </Link>
            </motion.div>
          ))}
      </div>

      {/* 3. Revenue & orders chart */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AdminChartCard title="Revenue Trend" subtitle="Last 6 months">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueGrowth}>
              <defs>
                <linearGradient id="dashRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: CHART.muted }} />
              <YAxis tick={{ fontSize: 11, fill: CHART.muted }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [formatNpr(v), 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke={CHART.primary} strokeWidth={2} fill="url(#dashRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </AdminChartCard>

        <AdminChartCard title="Orders Trend" subtitle="Monthly order volume">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: CHART.muted }} />
              <YAxis tick={{ fontSize: 11, fill: CHART.muted }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="orders" fill={CHART.secondary} radius={[4, 4, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </AdminChartCard>
      </div>

      {/* 4. User growth + order status */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminChartCard title="Customer Growth" subtitle="New registrations per month">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: CHART.muted }} />
              <YAxis tick={{ fontSize: 11, fill: CHART.muted }} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke={CHART.purple} strokeWidth={2} dot={{ r: 3 }} name="Users" />
            </LineChart>
          </ResponsiveContainer>
        </AdminChartCard>

        <AdminChartCard title="Order Status" subtitle="Current pipeline">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={orderStatusChart} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2}>
                {orderStatusChart.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || CHART.muted} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </AdminChartCard>
      </div>

      {/* 5. Category breakdown */}
      <AdminChartCard title="Top Categories" subtitle="Products and stock by category">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={productsByCategory.slice(0, 6)}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
            <XAxis dataKey="category" tick={{ fontSize: 11, fill: CHART.muted }} />
            <YAxis tick={{ fontSize: 11, fill: CHART.muted }} />
            <Tooltip />
            <Bar dataKey="products" fill={CHART.primary} radius={[4, 4, 0, 0]} name="Products" />
          </BarChart>
        </ResponsiveContainer>
      </AdminChartCard>

      {/* 6. Low stock + recent orders */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AdminChartCard
          title="Low Stock Alerts"
          subtitle={`${overview.lowStockCount} items need restocking`}
          action={
            <Link to="/admin/reports" className="text-sm font-medium text-brand-orange hover:text-brand-orange-dark">
              View All
            </Link>
          }
        >
          {lowStockProducts.length === 0 ? (
            <p className="py-6 text-center text-sm text-text-muted">All products are well stocked.</p>
          ) : (
            <div className="space-y-2">
              {lowStockProducts.slice(0, 5).map((p) => (
                <div key={p._id} className="flex items-center justify-between rounded-xl bg-surface-primary px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-primary">{p.name}</p>
                    <p className="text-xs text-text-muted">{p.category}</p>
                  </div>
                  <span className={`ml-3 shrink-0 text-sm font-bold tabular-nums ${p.stock === 0 ? 'text-red-500' : 'text-amber-600'}`}>
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </AdminChartCard>

        <AdminChartCard
          title="Recent Orders"
          subtitle="Latest store transactions"
          action={
            <Link to="/admin/orders" className="text-sm font-medium text-brand-orange hover:text-brand-orange-dark">
              View All
            </Link>
          }
        >
          <div className="space-y-2">
            {recentOrders.slice(0, 5).map((o) => (
              <div key={o._id} className="flex items-center justify-between gap-3 rounded-xl bg-surface-primary px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">{o.orderNumber}</p>
                  <p className="truncate text-xs text-text-muted">{o.customer}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold tabular-nums">{formatNpr(o.totalAmount)}</p>
                  {statusBadge(o.orderStatus)}
                </div>
              </div>
            ))}
          </div>
        </AdminChartCard>
      </div>

      {/* 7. Business metrics + contacts */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="admin-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <FaIcon icon="chart-line" size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Avg Order Value</p>
              <p className="text-lg font-bold tabular-nums">{formatNpr(overview.avgOrderValue)}</p>
            </div>
          </div>
        </div>
        <div className="admin-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <FaIcon icon="boxes-stacked" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Inventory Value</p>
              <p className="text-lg font-bold tabular-nums">{formatNpr(overview.inventoryValue)}</p>
            </div>
          </div>
        </div>
        <div className="admin-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <FaIcon icon="triangle-exclamation" size={20} className="text-red-500" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Out of Stock</p>
              <p className="text-lg font-bold tabular-nums text-red-500">{overview.outOfStockCount}</p>
            </div>
          </div>
        </div>
        <div className="admin-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light">
              <FaIcon icon="envelope" size={20} className="text-brand-orange" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Contact Messages</p>
              <p className="text-lg font-bold tabular-nums">{contactStats.total}</p>
              <p className="text-xs text-amber-600">{contactStats.pending} pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="admin-card p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-text-primary">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light">
              <FaIcon icon="plus" size={16} className="text-brand-orange" />
            </span>
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link to="/admin/products/create" className="btn-cta block w-full text-center">+ Add New Product</Link>
            <Link to="/admin/orders" className="btn-ghost block w-full text-center">View All Orders</Link>
            <Link to="/admin/reports" className="btn-ghost block w-full text-center">Open Reports</Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="admin-card p-6">
          <h3 className="mb-4 font-semibold text-text-primary">Store Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between rounded-xl bg-surface-primary px-4 py-3">
              <span className="text-text-muted">Admin</span>
              <span className="font-medium text-text-primary">{user?.name}</span>
            </div>
            <div className="flex justify-between rounded-xl bg-surface-primary px-4 py-3">
              <span className="text-text-muted">Cancelled Orders</span>
              <span className="font-medium text-text-primary">{reports.orderStats?.cancelled ?? 0}</span>
            </div>
            <div className="flex justify-between rounded-xl bg-surface-primary px-4 py-3">
              <span className="text-text-muted">Delivered Orders</span>
              <span className="font-medium text-emerald-600">{reports.orderStats?.delivered ?? 0}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={loadData}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-orange transition-colors hover:text-brand-orange-dark"
          >
            <FaIcon icon="arrows-rotate" size={16} />
            Refresh Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
