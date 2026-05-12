import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import CartIcon from '../cart/CartIcon'

const THEME = {
  // Main Colors
  primary: '#1a1a2e',      // Dark navy
  primaryLight: '#16213e',   // Lighter navy
  primaryDark: '#0f0f1a',    // Darkest
  accent: '#00d2ff',         // Electric blue
  accentHover: '#0099cc',    // Darker blue
  secondary: '#0f3460',      // Deep blue

  // Text Colors
  text: '#ffffff',
  textMuted: '#a0a0a0',
  textDark: '#121212',

  // UI Colors
  success: '#00ff9d',
  error: '#ff4757',
  warning: '#ffa502',

  // Gradients
  gradient: 'from-[#1a1a2e] to-[#16213e]',
  buttonGradient: 'from-[#00d2ff] to-[#0099cc]'
}

// Logo Configuration
const LOGO = {
  name: 'MeroGadget',
  icon: '⚡',
  tagline: 'Premium Electronics'
}

const Navbar = () => {
  const { user, logout } = useAuth()
  const { getCartCount, fetchCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)
  const mobileMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      setIsDropdownOpen(false)
      setIsMobileMenuOpen(false)
      await logout()
      await fetchCart()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      navigate('/')
    }
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Don't show navbar on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null
  }

  return (
    <nav className="sticky top-0 z-50 shadow-xl" style={{ backgroundColor: THEME.primary }}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all group-hover:scale-105" style={{ background: THEME.accent }}>
              <span className="text-white text-xl">{LOGO.icon}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight" style={{ color: THEME.text }}>
                {LOGO.name}
              </span>
              <span className="text-xs opacity-70" style={{ color: THEME.textMuted }}>
                {LOGO.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/products"
              className="font-medium transition-all hover:scale-105"
              style={{ color: THEME.textMuted }}
              onMouseEnter={(e) => e.target.style.color = THEME.accent}
              onMouseLeave={(e) => e.target.style.color = THEME.textMuted}
            >
              Products
            </Link>

            {/* Cart Icon - Hide for admin */}
            {user?.role !== 'admin' && (
              <Link to="/cart" className="relative transition-transform hover:scale-105">
                <CartIcon />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg" style={{ background: THEME.accent }}>
                    {getCartCount()}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 focus:outline-none transition-all hover:scale-105"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg" style={{ background: THEME.accent }}>
                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline font-medium" style={{ color: THEME.text }}>
                    {user.name?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: THEME.textMuted }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl py-1 z-10 border animate-fade-in" style={{ backgroundColor: THEME.primaryLight, borderColor: THEME.secondary }}>
                    <div className="px-4 py-3 border-b" style={{ borderColor: THEME.secondary }}>
                      <p className="text-sm font-semibold" style={{ color: THEME.text }}>{user.name}</p>
                      <p className="text-xs truncate" style={{ color: THEME.textMuted }}>{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span className="inline-block mr-2">👤</span>
                      Profile
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm transition-colors w-full"
                        style={{ color: THEME.accent }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = THEME.secondary}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <span>📊</span>
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm transition-colors border-t mt-1"
                      style={{ color: '#ff4757', borderColor: THEME.secondary }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = THEME.secondary}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span>🚪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="font-medium transition-all hover:scale-105"
                  style={{ color: THEME.textMuted }}
                  onMouseEnter={(e) => e.target.style.color = THEME.accent}
                  onMouseLeave={(e) => e.target.style.color = THEME.textMuted}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-lg font-medium transition-all hover:scale-105 shadow-md"
                  style={{ background: THEME.accent, color: THEME.text }}
                  onMouseEnter={(e) => e.currentTarget.style.background = THEME.accentHover}
                  onMouseLeave={(e) => e.currentTarget.style.background = THEME.accent}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {user?.role !== 'admin' && (
              <Link to="/cart" className="relative">
                <CartIcon />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" style={{ background: THEME.accent }}>
                    {getCartCount()}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg transition-colors"
              style={{ color: THEME.text }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden py-4 space-y-2 animate-slide-down rounded-b-lg"
            style={{ backgroundColor: THEME.primaryLight }}
          >
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 transition-colors rounded-lg"
              style={{ color: THEME.textMuted }}
            >
              <span>📦</span>
              Products
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg mx-2 transition-colors"
                style={{ color: THEME.accent, background: THEME.secondary }}
              >
                <span>📊</span>
                Admin Dashboard
              </Link>
            )}

            <div className="border-t my-2" style={{ borderColor: THEME.secondary }}></div>

            {user ? (
              <>
                <div className="px-4 py-3">
                  <p className="font-semibold" style={{ color: THEME.text }}>{user.name}</p>
                  <p className="text-sm truncate" style={{ color: THEME.textMuted }}>{user.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 transition-colors rounded-lg"
                  style={{ color: THEME.textMuted }}
                >
                  <span>👤</span>
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 transition-colors rounded-lg"
                  style={{ color: '#ff4757' }}
                >
                  <span>🚪</span>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 transition-colors rounded-lg"
                  style={{ color: THEME.textMuted }}
                >
                  <span>🔐</span>
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg mx-2 transition-colors"
                  style={{ background: THEME.accent, color: THEME.text }}
                >
                  <span>📝</span>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </nav>
  )
}

export default Navbar