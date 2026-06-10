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
     <div className="bg-[#111827] rounded-xl overflow-hidden border border-[#1E3A8A] hover:border-[#FF6200] transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 group flex flex-col h-full">
  {/* Product Image - Smaller */}
  <div className="h-28 bg-gradient-to-br from-[#0A2540] to-[#1E3A8A] flex items-center justify-center overflow-hidden relative">
    {product.images && product.images[0] ? (
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    ) : (
      <div className="text-4xl opacity-30 group-hover:scale-110 transition-transform duration-500">📦</div>
    )}
    {product.stock === 0 && (
      <div className="absolute top-1 right-1 bg-[#FF3B30]/90 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
        Out of Stock
      </div>
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </div>

  <div className="p-2.5 flex flex-col flex-grow">
    {/* Product Name - Smaller text */}
    <h3 className="font-semibold text-white text-sm px-1 line-clamp-2 group-hover:text-[#22D3EE] transition-colors duration-300 leading-tight">
      {product.name}
    </h3>

    {/* Price - Smaller */}
    <div className="flex items-baseline gap-1 px-1 mt-1">
      <span className="text-base font-bold text-[#FF6200]">
        रु {product.price?.toFixed(2)}
      </span>
      {product.originalPrice && (
        <span className="text-[10px] text-gray-400 line-through">
          रु {product.originalPrice.toFixed(2)}
        </span>
      )}
    </div>

    {/* Stock Status - Smaller badge */}
    <div className="mb-1.5 mt-1">
      {product.stock > 0 ? (
        <span className="text-[10px] text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-0.5 rounded-full font-medium">
          In Stock
        </span>
      ) : (
        <span className="text-[10px] text-[#FF3B30] bg-[#FF3B30]/10 px-2 py-0.5 rounded-full font-medium">
          Out of Stock
        </span>
      )}
    </div>

    {/* Action Buttons - Smaller */}
    <div className="flex gap-1.5 mt-auto">
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex-1 bg-[#1E3A8A] text-white text-xs py-1.5 rounded-lg hover:bg-[#FF6200] transition-all duration-300 font-medium hover:shadow-md hover:shadow-orange-500/20"
      >
        Details
      </button>

      {!isAdmin && (
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding}
          className={`flex-1 bg-gradient-to-r from-[#FF6200] to-[#FF3D00] text-white text-xs py-1.5 rounded-lg transition-all duration-300 font-medium 
            ${product.stock === 0 || isAdding
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-md hover:shadow-orange-500/30 hover:scale-[1.02]'
            }`}
        >
          {isAdding ? (
            <span className="flex items-center justify-center gap-1">
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Adding...
            </span>
          ) : 'Add To Cart'}
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