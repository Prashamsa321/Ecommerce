// src/components/products/ProductCard.jsx
import { Link, useNavigate } from 'react-router-dom' // Add useNavigate
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast' // ADD THIS LINE - the missing import

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate() // Add this for redirect

  const handleAddToCart = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please login to add items to cart')
      // Optional: Redirect to login after 1.5 seconds
      setTimeout(() => {
        navigate('/login', { state: { from: `/products/${product._id}` } })
      }, 1500)
      return
    }
    
    await addToCart(product._id, 1)
  }

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <Link to={`/products/${product._id}`}>
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">${product.price}</span>
          <span className="text-sm text-gray-500">Stock: {product.countInStock}</span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.countInStock === 0}
          className="mt-3 w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard