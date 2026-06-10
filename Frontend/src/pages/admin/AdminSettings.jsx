import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

const AdminSettings = () => {
  const { user, token } = useAuth();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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

    setLoading(true);
    try {
      await axios.put(
        'http://localhost:5000/api/auth/change-password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Security Settings</h1>
        <p className="text-slate-400 mt-1">Change your admin account password</p>
      </div>

      {/* Change Password Card */}
      <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <h2 className="text-lg font-semibold text-white">Change Password</h2>
          </div>
          <p className="text-white/80 text-sm mt-1">Update your password to keep your account secure</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter current password"
              required
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Confirm new password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Changing Password...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>

      {/* Password Tips */}
      <div className="mt-6 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <span>💡</span> Password Tips
        </h3>
        <ul className="text-xs text-slate-400 space-y-1 ml-6 list-disc">
          <li>Use at least 6 characters</li>
          <li>Combine letters, numbers, and special characters</li>
          <li>Avoid using common words or personal information</li>
          <li>Don't reuse passwords across different accounts</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSettings;