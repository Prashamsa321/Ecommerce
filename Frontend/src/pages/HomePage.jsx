import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { productService } from '../services/productService'
import ProductCard from '../components/products/ProductCard'
import { FaSnowflake, FaTv, FaClock } from "react-icons/fa";
import { MdOutlineAcUnit } from "react-icons/md";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await productService.getAllProducts()
        const productsArray = Array.isArray(products) ? products : []
        setFeaturedProducts(productsArray.slice(0, 4))
        
        // Extract unique categories
        const uniqueCategories = [...new Set(productsArray.map(p => p.category).filter(Boolean))]
        setCategories(uniqueCategories.slice(0, 4))
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const categoriesData = [
    { name: 'Refrigerator', icon: '🧊', color: 'bg-blue-100', textColor: 'text-blue-600' },
    { name: 'Television', icon: '📺', color: 'bg-green-100', textColor: 'text-green-600' },
    { name: 'Air Conditioner', icon: '❄️', color: 'bg-purple-100', textColor: 'text-purple-600' },
    { name: 'Watch', icon: '🕐', color: 'bg-orange-100', textColor: 'text-orange-600' }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm mb-4">
                🔥 Limited Time Offer
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">MeroGadget</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Discover amazing gadgets and electronics at unbeatable prices. 
                Shop the latest tech trends with exclusive discounts!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Shop Now
                </Link>
                <Link
                  to="/products"
                  className="border border-gray-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all"
                >
                  View Collections
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex gap-8 mt-12">
                <div>
                  <div className="text-2xl font-bold text-blue-400">10K+</div>
                  <div className="text-sm text-gray-400">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">500+</div>
                  <div className="text-sm text-gray-400">Products</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">24/7</div>
                  <div className="text-sm text-gray-400">Support</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 backdrop-blur-sm">
                  <div className="text-8xl md:text-9xl text-center animate-bounce">
                    🛒
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-gray-300">Premium Quality Gadgets</p>
                    <p className="text-2xl font-bold text-white"> Shop Now </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Shop by Category</h2>
          <p className="text-gray-600">Find what you're looking for</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categoriesData.map((category, index) => (
            <Link
              key={index}
              to={`/products?category=${category.name.toLowerCase()}`}
              className={`${category.color} rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300 group`}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className={`font-semibold ${category.textColor}`}>{category.name}</h3>
              <p className="text-sm text-gray-500 mt-1">Shop Now →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-50 rounded-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Products</h2>
          <p className="text-gray-600">Hand-picked just for you</p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        
        {!loading && featuredProducts.length > 0 && (
          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              View All Products
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-5xl mb-4">🚚</div>
            <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
            <p className="text-gray-600 text-sm">On orders over $100</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-5xl mb-4">🔄</div>
            <h3 className="font-semibold text-lg mb-2">30-Day Returns</h3>
            <p className="text-gray-600 text-sm">Hassle-free returns</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-5xl mb-4">💳</div>
            <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
            <p className="text-gray-600 text-sm">100% secure transactions</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-5xl mb-4">⏰</div>
            <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-sm">Dedicated customer service</p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white py-16 mt-8 ">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Get the latest updates on new products and upcoming sales
          </p>
          <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default HomePage