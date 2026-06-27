import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { error: toastError } = useToast();
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const headers = { Authorization: `Bearer ${token}` };
      const [productsRes, usersRes, orderStatsRes] = await Promise.all([
        axios.get(`${API}/products/getproduct?limit=1&page=1`, { headers }),
        axios.get(`${API}/auth/users`, { headers }),
        axios.get(`${API}/orders/admin/stats`, { headers }).catch(() => ({ data: { stats: {} } })),
      ]);
      const users = usersRes.data.users || [];
      const orderStats = orderStatsRes.data.stats || {};
      setStats({
        totalProducts: productsRes.data.total ?? 0,
        totalOrders: orderStats.totalOrders ?? 0,
        totalUsers: users.filter(u => u.role !== 'admin').length,
        totalRevenue: orderStats.totalRevenue ?? 0,
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      toastError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: '📦', accent: 'text-brand-orange', bg: 'bg-brand-light', link: '/admin/products', prefix: '' },
    { title: 'Total Orders', value: stats.totalOrders, icon: '🛒', accent: 'text-brand-orange-dark', bg: 'bg-brand-light', link: '/admin/orders', prefix: '' },
    { title: 'Total Users', value: stats.totalUsers, icon: '👥', accent: 'text-purple-600', bg: 'bg-purple-50', link: '/admin/users', prefix: '' },
    { title: 'Total Revenue', value: stats.totalRevenue, icon: '💰', accent: 'text-brand-amber', bg: 'bg-amber-50', link: '/admin/orders', prefix: 'रू ' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card-premium p-6 bg-gradient-hero">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-cta rounded-2xl flex items-center justify-center text-2xl shadow-glow-orange">👋</div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Welcome back, {user?.name}!</h1>
            <p className="text-text-muted mt-1">Here's what's happening with your store today.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Link key={index} to={stat.link} className="group admin-stat-card hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-text-primary mt-2">
                  {stat.prefix}{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
            <div className={`mt-4 text-sm ${stat.accent} font-medium`}>View Details →</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-premium p-6">
          <h3 className="font-semibold text-text-primary mb-4">⚡ Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/admin/products/create" className="btn-cta w-full text-center block">+ Add New Product</Link>
            <Link to="/admin/orders" className="btn-ghost w-full text-center block">View All Orders</Link>
          </div>
        </div>
        <div className="card-premium p-6">
          <h3 className="font-semibold text-text-primary mb-4">ℹ️ Admin Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2"><span className="text-text-muted w-16">Name:</span><span className="text-text-primary">{user?.name}</span></div>
            <div className="flex gap-2"><span className="text-text-muted w-16">Email:</span><span className="text-text-secondary">{user?.email}</span></div>
          </div>
          <button onClick={fetchDashboardData} className="mt-4 text-sm text-brand-orange hover:text-brand-orange-dark transition-colors font-medium">🔄 Refresh Data</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
