import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import CartIcon from '../cart/CartIcon'
import TopAnnouncementBar from './TopAnnouncementBar'
import CategoriesDropdown from './CategoriesDropdown'
const Navbar = () => {
  const { user, logout } = useAuth()
  const { getCartCount, fetchCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const dropdownRef = useRef(null)
  const mobileMenuRef = useRef(null)

  // Add scroll effect for glass morphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      
      logout()
      
      // Navigate to login page
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      navigate('/login')
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
    <>
      {/* Top Announcement Bar - Added above navbar */}
      <TopAnnouncementBar />
      
      <nav
        className={` sticky top-0 z-50 transition-all duration-500 ${isScrolled
            ? 'backdrop-blur-xl shadow-lg'
            : 'backdrop-blur-sm'
          }`}
        style={{
          backgroundColor: isScrolled
            ? 'var(--nav-scrolled-bg)'
            : 'var(--nav-bg)',
          borderBottom: isScrolled
            ? 'var(--nav-border-scrolled)'
            : 'var(--nav-border)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center h-14">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className=' '>
                <img src="./logo3.png" alt="MeroGadget" className='h-20 w-30 ' />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105"
                style={{
                  color: 'var(--text-secondary)',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)'
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >Home</Link>
              <Link
                to="/products"
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105"
                style={{
                  color: 'var(--text-secondary)',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)'
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                Products
              </Link>
              <CategoriesDropdown />

              <Link to="/about"
                 className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105"
                 style={{
                   color: 'var(--text-secondary)',
                   fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif'
                 }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.color = 'var(--text-primary)'
                   e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.color = 'var(--text-secondary)'
                   e.currentTarget.style.backgroundColor = 'transparent'
                 }} >About Us</Link>


              <Link to="/contact"
               className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105"
               style={{
                 color: 'var(--text-secondary)',
                 fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.color = 'var(--text-primary)'
                 e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.color = 'var(--text-secondary)'
                 e.currentTarget.style.backgroundColor = 'transparent'
               }}>Contact</Link>

              {/* Cart Icon */}
              {user?.role !== 'admin' && (
                <Link
                  to="/cart"
                  className="relative p-2 rounded-lg transition-all duration-300 hover:scale-110"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <CartIcon />
                  {getCartCount() > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg"
                      style={{
                        background: 'var(--accent-orange)',
                        boxShadow: 'var(--cart-badge-shadow)'
                      }}
                    >
                      {getCartCount()}
                    </span>
                  )}
                </Link>
              )}

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg focus:outline-none transition-all duration-300"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-lg ring-2 ring-offset-1 ring-offset-transparent transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: 'var(--avatar-gradient)',
                        ringColor: 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className="hidden lg:inline text-sm font-medium"
                      style={{
                        color: 'var(--text-primary)',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif'
                      }}
                    >
                      {user.name?.split(' ')[0] || user.email?.split('@')[0]}
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <div
                      className="absolute right-0 mt-1 w-64 rounded-2xl shadow-2xl py-2 z-10 border animate-scale-in overflow-hidden"
                      style={{
                        backgroundColor: 'var(--dropdown-bg)',
                        borderColor: 'var(--dropdown-border)',
                        backdropFilter: 'blur(40px)',
                        boxShadow: 'var(--dropdown-shadow)'
                      }}
                    >
                      {/* User Info Header */}
                      <div
                        className="px-5 py-4 border-b"
                        style={{ borderColor: 'var(--divider-color)' }}
                      >
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {user.name}
                        </p>
                        <p className="text-xs truncate mt-1" style={{ color: 'var(--text-secondary)' }}>
                          {user.email}
                        </p>
                      </div>

                      <div className="py-1">
                        {/* Profile Link */}
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-5 py-2.5 text-sm transition-all duration-200 mx-2 rounded-lg"
                          style={{ color: 'var(--text-primary)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
                            e.currentTarget.style.color = 'var(--accent-cyan)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = 'var(--text-primary)'
                          }}
                        >
                          <span>👤</span>
                          Profile
                        </Link>

                        {/* Admin Dashboard Link */}
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-sm transition-all duration-200 mx-2 rounded-lg font-medium"
                            style={{ color: 'var(--accent-cyan)' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--cyan-hover-bg)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            <span>📊</span>
                            Admin Dashboard
                          </Link>
                        )}

                        {/* Divider */}
                        <div className="mx-4 my-1" style={{ borderTop: 'var(--divider-border)' }}></div>

                        {/* Logout Button */}
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full text-left px-5 py-2.5 text-sm transition-all duration-200 mx-2 rounded-lg"
                          style={{ color: 'var(--error-red)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--error-hover-bg)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                          }}
                        >
                          <span>🚪</span>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300"
                    style={{
                      color: 'var(--text-secondary)',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--text-primary)'
                      e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)'
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'var(--accent-orange)',
                      color: 'var(--white)',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
                      boxShadow: 'var(--register-btn-shadow)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--accent-orange-hover)'
                      e.currentTarget.style.boxShadow = 'var(--register-btn-shadow-hover)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--accent-orange)'
                      e.currentTarget.style.boxShadow = 'var(--register-btn-shadow)'
                    }}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {user?.role !== 'admin' && (
                <Link
                  to="/cart"
                  className="relative p-2 rounded-lg transition-all duration-300"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <CartIcon />
                  {getCartCount() > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg"
                      style={{
                        background: 'var(--accent-orange)',
                        boxShadow: 'var(--cart-badge-shadow)'
                      }}
                    >
                      {getCartCount()}
                    </span>
                  )}
                </Link>
              )}

              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg transition-all duration-200"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              className="md:hidden py-4 space-y-1 animate-slide-down rounded-b-2xl shadow-2xl border-t"
              style={{
                backgroundColor: 'var(--mobile-menu-bg)',
                borderColor: 'var(--dropdown-border)',
                backdropFilter: 'blur(40px)'
              }}
            >
              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all duration-200 rounded-xl mx-3"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <span className="text-base">📦</span>
                Products
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium rounded-xl mx-3 transition-all duration-200"
                  style={{
                    background: 'var(--admin-gradient)',
                    color: 'var(--white)',
                    boxShadow: 'var(--admin-btn-shadow)'
                  }}
                >
                  <span className="text-base">📊</span>
                  Admin Dashboard
                </Link>
              )}

              <div className="mx-4 my-2" style={{ borderTop: 'var(--divider-border)' }}></div>

              {user ? (
                <>
                  <div
                    className="px-5 py-3 mx-3 rounded-xl"
                    style={{ backgroundColor: 'var(--mobile-user-bg)' }}
                  >
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {user.name}
                    </p>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {user.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm transition-all duration-200 rounded-xl mx-3"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <span className="text-base">👤</span>
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm transition-all duration-200 rounded-xl mx-3 font-medium"
                    style={{ color: 'var(--error-red)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--error-hover-bg)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <span className="text-base">🚪</span>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm transition-all duration-200 rounded-xl mx-3"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <span className="text-base">🔐</span>
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium rounded-xl mx-3 transition-all duration-200"
                    style={{
                      background: 'var(--accent-orange)',
                      color: 'var(--white)',
                      boxShadow: 'var(--register-btn-shadow)'
                    }}
                  >
                    <span className="text-base">📝</span>
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        <style>{`
          :root {
            /* Primary Colors - Deep Navy */
            --nav-bg: rgba(10, 37, 64, 0.92);
            --nav-scrolled-bg: rgba(10, 37, 64, 0.85);
            --nav-border: 0.5px solid rgba(34, 211, 238, 0.08);
            --nav-border-scrolled: 0.5px solid rgba(34, 211, 238, 0.12);
            
            /* Text Colors */
            --text-primary: #FFFFFF;
            --text-secondary: #A1A1A6;
            
            /* Accent Colors */
            --accent-orange: #FF6200;
            --accent-orange-hover: #E05500;
            --accent-cyan: #22D3EE;
            
            /* Background Colors - Neutral Dark Gray */
            --hover-bg: rgba(255, 255, 255, 0.05);
            --dropdown-bg: #111827;
            --mobile-menu-bg: #111827;
            --mobile-user-bg: rgba(255, 255, 255, 0.03);
            
            /* Border Colors */
            --dropdown-border: rgba(34, 211, 238, 0.15);
            --divider-color: rgba(34, 211, 238, 0.08);
            --divider-border: 0.5px solid rgba(34, 211, 238, 0.08);
            
            /* Shadows */
            --cart-badge-shadow: 0 2px 8px rgba(255, 98, 0, 0.4);
            --dropdown-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            --register-btn-shadow: 0 2px 8px rgba(255, 98, 0, 0.3);
            --register-btn-shadow-hover: 0 4px 12px rgba(255, 98, 0, 0.4);
            --admin-btn-shadow: 0 4px 12px rgba(34, 211, 238, 0.3);
            
            /* Gradients */
            --avatar-gradient: linear-gradient(135deg, #1E3A8A, #22D3EE);
            --admin-gradient: linear-gradient(135deg, #1E3A8A, #22D3EE);
            
            /* Utility Colors */
            --white: #FFFFFF;
            --error-red: #FF3B30;
            --error-hover-bg: rgba(255, 59, 48, 0.08);
            --cyan-hover-bg: rgba(34, 211, 238, 0.08);
          }
          
          @keyframes scale-in {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(-8px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          
          @keyframes slide-down {
            from {
              opacity: 0;
              transform: translateY(-16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-scale-in {
            animation: scale-in 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .animate-slide-down {
            animation: slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}</style>
      </nav>
    </>
  )
}

export default Navbar