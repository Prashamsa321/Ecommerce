import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, LogOut } from 'lucide-react'

const ease = [0.4, 0, 0.2, 1]

const NavIcon = ({ icon: Icon, className = 'w-[18px] h-[18px]' }) => (
  <Icon className={`${className} shrink-0`} strokeWidth={2} aria-hidden="true" />
)

const dropdownVariants = {
  closed: { height: 0, opacity: 0, transition: { duration: 0.25, ease } },
  open: { height: 'auto', opacity: 1, transition: { duration: 0.28, ease } },
}

const AdminSidebar = ({
  sidebarRef,
  navGroups,
  location,
  isSidebarOpen,
  mobileNavOpen,
  openDropdown,
  toggleDropdown,
  onLogoutConfirm,
  onNavigate,
}) => {
  const linkClass = (active, labels) =>
    `group relative flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-all duration-200 ${
      labels ? 'px-3' : 'px-0 justify-center'
    } ${
      active
        ? 'bg-brand-orange/15 text-brand-orange shadow-sm'
        : 'text-slate-300 hover:bg-white/5 hover:text-white'
    }`

  const renderContent = (labels) => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={`flex shrink-0 items-center border-b border-white/10 ${labels ? 'gap-3 px-5 py-5' : 'justify-center px-3 py-5'}`}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-cta text-sm font-bold text-white shadow-glow-orange">
          MG
        </div>
        <AnimatePresence>
          {labels && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="min-w-0"
            >
              <p className="truncate text-base font-bold text-white">MeroGadget</p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Admin Pro</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="admin-sidebar-scroll flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-6 last:mb-0">
            {labels && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = !item.dropdown && location.pathname === item.path
                const isAnyDropdownActive = item.dropdown && item.dropdownItems.some((s) => location.pathname === s.path)
                const isDropdownOpen = openDropdown === item.name

                if (item.dropdown) {
                  return (
                    <div key={item.name}>
                      <button
                        type="button"
                        onClick={() => toggleDropdown(item.name)}
                        className={`${linkClass(isAnyDropdownActive, labels)} w-full ${labels ? 'justify-between' : ''}`}
                        title={!labels ? item.name : undefined}
                      >
                        <span className={`flex items-center gap-3 ${labels ? '' : 'justify-center'}`}>
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                              isAnyDropdownActive ? 'bg-brand-orange/20' : 'bg-white/5 group-hover:bg-white/10'
                            }`}
                          >
                            <NavIcon icon={item.icon} />
                          </span>
                          {labels && <span className="truncate">{item.name}</span>}
                        </span>
                        {labels && (
                          <motion.span animate={{ rotate: isDropdownOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                          </motion.span>
                        )}
                      </button>
                      <AnimatePresence initial={false}>
                        {labels && (isDropdownOpen || isAnyDropdownActive) && (
                          <motion.div
                            variants={dropdownVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="overflow-hidden"
                          >
                            <div className="ml-4 mt-1 space-y-0.5 border-l border-white/10 pl-3">
                              {item.dropdownItems.map((sub) => (
                                <Link
                                  key={sub.path}
                                  to={sub.path}
                                  onClick={onNavigate}
                                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                                    location.pathname === sub.path
                                      ? 'bg-brand-orange/10 font-medium text-brand-orange'
                                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                  }`}
                                >
                                  <NavIcon icon={sub.icon} className="h-4 w-4" />
                                  <span className="truncate">{sub.name}</span>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onNavigate}
                    className={linkClass(isActive, labels)}
                    title={!labels ? item.name : undefined}
                  >
                    {isActive && labels && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-orange" />
                    )}
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        isActive ? 'bg-brand-orange/20' : 'bg-white/5 group-hover:bg-white/10'
                      }`}
                    >
                      <NavIcon icon={item.icon} />
                    </span>
                    {labels && <span className="truncate">{item.name}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="shrink-0 border-t border-white/10 p-3">
        <button
          type="button"
          onClick={onLogoutConfirm}
          className={`flex w-full items-center gap-3 rounded-xl py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300 ${
            labels ? 'px-3' : 'justify-center px-0'
          }`}
          title={!labels ? 'Logout' : undefined}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
            <LogOut className="h-[18px] w-[18px]" />
          </span>
          {labels && <span>Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
            onClick={onNavigate}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        ref={sidebarRef}
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.3, ease }}
        className="admin-sidebar-shell fixed inset-y-0 left-0 z-30 hidden lg:flex lg:flex-col"
      >
        {renderContent(isSidebarOpen)}
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease }}
            className="admin-sidebar-shell fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col lg:hidden"
          >
            {renderContent(true)}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

export default AdminSidebar
