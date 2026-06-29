import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import FaIcon from '../../common/FaIcon'
import { formatSystemTime, formatSystemDate, formatRelativeLogin } from '../../../utils/helpers'

const ease = [0.4, 0, 0.2, 1]

const menuVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease } },
  exit: { opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.15 } },
}

const AdminHeader = ({
  pageMeta,
  isSidebarOpen,
  headerScrolled,
  onMenuToggle,
  now,
  lastLogin,
  isFullscreen,
  onToggleFullscreen,
  user,
  isProfileOpen,
  setIsProfileOpen,
  onLogoutConfirm,
}) => (
  <header
    className={`admin-header sticky top-0 z-20 transition-all duration-300 ${
      headerScrolled ? 'admin-header-scrolled shadow-soft' : ''
    }`}
  >
    <div className="flex flex-col gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMenuToggle}
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-divider bg-white text-text-secondary transition-colors duration-200 hover:border-brand-orange/30 hover:bg-brand-light hover:text-brand-orange sm:mt-0"
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Open menu'}
        >
          <FaIcon icon="bars" size={20} />
        </motion.button>

        <div className="min-w-0 flex-1">
          <nav className="mb-1 flex flex-wrap items-center gap-1 text-xs text-text-muted" aria-label="Breadcrumb">
            {pageMeta.crumbs.map((crumb, i) => (
              <span key={crumb} className="flex items-center gap-1">
                {i > 0 && <FaIcon icon="chevron-right" className="shrink-0 opacity-50" size={12} />}
                <span className={i === pageMeta.crumbs.length - 1 ? 'font-medium text-brand-orange' : ''}>
                  {crumb}
                </span>
              </span>
            ))}
          </nav>
          <h1 className="truncate text-lg font-bold text-text-primary sm:text-xl">{pageMeta.title}</h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <Link
          to="/admin/products/create"
          className="hidden items-center gap-1.5 rounded-xl bg-gradient-cta px-3 py-2 text-sm font-semibold text-white shadow-glow-orange transition-all duration-200 hover:opacity-95 sm:flex"
        >
          <FaIcon icon="plus" size={16} />
          <span className="hidden md:inline">New Product</span>
        </Link>

        <div className="hidden text-right leading-tight sm:block">
          <p className="text-sm font-semibold tabular-nums text-text-primary">{formatSystemTime(now)}</p>
          <p className="text-xs text-text-muted">{formatSystemDate(now)}</p>
        </div>

        <div className="hidden border-l border-divider pl-3 text-right leading-tight md:block">
          <p className="text-[11px] uppercase tracking-wide text-text-muted">Last login</p>
          <p className="text-sm font-medium tabular-nums text-text-secondary">
            {formatRelativeLogin(lastLogin, now)}
          </p>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onToggleFullscreen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-divider bg-white text-text-muted transition-colors duration-200 hover:border-brand-orange/30 hover:bg-brand-light hover:text-brand-orange"
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isFullscreen ? 'min' : 'max'}
              initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="block"
            >
              <FaIcon icon={isFullscreen ? 'compress' : 'expand'} size={18} />
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <div className="relative border-l border-divider pl-2 sm:pl-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors duration-200 hover:bg-brand-light sm:px-3 sm:py-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-cta text-sm font-semibold text-white shadow-glow-orange">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <span className="hidden text-sm font-medium text-text-primary md:block">
              {user?.name?.split(' ')[0] || user?.email?.split('@')[0]}
            </span>
          </motion.button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-10"
                  onClick={() => setIsProfileOpen(false)}
                />
                <motion.div
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-2xl border border-divider bg-white py-1 shadow-card-hover"
                >
                  <div className="border-b border-divider px-4 py-3">
                    <p className="truncate text-sm font-medium text-text-primary">{user?.name}</p>
                    <p className="truncate text-xs text-text-muted">{user?.email}</p>
                  </div>
                  <Link
                    to="/admin/profile"
                    className="block px-4 py-2.5 text-sm text-text-secondary transition-colors duration-200 hover:bg-brand-light"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button
                    type="button"
                    onClick={onLogoutConfirm}
                    className="w-full px-4 py-2.5 text-left text-sm text-status-error transition-colors duration-200 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  </header>
)

export default AdminHeader
