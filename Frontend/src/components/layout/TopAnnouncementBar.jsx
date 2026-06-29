import React, { useState, useEffect } from 'react';
import FaIcon from '../common/FaIcon';

const TopAnnouncementBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const announcements = [
    { id: 1, message: 'Free Shipping on Orders Over $50', icon: 'truck', color: 'text-brand-orange' },
    { id: 2, message: 'Big Summer Sale Up to 70% Off', icon: 'fire', color: 'text-orange-400' },
    { id: 3, message: '24/7 Customer Support', icon: 'comments', color: 'text-green-400' },
    { id: 4, message: 'New Arrivals Available Now', icon: 'sparkles', color: 'text-purple-400' },
    { id: 5, message: 'Rated 4.9/5 by 10,000+ Customers', icon: 'star', color: 'text-yellow-400' },
    { id: 6, message: 'Exclusive Offers for Members', icon: 'gift', color: 'text-pink-400' }
  ];

  useEffect(() => {
    let interval;
    if (!isPaused && isVisible) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPaused, isVisible, announcements.length]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="relative w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-divider overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4 py-2.5">
        <div className="relative overflow-hidden">
          <div 
            className="flex items-center justify-center gap-8"
            style={{ 
              animation: isPaused ? 'none' : 'marquee 25s linear infinite',
              whiteSpace: 'nowrap'
            }}
          >
            {[...announcements, ...announcements].map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="inline-flex items-center gap-2 px-4"
              >
                <FaIcon icon={item.icon} className={item.color} size={16} />
                <span className={`text-sm font-medium ${item.color}`}>
                  {item.message}
                </span>
                <span className="text-slate-600 text-lg mx-2">•</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none" />
      </div>

      <button
        onClick={handleClose}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-brand-light transition-all duration-200 z-10 opacity-0 group-hover:opacity-100"
        aria-label="Close announcement"
      >
        <FaIcon icon="xmark" className="text-text-muted hover:text-white" size={16} />
      </button>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default TopAnnouncementBar;
