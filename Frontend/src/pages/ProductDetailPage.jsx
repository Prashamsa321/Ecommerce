import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast' 

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A2540] to-[#1E3A8A] flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#FF6200] border-t-transparent"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-[#22D3EE] border-t-transparent animate-pulse opacity-50"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A2540] to-[#1E3A8A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-[#FF3B30]/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-[#FF3B30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-white text-xl font-semibold">Product not found</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 px-6 py-2 bg-[#FF6200] text-white rounded-xl hover:bg-[#E05500] transition-all duration-300"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2540] via-[#0D2E4A] to-[#1E3A8A] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-[#22D3EE] transition-colors"
          >
            Home
          </button>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <button
            onClick={() => navigate('/products')}
            className="text-gray-400 hover:text-[#22D3EE] transition-colors"
          >
            Products
          </button>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-300 truncate">{product.name}</span>
        </div>

        <div className="bg-[#111827]/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-[#1E3A8A] shadow-2xl hover:border-[#22D3EE]/30 transition-all duration-500">
          <div className="md:flex">
            {/* Product Image Section */}
            <div className="md:w-1/2 bg-gradient-to-br from-[#0A2540] to-[#1E3A8A] p-8 flex items-center justify-center">
              <div className="relative group">
                <img
                  src={product.image || 'https://via.placeholder.com/600'}
                  alt={product.name}
                  className="w-full max-w-md mx-auto object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                />
                {/* Image Badge */}
                {product.countInStock > 0 ? (
                  <div className="absolute top-4 right-4 bg-[#22D3EE]/90 backdrop-blur-sm text-[#0A2540] text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    In Stock
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 bg-[#FF3B30]/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Out of Stock
                  </div>
                )}
              </div>
            </div>
            
            {/* Product Details Section */}
            <div className="p-8 md:w-1/2">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1E3A8A]/50 border border-[#22D3EE]/30 rounded-full text-[#22D3EE] text-xs font-medium mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22D3EE] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22D3EE]"></span>
                </span>
                {product.category}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {product.name}
              </h1>
              
              {/* Price Section */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl md:text-5xl font-bold text-[#FF6200]">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                {product.discount && (
                  <span className="bg-[#22D3EE]/20 text-[#22D3EE] text-sm font-semibold px-2 py-1 rounded-lg">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#22D3EE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Product Description
                </h3>
                <p className="text-gray-300 leading-relaxed">{product.description}</p>
              </div>
              
              {/* Stock Info */}
              <div className="mb-6 p-4 bg-[#0A2540]/50 rounded-xl border border-[#1E3A8A]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Availability:</span>
                  {product.countInStock > 0 ? (
                    <span className="text-[#22D3EE] font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#22D3EE] rounded-full animate-pulse"></span>
                      {product.countInStock} units in stock
                    </span>
                  ) : (
                    <span className="text-[#FF3B30] font-semibold">Out of Stock</span>
                  )}
                </div>
              </div>
              
              {/* Quantity Selector */}
              {product.countInStock > 0 && (
                <div className="mb-6">
                  <label className="text-gray-300 font-medium mb-2 block">Quantity:</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-10 h-10 rounded-xl bg-[#1E3A8A] text-white hover:bg-[#FF6200] transition-all duration-300 flex items-center justify-center text-xl font-bold"
                    >
                      -
                    </button>
                    <div className="relative">
                      <select
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="px-6 py-2.5 bg-[#0A2540] text-white rounded-xl border border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent cursor-pointer appearance-none pr-10"
                      >
                        {[...Array(Math.min(product.countInStock, 10))].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <button
                      onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                      className="w-10 h-10 rounded-xl bg-[#1E3A8A] text-white hover:bg-[#FF6200] transition-all duration-300 flex items-center justify-center text-xl font-bold"
                    >
                      +
                    </button>
                    <span className="text-gray-400 text-sm ml-2">Max {Math.min(product.countInStock, 10)}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                  className="w-full bg-gradient-to-r from-[#FF6200] to-[#FF3D00] text-white py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                
                <button
                  onClick={() => navigate('/products')}
                  className="w-full bg-[#1E3A8A] text-white py-3 rounded-xl font-medium hover:bg-[#FF6200] transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </button>
              </div>

              {/* Features List */}
              <div className="mt-8 pt-6 border-t border-[#1E3A8A]">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#FF6200]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Why choose this product?
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-[#22D3EE]">✓</span> Premium Quality
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-[#22D3EE]">✓</span> 1 Year Warranty
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-[#22D3EE]">✓</span> Free Shipping
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-[#22D3EE]">✓</span> Secure Payment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage