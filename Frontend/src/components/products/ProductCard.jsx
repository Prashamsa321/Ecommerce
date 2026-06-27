import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { success, error, info } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const isAdmin = user?.role === 'admin'

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : Math.floor(Math.random() * 20) + 5
  const rating = (4 + Math.random()).toFixed(1)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isAdmin) { error('Admin users cannot add items to cart'); return }
    setIsAdding(true)
    const result = await addToCart(product._id, 1)
    setIsAdding(false)
    if (result.success) success(`${product.name} added to cart!`)
    else if (result.notAuthenticated) error('Please login to add items')
    else if (result.alreadyInCart) info('Already in your cart')
    else if (result.error) error(result.error)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/products/${product._id}`} className="group block">
        <div className="card-premium overflow-hidden flex flex-col h-full">
          <div className="relative aspect-square bg-brand-light overflow-hidden">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">📦</div>
            )}

            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {discount > 0 && <span className="badge-sale">-{discount}%</span>}
            </div>

            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted(!wishlisted) }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-soft transition-all ${
                  wishlisted ? 'bg-brand-orange text-white' : 'bg-white text-text-secondary hover:text-brand-orange hover:border-brand-orange border border-divider'
                }`}
                aria-label="Wishlist"
              >
                <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
              <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-white text-text-secondary border border-divider shadow-soft">
                <Eye size={16} />
              </span>
            </div>

            {!isAdmin && product.stock > 0 && (
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="absolute bottom-3 left-3 right-3 py-2.5 rounded-xl bg-gradient-cta text-white text-sm font-semibold
                  opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300
                  flex items-center justify-center gap-2 hover:shadow-glow-orange disabled:opacity-60"
              >
                <ShoppingCart size={15} />
                {isAdding ? 'Adding...' : 'Quick Add'}
              </button>
            )}

            {product.stock === 0 && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-sm">
                <span className="px-3 py-1.5 bg-status-error text-white text-xs font-bold rounded-full">Out of Stock</span>
              </div>
            )}
          </div>

          <div className="p-4 flex flex-col flex-grow">
            <p className="text-xs text-brand-orange font-medium mb-1">{product.category}</p>
            <h3 className="font-semibold text-text-primary text-sm line-clamp-2 group-hover:text-brand-orange transition-colors leading-snug mb-2">
              {product.name}
            </h3>

            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className={i < Math.floor(rating) ? 'text-brand-amber fill-brand-amber' : 'text-divider'} />
                ))}
              </div>
              <span className="text-xs text-text-muted">({rating})</span>
            </div>

            <div className="mt-auto flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-text-primary">रु {product.price?.toLocaleString()}</span>
              </div>
              {product.stock > 0 ? (
                <span className="text-[10px] text-status-success bg-green-50 px-2 py-0.5 rounded-full font-medium">In Stock</span>
              ) : (
                <span className="text-[10px] text-status-error bg-red-50 px-2 py-0.5 rounded-full font-medium">Sold Out</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard
