import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { success, error } = useToast();
  
  // Modal state for role change
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  
  // Modal state for delete
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

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open modal for role change
  const openRoleModal = (user) => {
    const newRoleValue = user.role === 'admin' ? 'user' : 'admin';
    setSelectedUser(user);
    setNewRole(newRoleValue);
    setRoleModalOpen(true);
  };

  // Handle confirm role change
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

  // Open delete modal
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  // Handle confirm delete
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

  // Close modals
  const handleCancelRoleModal = () => {
    setRoleModalOpen(false);
    setSelectedUser(null);
  };

  const handleCancelDeleteModal = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  // Close modals on ESC key
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
        <p className="text-gray-600 mt-1">Manage your store users and their roles</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member Since
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <p className="text-4xl mb-2">👥</p>
                    <p>No users found</p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="mt-2 text-blue-600 hover:text-blue-700"
                      >
                        Clear search
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {/* Edit Role Button */}
                        <button
                          onClick={() => openRoleModal(user)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                          title="Change Role"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        {/* Delete Button - Don't allow deleting yourself */}
                        {user.email !== 'admin@example.com' && (
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="text-red-600 hover:text-red-800 transition-colors p-1"
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