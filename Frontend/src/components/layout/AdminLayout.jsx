import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Modal from '../Modal'
import AdminSidebar from '../admin/layout/AdminSidebar'
import AdminHeader from '../admin/layout/AdminHeader'
import { adminNavGroups, getAdminPageMeta } from '../admin/layout/adminNavConfig'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const easeSmooth = [0.4, 0, 0.2, 1]

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeSmooth } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: easeSmooth } },
}

function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, token, loading } = useAuth()
  const { success, error: toastError } = useToast()

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [now, setNow] = useState(() => new Date())
  const [lastLogin, setLastLogin] = useState(user?.lastLogin || null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true
  )

  const sidebarRef = useRef(null)
  const mainRef = useRef(null)
  const pageMeta = getAdminPageMeta(location.pathname)

  const isProductsRoute =
    location.pathname.includes('/admin/products') || location.pathname.includes('/admin/categories')
  const isSettingsRoute = location.pathname.startsWith('/admin/settings')

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (isProductsRoute) setOpenDropdown('Products')
    if (isSettingsRoute) setOpenDropdown('Settings')
  }, [location.pathname, isProductsRoute, isSettingsRoute])

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (user?.lastLogin) setLastLogin(user.lastLogin)
  }, [user?.lastLogin])

  useEffect(() => {
    if (!token || user?.lastLogin) return

    const fetchLastLogin = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (data?.user?.lastLogin) {
          setLastLogin(data.user.lastLogin)
          const stored = localStorage.getItem('user')
          if (stored) {
            const parsed = JSON.parse(stored)
            localStorage.setItem('user', JSON.stringify({ ...parsed, lastLogin: data.user.lastLogin }))
          }
        }
      } catch {
        // keep fallback display
      }
    }

    fetchLastLogin()
  }, [token, user?.lastLogin])

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  useEffect(() => {
    setMobileNavOpen(false)
    setIsProfileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const el = mainRef.current
    if (!el) return

    const onScroll = () => setHeaderScrolled(el.scrollTop > 8)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (!isProductsRoute && !isSettingsRoute) setOpenDropdown(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isProductsRoute, isSettingsRoute])

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch {
      toastError('Fullscreen is not supported in this browser')
    }
  }, [toastError])

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName)
  }

  const handleMenuToggle = () => {
    if (isDesktop) {
      setIsSidebarOpen((open) => !open)
    } else {
      setMobileNavOpen((open) => !open)
    }
  }

  const closeMobileNav = () => setMobileNavOpen(false)

  const openLogoutConfirm = () => {
    setIsProfileOpen(false)
    setLogoutModalOpen(true)
  }

  const handleConfirmLogout = async () => {
    try {
      await logout()
      success('Logged out successfully')
      setLogoutModalOpen(false)
      navigate('/admin/login')
    } catch {
      toastError('Logout failed')
    }
  }

  const contentMargin = isDesktop ? (isSidebarOpen ? 260 : 72) : 0

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-primary">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: easeSmooth }}
          className="text-center"
        >
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
          <p className="mt-4 text-text-muted">Loading...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="admin-shell flex min-h-screen overflow-hidden bg-[#f1f5f9]">
      <AdminSidebar
        sidebarRef={sidebarRef}
        navGroups={adminNavGroups}
        location={location}
        isSidebarOpen={isSidebarOpen}
        mobileNavOpen={mobileNavOpen}
        openDropdown={openDropdown}
        toggleDropdown={toggleDropdown}
        onLogoutConfirm={openLogoutConfirm}
        onNavigate={closeMobileNav}
      />

      <motion.div
        initial={false}
        animate={{ marginLeft: contentMargin }}
        transition={{ duration: 0.3, ease: easeSmooth }}
        className="flex min-h-screen w-full min-w-0 flex-1 flex-col"
      >
        <AdminHeader
          pageMeta={pageMeta}
          isSidebarOpen={isSidebarOpen}
          headerScrolled={headerScrolled}
          onMenuToggle={handleMenuToggle}
          now={now}
          lastLogin={lastLogin}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          user={user}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          onLogoutConfirm={openLogoutConfirm}
        />

        <main ref={mainRef} className="admin-main flex-1 overflow-y-auto overflow-x-hidden">
          <div className="admin-content mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </motion.div>

      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of the admin panel?"
        confirmText="Log Out"
        cancelText="Stay Signed In"
        type="danger"
      />
    </div>
  )
}

export default AdminLayout
