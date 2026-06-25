import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/products/ProductCard';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const { user } = useAuth();
  const { error } = useToast();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  // Get category from URL params on mount and when URL changes
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setCurrentPage(1);
      // Clear search term when category is selected
      setSearchTerm('');
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      console.log('Raw data from API:', data);
      
      // Handle different response formats
      let productsArray = [];
      if (Array.isArray(data)) {
        productsArray = data;
      } else if (data && data.products && Array.isArray(data.products)) {
        productsArray = data.products;
      } else if (data && data.data && Array.isArray(data.data)) {
        productsArray = data.data;
      } else {
        console.error('Unexpected data format:', data);
        productsArray = [];
      }
      
      console.log('Products array after parsing:', productsArray);
      setProducts(productsArray);

      // Extract unique categories
      const uniqueCategories = [...new Set(productsArray.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // You can also fetch categories from your category API
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      if (data.success && data.categories) {
        setCategories(data.categories.map(c => c.name));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Filter products based on search and selected category
  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = !searchTerm ||
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
    setCurrentPage(1);
  }, [filteredProducts.length, itemsPerPage, selectedCategory, searchTerm]);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearCategoryFilter = () => {
    setSelectedCategory('');
    setSearchParams({}); // Clear URL params
  };

  const isAdmin = user?.role === 'admin';

  // Debug: Log current products
  console.log('Current products to render:', currentProducts);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A2540] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#FF6200] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A2540] py-8">
      <div className="container mx-auto px-4">
        {/* Admin Notice Banner */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👑</span>
              <div className="flex-1">
                <p className="text-blue-800 font-semibold">Admin Mode</p>
                <p className="text-blue-600 text-sm">You are viewing as admin. Use the Admin Dashboard to manage products.</p>
              </div>
              <a
                href="/admin/products"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-md"
              >
                Go to Admin Panel →
              </a>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold text-white mb-8">
          {selectedCategory
            ? `${selectedCategory} Products`
            : isAdmin ? 'Product Catalog (Admin View)' : 'Our Products'}
        </h1>

        {/* Search and Filter Section */}
        <div className="bg-[#111827]/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-[#1E3A8A]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Search Products</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedCategory(''); // Clear category filter when searching
                    setSearchParams({});
                  }}
                  className="w-full px-4 py-2 pl-10 bg-[#0A2540] border border-[#1E3A8A] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    if (e.target.value) {
                      setSearchParams({ category: e.target.value });
                    } else {
                      setSearchParams({});
                    }
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="flex-1 px-4 py-2 bg-[#0A2540] border border-[#1E3A8A] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {selectedCategory && (
                  <button
                    onClick={clearCategoryFilter}
                    className="px-4 py-2 bg-[#FF3B30] text-white rounded-xl hover:bg-[#FF2D55] transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Category Banner when filtering */}
        {selectedCategory && (
          <div className="bg-gradient-to-r from-[#FF6200]/20 to-[#FF3D00]/20 rounded-2xl p-4 mb-6 border border-[#FF6200]/30">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📂</span>
                <div>
                  <p className="text-white font-semibold">Showing products in: {selectedCategory}</p>
                  <p className="text-gray-300 text-sm">{filteredProducts.length} products found</p>
                </div>
              </div>
              <button
                onClick={clearCategoryFilter}
                className="px-4 py-2 bg-[#1E3A8A] text-white rounded-xl hover:bg-[#FF6200] transition-colors"
              >
                Show All Products
              </button>
            </div>
          </div>
        )}

        {/* Debug: Show product count */}
        <div className="text-white text-center mb-4 text-sm opacity-50">
          Total Products: {products.length} | Filtered: {filteredProducts.length} | Showing: {currentProducts.length}
        </div>

        {/* Products Grid */}
        {currentProducts.length === 0 ? (
          <div className="text-center py-12 bg-[#111827]/50 rounded-2xl border border-[#1E3A8A]">
            <p className="text-4xl mb-2">🔍</p>
            <p className="text-gray-300">No products found</p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSearchParams({});
                }}
                className="mt-2 text-[#22D3EE] hover:text-[#FF6200] transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {currentProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-xl transition-colors ${currentPage === 1
                        ? 'bg-[#1E3A8A] text-gray-500 cursor-not-allowed'
                        : 'bg-[#1E3A8A] text-white hover:bg-[#FF6200]'
                      }`}
                  >
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(pageNum => {
                        if (pageNum === 1 || pageNum === totalPages) return true;
                        if (Math.abs(pageNum - currentPage) <= 1) return true;
                        return false;
                      })
                      .map((pageNum, index, array) => {
                        const prevPage = array[index - 1];
                        if (prevPage && pageNum - prevPage > 1) {
                          return (
                            <React.Fragment key={`ellipsis-${pageNum}`}>
                              <span className="px-3 py-2 text-gray-400">...</span>
                              <button
                                onClick={() => goToPage(pageNum)}
                                className={`px-4 py-2 rounded-xl transition-colors ${currentPage === pageNum
                                    ? 'bg-[#FF6200] text-white'
                                    : 'bg-[#1E3A8A] text-white hover:bg-[#FF6200]'
                                  }`}
                              >
                                {pageNum}
                              </button>
                            </React.Fragment>
                          );
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`px-4 py-2 rounded-xl transition-colors ${currentPage === pageNum
                                ? 'bg-[#FF6200] text-white'
                                : 'bg-[#1E3A8A] text-white hover:bg-[#FF6200]'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-xl transition-colors ${currentPage === totalPages
                        ? 'bg-[#1E3A8A] text-gray-500 cursor-not-allowed'
                        : 'bg-[#1E3A8A] text-white hover:bg-[#FF6200]'
                      }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}

        {/* Results Info */}
        {filteredProducts.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-400">
            Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;