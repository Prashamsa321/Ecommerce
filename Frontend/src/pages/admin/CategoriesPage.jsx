import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import Modal
 from '../../components/Modal';
const CategoriesPage = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Television', icon: '📺', productCount: 0 },
    { id: 2, name: 'Refrigerator', icon: '🧊', productCount: 0 },
    { id: 3, name: 'Air Conditioner', icon: '❄️', productCount: 0 },
    { id: 4, name: 'Watch', icon: '⌚', productCount: 0 }
  ]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const { success, error } = useToast();
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      error('Please enter category name');
      return;
    }

    if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
      error('Category already exists');
      return;
    }

    const newCategory = {
      id: Date.now(),
      name: newCategoryName,
      icon: getIconForCategory(newCategoryName),
      productCount: 0
    };

    setCategories([...categories, newCategory]);
    success('Category added successfully');
    setNewCategoryName('');
  };

  const getIconForCategory = (name) => {
    const icons = {
      'television': '📺',
      'refrigerator': '🧊',
      'air conditioner': '❄️',
      'watch': '⌚'
    };
    return icons[name.toLowerCase()] || '📦';
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
      success('Category deleted successfully');
      setModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <p className="text-gray-600 mt-1">Manage your product categories</p>
      </div>

      {/* Add Category */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Add New Category</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter category name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-2xl">{category.icon}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium text-gray-800">{category.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-gray-600">{category.productCount}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => openDeleteModal(category)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}" category?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default CategoriesPage;