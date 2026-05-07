// src/pages/HomePage.jsx
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { productService } from '../services/productService'
import ProductList from '../components/products/ProductList'

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productService.getAllProducts()
        setFeaturedProducts(products.slice(0, 4))
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 rounded-lg mb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to ShopHub
          </h1>
          <p className="text-xl mb-8">
            Discover amazing products at unbeatable prices
          </p>
          <Link
            to="/products"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Products</h2>
        <ProductList products={featuredProducts} loading={loading} />
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="text-center p-6">
          <div className="text-blue-600 text-4xl mb-4">🚚</div>
          <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
          <p className="text-gray-600">On orders over $100</p>
        </div>
        <div className="text-center p-6">
          <div className="text-blue-600 text-4xl mb-4">🔄</div>
          <h3 className="font-semibold text-lg mb-2">30-Day Returns</h3>
          <p className="text-gray-600">Hassle-free returns</p>
        </div>
        <div className="text-center p-6">
          <div className="text-blue-600 text-4xl mb-4">💳</div>
          <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
          <p className="text-gray-600">100% secure transactions</p>
        </div>
      </section>
    </div>
  )
}

export default HomePage