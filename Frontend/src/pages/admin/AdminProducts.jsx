import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { success, error } = useToast();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { products: data, pagination } = await productService.getProducts({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm.trim(),
      });
      setProducts(data);
      setTotalPages(pagination.totalPages);
      setTotalProducts(pagination.total);
    } catch {
      error('Failed to fetch products');
      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, error]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, searchTerm ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchProducts, searchTerm]);

  const currentProducts = products;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = totalProducts === 0 ? 0 : indexOfLastItem - itemsPerPage + 1;

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

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await productService.deleteProduct(productToDelete._id);
        success('Product deleted successfully');
        fetchProducts();
      } catch (err) {
        error('Failed to delete product');
      } finally {
        setModalOpen(false);
        setProductToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setModalOpen(false);
    setProductToDelete(null);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Products Management</h1>
          <p className="text-text-muted mt-1">Manage your product inventory</p>
        </div>
        <Link
          to="/admin/products/create"
          className="bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-5 py-2.5 rounded-lg hover:from-brand-orange-dark hover:to-brand-orange transition-all duration-300 flex items-center gap-2 shadow-md"
        >
          <span className="text-xl">+</span> Add New Product
        </Link>
      </div>

      {/* Search and Results Info */}
      <div className="bg-white rounded-xl shadow-lg p-5 border border-divider">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 pl-10 bg-surface-primary border border-divider rounded-lg text-text-primary placeholder-text-muted focus:ring-2 focus:ring-brand-orange focus:border-transparent"
            />
            <span className="absolute left-3 top-3 text-text-muted">ðŸ”</span>
          </div>
          <div className="text-sm text-text-muted flex items-center">
            Total: <span className="text-text-primary font-semibold ml-1 mr-1">{totalProducts}</span> products
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-divider">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-surface-primary">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-700">
              {currentProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-text-muted">
                    <div className="text-5xl mb-2">ðŸ“¦</div>
                    <p>No products found</p>
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
                currentProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-brand-light/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-surface-primary rounded-lg flex items-center justify-center overflow-hidden border border-divider">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-text-muted text-xl">ðŸ“¦</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{product.name?.substring(0, 30)}</p>
                          <p className="text-xs text-text-muted truncate max-w-xs">
                            {product.description?.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-brand-light0/20 text-brand-orange rounded-full border border-brand-orange/20">
                        {product.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-brand-orange">
                        à¤°à¥‚ {product.price?.toLocaleString('en-IN') || '0'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="text-brand-orange hover:text-brand-orange-dark transition-colors p-1"
                          title="Edit Product"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => openDeleteModal(product)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1"
                          title="Delete Product"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
          <div className="text-sm text-text-muted">
            Showing {indexOfFirstItem} to {Math.min(indexOfLastItem, totalProducts)} of {totalProducts} products
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                currentPage === 1
                  ? 'bg-brand-light text-text-muted cursor-not-allowed'
                  : 'bg-brand-light text-text-secondary hover:bg-brand-orange hover:text-white'
              }`}
            >
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-all duration-300 ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white shadow-md'
                        : 'bg-brand-light text-text-secondary hover:bg-brand-orange hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-2 py-2 text-text-muted">...</span>
                  <button
                    onClick={() => goToPage(totalPages)}
                    className="w-10 h-10 rounded-lg transition-all duration-300 bg-brand-light text-text-secondary hover:bg-brand-orange hover:text-white"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                currentPage === totalPages
                  ? 'bg-brand-light text-text-muted cursor-not-allowed'
                  : 'bg-brand-light text-text-secondary hover:bg-brand-orange hover:text-white'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default AdminProducts;