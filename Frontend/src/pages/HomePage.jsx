import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Truck, Shield, RotateCcw, Headphones, Zap, Star, ChevronLeft, ChevronRight,
  Smartphone, Laptop, Watch, Headphones as HeadphonesIcon, Gamepad2, Camera,
} from 'lucide-react'
import { productService } from '../services/productService'
import ProductCard from '../components/products/ProductCard'
import ProductShowcaseSection from '../components/ui/ProductShowcaseSection'
import SectionHeader from '../components/ui/SectionHeader'

const CATEGORIES = [
  { name: 'Smartphones', icon: Smartphone, slug: 'Smartphones' },
  { name: 'Laptops', icon: Laptop, slug: 'Laptops' },
  { name: 'Smart Watches', icon: Watch, slug: 'Smart Watches' },
  { name: 'Headphones', icon: HeadphonesIcon, slug: 'Headphones' },
  { name: 'Gaming', icon: Gamepad2, slug: 'Gaming' },
  { name: 'Cameras', icon: Camera, slug: 'Cameras' },
]

const CATEGORY_SECTIONS = [
  { slug: 'Smartphones', badge: 'Mobile', title: 'Latest Smartphones', subtitle: 'Flagship phones and everyday essentials' },
  { slug: 'Laptops', badge: 'Computing', title: 'Top Laptops', subtitle: 'Work, study, and gaming machines' },
  { slug: 'Headphones', badge: 'Audio', title: 'Headphones & Earbuds', subtitle: 'Immersive sound for every lifestyle' },
  { slug: 'Gaming', badge: 'Gaming', title: 'Gaming Gear', subtitle: 'Consoles, accessories, and pro setups' },
  { slug: 'Smart Watches', badge: 'Wearables', title: 'Smart Watches', subtitle: 'Track fitness and stay connected' },
  { slug: 'Cameras', badge: 'Photography', title: 'Cameras & Lenses', subtitle: 'Capture moments in stunning detail' },
]

const FEATURES = [
  { icon: Truck, title: 'Fast Delivery', desc: 'Free shipping on orders over रु5,000' },
  { icon: Shield, title: 'Secure Payment', desc: '256-bit SSL encrypted checkout' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day hassle-free return policy' },
  { icon: Headphones, title: '24/7 Support', desc: 'Expert help whenever you need it' },
]

const TESTIMONIALS = [
  { name: 'Rahul Sharma', role: 'Tech Enthusiast', rating: 5, text: 'Best electronics store in Nepal. Genuine products, fast delivery, and amazing customer support!', avatar: 'RS' },
  { name: 'Priya Karki', role: 'Verified Buyer', rating: 5, text: 'Ordered a MacBook and it arrived in perfect condition. The packaging was premium and delivery was super fast.', avatar: 'PK' },
  { name: 'Anil Thapa', role: 'Gaming Fan', rating: 5, text: 'Great prices on gaming gear. The website is smooth and the product quality is exactly as described.', avatar: 'AT' },
]

const FlashCountdown = () => {
  const [time, setTime] = useState({ h: 5, m: 23, s: 47 })
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev
        s--
        if (s < 0) { s = 59; m-- }
        if (m < 0) { m = 59; h-- }
        if (h < 0) { h = 23; m = 59; s = 59 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])
  const pad = (n) => String(n).padStart(2, '0')
  return (
    <div className="flex gap-2">
      {[['h', time.h], ['m', time.m], ['s', time.s]].map(([label, val]) => (
        <div key={label} className="text-center">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl font-bold text-brand-orange border border-brand-orange/20 shadow-soft">
            {pad(val)}
          </div>
          <span className="text-[10px] text-text-muted mt-1 block uppercase">{label}</span>
        </div>
      ))}
    </div>
  )
}

const sortByNewest = (list) =>
  [...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))

const sortByPrice = (list, asc = true) =>
  [...list].sort((a, b) => (asc ? (a.price || 0) - (b.price || 0) : (b.price || 0) - (a.price || 0)))

