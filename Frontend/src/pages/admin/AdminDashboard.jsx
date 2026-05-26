import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { error: toastError } = useToast();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products/getproduct', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: { orders: [] } }))
      ]);

      const products = productsRes.data.products || [];
      const totalProducts = products.length;
      const users = usersRes.data.users || [];
      const totalUsers = users.length;
      const orders = ordersRes.data.orders || [];
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      setStats({
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      toastError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { 
      title: 'Total Products', 
      value: stats.totalProducts, 
      icon: '📦', 
      color: 'from-blue-600 to-blue-700', 
      link: '/admin/products',
      prefix: ''
    },
    { 
      title: 'Total Orders', 
      value: stats.totalOrders, 
      icon: '🛒', 
      color: 'from-teal-500 to-teal-600', 
      link: '/admin/orders',
      prefix: ''
    },
    { 
      title: 'Total Users', 
      value: stats.totalUsers, 
      icon: '👥', 
      color: 'from-purple-600 to-purple-700', 
      link: '/admin/users',
      prefix: ''
    },
    { 
      title: 'Total Revenue', 
      value: stats.totalRevenue, 
      icon: '💰', 
      color: 'from-amber-500 to-amber-600', 
      link: '/admin/analytics',
      prefix: 'रू '
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="absolute inset-0 rounded-full h-12 w-12 border-t-2 border-teal-500 animate-pulse opacity-50"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
            👋
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name}!</h1>
            <p className="text-slate-400 mt-1">Here's what's happening with your store today.</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="group bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-700"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {stat.prefix}{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4 text-sm text-blue-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                View Details 
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-xl">⚡</span>
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              to="/admin/products/create"
              className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-md"
            >
              + Add New Product
            </Link>
            <Link
              to="/admin/orders"
              className="block w-full text-center border border-teal-500 text-teal-400 px-4 py-2.5 rounded-lg hover:bg-teal-500/10 transition-all duration-300 font-medium"
            >
              View All Orders
            </Link>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-xl">ℹ️</span>
            Admin Info
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-16">Name:</span>
              <span className="text-white font-medium">{user?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-16">Email:</span>
              <span className="text-slate-300">{user?.email}</span>
            </div>
          </div>
          
          <button
            onClick={fetchDashboardData}
            className="mt-4 w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-1"
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;