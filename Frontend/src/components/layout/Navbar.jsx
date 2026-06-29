import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FaIcon from '../common/FaIcon'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { productService } from '../../services/productService'

const CATEGORIES = [
  { name: 'Smartphones', icon: 'mobile-screen', slug: 'Smartphones' },
  { name: 'Laptops', icon: 'laptop', slug: 'Laptops' },
  { name: 'Tablets', icon: 'tablet-screen-button', slug: 'Tablets' },
  { name: 'Headphones', icon: 'headphones', slug: 'Headphones' },
  { name: 'Smart Watches', icon: 'clock', slug: 'Smart Watches' },
  { name: 'Gaming', icon: 'gamepad', slug: 'Gaming' },
  { name: 'Cameras', icon: 'camera', slug: 'Cameras' },
  { name: 'Audio', icon: 'volume-high', slug: 'Audio' },
  { name: 'Accessories', icon: 'microchip', slug: 'Accessories' },
]

const navLinkClass = (active) =>
  active
    ? 'nav-link-active'
    : 'px-4 py-2 text-sm font-medium text-text-secondary hover:text-brand-orange rounded-xl hover:bg-brand-light transition-all'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { getCartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const searchRef = useRef(null)
  const mobileSearchRef = useRef(null)
  const searchToggleRef = useRef(null)
  const profileRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setMegaOpen(false)
    setProfileOpen(false)
    setMobileSearchOpen(false)
    setShowSuggestions(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('search')
    if (location.pathname === '/products' && q) {
      setSearchQuery(q)
    } else if (location.pathname !== '/products') {
      setSearchQuery('')
    }
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([])
      return
    }
    const timer = setTimeout(async () => {
      try {
        const { products } = await productService.getProducts({
          search: searchQuery.trim(),
          limit: 6,
          page: 1,
        })
        setSuggestions(products)
      } catch {
        setSuggestions([])
      }
    }, 200)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
      const inSearch =
        searchRef.current?.contains(e.target) ||
        mobileSearchRef.current?.contains(e.target) ||
        searchToggleRef.current?.contains(e.target)
      if (!inSearch) {
        setShowSuggestions(false)
        setMobileSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (location.pathname.startsWith('/admin')) return null

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    navigate('/login')
  }

  const handleSearch = (e) => {
    e?.preventDefault?.()
    const query = searchQuery.trim()
    if (!query) return
    navigate(`/products?search=${encodeURIComponent(query)}`)
    setShowSuggestions(false)
    setMobileSearchOpen(false)
  }

  const goToSearchResults = (query) => {
    const q = (query || searchQuery).trim()
    if (!q) return
    navigate(`/products?search=${encodeURIComponent(q)}`)
    setShowSuggestions(false)
    setMobileSearchOpen(false)
    setSearchQuery(q)
  }

  const goToProduct = (id) => {
    navigate(`/products/${id}`)
    setShowSuggestions(false)
    setMobileSearchOpen(false)
    setSearchQuery('')
  }

  const renderSuggestions = (onViewAll) =>
    showSuggestions && searchQuery.trim() && (
      <div className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl overflow-hidden border border-divider shadow-card z-50">
        {suggestions.length > 0 ? (
          suggestions.map((p) => (
            <button
              key={p._id}
              type="button"
              onClick={() => goToProduct(p._id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-brand-light text-left transition-colors"
            >
              {p.images?.[0] && (
                <img src={p.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover" />
              )}
              <div className="min-w-0">
                <p className="text-sm text-text-primary line-clamp-1">{p.name}</p>
                <p className="text-xs text-brand-orange font-medium">रु {p.price?.toLocaleString()}</p>
              </div>
            </button>
          ))
        ) : (
          <p className="px-4 py-3 text-sm text-text-muted">No matching products</p>
        )}
        <button
          type="button"
          onClick={onViewAll}
          className="w-full px-4 py-3 text-sm font-semibold text-brand-orange hover:bg-brand-light border-t border-divider text-left"
        >
          View all results for &quot;{searchQuery.trim()}&quot;
        </button>
      </div>
    )

  const isActive = (path) => location.pathname === path

  return (
    <>
      <div className="bg-gradient-promo text-white text-center text-xs sm:text-sm py-2 px-4 font-medium">
        Free shipping on orders over रु5,000 · New arrivals every week
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass-strong shadow-soft' : 'bg-white/90 backdrop-blur-sm border-b border-divider'
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16 lg:h-[72px] gap-4">
            <Link to="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-cta flex items-center justify-center shadow-glow-orange group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-sm">MG</span>
              </div>
              <span className="hidden sm:block text-xl font-bold tracking-tight text-text-primary">
                Mero<span className="text-brand-orange">Gadget</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              <Link to="/" className={navLinkClass(isActive('/'))}>Home</Link>
              <div
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-text-secondary hover:text-brand-orange rounded-xl hover:bg-brand-light transition-all">
                  Categories <FaIcon icon="chevron-down" size={14} className={`transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {megaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-[520px] glass rounded-2xl p-6 shadow-card border border-divider"
                    >
                      <div className="grid grid-cols-3 gap-2">
                        {CATEGORIES.map(({ name, icon, slug }) => (
                          <Link
                            key={slug}
                            to={`/products?category=${encodeURIComponent(slug)}`}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-light group transition-all"
                          >
                            <div className="w-9 h-9 rounded-lg bg-brand-light flex items-center justify-center group-hover:bg-brand-orange/10 transition-colors">
                              <FaIcon icon={icon} size={16} className="text-brand-orange" />
                            </div>
                            <span className="text-sm text-text-secondary group-hover:text-brand-orange">{name}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-divider">
                        <Link to="/products" className="text-sm text-brand-orange hover:text-brand-orange-dark transition-colors font-medium">
                          View all products →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link to="/products" className={navLinkClass(isActive('/products'))}>Shop</Link>
              <Link to="/about" className={navLinkClass(isActive('/about'))}>About</Link>
              <Link to="/contact" className={navLinkClass(isActive('/contact'))}>Contact</Link>
            </nav>

            <div className="hidden md:flex flex-1 max-w-md mx-4" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative w-full">
                <FaIcon icon="magnifying-glass" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <input
                  type="search"
                  placeholder="Search electronics..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true) }}
                  onFocus={() => setShowSuggestions(true)}
                  aria-label="Search products"
                  className="w-full pl-11 pr-12 py-2.5 bg-surface-primary border border-divider rounded-2xl text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all"
                />
                <button
                  type="submit"
                  aria-label="Search products"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-xl text-text-secondary hover:text-brand-orange hover:bg-brand-light transition-all"
                >
                  <FaIcon icon="magnifying-glass" size={16} />
                </button>
                {renderSuggestions(() => goToSearchResults())}
              </form>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                ref={searchToggleRef}
                onClick={() => {
                  setMobileSearchOpen((open) => {
                    if (!open) setShowSuggestions(true)
                    return !open
                  })
                }}
                className="md:hidden p-2.5 rounded-xl text-text-secondary hover:text-brand-orange hover:bg-brand-light transition-all"
                aria-label="Search"
              >
                <FaIcon icon="magnifying-glass" size={20} />
              </button>
              <Link to="/cart" className="p-2.5 rounded-xl text-text-secondary hover:text-brand-orange hover:bg-brand-light transition-all relative">
                <FaIcon icon="cart-shopping" size={20} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {getCartCount() > 9 ? '9+' : getCartCount()}
                  </span>
                )}
              </Link>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl hover:bg-brand-light transition-all border border-transparent hover:border-divider"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-cta flex items-center justify-center">
                    <FaIcon icon="user" size={16} className="text-white" />
                  </div>
                  {user && <span className="hidden lg:block text-sm font-medium text-text-secondary max-w-[80px] truncate">{user.name?.split(' ')[0]}</span>}
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 glass rounded-2xl overflow-hidden border border-divider shadow-card z-50"
                    >
                      {user ? (
                        <>
                          <div className="px-4 py-3 border-b border-divider">
                            <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                            <p className="text-xs text-text-muted truncate">{user.email}</p>
                          </div>
                          {user.role === 'admin' ? (
                            <Link to="/admin" className="block px-4 py-3 text-sm text-text-secondary hover:text-brand-orange hover:bg-brand-light transition-colors">Admin Panel</Link>
                          ) : (
                            <Link to="/profile" className="block px-4 py-3 text-sm text-text-secondary hover:text-brand-orange hover:bg-brand-light transition-colors">My Dashboard</Link>
                          )}
                          <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-status-error hover:bg-red-50 transition-colors">Sign Out</button>
                        </>
                      ) : (
                        <>
                          <Link to="/login" className="block px-4 py-3 text-sm text-text-secondary hover:text-brand-orange hover:bg-brand-light">Sign In</Link>
                          <Link to="/register" className="block px-4 py-3 text-sm text-brand-orange hover:bg-brand-light font-medium">Create Account</Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-xl text-text-secondary hover:text-brand-orange hover:bg-brand-light"
                aria-label="Menu"
              >
                {mobileOpen ? <FaIcon icon="xmark" size={22} /> : <FaIcon icon="bars" size={22} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              ref={mobileSearchRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-divider"
            >
              <form onSubmit={handleSearch} className="section-container py-3">
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <FaIcon icon="magnifying-glass" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <input
                      type="search"
                      placeholder="Search electronics..."
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true) }}
                      onFocus={() => setShowSuggestions(true)}
                      aria-label="Search products"
                      className="input-field pl-11 w-full"
                      autoFocus
                    />
                    {renderSuggestions(() => goToSearchResults())}
                  </div>
                  <button type="submit" className="btn-cta px-4 py-2.5 shrink-0">
                    Search
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden glass-strong border-t border-divider"
            >
              <div className="section-container py-4 space-y-1">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/products', label: 'Shop All' },
                  { to: '/about', label: 'About' },
                  { to: '/contact', label: 'Contact' },
                ].map(({ to, label }) => (
                  <Link key={to} to={to} className={`block px-4 py-3 rounded-xl transition-all font-medium ${isActive(to) ? 'nav-link-active' : 'text-text-secondary hover:text-brand-orange hover:bg-brand-light'}`}>
                    {label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-divider">
                  <p className="px-4 py-2 text-xs text-text-muted uppercase tracking-wider">Categories</p>
                  <div className="grid grid-cols-2 gap-1">
                    {CATEGORIES.slice(0, 6).map(({ name, slug }) => (
                      <Link key={slug} to={`/products?category=${encodeURIComponent(slug)}`} className="px-4 py-2.5 text-sm text-text-secondary hover:text-brand-orange hover:bg-brand-light rounded-xl">
                        {name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

export default Navbar