const byCategory = (list, category) =>
  list.filter(p => p.category?.toLowerCase() === category.toLowerCase())

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [testimonialIdx, setTestimonialIdx] = useState(0)

  useEffect(() => {
    let cancelled = false
    const loadProducts = async () => {
      try {
        const { products: data } = await productService.getProducts({ page: 1, limit: 100 })
        if (!cancelled) setProducts(data)
      } catch (err) {
        console.error('Failed to load home products:', err)
        if (!cancelled) setProducts([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadProducts()
    return () => { cancelled = true }
  }, [])

  const productSections = useMemo(() => {
    const newest = sortByNewest(products)
    const inStock = products.filter(p => (p.stock ?? 0) > 0)
    const withDiscount = products.filter(p => p.originalPrice && p.originalPrice > p.price)

    const categoryCounts = products.reduce((acc, p) => {
      if (p.category) acc[p.category] = (acc[p.category] || 0) + 1
      return acc
    }, {})

    return {
      heroProduct: newest[0] || products[0],
      latest: newest.slice(0, 8),
      featured: newest.slice(0, 8),
      trending: sortByPrice(inStock, false).slice(0, 8),
      flashSale: (withDiscount.length ? withDiscount : newest.slice(4, 12)).slice(0, 8),
      bestDeals: sortByPrice(inStock, true).slice(0, 8),
      premium: sortByPrice(inStock, false).slice(0, 8),
      categoryCounts,
    }
  }, [products])

  const categoryProductMap = useMemo(() => {
    const map = {}
    CATEGORY_SECTIONS.forEach(({ slug }) => {
      map[slug] = byCategory(products, slug).slice(0, 8)
    })
    return map
  }, [products])

  return (
    <div className="bg-surface-primary pb-20 md:pb-0">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-amber/10 rounded-full blur-[100px]" />
        </div>
        <div className="section-container relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <span className="badge-new mb-6 inline-flex items-center gap-2">
                <Zap size={12} /> New Arrivals 2025
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-[1.1] tracking-tight mb-6">
                The Future of{' '}
                <span className="bg-gradient-to-r from-brand-orange to-brand-orange-dark bg-clip-text text-transparent">
                  Electronics
                </span>
              </h1>
              <p className="text-lg text-text-secondary mb-8 max-w-lg leading-relaxed">
                Discover premium gadgets curated for innovators. From cutting-edge smartphones to pro-grade laptops — experience technology at its finest.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="btn-cta px-8 py-4 text-base">Shop Now</Link>
                <Link to="/products" className="btn-ghost px-8 py-4 text-base">Explore Products</Link>
              </div>
              <div className="flex gap-10 mt-14">
                {[['100+', 'Products'], ['10K+', 'Customers'], ['4.9★', 'Rating']].map(([val, label]) => (
                  <div key={label}>
                    <div className="text-2xl font-bold text-text-primary">{val}</div>
                    <div className="text-sm text-text-muted">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 card-premium p-8">
                {productSections.heroProduct?.images?.[0] ? (
                  <img
                    src={productSections.heroProduct.images[0]}
                    alt={productSections.heroProduct.name}
                    className="w-full max-h-80 object-contain animate-float drop-shadow-2xl"
                  />
                ) : (
                  <div className="h-80 flex items-center justify-center text-8xl opacity-30">📱</div>
                )}
                {productSections.heroProduct && (
                  <div className="mt-6 p-4 bg-brand-light rounded-2xl border border-brand-orange/10">
                    <p className="text-xs text-brand-orange font-medium">{productSections.heroProduct.category}</p>
                    <p className="text-text-primary font-semibold mt-1 line-clamp-1">{productSections.heroProduct.name}</p>
                    <p className="text-brand-orange font-bold mt-1">रु {productSections.heroProduct.price?.toLocaleString()}</p>
                  </div>
                )}
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-cta rounded-2xl opacity-20 blur-xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <SectionHeader badge="Categories" title="Shop by Category" subtitle="Browse electronics by type" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(({ name, icon: Icon, slug }, i) => (
              <motion.div key={slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link
                  to={`/products?category=${encodeURIComponent(slug)}`}
                  className="group block p-6 card-premium text-center hover:scale-105 transition-transform duration-300 bg-gradient-category"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-cta flex items-center justify-center shadow-glow-orange group-hover:scale-105 transition-transform">
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-text-primary font-semibold text-sm mb-1">{name}</h3>
                  <p className="text-xs text-text-muted">
                    {productSections.categoryCounts[name] || 0} items
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 1. Latest Arrivals */}
      <ProductShowcaseSection
        badge="Just In"
        title="Latest Products"
        subtitle="Freshly added gadgets — be the first to grab them"
        products={productSections.latest}
        loading={loading}
        limit={8}
        viewAllHref="/products"
        viewAllLabel="See All New"
        variant="default"
      />

      {/* 2. Featured */}
      <ProductShowcaseSection
        badge="Editor's Pick"
        title="Featured Products"
        subtitle="Hand-picked premium electronics just for you"
        products={productSections.featured}
        loading={loading}
        limit={8}
        viewAllHref="/products"
        variant="alt"
      />

      {/* 3. Flash Sale */}
      <section className="py-16 md:py-20 bg-brand-light relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/5 to-transparent pointer-events-none" />
        <div className="section-container relative">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <span className="badge-sale mb-4 inline-flex">⚡ Flash Sale</span>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary">Limited Time Deals</h2>
              <p className="text-text-secondary mt-2">Grab these deals before they're gone</p>
            </div>
            <FlashCountdown />
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton aspect-[3/4]" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {productSections.flashSale.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/products" className="btn-promo px-10">Shop All Deals</Link>
          </div>
        </div>
      </section>

      {/* 4–9. Category-wise sections */}
      {CATEGORY_SECTIONS.map(({ slug, badge, title, subtitle }, idx) => (
        <ProductShowcaseSection
          key={slug}
          badge={badge}
          title={title}
          subtitle={subtitle}
          products={categoryProductMap[slug]}
          loading={loading}
          limit={8}
          viewAllHref={`/products?category=${encodeURIComponent(slug)}`}
          viewAllLabel={`All ${slug}`}
          variant={idx % 2 === 0 ? 'default' : 'alt'}
        />
      ))}

      {/* 10. Trending / Best Sellers */}
      <ProductShowcaseSection
        badge="Hot"
        title="Trending Now"
        subtitle="Most popular picks shoppers love right now"
        products={productSections.trending}
        loading={loading}
        limit={8}
        viewAllHref="/products"
        variant="sale"
      />

      {/* 11. Best Budget Deals */}
      <ProductShowcaseSection
        badge="Value"
        title="Best Budget Deals"
        subtitle="Quality electronics that won't break the bank"
        products={productSections.bestDeals}
        loading={loading}
        limit={8}
        viewAllHref="/products"
        variant="alt"
      />

      {/* 12. Premium Collection */}
      <ProductShowcaseSection
        badge="Premium"
        title="Premium Collection"
        subtitle="Top-tier devices for power users and professionals"
        products={productSections.premium}
        loading={loading}
        limit={8}
        viewAllHref="/products"
        variant="default"
      />

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 bg-white">
        <div className="section-container">
          <SectionHeader badge="Why Us" title="Why Choose MeroGadget" subtitle="We're committed to delivering the best shopping experience" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 card-premium text-center group"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-brand-light flex items-center justify-center group-hover:bg-brand-orange/10 transition-colors">
                  <Icon size={24} className="text-brand-orange" />
                </div>
                <h3 className="text-text-primary font-semibold mb-2">{title}</h3>
                <p className="text-sm text-text-muted">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20">
        <div className="section-container">
          <SectionHeader badge="Reviews" title="What Our Customers Say" subtitle="Trusted by thousands of tech lovers" />
          <div className="max-w-2xl mx-auto">
            <motion.div
              key={testimonialIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-premium p-8 md:p-10 text-center"
            >
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(TESTIMONIALS[testimonialIdx].rating)].map((_, i) => (
                  <Star key={i} size={18} className="text-brand-amber fill-brand-amber" />
                ))}
              </div>
              <p className="text-lg text-text-secondary leading-relaxed mb-6 italic">
                "{TESTIMONIALS[testimonialIdx].text}"
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-cta flex items-center justify-center text-white font-bold text-sm">
                  {TESTIMONIALS[testimonialIdx].avatar}
                </div>
                <div className="text-left">
                  <p className="text-text-primary font-semibold">{TESTIMONIALS[testimonialIdx].name}</p>
                  <p className="text-sm text-text-muted">{TESTIMONIALS[testimonialIdx].role}</p>
                </div>
              </div>
            </motion.div>
            <div className="flex justify-center gap-3 mt-6">
              <button onClick={() => setTestimonialIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="w-10 h-10 rounded-xl card-premium flex items-center justify-center text-text-secondary hover:text-brand-orange transition-colors">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length)} className="w-10 h-10 rounded-xl card-premium flex items-center justify-center text-text-secondary hover:text-brand-orange transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-20 bg-white">
        <div className="section-container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-cta p-10 md:p-16 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggIGQ9Ik0zNiAzNGg0djJoLTR6bTAtNGg0djJoLTR6bTAtNGg0djJoLTR6bTAtNGg0djJoLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay in the Loop</h2>
              <p className="text-white/80 mb-8 max-w-md mx-auto">Get exclusive deals, new arrivals, and tech news delivered to your inbox.</p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder="Enter your email" className="flex-1 px-5 py-3.5 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm" />
                <button type="submit" className="px-8 py-3.5 bg-white text-brand-orange font-semibold rounded-2xl hover:bg-white/90 transition-colors shrink-0">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
