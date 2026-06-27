import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const { success, error } = useToast();
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const iconOptions = [
    { icon: 'ðŸ“º' }, { icon: 'ðŸ§Š' }, { icon: 'â„ï¸' }, { icon: 'âŒš' },
    { icon: 'ðŸ“±' }, { icon: 'ðŸ’»' }, { icon: 'ðŸŽ§' }, { icon: 'ðŸŽ®' },
    { icon: 'ðŸ“·' }, { icon: 'ðŸ”Š' }, { icon: 'ðŸ–¥ï¸' }, { icon: 'âŒ¨ï¸' },
    { icon: 'ðŸ–¨ï¸' }, { icon: 'ðŸ“¡' }, { icon: 'ðŸ”‹' }, { icon: 'ðŸ’¾' }
  ];

  useEffect(() => {
    fetchCategoriesWithCounts();
  }, []);

  const fetchCategoriesWithCounts = async () => {
    try {
      setLoading(true);
      
      // Fetch all categories
      const categoriesData = await categoryService.getAllCategories();
      
      // Fetch all products to count per category
      const productsData = await productService.getAllProducts();
      const allProducts = Array.isArray(productsData) ? productsData : [];
      
      // Count products per category
      const categoriesWithCounts = categoriesData.map(category => {
        const productCount = allProducts.filter(
          product => product.category === category.name
        ).length;
        
        return {
          ...category,
          productCount: productCount
        };
      });
      
      setCategories(categoriesWithCounts);
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
        icon: 'ðŸ“¦'
      });
      
      success('Category added successfully');
      setNewCategoryName('');
      fetchCategoriesWithCounts();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to add category');
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditIcon(category.icon || 'ðŸ“¦');
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
      fetchCategoriesWithCounts();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update category');
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditName('');
    setEditIcon('ðŸ“¦');
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
        fetchCategoriesWithCounts();
      } catch (err) {
        error(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
          <div className="absolute inset-0 rounded-full h-12 w-12 border-t-2 border-brand-orange animate-pulse opacity-50"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Categories</h1>
          <p className="text-text-muted mt-1">Manage your product categories</p>
        </div>
        <div className="text-sm text-text-muted">
          Total: <span className="text-text-primary font-semibold">{categories.length}</span> categories
        </div>
      </div>

      {/* Add Category */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-divider">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Add New Category</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter category name"
            className="flex-1 px-4 py-2.5 bg-surface-primary border border-divider rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-brand-orange focus:border-transparent"
          />
          <button
            onClick={handleAddCategory}
            className="bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-6 py-2.5 rounded-lg hover:from-brand-orange-dark hover:to-brand-orange transition-all duration-300 flex items-center gap-2 font-medium"
          >
            <span className="text-lg">+</span> Add Category
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-divider">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-surface-primary">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Icon</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Products</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-700">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-text-muted">
                    <div className="text-5xl mb-2">ðŸ·ï¸</div>
                    <p>No categories found</p>
                    <p className="text-sm mt-1">Click "Add Category" to create your first category</p>
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category._id} className="hover:bg-brand-light/50 transition-colors">
                    {editingCategory?._id === category._id ? (
                      // Edit Mode
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={editIcon}
                            onChange={(e) => setEditIcon(e.target.value)}
                            className="px-2 py-1 bg-surface-primary border border-divider rounded-lg text-text-primary focus:ring-2 focus:ring-brand-orange"
                          >
                            {iconOptions.map(option => (
                              <option key={option.icon} value={option.icon}>
                                {option.icon}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="px-3 py-1 bg-surface-primary border border-divider rounded-lg text-text-primary focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-text-muted">{category.productCount || 0}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleUpdateCategory}
                              className="text-green-400 hover:text-green-300 transition-colors p-1"
                              title="Save"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-text-muted hover:text-white transition-colors p-1"
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
                      // View Mode
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-2xl">{category.icon || 'ðŸ“¦'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-white">{category.name}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-brand-light0/20 text-brand-orange text-xs font-medium rounded-full border border-brand-orange/20">
                            ðŸ“¦ {category.productCount || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="text-brand-orange hover:text-brand-orange-dark transition-colors p-1"
                              title="Edit Category"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => openDeleteModal(category)}
                              className="text-red-400 hover:text-red-300 transition-colors p-1"
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