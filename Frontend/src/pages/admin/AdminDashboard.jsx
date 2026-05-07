// src/pages/admin/AdminDashboard.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Total Products', value: '0', icon: '📦', color: 'bg-blue-500', link: '/admin/products' },
    { title: 'Total Orders', value: '0', icon: '🛒', color: 'bg-green-500', link: '/admin/orders' },
    { title: 'Total Users', value: '0', icon: '👥', color: 'bg-purple-500', link: '/admin/users' },
    { title: 'Total Revenue', value: '$0', icon: '💰', color: 'bg-yellow-500', link: '/admin/analytics' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 text-sm text-blue-600">
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
              className="block w-full text-center bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              + Add New Product
            </Link>
            <Link
              to="/admin/orders"
              className="block w-full text-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View All Orders
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Admin Info</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> <span className="text-red-600 capitalize">{user?.role}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;