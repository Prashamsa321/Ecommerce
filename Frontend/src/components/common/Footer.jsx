import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-[#1C1C1E] border-t border-[#2C2C2E] mt-16">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#007AFF] to-[#34C759] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-[#F5F5F7]">MeroGadget</h3>
            </div>
            <p className="text-[#A1A1A6] text-sm leading-relaxed">
              Premium electronics store. Quality products, best prices, and excellent service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#F5F5F7] font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-[#A1A1A6] hover:text-[#F5F5F7] transition-colors text-sm">Home</Link></li>
              <li><Link to="/products" className="text-[#A1A1A6] hover:text-[#F5F5F7] transition-colors text-sm">Products</Link></li>
              <li><Link to="/about" className="text-[#A1A1A6] hover:text-[#F5F5F7] transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-[#A1A1A6] hover:text-[#F5F5F7] transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-[#F5F5F7] font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-[#A1A1A6] hover:text-[#F5F5F7] transition-colors text-sm">FAQ</Link></li>
              <li><Link to="/returns" className="text-[#A1A1A6] hover:text-[#F5F5F7] transition-colors text-sm">Returns Policy</Link></li>
              <li><Link to="/shipping" className="text-[#A1A1A6] hover:text-[#F5F5F7] transition-colors text-sm">Shipping Info</Link></li>
              <li><Link to="/terms" className="text-[#A1A1A6] hover:text-[#F5F5F7] transition-colors text-sm">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-[#F5F5F7] font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-[#2C2C2E] rounded-full flex items-center justify-center text-[#A1A1A6] hover:bg-[#007AFF] hover:text-white transition-all duration-300">
                <FaFacebook className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-[#2C2C2E] rounded-full flex items-center justify-center text-[#A1A1A6] hover:bg-[#007AFF] hover:text-white transition-all duration-300">
                <FaTwitter className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-[#2C2C2E] rounded-full flex items-center justify-center text-[#A1A1A6] hover:bg-[#007AFF] hover:text-white transition-all duration-300">
                <FaInstagram className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-[#2C2C2E] rounded-full flex items-center justify-center text-[#A1A1A6] hover:bg-[#007AFF] hover:text-white transition-all duration-300">
                <FaGithub className="text-lg" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#2C2C2E] mt-8 pt-8 text-center">
          <p className="text-[#A1A1A6] text-sm">&copy; 2024 MeroGadget. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer