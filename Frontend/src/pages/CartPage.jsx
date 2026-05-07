// src/pages/CartPage.jsx
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'

const CartPage = () => {
  const { cart, loading } = useCart()

  if (loading) {
    return <div className="text-center py-10">Loading cart...</div>
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
        <Link to="/products" className="btn-primary inline-block">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-4">
          {cart.items.map((item) => (
            <CartItem key={item.product?._id} item={item} />
          ))}
        </div>
        <div className="mt-4">
          <Link to="/products" className="text-blue-600 hover:underline">
            ← Continue Shopping
          </Link>
        </div>
      </div>
      
      <div>
        <CartSummary />
      </div>
    </div>
  )
}

export default CartPage