import React, { useState, useEffect, useCallback } from 'react';

import { useSearchParams } from 'react-router-dom';

import { productService } from '../services/productService';

import { useAuth } from '../context/AuthContext';

import { useToast } from '../context/ToastContext';

import ProductCard from '../components/products/ProductCard';



const ITEMS_PER_PAGE = 12;



const ProductsPage = () => {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('');

  const [categories, setCategories] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const { user } = useAuth();

  const { error } = useToast();

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalProducts, setTotalProducts] = useState(0);



  useEffect(() => {

    const categoryParam = searchParams.get('category');

    const searchParam = searchParams.get('search');



    if (searchParam) {

      setSearchTerm(searchParam);

      setSelectedCategory('');

      setCurrentPage(1);

      return;

    }

    if (categoryParam) {

      setSelectedCategory(categoryParam);

      setSearchTerm('');

      setCurrentPage(1);

      return;

    }

    setSearchTerm('');

    setSelectedCategory('');

  }, [searchParams]);



  useEffect(() => {

    fetchCategories();

  }, []);



  const fetchProducts = useCallback(async () => {

    try {

      setLoading(true);

      const { products: data, pagination } = await productService.getProducts({

        page: currentPage,

        limit: ITEMS_PER_PAGE,

        search: searchTerm.trim(),

        category: selectedCategory,

      });

      setProducts(data);

      setTotalPages(pagination.totalPages);

      setTotalProducts(pagination.total);

    } catch (err) {

      console.error('Failed to fetch products:', err);

      error('Failed to load products');

      setProducts([]);

      setTotalPages(1);

      setTotalProducts(0);

    } finally {

      setLoading(false);

    }

  }, [currentPage, searchTerm, selectedCategory, error]);



  useEffect(() => {

    fetchProducts();

  }, [fetchProducts]);



  const fetchCategories = async () => {

    try {

      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/categories`);

      const data = await response.json();

      if (data.success && data.categories) {

        setCategories(data.categories.map(c => c.name));

      }

    } catch (err) {

      console.error('Error fetching categories:', err);

    }

  };



  const goToPage = (pageNumber) => {

    setCurrentPage(pageNumber);

    window.scrollTo({ top: 0, behavior: 'smooth' });

  };



  const clearCategoryFilter = () => {

    setSelectedCategory('');

    setSearchParams({});

    setCurrentPage(1);

  };



  const isAdmin = user?.role === 'admin';

  const indexOfFirstItem = totalProducts === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const indexOfLastItem = Math.min(currentPage * ITEMS_PER_PAGE, totalProducts);



  return (

    <div className="min-h-screen bg-surface-primary py-10 pb-24 md:pb-10">

      <div className="section-container">

        {isAdmin && (

          <div className="bg-brand-light border border-brand-orange/20 rounded-2xl p-4 mb-6">

            <div className="flex items-center gap-3">

              <span className="text-2xl">👑</span>

              <div className="flex-1">

                <p className="text-brand-orange-dark font-semibold">Admin Mode</p>

                <p className="text-text-secondary text-sm">You are viewing as admin. Use the Admin Dashboard to manage products.</p>

              </div>

              <a href="/admin/products" className="btn-cta text-sm px-4 py-2">

                Go to Admin Panel →

              </a>

            </div>

          </div>

        )}



        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">

          {searchTerm ? `Search: "${searchTerm}"` : selectedCategory ? selectedCategory : 'All Products'}

        </h1>

        <p className="text-text-muted mb-8">{totalProducts} products available</p>



        <div className="card-premium p-5 mb-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="block text-sm font-medium text-text-secondary mb-1">Search Products</label>

              <div className="relative">

                <input

                  type="text"

                  placeholder="Search by name or description..."

                  value={searchTerm}

                  onChange={(e) => {

                    const value = e.target.value;

                    setSearchTerm(value);

                    setSelectedCategory('');

                    setCurrentPage(1);

                    if (value.trim()) {

                      setSearchParams({ search: value.trim() });

                    } else {

                      setSearchParams({});

                    }

                  }}

                  className="input-field pl-10"

                />

                <span className="absolute left-3 top-2.5 text-text-muted">🔍</span>

              </div>

            </div>

            <div>

              <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>

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

                  className="input-field"

                >

                  <option value="">All Categories</option>

                  {categories.map(category => (

                    <option key={category} value={category}>{category}</option>

                  ))}

                </select>

                {selectedCategory && (

                  <button onClick={clearCategoryFilter} className="btn-ghost px-4 py-2 text-status-error border-status-error/30 hover:bg-red-50">

                    Clear

                  </button>

                )}

              </div>

            </div>

          </div>

        </div>



        {selectedCategory && (

          <div className="bg-brand-light rounded-2xl p-4 mb-6 border border-brand-orange/20">

            <div className="flex items-center justify-between flex-wrap gap-3">

              <div>

                <p className="text-text-primary font-semibold">Showing products in: {selectedCategory}</p>

                <p className="text-text-secondary text-sm">{totalProducts} products found</p>

              </div>

              <button onClick={clearCategoryFilter} className="btn-cta text-sm px-4 py-2">

                Show All Products

              </button>

            </div>

          </div>

        )}



        {loading ? (

          <div className="flex items-center justify-center py-24">

            <div className="w-12 h-12 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />

          </div>

        ) : products.length === 0 ? (

          <div className="text-center py-12 card-premium">

            <p className="text-4xl mb-2">🔍</p>

            <p className="text-text-secondary">No products found</p>

            {(searchTerm || selectedCategory) && (

              <button

                onClick={() => { setSearchTerm(''); setSelectedCategory(''); setSearchParams({}); setCurrentPage(1); }}

                className="mt-2 text-brand-orange hover:text-brand-orange-dark transition-colors font-medium"

              >

                Clear filters

              </button>

            )}

          </div>

        ) : (

          <>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

              {products.map((product, i) => (

                <ProductCard key={product._id} product={product} index={i} />

              ))}

            </div>



            {totalPages > 1 && (

              <div className="mt-10 flex justify-center">

                <nav className="flex items-center gap-2">

                  <button

                    onClick={() => goToPage(currentPage - 1)}

                    disabled={currentPage === 1}

                    className={`px-4 py-2 rounded-xl transition-colors ${currentPage === 1 ? 'bg-surface-primary text-text-disabled cursor-not-allowed' : 'btn-ghost'}`}

                  >

                    Previous

                  </button>

                  <div className="flex gap-1">

                    {Array.from({ length: totalPages }, (_, i) => i + 1)

                      .filter(pageNum => pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1)

                      .map((pageNum, index, array) => {

                        const prevPage = array[index - 1];

                        if (prevPage && pageNum - prevPage > 1) {

                          return (

                            <React.Fragment key={`ellipsis-${pageNum}`}>

                              <span className="px-3 py-2 text-text-muted">...</span>

                              <button

                                onClick={() => goToPage(pageNum)}

                                className={`px-4 py-2 rounded-xl transition-colors ${currentPage === pageNum ? 'btn-cta' : 'btn-ghost'}`}

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

                            className={`px-4 py-2 rounded-xl transition-colors ${currentPage === pageNum ? 'btn-cta' : 'btn-ghost'}`}

                          >

                            {pageNum}

                          </button>

                        );

                      })}

                  </div>

                  <button

                    onClick={() => goToPage(currentPage + 1)}

                    disabled={currentPage === totalPages}

                    className={`px-4 py-2 rounded-xl transition-colors ${currentPage === totalPages ? 'bg-surface-primary text-text-disabled cursor-not-allowed' : 'btn-ghost'}`}

                  >

                    Next

                  </button>

                </nav>

              </div>

            )}

          </>

        )}



        {!loading && totalProducts > 0 && (

          <div className="mt-4 text-center text-sm text-text-muted">

            Showing {indexOfFirstItem} - {indexOfLastItem} of {totalProducts} products

          </div>

        )}

      </div>

    </div>

  );

};



export default ProductsPage;

