// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast' // Make sure this import exists

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const { addToCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id)
        setProduct(data)
      } catch (error) {
        toast.error('Product not found')
        navigate('/products')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id, navigate])

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart')
      navigate('/login')
      return
    }
    await addToCart(product._id, qty)
  }

  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  if (!product) {
    return <div className="text-center py-10">Product not found</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2">
          <img
            src={product.image || 'https://via.placeholder.com/600'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6 md:w-1/2">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.category}</p>
          <p className="text-3xl font-bold text-blue-600 mb-4">${product.price}</p>
          <p className="text-gray-700 mb-4">{product.description}</p>
          
        

          {product.countInStock > 0 && (
            <div className="mb-4 flex items-center gap-4">
              <label className="text-gray-600">Quantity:</label>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="input w-24"
              >
                {[...Array(Math.min(product.countInStock, 10))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage