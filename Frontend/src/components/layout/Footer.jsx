import { Link } from 'react-router-dom'
import FaIcon from '../common/FaIcon'

const Footer = () => {
  const year = new Date().getFullYear()

  const categories = ['Smartphones', 'Laptops', 'Headphones', 'Gaming', 'Cameras', 'Tablets']
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <footer className="bg-white border-t border-divider mt-auto">
      <div className="section-container pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-cta flex items-center justify-center">
                <span className="text-white font-bold text-sm">MG</span>
              </div>
              <span className="text-xl font-bold text-text-primary">Mero<span className="text-brand-orange">Gadget</span></span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed">
              Nepal's premium electronics marketplace. Genuine products, fast delivery, and expert support.
            </p>
          </div>

          <div>
            <h4 className="text-text-primary font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {links.map(l => (
                <li key={l.path}>
                  <Link to={l.path} className="text-text-muted hover:text-brand-orange text-sm transition-colors">{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-text-primary font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map(c => (
                <li key={c}>
                  <Link to={`/products?category=${encodeURIComponent(c)}`} className="text-text-muted hover:text-brand-orange text-sm transition-colors">{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-text-primary font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li className="flex items-center gap-2">
                <FaIcon icon="envelope" size={14} className="text-brand-orange" />
                support@merogadget.com
              </li>
              <li className="flex items-center gap-2">
                <FaIcon icon="phone" size={14} className="text-brand-orange" />
                +977 9800000000
              </li>
              <li className="flex items-center gap-2">
                <FaIcon icon="location-dot" size={14} className="text-brand-orange" />
                Kathmandu, Nepal
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-divider pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-sm">© {year} MeroGadget. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-text-muted">
            <Link to="/privacy" className="hover:text-brand-orange transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-brand-orange transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
