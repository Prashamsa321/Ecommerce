// src/components/cart/CartItem.jsx
import { useCart } from '../../hooks/useCart'

const CartItem = ({ item }) => {
  const { increaseQty, decreaseQty, removeFromCart } = useCart()
  const product = item.product

  if (!product) {
    console.warn('Cart item missing product:', item)
    return null
  }

  const handleIncrease = () => {
    console.log('Increasing quantity for product:', product._id)
    increaseQty(product._id)
  }

  const handleDecrease = () => {
    console.log('Decreasing quantity for product:', product._id)
    decreaseQty(product._id)
  }

  const handleRemove = () => {
    console.log('Removing product from cart:', product._id)
    removeFromCart(product._id)
  }

  return (
    <div className="flex items-center gap-4 py-4 border-b">
      <img
        src={product.image || 'https://via.placeholder.com/80'}
        alt={product.name}
        className="w-20 h-20 object-cover rounded"
      />
      
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600">${product.price?.toFixed(2) || '0.00'}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrease}
          className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="w-8 text-center">{item.qty || 0}</span>
        <button
          onClick={handleIncrease}
          className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <div className="w-24 text-right font-semibold">
        ${((product.price || 0) * (item.qty || 0)).toFixed(2)}
      </div>

      <button
        onClick={handleRemove}
        className="text-red-500 hover:text-red-700 transition-colors"
        aria-label="Remove item"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}

export default CartItem