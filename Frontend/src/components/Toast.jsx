import React, { useEffect } from 'react'
import FaIcon from './common/FaIcon'

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const styles = {
    success: { bg: 'bg-status-success', icon: 'circle-check' },
    error: { bg: 'bg-status-error', icon: 'circle-xmark' },
    info: { bg: 'bg-brand-orange', icon: 'circle-info' },
    warning: { bg: 'bg-gradient-promo', icon: 'triangle-exclamation' },
  }[type] || { bg: 'bg-brand-orange', icon: 'circle-info' }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-up md:bottom-6 md:right-6">
      <div className={`${styles.bg} text-white px-6 py-4 rounded-2xl shadow-card-hover flex items-center gap-3 min-w-[280px] max-w-md`}>
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <FaIcon icon={styles.icon} size={14} />
        </div>
        <span className="flex-1 font-medium">{message}</span>
        <button onClick={onClose} className="hover:opacity-70 transition-opacity text-white/80 hover:text-white" aria-label="Close">
          <FaIcon icon="xmark" size={14} />
        </button>
      </div>
    </div>
  )
}

export default Toast
