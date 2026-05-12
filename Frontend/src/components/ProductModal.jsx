import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProductModal = ({ isOpen, onClose, product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { success, error } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setQuantity(1);
      setCurrentImage(0);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = async () => {
    if (user?.role === 'admin') {
      error('Admin users cannot add items to cart');
      return;
    }
    const result = await addToCart(product._id, quantity);
    if (result) {
      success(`${quantity}x ${product.name} added to cart!`);
      onClose();
    } else {
      error('Please login to add items to cart');
    }
  };

  const images = product.images?.filter(img => img) || [];
  const hasImages = images.length > 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-scale-up">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div>
              {/* Main Image */}
              <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center overflow-hidden mb-4">
                {hasImages ? (
                  <img 
                    src={images[currentImage]} 
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400 text-8xl">📦</div>
                )}
              </div>
              
              {/* Thumbnails */}
              {hasImages && images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        currentImage === index ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Product Info */}
            <div>
              {/* Product Name */}
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h3>
              
              {/* Category Badge */}
              {product.category && (
                <div className="mb-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    📁 {product.category}
                  </span>
                </div>
              )}
              
              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-blue-600">${product.price?.toFixed(2)}</span>
              </div>
              
              {/* Stock Status */}
              <div className="mb-4">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      ✓ In Stock
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    ✗ Out of Stock
                  </span>
                )}
              </div>
              
              {/* Full Description */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span>📝</span> Description
                </h4>
                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </div>
              </div>
              
              {/* Quantity Selector */}
              {user?.role !== 'admin' && product.stock > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-xl flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-xl flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                {user?.role !== 'admin' && product.stock > 0 && (
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    🛒 Add to Cart ({quantity})
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
              
              {/* Admin Note */}
              {user?.role === 'admin' && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 flex items-center gap-2">
                    <span>📊</span> Admin Mode: Use Admin Panel to edit products
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scale-up {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-up {
          animation: scale-up 0.2s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .break-words {
          word-break: break-word;
          overflow-wrap: break-word;
        }
      `}</style>
    </div>
  );
};

export default ProductModal;