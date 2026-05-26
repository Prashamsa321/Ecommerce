import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { success, error } = useToast();
  
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users || []);
    } catch (err) {
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

  const openRoleModal = (user) => {
    const newRoleValue = user.role === 'admin' ? 'user' : 'admin';
    setSelectedUser(user);
    setNewRole(newRoleValue);
    setRoleModalOpen(true);
  };

  const handleConfirmRoleChange = async () => {
    if (selectedUser) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          `http://localhost:5000/api/auth/users/${selectedUser._id}/role`,
          { role: newRole },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        success(`${selectedUser.name || selectedUser.email}'s role changed to ${newRole}`);
        fetchUsers();
      } catch (err) {
        error('Failed to update user role');
      } finally {
        setRoleModalOpen(false);
        setSelectedUser(null);
      }
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `http://localhost:5000/api/auth/users/${userToDelete._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        success(`${userToDelete.name || userToDelete.email} deleted successfully`);
        fetchUsers();
      } catch (err) {
        error('Failed to delete user');
      } finally {
        setDeleteModalOpen(false);
        setUserToDelete(null);
      }
    }
  };

  const handleCancelRoleModal = () => {
    setRoleModalOpen(false);
    setSelectedUser(null);
  };

  const handleCancelDeleteModal = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (roleModalOpen) handleCancelRoleModal();
        if (deleteModalOpen) handleCancelDeleteModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [roleModalOpen, deleteModalOpen]);

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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Users Management</h1>
        <p className="text-slate-400 mt-1">Manage your store users and their roles</p>
      </div>

      {/* Search */}
      <div className="bg-slate-800 rounded-xl shadow-lg p-5 mb-6 border border-slate-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="absolute left-3 top-3 text-slate-400">🔍</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Member Since</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    <div className="text-5xl mb-2">👥</div>
                    <p>No users found</p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="mt-2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Clear search
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center shadow-md">
                          <span className="text-white font-semibold">
                            {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user.name || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openRoleModal(user)}
                          className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                          title="Change Role"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        {user.email !== 'admin@example.com' && (
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                            title="Delete User"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Change Confirmation Modal */}
      <Modal
        isOpen={roleModalOpen}
        onClose={handleCancelRoleModal}
        onConfirm={handleConfirmRoleChange}
        title="Change User Role"
        message={`Are you sure you want to change "${selectedUser?.name || selectedUser?.email}"'s role from ${selectedUser?.role} to ${newRole}?`}
        confirmText="Change Role"
        cancelText="Cancel"
        type="warning"
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={handleCancelDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${userToDelete?.name || userToDelete?.email}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default AdminUsers;