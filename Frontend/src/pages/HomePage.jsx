import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { productService } from '../services/productService'
import ProductCard from '../components/products/ProductCard'

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await productService.getAllProducts()
        const productsArray = Array.isArray(products) ? products : []
        setFeaturedProducts(productsArray.slice(0, 4))
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const categoriesData = [
    { name: 'Refrigerator', icon: '🧊', gradient: 'from-blue-500/20 to-cyan-500/20' },
    { name: 'Television', icon: '📺', gradient: 'from-purple-500/20 to-pink-500/20' },
    { name: 'Air Conditioner', icon: '❄️', gradient: 'from-cyan-500/20 to-blue-500/20' },
    { name: 'Watch', icon: '⌚', gradient: 'from-orange-500/20 to-red-500/20' }
  ]

  return (
    <div className="bg-[#0A2540]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#1E3A8A] rounded-full filter blur-[128px] opacity-30"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FF6200] rounded-full filter blur-[128px] opacity-20"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#22D3EE] rounded-full filter blur-[120px] opacity-15"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E3A8A]/30 border border-[#22D3EE]/50 rounded-full text-[#22D3EE] text-sm mb-6 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22D3EE] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22D3EE]"></span>
                </span>
                New Collection Available
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Premium
                <span className="bg-gradient-to-r from-[#FF6200] to-[#FF3D00] bg-clip-text text-transparent"> Electronics</span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-lg">
                Discover cutting-edge gadgets and electronics. Experience the future of technology with our premium collection.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="bg-[#FF6200] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#E05500] transition-all duration-300 shadow-lg shadow-orange-500/30 active:scale-95"
                >
                  Explore Products
                </Link>
                <Link
                  to="/products"
                  className="border border-[#22D3EE] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#22D3EE]/10 transition-all duration-300 active:scale-95"
                >
                  View Collections
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex gap-12 mt-16">
                <div>
                  <div className="text-3xl font-bold text-white">10K+</div>
                  <div className="text-sm text-gray-300">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-gray-300">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-sm text-gray-300">Support</div>
                </div>
              </div>
            </div>
            
            <div className="relative hidden md:block">
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-[#1E3A8A]/30 to-[#111827]/50 rounded-3xl p-8 backdrop-blur-sm border border-[#FF6200]/30">
                  <div className="text-9xl text-center animate-float">
                   <img src="./home appliance.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Shop by Category</h2>
            <p className="text-gray-300">Find exactly what you're looking for</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categoriesData.map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${category.name.toLowerCase()}`}
                className={`bg-gradient-to-br ${category.gradient} rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300 border border-[#1E3A8A] hover:border-[#FF6200] group backdrop-blur-sm`}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-white font-semibold">{category.name}</h3>
                <p className="text-[#22D3EE] text-sm mt-2 group-hover:text-[#FF6200] transition">Shop Now →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-[#111827]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Featured Products</h2>
            <p className="text-gray-300">Hand-picked just for you</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#0A2540] rounded-2xl p-4 animate-pulse border border-[#1E3A8A]">
                  <div className="h-48 bg-[#1E3A8A] rounded-xl mb-4"></div>
                  <div className="h-4 bg-[#1E3A8A] rounded-full mb-2 w-3/4"></div>
                  <div className="h-4 bg-[#1E3A8A] rounded-full w-1/2"></div>
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
            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-[#FF6200] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#E05500] transition-all duration-300 shadow-lg shadow-orange-500/30 active:scale-95"
              >
                View All Products
                <span>→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $100' },
              { icon: '🔄', title: '30-Day Returns', desc: 'Hassle-free returns' },
              { icon: '💳', title: 'Secure Payment', desc: '100% secure transactions' },
              { icon: '⏰', title: '24/7 Support', desc: 'Dedicated customer service' }
            ].map((feature, index) => (
              <div key={index} className="bg-[#111827] rounded-2xl p-6 text-center border border-[#1E3A8A] hover:border-[#22D3EE] transition-all duration-300 group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-[#0A2540] to-[#111827]">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8">
            Get the latest updates on new products and exclusive offers
          </p>
          <form className="flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-[#0A2540] border border-[#1E3A8A] rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="bg-[#FF6200] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#E05500] transition-all duration-300 shadow-lg shadow-orange-500/20 active:scale-95"
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