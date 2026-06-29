import { Link, useLocation } from 'react-router-dom'
import FaIcon from '../common/FaIcon'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const MobileBottomNav = () => {
  const location = useLocation()
  const { getCartCount } = useCart()
  const { isAuthenticated } = useAuth()
  const count = getCartCount()

  if (location.pathname.startsWith('/admin')) return null

  const links = [
    { to: '/', icon: 'house', label: 'Home' },
    { to: '/products', icon: 'store', label: 'Shop' },
    { to: '/cart', icon: 'cart-shopping', label: 'Cart', badge: count },
    { to: isAuthenticated ? '/profile' : '/login', icon: 'user', label: 'Account' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-divider safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {links.map(({ to, icon, label, badge }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 relative
                ${active ? 'text-brand-orange' : 'text-text-muted hover:text-text-secondary'}`}
            >
              <FaIcon icon={icon} size={20} />
              {badge > 0 && (
                <span className="absolute -top-0.5 right-1 min-w-[18px] h-[18px] bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNav
