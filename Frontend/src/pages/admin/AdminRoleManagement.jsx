import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';
import { isProtectedAdmin } from '../../utils/adminConstants';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminRoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { success, error } = useToast();

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users || []);
    } catch {
      error('Failed to fetch accounts');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openRoleModal = (user, targetRole) => {
    if (isProtectedAdmin(user.email) && targetRole === 'user') {
      error('This admin account is protected and cannot be demoted');
      return;
    }
    setSelectedUser(user);
    setNewRole(targetRole);
    setRoleModalOpen(true);
  };

  const handleConfirmRoleChange = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/auth/users/${selectedUser._id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      success(`${selectedUser.name || selectedUser.email} is now ${newRole}`);
      fetchUsers();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update role');
    } finally {
      setRoleModalOpen(false);
      setSelectedUser(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Role Management</h1>
        <p className="text-text-muted mt-1">Assign admin or user roles to accounts</p>
      </div>

      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <span className="font-medium">Protected admin:</span>{' '}
        prashamsalamsal2061@gmail.com — this account always stays admin and cannot be demoted.
      </div>

      <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-divider">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2.5 bg-surface-primary border border-divider rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-brand-orange focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-divider">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-divider">
            <thead className="bg-surface-primary">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase">Account</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase">Current Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-text-muted">No accounts found</td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const protectedAccount = isProtectedAdmin(user.email);
                  const isAdmin = user.role === 'admin';

                  return (
                    <tr key={user._id} className="hover:bg-brand-light/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-cta flex items-center justify-center text-white font-semibold">
                            {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-primary">{user.name || 'N/A'}</p>
                            {protectedAccount && (
                              <span className="text-[10px] uppercase tracking-wide text-amber-700 font-semibold">Protected</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          isAdmin
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-brand-light text-brand-orange border border-brand-orange/20'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {!isAdmin && (
                            <button
                              onClick={() => openRoleModal(user, 'admin')}
                              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                            >
                              Make Admin
                            </button>
                          )}
                          {isAdmin && !protectedAccount && (
                            <button
                              onClick={() => openRoleModal(user, 'user')}
                              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-light text-text-secondary hover:bg-divider transition-colors"
                            >
                              Make User
                            </button>
                          )}
                          {protectedAccount && (
                            <span className="text-xs text-text-muted italic">Locked as admin</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={roleModalOpen}
        onClose={() => { setRoleModalOpen(false); setSelectedUser(null); }}
        onConfirm={handleConfirmRoleChange}
        title="Change Role"
        message={`Change "${selectedUser?.name || selectedUser?.email}" to ${newRole}?`}
        confirmText="Confirm"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
};

export default AdminRoleManagement;
