import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Heart, ShoppingCart, Truck, Shield, Minus, Plus, ChevronRight } from 'lucide-react'
import { productService } from '../services/productService'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const TABS = ['Description', 'Specifications', 'Reviews']

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState('Description')
  const [adding, setAdding] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { success, error } = useToast()

  useEffect(() => {
    productService.getProductById(id)
      .then(setProduct)
      .catch(() => { error('Product not found'); navigate('/products') })
      .finally(() => setLoading(false))
  }, [id])

  const images = product?.images?.filter(Boolean) || []
  const rating = 4.7

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return }
    setAdding(true)
    await addToCart(product._id, qty)
    setAdding(false)
    success('Added to cart!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-primary flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="min-h-screen bg-surface-primary pb-28 lg:pb-12">
      <div className="section-container py-8">
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
          <Link to="/" className="hover:text-brand-orange transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:text-brand-orange transition-colors">Products</Link>
          <ChevronRight size={14} />
          <span className="text-text-secondary line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="card-premium overflow-hidden aspect-square bg-brand-light flex items-center justify-center group">
              {images[activeImage] ? (
                <img src={images[activeImage]} alt={product.name}
                  className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <span className="text-8xl opacity-20">📦</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImage === i ? 'border-brand-orange shadow-glow-orange' : 'border-divider hover:border-brand-orange/50'
                    }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <span className="badge-new">{product.category}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mt-3 mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex">{[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < Math.floor(rating) ? 'text-brand-amber fill-brand-amber' : 'text-divider'} />
              ))}</div>
              <span className="text-text-muted text-sm">{rating} (128 reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-text-primary">रु {product.price?.toLocaleString()}</span>
              <span className="badge-sale">Save 15%</span>
            </div>

            <p className="text-text-secondary leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-3 card-premium rounded-2xl p-1">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-xl flex items-center justify-center text-text-secondary hover:text-brand-orange hover:bg-brand-light transition-all">
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-semibold text-text-primary">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-10 h-10 rounded-xl flex items-center justify-center text-text-secondary hover:text-brand-orange hover:bg-brand-light transition-all">
                  <Plus size={16} />
                </button>
              </div>
              {product.stock > 0
                ? <span className="text-status-success text-sm font-medium">✓ {product.stock} in stock</span>
                : <span className="text-status-error text-sm font-medium">Out of stock</span>}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button onClick={handleAddToCart} disabled={product.stock === 0 || adding} className="btn-cta flex-1 py-4 disabled:opacity-50">
                <ShoppingCart size={18} /> {adding ? 'Adding...' : 'Add to Cart'}
              </button>
              <button className="btn-promo flex-1 py-4" onClick={() => { handleAddToCart(); navigate('/checkout') }}>
                Buy Now
              </button>
              <button className="btn-ghost px-5 py-4"><Heart size={18} /></button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[{ icon: Truck, text: 'Free delivery over रु5,000' }, { icon: Shield, text: '1 year warranty included' }].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 p-3 card-premium rounded-xl text-sm text-text-secondary">
                  <Icon size={16} className="text-brand-orange shrink-0" />{text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-16">
          <div className="flex gap-1 border-b border-divider mb-8 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
                  activeTab === tab ? 'text-brand-orange border-brand-orange' : 'text-text-muted border-transparent hover:text-text-primary'
                }`}>{tab}</button>
            ))}
          </div>
          <div className="card-premium p-8">
            {activeTab === 'Description' && <p className="text-text-secondary leading-relaxed">{product.description}</p>}
            {activeTab === 'Specifications' && (
              <div className="grid sm:grid-cols-2 gap-4">
                {[['Category', product.category], ['Stock', product.stock], ['Price', `रु ${product.price}`], ['SKU', product._id?.slice(-8).toUpperCase()]].map(([k, v]) => (
                  <div key={k} className="flex justify-between p-4 bg-brand-light rounded-xl">
                    <span className="text-text-muted">{k}</span>
                    <span className="text-text-primary font-medium">{v}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'Reviews' && (
              <div className="text-center py-8 text-text-muted">
                <Star size={32} className="mx-auto mb-3 text-brand-amber opacity-50" />
                <p>Reviews coming soon. Be the first to review!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 glass-strong border-t border-divider p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-text-muted">Total</p>
            <p className="text-lg font-bold text-text-primary">रु {(product.price * qty).toLocaleString()}</p>
          </div>
          <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-cta px-6 py-3 text-sm disabled:opacity-50">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
