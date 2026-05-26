import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/products/ProductCard';
import { useToast } from '../context/ToastContext';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  
  const { user } = useAuth();
  const { error } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      const productsArray = Array.isArray(data) ? data : [];
      setProducts(productsArray);
      
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalFilteredPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
  }, [filteredProducts.length, itemsPerPage]);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A2540] to-[#1E3A8A] flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#FF6200] border-t-transparent"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-[#22D3EE] border-t-transparent animate-pulse opacity-50"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2540] via-[#0D2E4A] to-[#1E3A8A] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Admin Notice Banner */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-[#111827] to-[#1E3A8A] border-l-4 border-[#FF6200] rounded-xl p-5 mb-8 shadow-xl">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-12 h-12 bg-[#FF6200]/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">👑</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-lg">Admin Mode Active</p>
                <p className="text-gray-300 text-sm">You are viewing as admin. Use the Admin Dashboard to manage products.</p>
              </div>
              <a 
                href="/admin/products" 
                className="bg-gradient-to-r from-[#FF6200] to-[#FF3D00] text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 text-sm font-semibold flex items-center gap-2"
              >
                Go to Admin Panel
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        )}

        {/* Header Section with Decorative Elements */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E3A8A]/30 border border-[#22D3EE]/30 rounded-full text-[#22D3EE] text-sm mb-4 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22D3EE] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22D3EE]"></span>
            </span>
            {isAdmin ? 'Admin Catalog' : 'Discover Our Collection'}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {isAdmin ? '📋 Product Catalog' : '✨ Our Products'}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {isAdmin 
              ? 'Manage and oversee all products in your inventory' 
              : 'Explore cutting-edge gadgets and electronics crafted for excellence'}
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-[#111827]/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-[#1E3A8A] hover:border-[#22D3EE]/50 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#22D3EE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Products
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-white px-5 py-3 pl-12 bg-[#0A2540] border border-[#1E3A8A] rounded-xl focus:ring-2 focus:ring-[#FF6200] focus:border-transparent transition-all duration-300 placeholder-gray-500 group-hover:border-[#22D3EE]/50"
                />
                <span className="absolute left-4 top-3.5 text-gray-400 text-lg">🔍</span>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#22D3EE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Category
              </label>
              <div className="flex gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 px-5 py-3 border border-[#1E3A8A] bg-[#0A2540] text-white rounded-xl focus:ring-2 focus:ring-[#FF6200] focus:border-transparent transition-all duration-300 cursor-pointer hover:border-[#22D3EE]/50"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="px-5 py-3 bg-gradient-to-r from-[#1E3A8A] to-[#0A2540] text-gray-300 rounded-xl hover:from-[#FF6200] hover:to-[#FF3D00] hover:text-white transition-all duration-300 font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count with Animation */}
        <div className="mb-6 flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF6200]/20 rounded-full flex items-center justify-center">
              <span className="text-[#FF6200] font-bold">{filteredProducts.length}</span>
            </div>
            <p className="text-gray-300 font-medium">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              {searchTerm && <span className="text-[#22D3EE] ml-1"> matching "{searchTerm}"</span>}
              {selectedCategory && <span className="text-[#FF6200] ml-1"> in {selectedCategory}</span>}
            </p>
          </div>
          {filteredProducts.length > 0 && (
            <div className="text-sm text-gray-400 bg-[#111827] px-4 py-2 rounded-full border border-[#1E3A8A]">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>

        {/* Products Grid */}
        {currentProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#111827]/60 backdrop-blur-sm rounded-2xl shadow-xl border border-[#1E3A8A]">
            <div className="w-24 h-24 mx-auto mb-4 bg-[#1E3A8A]/30 rounded-full flex items-center justify-center">
              <p className="text-5xl">🔍</p>
            </div>
            <p className="text-gray-300 text-lg mb-3">No products found</p>
            <p className="text-gray-400 text-sm mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6200] to-[#FF3D00] text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-2 bg-[#111827]/50 backdrop-blur-sm px-4 py-3 rounded-2xl border border-[#1E3A8A]">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                      currentPage === 1
                        ? 'bg-[#1E3A8A]/30 text-gray-500 cursor-not-allowed'
                        : 'bg-[#1E3A8A] text-white hover:bg-[#FF6200] hover:shadow-lg'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
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
                                className={`px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                                  currentPage === pageNum
                                    ? 'bg-gradient-to-r from-[#FF6200] to-[#FF3D00] text-white shadow-lg shadow-orange-500/30'
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
                            className={`px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-r from-[#FF6200] to-[#FF3D00] text-white shadow-lg shadow-orange-500/30'
                                : 'bg-[#1E3A8A] text-white hover:bg-[#FF6200]'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                      currentPage === totalPages
                        ? 'bg-[#1E3A8A]/30 text-gray-500 cursor-not-allowed'
                        : 'bg-[#1E3A8A] text-white hover:bg-[#FF6200] hover:shadow-lg'
                    }`}
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </>
        )}

        {/* Page Info */}
        {filteredProducts.length > 0 && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#111827]/50 backdrop-blur-sm rounded-full border border-[#1E3A8A]">
              <svg className="w-4 h-4 text-[#22D3EE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-400">
                Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;