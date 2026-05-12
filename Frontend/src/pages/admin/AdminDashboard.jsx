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
      
      // Fetch all data in parallel for better performance
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products/getproduct', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: { orders: [] } })) // If orders endpoint doesn't exist yet
      ]);

      // Calculate total products
      const products = productsRes.data.products || [];
      const totalProducts = products.length;

      // Calculate total users
      const users = usersRes.data.users || [];
      const totalUsers = users.length;

      // Calculate total orders and revenue
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
      color: 'bg-blue-500', 
      link: '/admin/products',
      prefix: ''
    },
    { 
      title: 'Total Orders', 
      value: stats.totalOrders, 
      icon: '🛒', 
      color: 'bg-green-500', 
      link: '/admin/orders',
      prefix: ''
    },
    { 
      title: 'Total Users', 
      value: stats.totalUsers, 
      icon: '👥', 
      color: 'bg-purple-500', 
      link: '/admin/users',
      prefix: ''
    },
    { 
      title: 'Total Revenue', 
      value: stats.totalRevenue, 
      icon: '💰', 
      color: 'bg-yellow-500', 
      link: '/admin/analytics',
      prefix: '$'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section - Blue theme */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-t-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stat.prefix}{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-md`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 text-sm text-blue-600 font-medium">
              View Details →
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/admin/products/create"
              className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add New Product
            </Link>
            <Link
              to="/admin/orders"
              className="block w-full text-center border border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              View All Orders
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Admin Info</h3>
          <div className="space-y-2 text-sm">
            <p><strong className="text-gray-700">Name:</strong> <span className="text-gray-600">{user?.name}</span></p>
            <p><strong className="text-gray-700">Email:</strong> <span className="text-gray-600">{user?.email}</span></p>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={fetchDashboardData}
            className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;