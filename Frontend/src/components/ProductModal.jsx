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
    
    if (result.success) {
      success(`${quantity}x ${product.name} added to cart!`);
      onClose();
    } else if (result.notAuthenticated) {
      error(result.error || 'Please login to add items to cart');
    } else if (result.alreadyInCart) {
      error(result.message || 'Item already in cart');
    } else if (result.error) {
      error(result.error);
    }
  };

  const images = product.images?.filter(img => img) || [];
  const hasImages = images.length > 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-gradient-to-br from-[#111827] to-[#0A2540] rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#1E3A8A] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#111827]/95 backdrop-blur-sm border-b border-[#1E3A8A] px-8 py-6 flex justify-between items-center rounded-t-3xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF6200]/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-[#FF6200]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Product Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-all duration-300 text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#1E3A8A] hover:scale-110"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div>
              <div className="bg-gradient-to-br from-[#0A2540] to-[#1E3A8A] rounded-2xl h-80 flex items-center justify-center overflow-hidden mb-4 border border-[#1E3A8A] group">
                {hasImages ? (
                  <img 
                    src={images[currentImage]} 
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-8xl opacity-30">📦</div>
                )}
              </div>
              
              {hasImages && images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                        currentImage === index 
                          ? 'border-[#FF6200] ring-2 ring-[#FF6200]/30 shadow-lg shadow-orange-500/20' 
                          : 'border-[#1E3A8A] hover:border-[#22D3EE]'
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
              <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{product.name}</h3>
              
              {/* Category Badge */}
              {product.category && (
                <div className="mb-4">
                  <span className="text-xs bg-[#1E3A8A]/50 text-[#22D3EE] px-3 py-1.5 rounded-full border border-[#22D3EE]/30">
                    {product.category}
                  </span>
                </div>
              )}
              
              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-[#FF6200]">
                ₹ {product.price?.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="ml-2 text-sm text-gray-400 line-through">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              {/* Stock Status */}
              <div className="mb-4">
                {product.stock > 0 ? (
                  <span className="text-sm text-[#22D3EE] bg-[#22D3EE]/10 px-4 py-1.5 rounded-full inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-[#22D3EE] rounded-full animate-pulse"></span>
                    ✓ In Stock 
                  </span>
                ) : (
                  <span className="text-sm text-[#FF3B30] bg-[#FF3B30]/10 px-4 py-1.5 rounded-full inline-flex items-center gap-1">
                    ✗ Out of Stock
                  </span>
                )}
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#22D3EE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Description
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
              
              {/* Quantity Selector */}
              {user?.role !== 'admin' && product.stock > 0 && (
                <div className="mb-6 text-center p-4 bg-[#0A2540]/50 rounded-xl border border-[#1E3A8A]">
                  <label className="block text-sm font-medium text-gray-300 mb-3">Select Quantity</label>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12  bg-[#1E3A8A] rounded-xl hover:bg-[#FF6200] transition-all duration-300 text-white text-xl flex items-center justify-center hover:shadow-lg"
                    >
                      -
                    </button>
                    <span className="w-16 text-center text-xl font-semibold text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-12 h-12 bg-[#1E3A8A] rounded-xl hover:bg-[#FF6200] transition-all duration-300 text-white text-xl flex items-center justify-center hover:shadow-lg"
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
                    className="flex-1 bg-gradient-to-r from-[#FF6200] to-[#FF3D00] text-white py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Cart ({quantity})
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 bg-[#1E3A8A] text-white py-4 rounded-xl font-semibold hover:bg-[#FF6200] transition-all duration-300 active:scale-95"
                >
                  Close
                </button>
              </div>

              
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-up {
          animation: scale-up 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default ProductModal;