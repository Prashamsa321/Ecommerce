import React, { useState } from 'react';
import FaIcon from '../../components/common/FaIcon';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const AdminProfile = () => {
  const { user, token } = useAuth();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.put(
        `${API_URL}/auth/updateprofile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      success('Profile updated successfully');
      setIsEditing(false);
    } catch {
      error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Admin Profile</h1>
        <p className="text-text-muted mt-1">Manage your profile information</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-divider overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b border-divider">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-brand-orange to-brand-orange-dark rounded-xl flex items-center justify-center">
                <FaIcon icon="user" size={18} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Profile Information</h2>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-dark transition-all duration-300 text-sm font-medium"
              >
                <FaIcon icon="pen-to-square" size={14} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all duration-300 ${
                  !isEditing 
                    ? 'bg-surface-primary border-divider text-text-muted cursor-not-allowed' 
                    : 'bg-surface-primary border-divider hover:border-brand-orange'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 bg-surface-primary border border-divider rounded-xl text-text-muted cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FaIcon icon="lock" size={16} className="text-text-muted" />
                </div>
              </div>
              <p className="text-xs text-text-muted mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter phone number"
                className={`w-full px-4 py-3 border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all duration-300 ${
                  !isEditing 
                    ? 'bg-surface-primary border-divider text-text-muted cursor-not-allowed' 
                    : 'bg-surface-primary border-divider hover:border-brand-orange'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                rows="3"
                placeholder="Enter address"
                className={`w-full px-4 py-3 border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all duration-300 resize-none ${
                  !isEditing 
                    ? 'bg-surface-primary border-divider text-text-muted cursor-not-allowed' 
                    : 'bg-surface-primary border-divider hover:border-brand-orange'
                }`}
              />
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4 border-t border-divider">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white py-3 rounded-xl font-semibold hover:from-brand-orange-dark hover:to-brand-orange transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-brand-light text-text-secondary py-3 rounded-xl font-medium hover:bg-brand-light transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
