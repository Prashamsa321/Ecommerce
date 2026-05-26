import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ProductModal from '../ProductModal';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { success, error, info } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const isAdmin = user?.role === 'admin';

  const handleAddToCart = async () => {
    if (isAdmin) {
      error('Admin users cannot add items to cart');
      return;
    }
    
    setIsAdding(true);
    const result = await addToCart(product._id, 1);
    setIsAdding(false);
    
    if (result.success) {
      success(`${product.name} added to cart!`);
    } else if (result.notAuthenticated) {
      error(result.error || 'Please login to add items to cart');
    } else if (result.alreadyInCart) {
      info(result.message || `${product.name} is already in your cart!`);
    } else if (result.error) {
      error(result.error);
    }
  };

  return (
    <>
      <div className="bg-[#111827] rounded-2xl overflow-hidden border border-[#1E3A8A] hover:border-[#FF6200] transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 group flex flex-col h-full">
        {/* Product Image */}
        <div className="h-52 bg-gradient-to-br from-[#0A2540] to-[#1E3A8A] flex items-center justify-center overflow-hidden relative">
          {product.images && product.images[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-7xl opacity-30 group-hover:scale-110 transition-transform duration-500">📦</div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-3 right-3 bg-[#FF3B30]/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
              Out of Stock
            </div>
          )}
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          {/* Product Name */}
          <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2 group-hover:text-[#22D3EE] transition-colors duration-300">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-[#FF6200]">
            ₹{product.price?.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Stock Status */}
          <div className="mb-4">
            {product.stock > 0 ? (
              <span className="text-xs text-[#22D3EE] bg-[#22D3EE]/10 px-3 py-1 rounded-full font-medium">
                In Stock
              </span>
            ) : (
              <span className="text-xs text-[#FF3B30] bg-[#FF3B30]/10 px-3 py-1 rounded-full font-medium">
                Out of Stock
              </span>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 bg-[#1E3A8A] text-white px-4 py-2.5 rounded-xl hover:bg-[#FF6200] transition-all duration-300 text-sm font-medium hover:shadow-lg hover:shadow-orange-500/20"
            >
              Details
            </button>
            
            {!isAdmin && (
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdding}
                className={`flex-1 bg-gradient-to-r from-[#FF6200] to-[#FF3D00] text-white px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium ${
                  product.stock === 0 || isAdding 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02]'
                }`}
              >
                {isAdding ? (
                  <span className="flex items-center justify-center gap-1">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding...
                  </span>
                ) : 'Add to Cart'}
              </button>
            )}
          </div>
        </div>
      </div>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  );
};

export default ProductCard;