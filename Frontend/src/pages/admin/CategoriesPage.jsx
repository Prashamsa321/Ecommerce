import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';
import { categoryService } from '../../services/categoryService';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const { success, error } = useToast();
  
  // Modal state for delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Icon options for dropdown (for selection only, not displayed as categories)
  const iconOptions = [
    { icon: '📺' },
    { icon: '🧊' },
    { icon: '❄️' },
    { icon: '⌚' },
    { icon: '📱' },
    { icon: '💻' },
    { icon: '🎧' },
    { icon: '🎮' },
    { icon: '📷' },
    { icon: '🔊' }
  ];

  // Fetch categories from backend (only real categories from database)
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data); // Only categories from database
    } catch (err) {
      console.error('Fetch categories error:', err);
      error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      error('Please enter category name');
      return;
    }

    try {
      await categoryService.createCategory({
        name: newCategoryName,
        icon: '📦' // Default icon
      });
      
      success('Category added successfully');
      setNewCategoryName('');
      fetchCategories(); // Refresh list from database
    } catch (err) {
      error(err.response?.data?.message || 'Failed to add category');
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditIcon(category.icon || '📦');
  };

  const handleUpdateCategory = async () => {
    if (!editName.trim()) {
      error('Category name cannot be empty');
      return;
    }

    try {
      await categoryService.updateCategory(editingCategory._id, {
        name: editName,
        icon: editIcon
      });
      
      success('Category updated successfully');
      setEditingCategory(null);
      fetchCategories(); // Refresh list from database
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update category');
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditName('');
    setEditIcon('📦');
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (categoryToDelete) {
      try {
        await categoryService.deleteCategory(categoryToDelete._id);
        success('Category deleted successfully');
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
        fetchCategories(); // Refresh list from database
      } catch (err) {
        error(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-600 mt-1">Manage your product categories</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {categories.length} categories
        </div>
      </div>

      {/* Add Category */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Category</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter category name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="text-lg">+</span> Add Category
          </button>
        </div>
      </div>

      {/* Categories Table - Shows ONLY database categories */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Icon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <div className="text-4xl mb-2">🏷️</div>
                    <p>No categories found</p>
                    <p className="text-sm mt-1">Click "Add Category" to create your first category</p>
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                    {editingCategory?._id === category._id ? (
                      // Edit Mode
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={editIcon}
                            onChange={(e) => setEditIcon(e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            {iconOptions.map(option => (
                              <option key={option.icon} value={option.icon}>
                                {option.icon} {option.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-600">{category.productCount || 0}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleUpdateCategory}
                              className="text-green-600 hover:text-green-800 transition-colors p-1"
                              title="Save"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-600 hover:text-gray-800 transition-colors p-1"
                              title="Cancel"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // View Mode - Shows ONLY database categories
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-2xl">{category.icon || '📦'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-800">{category.name}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            📦 {category.productCount || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                              title="Edit Category"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => openDeleteModal(category)}
                              className="text-red-600 hover:text-red-800 transition-colors p-1"
                              title="Delete Category"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}" category? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default CategoriesPage;