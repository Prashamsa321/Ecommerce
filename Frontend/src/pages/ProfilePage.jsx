import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, isAuthenticated, loading } = useAuth();

  // Debug - log to console
  console.log('ProfilePage - isAuthenticated:', isAuthenticated);
  console.log('ProfilePage - user:', user);
  console.log('ProfilePage - loading:', loading);

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // If not authenticated, show login message
  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Not Logged In</h2>
          <p className="text-gray-600 mb-6">Please login to view your profile</p>
          <Link 
            to="/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Show profile
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600 mt-1">View and manage your account information</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card - Left Side */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              <h3 className="font-semibold text-xl text-gray-800">{user.name || 'User'}</h3>
              <p className="text-sm text-gray-500 mt-1">{user.email}</p>
              <p className="text-xs text-blue-600 mt-2 capitalize">Role: {user.role || 'user'}</p>
              
              <div className="border-t border-gray-200 my-4"></div>
              
              <div className="text-left space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Member Since:</span>
                  <span className="text-gray-700">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Information Card - Right Side */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
              
              <div className="space-y-4">
                {/* Name */}
                <div className="border-b border-gray-100 pb-3">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <p className="text-gray-800 font-medium">{user.name || 'Not provided'}</p>
                </div>
                
                {/* Email */}
                <div className="border-b border-gray-100 pb-3">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                  <p className="text-gray-800 font-medium">{user.email}</p>
                </div>
                
                {/* Role */}
                <div className="border-b border-gray-100 pb-3">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Account Type</label>
                  <p className="text-gray-800 font-medium capitalize">{user.role || 'User'}</p>
                </div>
                
                {/* User ID */}
                <div className="border-b border-gray-100 pb-3">
                  <label className="block text-sm font-medium text-gray-500 mb-1">User ID</label>
                  <p className="text-gray-800 font-mono text-sm">{user._id || 'Not available'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">
                <Link 
                  to="/products" 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;