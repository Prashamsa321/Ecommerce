import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const categories = [
    { name: 'Refrigerator', icon: '🧊', link: '/products?category=Refrigerator' },
    { name: 'Television', icon: '📺', link: '/products?category=Television' },
    { name: 'Air Conditioner', icon: '❄️', link: '/products?category=Air Conditioner' },
    { name: 'Watch', icon: '⌚', link: '/products?category=Watch' },
    { name: 'Laptop', icon: '💻', link: '/products?category=Laptop' },
    { name: 'Headphones', icon: '🎧', link: '/products?category=Headphones' }
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const supportLinks = [
    { name: 'FAQ', path: '/faq' },
    { name: 'Shipping Info', path: '/shipping' },
    { name: 'Returns Policy', path: '/returns' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' }
  ];

  const features = [
    { icon: '🚚', title: 'Free Shipping', desc: 'On orders over रु100' },
    { icon: '🔄', title: '30-Day Returns', desc: 'Hassle-free returns' },
    { icon: '💳', title: 'Secure Payment', desc: '100% secure transactions' },
    { icon: '⏰', title: '24/7 Support', desc: 'Dedicated customer service' }
  ];

  return (
    <footer className="bg-[#0A2540] text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 pt-12 pb-8">
        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 mb-8 border-b border-[#1E3A8A]">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-[#1E3A8A]/20 rounded-xl hover:bg-[#1E3A8A]/30 transition-all duration-300">
              <div className="text-3xl">{feature.icon}</div>
              <div>
                <h4 className="font-semibold text-white">{feature.title}</h4>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🛒</span>
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#22D3EE] to-[#FF6200] bg-clip-text text-transparent">
                MeroGadget
              </h2>
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Your one-stop destination for premium electronics and gadgets. 
              Quality products, competitive prices, and exceptional service.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center hover:bg-[#FF6200] transition-all duration-300">
                <span className="text-sm">📘</span>
              </a>
              <a href="#" className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center hover:bg-[#FF6200] transition-all duration-300">
                <span className="text-sm">📸</span>
              </a>
              <a href="#" className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center hover:bg-[#FF6200] transition-all duration-300">
                <span className="text-sm">🐦</span>
              </a>
              <a href="#" className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center hover:bg-[#FF6200] transition-all duration-300">
                <span className="text-sm">💼</span>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#FF6200] rounded-full"></span>
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-[#22D3EE] transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
              Shop Categories
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#FF6200] rounded-full"></span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.slice(0, 6).map((category, index) => (
                <Link
                  key={index}
                  to={category.link}
                  className="text-gray-400 hover:text-[#22D3EE] transition-colors duration-300 text-sm flex items-center gap-2"
                >
                  <span>{category.icon}</span>
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Newsletter Column */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
              Stay Updated
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#FF6200] rounded-full"></span>
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest updates on new products and exclusive offers
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-[#1E3A8A] border border-[#1E3A8A] rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF6200] text-sm"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-[#FF6200] to-[#FF3D00] text-white rounded-r-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 text-sm font-medium">
                  Subscribe
                </button>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <span>📧</span>
                  <a href="mailto:support@merogadget.com" className="hover:text-[#22D3EE] transition-colors">
                    support@merogadget.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <span>📞</span>
                  <a href="tel:+9779800000000" className="hover:text-[#22D3EE] transition-colors">
                    +977 9800000000
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <span>📍</span>
                  <span>Kathmandu, Nepal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 mt-4 border-t border-[#1E3A8A]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-gray-400 text-sm">
              © {currentYear} MeroGadget. All rights reserved.
            </p>
            <div className="flex gap-6">
              {supportLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="text-gray-400 hover:text-[#22D3EE] transition-colors text-xs"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex gap-2">
              <span className="text-xl">💳</span>
              <span className="text-xl">💵</span>
              <span className="text-xl">🟣</span>
              <span className="text-xl">🔵</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;