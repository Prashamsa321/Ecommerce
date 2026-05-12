import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const { cartItems, loading, removeFromCart, updateQuantity, getCartTotal } = useCart();
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  // Redirect admin users away from cart page
  useEffect(() => {
    if (user?.role === 'admin') {
      toastError('Admin users cannot access shopping cart');
      navigate('/admin');
    }
  }, [user, navigate, toastError]);

  // Handle remove click - open modal
  const handleRemoveClick = (item) => {
    setItemToRemove(item);
    setModalOpen(true);
  };

  // Handle confirm remove
  const handleConfirmRemove = async () => {
    if (itemToRemove) {
      await removeFromCart(itemToRemove.productId || itemToRemove._id);
      success(`${itemToRemove.name} removed from cart`);
      setModalOpen(false);
      setItemToRemove(null);
    }
  };

  // Handle cancel remove
  const handleCancelRemove = () => {
    setModalOpen(false);
    setItemToRemove(null);
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        handleCancelRemove();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [modalOpen]);

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">Loading cart...</div>
      </div>
    );
  }

  // Don't render cart for admin (while redirecting)
  if (user?.role === 'admin') {
    return null;
  }

  const items = Array.isArray(cartItems) ? cartItems : [];
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Cart</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <a 
              href="/products" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="hidden md:grid md:grid-cols-12 gap-4 bg-gray-100 p-4 font-semibold text-gray-700">
              <div className="md:col-span-6">Product</div>
              <div className="md:col-span-2 text-center">Price</div>
              <div className="md:col-span-2 text-center">Quantity</div>
              <div className="md:col-span-1 text-center">Total</div>
              <div className="md:col-span-1"></div>
            </div>
            
            {items.map((item) => (
              <div key={item.productId || item._id} className="border-t border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-6 flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                      ) : (
                        <span className="text-gray-400 text-2xl">📦</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.name || 'Product'}</h3>
                      <p className="text-sm text-gray-500">ID: {item.productId || item._id}</p>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 text-center">
                    <span className="text-gray-600">${(item.price || 0).toFixed(2)}</span>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.productId || item._id, Math.max(1, (item.quantity || 1) - 1))}
                        className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity || 0}</span>
                      <button
                        onClick={() => updateQuantity(item.productId || item._id, (item.quantity || 1) + 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="md:col-span-1 text-center">
                    <span className="font-semibold text-gray-800">
                      ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="md:col-span-1 text-center">
                    <button
                      onClick={() => handleRemoveClick(item)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Remove item"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Cart Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-800">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-gray-800">$0.00</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button 
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              onClick={() => success('Checkout functionality coming soon!')}
            >
              Proceed to Checkout
            </button>
            <a 
              href="/products" 
              className="block text-center mt-4 text-blue-600 hover:text-blue-700 transition-colors"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleCancelRemove}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-red-50 rounded-t-lg p-4 border-b border-red-500">
              <div className="flex items-center gap-3">
                <span className="text-2xl text-red-600">⚠️</span>
                <h3 className="text-lg font-semibold text-gray-900">Remove Item</h3>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to remove <strong className="font-semibold">"{itemToRemove?.name}"</strong> from your cart?
              </p>
            </div>
            
            <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={handleCancelRemove}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;