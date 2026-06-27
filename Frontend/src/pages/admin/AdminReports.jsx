import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  RefreshCw,
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  Wallet,
  AlertTriangle,
  Mail,
  BarChart3,
  Boxes,
  Target,
  ArrowUpRight,
} from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { fetchAdminReports } from '../../services/adminReportService'
import { formatNpr } from '../../utils/helpers'
import AdminChartCard from '../../components/admin/charts/AdminChartCard'
import { CHART, STATUS_COLORS, PIE_COLORS } from '../../components/admin/charts/chartTheme'

const statusBadge = (status) => {
  const colors = {
    pending: 'bg-amber-50 text-amber-700',
    processing: 'bg-blue-50 text-blue-700',
    shipped: 'bg-purple-50 text-purple-700',
    delivered: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-red-50 text-red-600',
  }
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${colors[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

const KpiCard = ({ title, value, icon: Icon, iconBg, iconColor, sub }) => (
  <div className="admin-stat-card">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-text-muted">{title}</p>
        <p className="mt-2 text-2xl font-bold tabular-nums text-text-primary">{value}</p>
        {sub && <p className="mt-1 text-xs text-text-muted">{sub}</p>}
      </div>
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={2} />
      </div>
    </div>
  </div>
)

const AdminReports = () => {
  const { error: toastError } = useToast()
  const [reports, setReports] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadReports = async () => {
    try {
      setLoading(true)
      const data = await fetchAdminReports()
      setReports(data)
    } catch (err) {
      console.error(err)
      toastError('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-16 rounded-2xl" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-72 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!reports) return null

  const { overview, revenueGrowth, userGrowth, orderStatusCounts, paymentMethodCounts, productsByCategory, lowStockProducts, contactStats, recentOrders, orderStats } = reports

  const orderStatusChart = orderStatusCounts.filter((s) => s.value > 0)
  const paymentChart = paymentMethodCounts.filter((p) => p.value > 0)

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Section 1: Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="admin-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-cta text-white shadow-glow-orange">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary sm:text-2xl">Business Reports</h2>
            <p className="text-sm text-text-muted">Analytics, growth trends, and inventory insights for MeroGadget</p>
          </div>
        </div>
        <button
          type="button"
          onClick={loadReports}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-divider bg-white px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-brand-orange/30 hover:text-brand-orange"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Reports
        </button>
      </motion.div>

      {/* Section 2: Overview KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total Revenue" value={formatNpr(overview.totalRevenue)} icon={Wallet} iconBg="bg-amber-50" iconColor="text-brand-amber" sub="All non-cancelled orders" />
        <KpiCard title="Total Orders" value={overview.totalOrders.toLocaleString()} icon={ShoppingCart} iconBg="bg-brand-light" iconColor="text-brand-orange" />
        <KpiCard title="Store Users" value={overview.totalUsers.toLocaleString()} icon={Users} iconBg="bg-purple-50" iconColor="text-purple-600" />
        <KpiCard title="Products" value={overview.totalProducts.toLocaleString()} icon={Package} iconBg="bg-orange-50" iconColor="text-brand-orange-dark" />
        <KpiCard title="Avg Order Value" value={formatNpr(overview.avgOrderValue)} icon={Target} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <KpiCard title="Fulfillment Rate" value={`${overview.fulfillmentRate}%`} icon={TrendingUp} iconBg="bg-emerald-50" iconColor="text-emerald-600" sub="Delivered orders" />
        <KpiCard title="Inventory Value" value={formatNpr(overview.inventoryValue)} icon={Boxes} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <KpiCard title="Low Stock Items" value={overview.lowStockCount.toLocaleString()} icon={AlertTriangle} iconBg="bg-red-50" iconColor="text-red-500" sub={`${overview.outOfStockCount} out of stock`} />
      </div>

      {/* Section 3 & 4: Revenue + Orders growth */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AdminChartCard title="Revenue Growth" subtitle="Monthly revenue trend (last 6 months)">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueGrowth}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART.primary} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={CHART.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: CHART.muted }} />
              <YAxis tick={{ fontSize: 12, fill: CHART.muted }} tickFormatter={(v) => `Rs.${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [formatNpr(v), 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke={CHART.primary} strokeWidth={2.5} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </AdminChartCard>

        <AdminChartCard title="Orders Growth" subtitle="Monthly order volume">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: CHART.muted }} />
              <YAxis tick={{ fontSize: 12, fill: CHART.muted }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="orders" fill={CHART.secondary} radius={[6, 6, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </AdminChartCard>
      </div>

      {/* Section 5: Customer growth */}
      <AdminChartCard title="Customer Growth" subtitle="New user registrations per month">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={userGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: CHART.muted }} />
            <YAxis tick={{ fontSize: 12, fill: CHART.muted }} allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="users" stroke={CHART.purple} strokeWidth={2.5} dot={{ fill: CHART.purple, r: 4 }} name="New Users" />
          </LineChart>
        </ResponsiveContainer>
      </AdminChartCard>

      {/* Section 6 & 7: Order status + Payment methods */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminChartCard title="Order Status Distribution" subtitle="Breakdown by fulfillment stage">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={orderStatusChart} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3}>
                {orderStatusChart.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || CHART.muted} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </AdminChartCard>

        <AdminChartCard title="Payment Methods" subtitle="COD vs eSewa usage">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={paymentChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} paddingAngle={4}>
                {paymentChart.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </AdminChartCard>
      </div>

      {/* Section 8: Category performance */}
      <AdminChartCard title="Products by Category" subtitle="Catalog distribution and stock levels">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productsByCategory} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
            <XAxis type="number" tick={{ fontSize: 12, fill: CHART.muted }} />
            <YAxis type="category" dataKey="category" width={100} tick={{ fontSize: 12, fill: CHART.muted }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="products" fill={CHART.primary} radius={[0, 4, 4, 0]} name="Products" />
            <Bar dataKey="stock" fill={CHART.info} radius={[0, 4, 4, 0]} name="Total Stock" />
          </BarChart>
        </ResponsiveContainer>
      </AdminChartCard>

      {/* Section 9: Business insights */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Pending Orders', value: orderStats.pending, color: 'text-amber-600' },
          { label: 'Processing', value: orderStats.processing, color: 'text-blue-600' },
          { label: 'Shipped', value: orderStats.shipped, color: 'text-purple-600' },
          { label: 'Delivered', value: orderStats.delivered, color: 'text-emerald-600' },
        ].map((item) => (
          <div key={item.label} className="admin-card p-5 text-center">
            <p className="text-sm text-text-muted">{item.label}</p>
            <p className={`mt-2 text-3xl font-bold tabular-nums ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Section 10: Low stock alert banner */}
      {overview.outOfStockCount > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:items-center">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
          <div className="flex-1">
            <p className="font-semibold text-red-700">{overview.outOfStockCount} product(s) are out of stock</p>
            <p className="text-sm text-red-600">Restock immediately to avoid lost sales.</p>
          </div>
          <Link to="/admin/products" className="shrink-0 text-sm font-medium text-red-700 hover:underline">
            Manage Products
          </Link>
        </div>
      )}

      {/* Section 11: Low stock table */}
      <AdminChartCard
        title="Low Stock Products"
        subtitle="Items with 10 or fewer units remaining"
        action={
          <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm font-medium text-brand-orange hover:text-brand-orange-dark">
            View All <ArrowUpRight className="h-4 w-4" />
          </Link>
        }
      >
        {lowStockProducts.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-muted">All products are well stocked.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table w-full text-sm">
              <thead>
                <tr className="border-b border-divider text-left text-text-muted">
                  <th className="pb-3 pr-4 font-medium">Product</th>
                  <th className="pb-3 pr-4 font-medium">Category</th>
                  <th className="pb-3 pr-4 font-medium">Stock</th>
                  <th className="pb-3 font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((p) => (
                  <tr key={p._id} className="border-b border-divider/60 last:border-0">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light">
                            <Package className="h-4 w-4 text-brand-orange" />
                          </div>
                        )}
                        <span className="font-medium text-text-primary">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-text-secondary">{p.category || '—'}</td>
                    <td className="py-3 pr-4">
                      <span className={`font-semibold tabular-nums ${p.stock === 0 ? 'text-red-500' : 'text-amber-600'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-3 tabular-nums text-text-secondary">{formatNpr(p.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminChartCard>

      {/* Section 12: Recent orders */}
      <AdminChartCard
        title="Recent Orders"
        subtitle="Latest transactions across the store"
        action={
          <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm font-medium text-brand-orange hover:text-brand-orange-dark">
            All Orders <ArrowUpRight className="h-4 w-4" />
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="admin-table w-full text-sm">
            <thead>
              <tr className="border-b border-divider text-left text-text-muted">
                <th className="pb-3 pr-4 font-medium">Order</th>
                <th className="pb-3 pr-4 font-medium">Customer</th>
                <th className="pb-3 pr-4 font-medium">Amount</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o._id} className="border-b border-divider/60 last:border-0">
                  <td className="py-3 pr-4 font-medium text-text-primary">{o.orderNumber}</td>
                  <td className="py-3 pr-4">
                    <p className="text-text-primary">{o.customer}</p>
                    <p className="text-xs text-text-muted">{o.email}</p>
                  </td>
                  <td className="py-3 pr-4 tabular-nums font-medium">{formatNpr(o.totalAmount)}</td>
                  <td className="py-3 pr-4">{statusBadge(o.orderStatus)}</td>
                  <td className="py-3 text-text-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminChartCard>

      {/* Section 13: Contact messages */}
      <AdminChartCard title="Contact Messages" subtitle="Customer inquiry overview">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Total', value: contactStats.total, icon: Mail, bg: 'bg-brand-light', color: 'text-brand-orange' },
            { label: 'Pending', value: contactStats.pending, icon: Mail, bg: 'bg-amber-50', color: 'text-amber-600' },
            { label: 'Read', value: contactStats.read, icon: Mail, bg: 'bg-blue-50', color: 'text-blue-600' },
            { label: 'Replied', value: contactStats.replied, icon: Mail, bg: 'bg-emerald-50', color: 'text-emerald-600' },
          ].map((c) => (
            <div key={c.label} className="rounded-xl bg-surface-primary p-4 text-center">
              <div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${c.bg}`}>
                <c.icon className={`h-4 w-4 ${c.color}`} />
              </div>
              <p className="text-2xl font-bold tabular-nums text-text-primary">{c.value}</p>
              <p className="text-xs text-text-muted">{c.label}</p>
            </div>
          ))}
        </div>
        <Link to="/admin/contacts" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-orange hover:text-brand-orange-dark">
          View Contacts <ArrowUpRight className="h-4 w-4" />
        </Link>
      </AdminChartCard>
    </div>
  )
}

export default AdminReports
