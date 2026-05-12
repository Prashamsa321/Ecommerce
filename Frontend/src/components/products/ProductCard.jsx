import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ProductModal from '.././ProductModal';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { success, error } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

  const handleAddToCart = async () => {
    if (isAdmin) {
      error('Admin users cannot add items to cart');
      return;
    }
    const result = await addToCart(product._id, 1);
    if (result) {
      success(`${product.name} added to cart!`);
    } else {
      error('Please login to add items to cart');
    }
  };

  // Truncate text with ellipsis
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
        {/* Product Image */}
        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          {product.images && product.images[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-gray-400 text-6xl">📦</div>
          )}
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          {/* Product Name - Fixed overflow with ellipsis */}
          <div className="mb-2">
            <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 break-words">
            {truncateText(product.name, 30)}
            </h3>
          </div>
          
          {/* Product Description - Truncated */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {truncateText(product.description, 35)}
          </p>
          
          {/* Price and Stock */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl font-bold text-blue-600">
              ${product.price?.toFixed(2)}
            </span>
            {product.stock > 0 ? (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                In Stock
              </span>
            ) : (
              <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              View Details
            </button>
            
            {!isAdmin && (
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors text-sm ${
                  product.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  );
};

export default ProductCard;