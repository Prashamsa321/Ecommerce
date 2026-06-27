import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      toastError('Admin users cannot access shopping cart');
      navigate('/admin');
    }
  }, [user, navigate, toastError]);

  const handleRemoveClick = (item) => {
    setItemToRemove(item);
    setModalOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (itemToRemove) {
      setUpdatingItemId(itemToRemove.productId || itemToRemove._id);
      try {
        await removeFromCart(itemToRemove.productId || itemToRemove._id);
        success(`${itemToRemove.name} removed from cart`);
        setModalOpen(false);
        setItemToRemove(null);
      } catch {
        toastError('Failed to remove item');
      } finally {
        setUpdatingItemId(null);
      }
    }
  };

  const handleCancelRemove = () => {
    setModalOpen(false);
    setItemToRemove(null);
  };

  const handleUpdateQuantity = useCallback(async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdatingItemId(itemId);
    try {
      await updateQuantity(itemId, newQuantity);
    } catch {
      toastError('Failed to update quantity');
    } finally {
      setUpdatingItemId(null);
    }
  }, [updateQuantity, toastError]);

  const handleDecrease = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      handleUpdateQuantity(itemId, currentQuantity - 1);
    } else {
      const item = items.find(i => (i.productId || i._id) === itemId);
      if (item) handleRemoveClick(item);
    }
  };

  const handleIncrease = (itemId, currentQuantity, maxStock = 999) => {
    if (currentQuantity < maxStock) {
      handleUpdateQuantity(itemId, currentQuantity + 1);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && modalOpen) handleCancelRemove();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [modalOpen]);

  if (user?.role === 'admin') return null;

  const items = Array.isArray(cartItems) ? cartItems : [];

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface-primary py-16 pb-24">
        <div className="section-container max-w-3xl">
          <div className="text-center card-premium p-12">
            <div className="text-7xl mb-6">🛒</div>
            <h1 className="text-3xl font-bold text-text-primary mb-4">Your Cart is Empty</h1>
            <p className="text-text-secondary mb-8">Looks like you haven't added anything yet</p>
            <Link to="/products" className="btn-cta px-8 py-3">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-primary py-10 pb-28 md:pb-10">
      <div className="section-container max-w-7xl">
        <h1 className="text-3xl font-bold text-text-primary mb-8">Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-4">
            {items.map((item) => {
              const itemId = item.productId || item._id;
              const isUpdating = updatingItemId === itemId;

              return (
                <div key={itemId} className="card-premium p-6">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-brand-light rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl">📦</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary text-lg">{item.name || 'Product'}</h3>
                      <p className="text-text-secondary text-sm mt-1">रु{(item.price || 0).toFixed(2)} each</p>

                      <div className="flex items-center gap-3 mt-4">
                        <button
                          onClick={() => handleDecrease(itemId, item.quantity || 1)}
                          disabled={isUpdating}
                          className="w-8 h-8 rounded-full bg-brand-light text-brand-orange hover:bg-brand-orange hover:text-white transition-all flex items-center justify-center disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-text-primary font-medium">
                          {isUpdating ? (
                            <svg className="animate-spin h-4 w-4 mx-auto text-brand-orange" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          ) : (
                            item.quantity || 0
                          )}
                        </span>
                        <button
                          onClick={() => handleIncrease(itemId, item.quantity || 1, 99)}
                          disabled={isUpdating}
                          className="w-8 h-8 rounded-full bg-brand-light text-brand-orange hover:bg-brand-orange hover:text-white transition-all flex items-center justify-center disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-text-primary">
                        रु{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveClick(item)}
                        disabled={isUpdating}
                        className="text-status-error hover:text-red-600 transition-colors mt-2 text-sm disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:w-1/3">
            <div className="card-premium p-6 sticky top-24">
              <h2 className="text-xl font-bold text-text-primary mb-6">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal ({items.reduce((sum, item) => sum + (item.quantity || 0), 0)} items)</span>
                  <span>रु{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Shipping</span>
                  <span className="text-status-success font-medium">Free</span>
                </div>
                <div className="border-t border-divider pt-3">
                  <div className="flex justify-between text-lg font-bold text-text-primary">
                    <span>Total</span>
                    <span>रु{getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full btn-cta py-4 mt-6" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </button>

              <Link to="/products" className="block text-center mt-4 text-brand-orange hover:text-brand-orange-dark transition-colors text-sm font-medium">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={handleCancelRemove}>
          <div className="card-premium max-w-md w-full mx-4 shadow-card-hover" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🗑️</div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">Remove Item</h3>
                <p className="text-text-secondary">
                  Are you sure you want to remove <strong className="text-text-primary">"{itemToRemove?.name}"</strong>?
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleCancelRemove} className="flex-1 btn-ghost py-3">Cancel</button>
                <button onClick={handleConfirmRemove} className="flex-1 py-3 bg-status-error text-white rounded-xl font-medium hover:bg-red-600 transition-all">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
