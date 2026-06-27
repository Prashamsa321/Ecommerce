import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { success, error } = useToast();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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
      const storeUsers = (response.data.users || []).filter(
        (user) => user.role !== 'admin'
      );
      setUsers(storeUsers);
    } catch {
      error('Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_URL}/auth/users/${userToDelete._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      success(`${userToDelete.name || userToDelete.email} deleted successfully`);
      fetchUsers();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleteModalOpen(false);
      setUserToDelete(null);
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
        <h1 className="text-2xl font-bold text-text-primary">Store Users</h1>
        <p className="text-text-muted mt-1">Customer accounts only — role changes are in Settings → Role Management</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-divider">
        <input
          type="text"
          placeholder="Search users by name or email..."
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
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase">Member Since</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-text-muted">
                    <p>No customer users found</p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="mt-2 text-brand-orange hover:text-brand-orange-dark transition-colors"
                      >
                        Clear search
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-brand-light/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-cta flex items-center justify-center text-white font-semibold">
                          {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-sm font-medium text-text-primary">{user.name || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="text-status-error hover:text-red-700 transition-colors p-1"
                        title="Delete User"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setUserToDelete(null); }}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Delete "${userToDelete?.name || userToDelete?.email}"? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default AdminUsers;
