import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ProductCard from '../products/ProductCard'

const ProductShowcaseSection = ({
  badge,
  title,
  subtitle,
  products = [],
  loading = false,
  limit = 8,
  viewAllHref,
  viewAllLabel = 'View All',
  variant = 'default',
  headerExtra,
}) => {
  const items = products.slice(0, limit)
  if (!loading && items.length === 0) return null

  const bgClass = {
    default: 'bg-surface-primary',
    alt: 'bg-white',
    sale: 'bg-brand-light relative overflow-hidden',
  }[variant] || 'bg-surface-primary'

  return (
    <section className={`py-16 md:py-20 ${bgClass}`}>
      {variant === 'sale' && (
        <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/5 to-transparent pointer-events-none" />
      )}
      <div className="section-container relative">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            {badge && <span className="badge-new mb-3 inline-flex">{badge}</span>}
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">{title}</h2>
            {subtitle && <p className="mt-2 text-text-secondary text-lg max-w-2xl">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-4 shrink-0">
            {headerExtra}
            {viewAllHref && (
              <Link
                to={viewAllHref}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange hover:text-brand-orange-dark transition-colors"
              >
                {viewAllLabel} <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(Math.min(limit, 8))].map((_, i) => (
              <div key={i} className="skeleton aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductShowcaseSection
