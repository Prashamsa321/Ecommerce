import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';

const CreateProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: ['']
  });

  // Fetch categories from database
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      error('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchProductData();
    }
  }, [id]);

  const fetchProductData = async () => {
    try {
      setFetching(true);
      const product = await productService.getProductById(id);
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || '',
        images: product.images && product.images.length > 0 ? product.images : ['']
      });
    } catch (err) {
      console.error('Error fetching product:', err);
      error('Failed to load product data');
      navigate('/admin/products');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const formatPriceDisplay = (value) => {
    if (!value) return '';
    return `रू ${parseFloat(value).toLocaleString('en-IN')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      error('Product name is required');
      return;
    }
    if (!formData.description.trim()) {
      error('Product description is required');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      error('Valid product price is required');
      return;
    }
    if (!formData.category.trim()) {
      error('Product category is required');
      return;
    }

    setLoading(true);
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
        images: formData.images.filter(img => img.trim() !== '')
      };
      
      if (isEditMode) {
        await productService.updateProduct(id, productData);
        success('Product updated successfully!');
      } else {
        await productService.createProduct(productData);
        success('Product created successfully!');
      }
      
      navigate('/admin/products');
    } catch (err) {
      console.error('Save product error:', err);
      error(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching || loadingCategories) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Edit Product' : 'Create New Product'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditMode ? 'Update your product information' : 'Add a new product to your store'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Product Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter product description"
            required
          />
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price * (Nepali Rupees - रू)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 font-semibold">रू</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="1"
                min="0"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                required
              />
            </div>
            {formData.price && (
              <p className="text-xs text-green-600 mt-1">
                {formatPriceDisplay(formData.price)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a category</option>
            {categories.length === 0 ? (
              <option value="" disabled>No categories available. Please add categories first.</option>
            ) : (
              categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.icon || '📦'} {category.name}
                </option>
              ))
            )}
          </select>
          {categories.length === 0 && (
            <p className="text-xs text-red-500 mt-1">
              No categories found. Please add categories in the Categories page first.
            </p>
          )}
        </div>

        {/* Product Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images (URLs)
          </label>
          {formData.images.map((image, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="url"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Image URL ${index + 1}`}
              />
              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            + Add Another Image
          </button>
          <p className="text-xs text-gray-500 mt-1">
            Enter image URLs (e.g., https://example.com/image.jpg)
          </p>
        </div>

        {/* Form Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="submit"
            disabled={loading || categories.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Product' : 'Create Product')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductPage;