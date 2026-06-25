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
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        // Get only the total count, not all products
        axios.get('http://localhost:5000/api/products/getproduct?page=1&limit=1', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: { orders: [] } }))
      ]);

      // Get total products count from response
      const totalProducts = productsRes.data.totalProducts || productsRes.data.products?.length || 0;
      const users = usersRes.data.users || [];
      const totalUsers = users.length;
      const orders = ordersRes.data.orders || [];
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      // Get recent orders for graph
      const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentOrders(sortedOrders.slice(0, 7));

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

  // Calculate weekly revenue data
  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weeklyData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];
      
      const dayOrders = recentOrders.filter(order => {
        return order.createdAt?.split('T')[0] === dayStr;
      });
      
      const total = dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      weeklyData.push({
        day: days[date.getDay()],
        amount: total,
        orders: dayOrders.length
      });
    }
    
    return weeklyData;
  };

  const weeklyData = getWeeklyData();
  const maxAmount = Math.max(...weeklyData.map(d => d.amount), 1);

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

      {/* Quick Actions & Analytics Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700">
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
            <Link
              to="/admin/users"
              className="block w-full text-center border border-purple-500 text-purple-400 px-4 py-2.5 rounded-lg hover:bg-purple-500/10 transition-all duration-300 font-medium"
            >
              Manage Users
            </Link>
          </div>
        </div>

        {/* Weekly Revenue Graph */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <span className="text-xl">📊</span>
              Weekly Revenue
            </h3>
            <span className="text-xs text-slate-400">Last 7 days</span>
          </div>

          {/* Graph Bars */}
          <div className="flex items-end justify-between h-48 gap-2">
            {weeklyData.map((data, index) => {
              const heightPercent = maxAmount > 0 ? (data.amount / maxAmount) * 100 : 0;
              const isHighest = data.amount === maxAmount && maxAmount > 0;
              
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="relative w-full flex justify-center">
                    {data.amount > 0 && (
                      <div className="absolute -top-6 text-xs text-slate-400 whitespace-nowrap">
                        रू {data.amount.toLocaleString()}
                      </div>
                    )}
                    <div 
                      className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 relative group cursor-pointer ${
                        isHighest ? 'bg-gradient-to-t from-amber-500 to-orange-500' : 'bg-gradient-to-t from-blue-500 to-teal-400'
                      }`}
                      style={{ height: `${Math.max(heightPercent, 4)}%` }}
                    >
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300 rounded-t-lg"></div>
                      {data.orders > 0 && (
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {data.orders} order{data.orders > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 mt-2">{data.day}</span>
                </div>
              );
            })}
          </div>

          {/* Graph Legend */}
          <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-t from-blue-500 to-teal-400"></div>
              <span className="text-xs text-slate-400">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-t from-amber-500 to-orange-500"></div>
              <span className="text-xs text-slate-400">Highest</span>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchDashboardData}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-1"
        >
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;