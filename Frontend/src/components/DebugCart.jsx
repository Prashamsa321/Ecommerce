import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const DebugCart = () => {
  let auth = null
  let cart = null
  
  try {
    auth = useAuth()
  } catch (e) {
    console.warn('AuthProvider not found')
  }
  
  try {
    cart = useCart()
  } catch (e) {
    console.warn('CartProvider not found')
  }
  
  if (!auth || !cart) {
    return (
      <div style={{ position: 'fixed', bottom: 10, right: 10, background: 'yellow', border: '1px solid black', padding: 10, zIndex: 9999 }}>
        <h3>⚠️ DebugCart Error</h3>
        <p>Component not properly wrapped with providers</p>
      </div>
    )
  }
  
  const { user, isAuthenticated, token } = auth
  const { addToCart, cartItems, loading, error } = cart

  const testAddToCart = async () => {
    const productId = prompt('Enter product ID to add to cart:')
    if (productId) {
      const result = await addToCart(productId, 1)
      alert(result ? 'Item added to cart!' : 'Failed to add item')
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: 10, right: 10, background: 'white', border: '2px solid black', padding: 10, zIndex: 9999, borderRadius: 5, boxShadow: '0 2px 10px rgba(0,0,0,0.2)', maxWidth: 300 }}>
      <h3 style={{ margin: '0 0 10px 0' }}>🛠️ Cart Debugger</h3>
      <div style={{ fontSize: 12 }}>
        <div><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</div>
        <div><strong>User ID:</strong> {user?._id || 'None'}</div>
        <div><strong>Has Token:</strong> {token ? '✅ Yes' : '❌ No'}</div>
        <div><strong>Cart Items:</strong> {cartItems.length}</div>
        <div><strong>Loading:</strong> {loading ? '⏳ Yes' : 'No'}</div>
        {error && <div style={{ color: 'red' }}><strong>Error:</strong> {error}</div>}
      </div>
      <button 
        onClick={testAddToCart}
        style={{ 
          marginTop: 10, 
          padding: '5px 10px', 
          background: '#3b82f6', 
          color: 'white', 
          border: 'none', 
          borderRadius: 3,
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Test Add to Cart
      </button>
    </div>
  )
}

export default DebugCart