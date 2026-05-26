import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

const UserProfile = () => {
  const { user, token } = useAuth();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.put(
        'http://localhost:5000/api/auth/updateprofile',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      success('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!passwordData.currentPassword) {
      error('Please enter your current password');
      return;
    }
    if (!passwordData.newPassword) {
      error('Please enter a new password');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      error('New password must be at least 6 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      await axios.post(
        'http://localhost:5000/api/auth/change-password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      success('Password changed successfully!');
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E3A8A]/30 border border-[#22D3EE]/30 rounded-full text-[#22D3EE] text-sm mb-4 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22D3EE] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22D3EE]"></span>
          </span>
          My Account
        </div>
        <h1 className="text-3xl font-bold text-white">User Profile</h1>
        <p className="text-gray-300 mt-2">Manage your personal information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#111827]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-[#1E3A8A] overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-[#0A2540] to-[#1E3A8A] px-6 py-4 border-b border-[#1E3A8A]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF6200]/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[#FF6200]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Profile Information</h2>
            </div>
            <div className="flex gap-3">
              {!isEditing && (
                <button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white rounded-xl hover:bg-[#FF6200] transition-all duration-300 text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Change Password
                </button>
              )}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white rounded-xl hover:bg-[#FF6200] transition-all duration-300 text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        {showChangePassword && !isEditing && (
          <div className="p-6 border-b border-[#1E3A8A] bg-[#0A2540]/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#FF6200]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Change Password
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 bg-[#0A2540] border border-[#1E3A8A] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 bg-[#0A2540] border border-[#1E3A8A] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 bg-[#0A2540] border border-[#1E3A8A] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 bg-gradient-to-r from-[#FF6200] to-[#FF3D00] text-white py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {passwordLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Changing...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex-1 bg-[#1E3A8A] text-white py-3 rounded-xl font-medium hover:bg-[#FF6200] transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#22D3EE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent transition-all duration-300 ${
                  !isEditing 
                    ? 'bg-[#0A2540] border-[#1E3A8A] text-gray-300 cursor-not-allowed' 
                    : 'bg-[#0A2540] border-[#1E3A8A] hover:border-[#22D3EE]'
                }`}
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#22D3EE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 bg-[#0A2540] border border-[#1E3A8A] rounded-xl text-gray-400 cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Email cannot be changed
              </p>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#22D3EE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter phone number"
                className={`w-full px-4 py-3 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent transition-all duration-300 ${
                  !isEditing 
                    ? 'bg-[#0A2540] border-[#1E3A8A] text-gray-300 cursor-not-allowed' 
                    : 'bg-[#0A2540] border-[#1E3A8A] hover:border-[#22D3EE]'
                }`}
              />
            </div>

            {/* Address Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#22D3EE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                rows="3"
                placeholder="Enter your address"
                className={`w-full px-4 py-3 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent transition-all duration-300 resize-none ${
                  !isEditing 
                    ? 'bg-[#0A2540] border-[#1E3A8A] text-gray-300 cursor-not-allowed' 
                    : 'bg-[#0A2540] border-[#1E3A8A] hover:border-[#22D3EE]'
                }`}
              />
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-6 border-t border-[#1E3A8A]">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-[#FF6200] to-[#FF3D00] text-white py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-[#1E3A8A] text-white py-3 rounded-xl font-medium hover:bg-[#FF6200] transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Account Stats Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111827]/50 backdrop-blur-sm rounded-xl p-4 border border-[#1E3A8A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#22D3EE]/10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#22D3EE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400">Account Type</p>
              <p className="text-white font-semibold capitalize">{user?.role || 'User'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#111827]/50 backdrop-blur-sm rounded-xl p-4 border border-[#1E3A8A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#22D3EE]/10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#22D3EE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400">Member Since</p>
              <p className="text-white font-semibold">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#111827]/50 backdrop-blur-sm rounded-xl p-4 border border-[#1E3A8A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#22D3EE]/10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#22D3EE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400">Orders</p>
              <p className="text-white font-semibold">View History</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;